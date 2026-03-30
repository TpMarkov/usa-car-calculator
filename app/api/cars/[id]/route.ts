import { NextRequest, NextResponse } from "next/server";

/**
 * Single Car API Route
 *
 * Fetches a specific car by its ID or VIN from the MarketCheck API.
 * This endpoint searches across all available inventory to find the car.
 */

// MarketCheck API Configuration
const MARKETCHECK_BASE_URL = "https://api.marketcheck.com";
const MARKETCHECK_API_KEY =
  process.env.MARKETCHECK_API_KEY || "tUgT7jpnVB1Xqw3MWrmrZjK0fxTCrT8Q";
const MARKETCHECK_API_SECRET =
  process.env.MARKETCHECK_API_SECRET || "S5BB5BVipX5PXrVq";

// Placeholder images for fallback
const PLACEHOLDERS = [
  "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800",
  "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=800",
  "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800",
  "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800",
  "https://images.unsplash.com/photo-1617788138017-80ad40651399?w=800",
  "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=800",
  "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800",
  "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=800",
];

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

/**
 * Generate authentication header for MarketCheck API
 */
function getAuthHeader(): string {
  const credentials = `${MARKETCHECK_API_KEY}:${MARKETCHECK_API_SECRET}`;
  const base64Credentials = Buffer.from(credentials).toString("base64");
  return `Basic ${base64Credentials}`;
}

/**
 * Check if a URL is valid
 */
function isValidUrl(url: string): boolean {
  if (!url || typeof url !== "string") return false;
  try {
    const urlObj = new URL(url);
    return urlObj.protocol === "http:" || urlObj.protocol === "https:";
  } catch {
    return false;
  }
}

/**
 * Recursively extract URL from any format
 */
function extractUrlDeep(item: any): string {
  if (!item) return "";
  if (typeof item === "string") return item;
  if (typeof item !== "object") return "";

  const urlFields = [
    "url",
    "photo",
    "src",
    "image",
    "href",
    "link",
    "path",
    "file",
    "img",
    "large",
    "medium",
    "thumb",
  ];
  for (const field of urlFields) {
    if (item[field]) {
      const val = item[field];
      if (typeof val === "string") return val;
      if (typeof val === "object") {
        const nested = extractUrlDeep(val);
        if (nested) return nested;
      }
    }
  }

  for (const key of Object.keys(item)) {
    const val = item[key];
    if (
      typeof val === "string" &&
      (val.includes(".jpg") ||
        val.includes(".jpeg") ||
        val.includes(".png") ||
        val.includes(".webp") ||
        val.includes(".gif") ||
        val.includes("http"))
    ) {
      return val;
    }
  }

  return "";
}

/**
 * Extract all URLs from media object
 */
function extractAllUrls(media: any): string[] {
  const urls: string[] = [];
  if (!media) return urls;

  const fields = [
    "photo_links",
    "all_photos",
    "images",
    "photos",
    "media",
    "photos_array",
  ];

  for (const field of fields) {
    if (media[field]) {
      const arr = media[field];
      if (Array.isArray(arr)) {
        for (const item of arr) {
          const url = extractUrlDeep(item);
          if (url && !urls.includes(url)) {
            urls.push(url);
          }
        }
      }
    }
  }

  return urls;
}

/**
 * Normalize a single car from MarketCheck API response
 */
function normalizeCar(car: any): NormalizedCar | null {
  try {
    const extractedUrls = extractAllUrls(car.media);
    const validImages = extractedUrls.filter((url) => isValidUrl(url));
    const image = validImages[0] || PLACEHOLDERS[0];

    const build = car.build || {};
    const make = car.make || build.make || "";
    const model = car.model || build.model || "";
    const year = car.year || build.year || 0;
    const title = car.heading || `${year} ${make} ${model}`.trim();

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

    const engine = car.engine || build.engine || "";
    const fuel = car.fuel_type || build.fuel_type || "";

    // Determine the car ID: use existing id, vin, or generate from vin
    const carId = car.id || car.vin || Math.random().toString(36).substr(2, 9);

    const media: MediaData = {
      _processed_urls: validImages,
      photo_links:
        validImages.length > 0 ? validImages : car.media?.photo_links,
    };

    if (car.media?.all_photos) media.all_photos = car.media.all_photos;
    if (car.media?.images) media.images = car.media.images;
    if (car.media?.photos) media.photos = car.media.photos;

    return {
      id: carId,
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
 * Search for a car by ID across paginated results
 */
async function searchCarById(carId: string): Promise<NormalizedCar | null> {
  const searchParams = new URLSearchParams();
  searchParams.append("api_key", MARKETCHECK_API_KEY);
  searchParams.append("rows", "50");
  searchParams.append("start", "0");
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
      console.error("MarketCheck API error:", response.status);
      return null;
    }

    const data = await response.json();
    let cars: any[] = [];

    if (data.listings && Array.isArray(data.listings)) {
      cars = data.listings;
    } else if (data.results && Array.isArray(data.results)) {
      cars = data.results;
    } else if (Array.isArray(data)) {
      cars = data;
    }

    // Try to find the car by id or vin in the first page only
    // This prevents excessive API calls when searching for a car
    let foundCar = cars.find((c) => c.id === carId || c.vin === carId);

    if (!foundCar) {
      // Don't search through additional pages - this would cause 10+ API calls per car detail view
      // Instead, return null and let the user know to find the car in marketplace first
      console.log(
        `[searchCarById] Car not found in first page (50 cars). NOT searching additional pages to avoid exhausting API quota.`,
      );
      console.log(
        `[searchCarById] To find this car, please search from the marketplace first to get it in recent inventory.`,
      );
      return null;
    }

    if (foundCar) {
      return normalizeCar(foundCar);
    }

    return null;
  } catch (error) {
    console.error("Error searching car by ID:", error);
    return null;
  }
}

/**
 * GET handler - Fetch a single car by ID
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const requestId = Math.random().toString(36).substring(2, 10);
  try {
    const { id: carId } = await params;

    if (!carId) {
      return NextResponse.json(
        { error: "Car ID is required" },
        { status: 400 },
      );
    }

    console.log(`[${requestId}] [API] Starting car search for ID:`, carId);
    console.time(`[${requestId}] [API] Car search duration`);

    // Search for the car
    const car = await searchCarById(carId);

    console.timeEnd(`[${requestId}] [API] Car search duration`);

    if (!car) {
      return NextResponse.json(
        { error: "Car not found", car: null },
        { status: 404 },
      );
    }

    return NextResponse.json({ car });
  } catch (error) {
    console.error("Error in GET /api/cars/[id]:", error);
    return NextResponse.json(
      { error: "Failed to fetch car data", car: null },
      { status: 500 },
    );
  }
}
