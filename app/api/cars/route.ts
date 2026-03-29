import { NextRequest, NextResponse } from "next/server";

// Marketcheck API Configuration
const MARKETCHECK_BASE_URL = "https://api.marketcheck.com";
const MARKETCHECK_API_KEY =
  process.env.MARKETCHECK_API_KEY || "tUgT7jpnVB1Xqw3MWrmrZjK0fxTCrT8Q";
const MARKETCHECK_API_SECRET =
  process.env.MARKETCHECK_API_SECRET || "S5BB5BVipX5PXrVq";

// Default pagination values
const DEFAULT_ROWS = 50;
const DEFAULT_PAGE = 1;

// Flexible media type to handle various API response formats
interface MediaData {
  photo_links?: (
    | string
    | { url?: string; photo?: string; src?: string; image?: string }
  )[];
  all_photos?: (
    | string
    | { url?: string; photo?: string; src?: string; image?: string }
  )[];
  images?: (
    | string
    | { url?: string; photo?: string; src?: string; image?: string }
  )[];
  photos?: (
    | string
    | { url?: string; photo?: string; src?: string; image?: string }
  )[];
  // Store processed URLs for easy access
  _processed_urls?: string[];
}

interface NormalizedCar {
  id: string;
  title: string;
  price?: number;
  image: string;
  year: number;
  make: string;
  model: string;
  mileage?: number;
  engine?: string;
  fuel?: string;
  vin?: string;
  location?: string;
  media?: MediaData;
}

interface ApiResponse {
  cars: NormalizedCar[];
  total: number;
  page: number;
  totalPages: number;
}

/**
 * Extract a valid URL string from various possible formats
 */
function extractUrl(item: string | object | undefined | null): string {
  if (!item) return "";

  if (typeof item === "string") {
    return item;
  }

  if (typeof item === "object" && item !== null) {
    const obj = item as Record<string, unknown>;
    return (
      (obj.url as string) ||
      (obj.photo as string) ||
      (obj.src as string) ||
      (obj.image as string) ||
      ""
    );
  }

  return "";
}

/**
 * Check if a URL is valid (not a placeholder)
 */
function isValidUrl(url: string): boolean {
  if (!url || typeof url !== "string") return false;
  return (
    !url.includes("photo_unavailable") &&
    !url.includes("placeholder") &&
    url.length > 0
  );
}

/**
 * Process photo array to extract valid URL strings
 */
function processPhotos(
  photos: (
    | string
    | { url?: string; photo?: string; src?: string; image?: string }
  )[],
): string[] {
  if (!Array.isArray(photos)) return [];

  const validUrls: string[] = [];
  for (const item of photos) {
    const url = extractUrl(item);
    if (isValidUrl(url)) {
      validUrls.push(url);
    }
  }
  return validUrls;
}

/**
 * Generate Basic Auth header for Marketcheck API
 */
function getAuthHeader(): string {
  const credentials = `${MARKETCHECK_API_KEY}:${MARKETCHECK_API_SECRET}`;
  const base64Credentials = Buffer.from(credentials).toString("base64");
  return `Basic ${base64Credentials}`;
}

/**
 * Normalize Marketcheck car data to our format based on actual API response
 */
