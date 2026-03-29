import { NextRequest, NextResponse } from "next/server";

// Marketcheck API Configuration
const MARKETCHECK_BASE_URL = "https://api.marketcheck.com";
const MARKETCHECK_API_KEY = "tUgT7jpnVB1Xqw3MWrmrZjK0fxTCrT8Q";
const MARKETCHECK_API_SECRET = "S5BB5BVipX5PXrVq";

// Default pagination values
const DEFAULT_ROWS = 9;
const DEFAULT_PAGE = 1;

interface NormalizedCar {
  id: string | number;
  title: string;
  price: number;
  image: string;
  year: number;
  make: string;
  model: string;
  location: string;
  mileage?: number;
  vin?: string;
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
 * Normalize Marketcheck car data to our format
 */
function normalizeCar(car: any): NormalizedCar {
  // Extract images from various possible locations
  let image = "";

  // Check media.photos array (common Marketcheck format)
  if (car.media && car.media.photos && car.media.photos.length > 0) {
    const photos = car.media.photos;
    const largePhoto = photos.find((p: any) => p.size === "large");
    const mediumPhoto = photos.find((p: any) => p.size === "medium");
    const firstPhoto = photos[0];
    image = largePhoto?.url || mediumPhoto?.url || firstPhoto?.url || "";
  }
  // Check media.images array
  else if (
    car.media &&
    car.media.images &&
    Array.isArray(car.media.images) &&
    car.media.images.length > 0
  ) {
    image = car.media.images[0];
  }
  // Check images array
  else if (car.images && Array.isArray(car.images) && car.images.length > 0) {
    image = car.images[0];
  }
  // Check image field (string)
  else if (car.image && typeof car.image === "string") {
    image = car.image;
  }
  // Check photo_urls array
  else if (
    car.photo_urls &&
    Array.isArray(car.photo_urls) &&
    car.photo_urls.length > 0
  ) {
    image = car.photo_urls[0];
  }
  // Check photos array (simple string URLs)
  else if (car.photos && Array.isArray(car.photos) && car.photos.length > 0) {
    image =
      typeof car.photos[0] === "string"
        ? car.photos[0]
        : car.photos[0]?.url || "";
  }
  // Fallback to placeholder if no image found
  if (!image) {
    image = "https://placehold.co/600x400?text=No+Image";
  }

  // Handle different Marketcheck response formats
  const vehicleInfo = car.vehicle_info || {};
  const build = car.build || vehicleInfo.build || {};

  // Extract make
  let make =
    car.make ||
    vehicleInfo.make ||
    build.make ||
    car.marque ||
    car.mfg_name ||
    "";

  // Extract model
  let model =
    car.model ||
    vehicleInfo.model ||
    build.model ||
    car.model_name ||
    car.carline_name ||
    "";

  // Year - use a simple fallback
  let year = car.year || vehicleInfo.year || 0;
  if (!year && build.model_year) year = build.model_year;

  // Build title from year, make, model
  const title = `${year} ${make} ${model}`.trim();

  // Build location from dealer info
  let location = "";
  if (car.dealer) {
    const city = car.dealer.city || "";
    const state = car.dealer.state || "";
    if (city && state) {
      location = `${city}, ${state}`;
    } else if (city) {
      location = city;
    } else if (state) {
      location = state;
    }
  } else if (car.location) {
    location = car.location;
  }

  // Extract price
  let price = 0;
  if (typeof car.price === "number") price = car.price;
  else if (typeof car.price === "string") price = parseInt(car.price, 10) || 0;
  else if (car.msrp)
    price =
      typeof car.msrp === "number" ? car.msrp : parseInt(car.msrp, 10) || 0;
  else if (car.listing_price)
    price =
      typeof car.listing_price === "number"
        ? car.listing_price
        : parseInt(car.listing_price, 10) || 0;

  return {
    id: car.listing_id || car.id || "",
    title: title || "Unknown Vehicle",
    price: price,
    image: image,
    year: year,
    make: make,
    model: model,
    location: location,
    mileage: car.mileage || car.miles,
    vin: car.vin,
  };
}

/**
 * Fetch cars from Marketcheck API
 */
async function fetchCarsFromMarketcheck(params: {
  rows: number;
  start: number;
  make?: string;
  model?: string;
  year?: number;
  priceMin?: number;
  priceMax?: number;
}): Promise<{ cars: NormalizedCar[]; total: number }> {
  const searchParams = new URLSearchParams();
  searchParams.append("api_key", MARKETCHECK_API_KEY);
  searchParams.append("rows", String(params.rows));
  searchParams.append("start", String(params.start));

  if (params.make) searchParams.append("make", params.make);
  if (params.model) searchParams.append("model", params.model);
  if (params.year) searchParams.append("year", String(params.year));
  if (params.priceMin)
    searchParams.append("price_min", String(params.priceMin));
  if (params.priceMax)
    searchParams.append("price_max", String(params.priceMax));

  const url = `${MARKETCHECK_BASE_URL}/v2/search/car/active?${searchParams.toString()}`;

  console.log(
    "Marketcheck API URL:",
    url.replace(MARKETCHECK_API_KEY, "REDACTED"),
  );

  const response = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: getAuthHeader(),
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Marketcheck API error:", response.status, errorText);
    throw new Error(`Marketcheck API error: ${response.status} - ${errorText}`);
  }

