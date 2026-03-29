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
}

interface ApiResponse {
  cars: NormalizedCar[];
  total: number;
  page: number;
  totalPages: number;
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
    // Extract images from media.photo_links array
    let image = "";
    if (car.media?.photo_links && car.media.photo_links.length > 0) {
      // Filter out the "photo_unavailable" placeholder images
      const validImages = car.media.photo_links.filter(
        (url: string) => !url.includes("photo_unavailable"),
      );
      image = validImages[0] || car.media.photo_links[0] || "";
    }

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