function normalizeCar(car: any): NormalizedCar | null {
  try {
    // Log the raw media structure for debugging
    console.log(
      "[normalizeCar] Raw media structure:",
      JSON.stringify(car.media, null, 2),
    );

    // Extract images from various possible media fields
    // Handle both string URLs and object formats
    let image = "";
    const validImages: string[] = [];

    // Process photo_links
    if (car.media?.photo_links && Array.isArray(car.media.photo_links)) {
      console.log(
        "[normalizeCar] photo_links length:",
        car.media.photo_links.length,
      );
      validImages.push(...processPhotos(car.media.photo_links));
    }

    // Also check all_photos if photo_links was empty or insufficient
    if (
      validImages.length === 0 &&
      car.media?.all_photos &&
      Array.isArray(car.media.all_photos)
    ) {
      console.log(
        "[normalizeCar] all_photos length:",
        car.media.all_photos.length,
      );
      validImages.push(...processPhotos(car.media.all_photos));
    }

    // Check images field
    if (
      validImages.length === 0 &&
      car.media?.images &&
      Array.isArray(car.media.images)
    ) {
      console.log("[normalizeCar] images length:", car.media.images.length);
      validImages.push(...processPhotos(car.media.images));
    }

    // Check photos field
    if (
      validImages.length === 0 &&
      car.media?.photos &&
      Array.isArray(car.media.photos)
    ) {
      console.log("[normalizeCar] photos length:", car.media.photos.length);
      validImages.push(...processPhotos(car.media.photos));
    }

    // Also check top-level image field or images array
    if (validImages.length === 0 && car.images && Array.isArray(car.images)) {
      validImages.push(...processPhotos(car.images));
    }

    console.log(
      "[normalizeCar] Total validImages extracted:",
      validImages.length,
    );
    if (validImages.length > 0) {
      console.log("[normalizeCar] First image:", validImages[0]);
      console.log("[normalizeCar] First 3 images:", validImages.slice(0, 3));
    }

    // Use first valid image or placeholder
    image = validImages[0] || "";

    // Get build info
    const build = car.build || {};

    // Extract make
    const make = car.make || build.make || "";

    // Extract model
    const model = car.model || build.model || "";

    // Year
    const year = car.year || build.year || 0;

    // Build title from heading or year + make + model
    const title = car.heading || `${year} ${make} ${model}`.trim();

    // Location from dealer info
    let location = "";
    if (car.dealer) {
      const city = car.dealer.city || "";
      const state = car.dealer.state || "";
      if (city && state) {
        location = `${city}, ${state}`;
      } else if (city) {
        location = city;
      }
    }

    // Extract engine info
    const engine = car.engine || build.engine || "";

    // Fuel type
    const fuel = car.fuel_type || build.fuel_type || "";

    // If no valid image found, use a placeholder but still show the car
    if (!image) {
      image = "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800";
      console.log(
        "[normalizeCar] No valid image found, using placeholder for:",
        title,
      );
    }

    // Build media object with processed URLs for easy access
    const media: MediaData = {
      photo_links:
        validImages.length > 0 ? validImages : car.media?.photo_links,
      _processed_urls: validImages,
    };

    // Add other possible fields if they exist
    if (car.media?.all_photos) {
      media.all_photos = car.media.all_photos;
    }
    if (car.media?.images) {
      media.images = car.media.images;
    }
    if (car.media?.photos) {
      media.photos = car.media.photos;
    }

    return {
      id: car.id || car.vin || Math.random().toString(36).substr(2, 9),
      title: title || "Unknown Vehicle",
      price: car.price || car.msrp,
      image: image,
      year: year,
      make: make,
      model: model,
      mileage: car.miles,
      engine: engine,
      fuel: fuel,
      vin: car.vin,
      location: location,
      media: media,
    };
  } catch (error) {
    console.error("Error normalizing car:", error);
    return null;
  }
}

/**
 * Fetch cars from MarketCheck API
 * @param page - Page number (1-indexed)
 * @returns Promise with normalized cars and total count
 */
async function fetchCarsFromMarketCheck(
  page: number,
): Promise<{ cars: NormalizedCar[]; total: number }> {
  const start = (page - 1) * DEFAULT_ROWS;

  const searchParams = new URLSearchParams();
  searchParams.append("api_key", MARKETCHECK_API_KEY);
  searchParams.append("rows", String(DEFAULT_ROWS));
  searchParams.append("start", String(start));
  searchParams.append("sort_by", "dom");
  searchParams.append("sort_order", "desc");

  const url = `${MARKETCHECK_BASE_URL}/v2/search/car/active?${searchParams.toString()}`;

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: getAuthHeader(),
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("MarketCheck API error:", response.status, errorText);
      throw new Error(
        `MarketCheck API error: ${response.status} - ${errorText}`,
      );
    }

    const data = await response.json();

    // Handle MarketCheck response format: { num_found, listings: [...] }
    let cars: any[] = [];
    let total = 0;

    if (data.listings && Array.isArray(data.listings)) {
      cars = data.listings;
      total = data.num_found || cars.length;
    } else if (data.results && Array.isArray(data.results)) {
      cars = data.results;
      total = data.total_count || data.total || cars.length;
    } else if (Array.isArray(data)) {
      cars = data;
      total = cars.length;
    }

    const normalizedCars = cars
      .map(normalizeCar)
      .filter((car): car is NormalizedCar => car !== null);

    return { cars: normalizedCars, total };
  } catch (error) {
    console.error("Error fetching cars from MarketCheck:", error);
    throw error;
  }
}

/**
 * GET handler for car listings
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // Parse query parameters
    const page = parseInt(searchParams.get("page") || String(DEFAULT_PAGE), 10);

    // Validate page
    if (isNaN(page) || page < 1) {
      return NextResponse.json(
        { error: "Invalid page parameter. Must be a positive integer." },
        { status: 400 },
      );
    }

    // Fetch from MarketCheck API
    const result = await fetchCarsFromMarketCheck(page);
    const cars = result.cars;
    const total = result.total;

    // Calculate total pages
    const totalPages = Math.ceil(total / DEFAULT_ROWS);

    const response: ApiResponse = {
      cars,
      total,
      page,
      totalPages,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error in GET /api/cars:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch cars from MarketCheck API",
        cars: [],
        total: 0,
        page: 1,
        totalPages: 0,
      },
      { status: 500 },
    );
  }
}