  const data = await response.json();
  console.log(
    "Marketcheck API response:",
    JSON.stringify(data).substring(0, 500),
  );

  // Handle different response formats from Marketcheck
  let cars: any[] = [];
  let total = 0;

  if (data.listings && Array.isArray(data.listings)) {
    cars = data.listings;
    total = data.total_count || data.total || cars.length;
  } else if (data.results && Array.isArray(data.results)) {
    cars = data.results;
    total = data.total_count || data.total || cars.length;
  } else if (Array.isArray(data)) {
    cars = data;
    total = cars.length;
  }

  const normalizedCars = cars.map(normalizeCar);

  return { cars: normalizedCars, total };
}

/**
 * GET handler for car listings
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // Parse query parameters
    const page = parseInt(searchParams.get("page") || String(DEFAULT_PAGE), 10);
    const make = searchParams.get("make") || undefined;
    const model = searchParams.get("model") || undefined;
    const year = searchParams.get("year");
    const minPriceParam = searchParams.get("minPrice");
    const maxPriceParam = searchParams.get("maxPrice");

    console.log("Request params:", {
      page,
      make,
      model,
      year,
      minPrice: minPriceParam,
      maxPrice: maxPriceParam,
    });

    // Validate page
    if (isNaN(page) || page < 1) {
      return NextResponse.json(
        { error: "Invalid page parameter. Must be a positive integer." },
        { status: 400 },
      );
    }

    // Parse price range from minPrice and maxPrice parameters
    let priceMin: number | undefined;
    let priceMax: number | undefined;
    if (minPriceParam) {
      priceMin = parseInt(minPriceParam, 10);
      if (isNaN(priceMin)) priceMin = undefined;
    }
    if (maxPriceParam) {
      priceMax = parseInt(maxPriceParam, 10);
      if (isNaN(priceMax)) priceMax = undefined;
    }

    // Parse year filter
    let yearNum: number | undefined;
    if (year) {
      yearNum = parseInt(year, 10);
      if (
        isNaN(yearNum!) ||
        yearNum! < 1900 ||
        yearNum! > new Date().getFullYear() + 1
      ) {
        return NextResponse.json(
          { error: "Invalid year parameter." },
          { status: 400 },
        );
      }
    }

    // Calculate pagination for Marketcheck API
    const start = (page - 1) * DEFAULT_ROWS;
    const rows = DEFAULT_ROWS;

    // Fetch from Marketcheck API
    const { cars, total } = await fetchCarsFromMarketcheck({
      rows,
      start,
      make,
      model,
      year: yearNum,
      priceMin,
      priceMax,
    });

    const totalPages = Math.ceil(total / DEFAULT_ROWS);

    console.log(`Returning ${cars.length} cars out of ${total} total`);

    // Return response
    return NextResponse.json({
      cars,
      total,
      page,
      totalPages,
    });
  } catch (error) {
    console.error("API route error:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);

    // Return a more helpful error message
    return NextResponse.json(
      {
        error: "Failed to fetch car data from Marketcheck API",
        details: errorMessage,
        cars: [],
        total: 0,
        page: 1,
        totalPages: 0,
      },
      { status: 500 },
    );
  }
}
