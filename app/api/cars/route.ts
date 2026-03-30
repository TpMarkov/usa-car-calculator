import { NextRequest, NextResponse } from "next/server";

// Marketcheck API Configuration
const MARKETCHECK_BASE_URL = "https://api.marketcheck.com";
const MARKETCHECK_API_KEY =
  process.env.MARKETCHECK_API_KEY || "tUgT7jpnVB1Xqw3MWrmrZjK0fxTCrT8Q";
const MARKETCHECK_API_SECRET =
  process.env.MARKETCHECK_API_SECRET || "S5BB5BVipX5PXrVq";

// Default pagination values
const DEFAULT_PAGE = 1;

// MarketCheck API pagination limits
const ITEMS_PER_PAGE = 50;
const MAX_OFFSET = 1000; // MarketCheck API safe limit
const MAX_PAGE = Math.floor(MAX_OFFSET / ITEMS_PER_PAGE); // = 20

// In-memory cache for API responses
// Uses page number as cache key to prevent duplicate requests
const carCache = new Map<
  string,
  { cars: NormalizedCar[]; total: number; timestamp: number }
>();

// Track in-flight requests to prevent duplicate API calls
const inFlightRequests = new Map<
  string,
  Promise<{ cars: NormalizedCar[]; total: number }>
>();

// Cache TTL (5 minutes)
const CACHE_TTL = 5 * 60 * 1000;

// Flexible media type to handle various API response formats
interface MediaData {
  photo_links?: (
    | string
    | { url?: string; photo?: string; src?: string; image?: string }
  )[];
  all_photos?: (is 
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

// Array of 20 unique car placeholder images
const PLACEHOLDERS = [
  "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800",
  "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=800",
  "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800",
  "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800",
  "https://images.unsplash.com/photo-1617788138017-80ad40651399?w=800",
  "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=800",
  "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800",
  "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=800",
  "https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=800",
  "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800",
  "https://images.unsplash.com/photo-1542362567-b07e54358753?w=800",
  "https://images.unsplash.com/photo-1550355291-bbee04a92027?w=800",
  "https://images.unsplash.com/photo-1502877338535-766e1452684a?w=800",
  "https://images.unsplash.com/photo-1535732820275-9ffd998cac22?w=800",
  "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?w=800",
  "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=800",
  "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800",
  "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800",
  "https://images.unsplash.com/photo-1611312449408-fcece27cdbb7?w=800",
  "https://images.unsplash.com/photo-1590362891991-f776e747a588?w=800",
];

/**
 * Recursively extract URL from any format
 */
function extractUrlDeep(item: any): string {
  if (!item) return "";
  if (typeof item === "string") return item;
  if (typeof item !== "object") return "";

  // Try all possible URL fields
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

  // If no known field, try first string property that looks like a URL
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
 * Handle ALL possible media fields and structures
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

  fields.forEach((field) => {
    const data = media[field];
    if (!data) return;

    if (Array.isArray(data)) {
      data.forEach((item) => urls.push(extractUrlDeep(item)));
    } else if (typeof data === "object") {
      Object.values(data).forEach((item) => urls.push(extractUrlDeep(item)));
    }
  });

  return Array.from(new Set(urls.filter(Boolean)));
}

/**
 * Check if a URL is valid (not a placeholder, has image extension)
 */
function isValidUrl(url: string): boolean {
  if (!url || typeof url !== "string" || url.length < 10) return false;

  // Normalize protocol
  let normalized = url;
  if (!url.startsWith("http://") && !url.startsWith("https://")) {
    if (url.startsWith("//")) {
      normalized = "https:" + url;
    } else {
      normalized = "https://" + url;
    }
  }

  // Reject obvious junk
  if (
    url.toLowerCase().includes("invalid") ||
    url.toLowerCase().includes("error") ||
    url.toLowerCase().includes("photo_unavailable") ||
    url.toLowerCase().includes("placeholder") ||
    (url.toLowerCase().includes(".gif") && url.length < 50)
  ) {
    return false;
  }

  // Accept URL-like strings with image extensions
  return normalized.match(/\.jpg|\.jpeg|\.png|\.webp|\.gif/i) !== null;
}

/**
 * Check if a URL is accessible by making a HEAD request
 * Returns true if the URL returns 200 OK, false otherwise
 */
async function isUrlAccessible(url: string): Promise<boolean> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000); // 3 second timeout

    const response = await fetch(url, {
      method: "HEAD",
      signal: controller.signal,
      // Only follow redirects for a reasonable number
      redirect: "follow",
    });

    clearTimeout(timeoutId);
    return response.ok;
  } catch (error) {
    // URL is not accessible (timeout, network error, etc.)
    console.log(
      `[isUrlAccessible] URL not accessible: ${url}`,
      error instanceof Error ? error.message : "Unknown error",
    );
    return false;
  }
}

/**
 * Validate multiple URLs and return only accessible ones
 * Uses parallel requests with concurrency limit
 */
async function validateUrls(urls: string[]): Promise<string[]> {
  const VALIDATION_CONCURRENCY = 5;
  const validated: string[] = [];

  // Process in batches to avoid overwhelming the server
  for (let i = 0; i < urls.length; i += VALIDATION_CONCURRENCY) {
    const batch = urls.slice(i, i + VALIDATION_CONCURRENCY);
    const results = await Promise.all(
      batch.map(async (url) => {
        const isAccessible = await isUrlAccessible(url);
        return isAccessible ? url : null;
      }),
    );

    results.forEach((url) => {
      if (url) validated.push(url);
    });
  }

  return validated;
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
 * Now includes async URL validation
 */
async function normalizeCar(car: any): Promise<NormalizedCar | null> {
  try {
    // Log the raw media structure for debugging
    console.log(
      "[normalizeCar] Raw media:",
      JSON.stringify(car.media, null, 2),
    );

    // Extract ALL possible URLs using the new comprehensive extraction
    const extractedUrls = extractAllUrls(car.media);
    console.log("[normalizeCar] All extracted URLs:", extractedUrls);

    // Filter URLs that pass basic validation (format check)
    const formatValidUrls = extractedUrls.filter((url) => isValidUrl(url));
    console.log(
      "[normalizeCar] Format-valid URLs count:",
      formatValidUrls.length,
    );

    // Validate URLs by checking if they are actually accessible (HEAD request)
    let validImages: string[];
    const MAX_VALIDATIONS = 10; // Limit URL validations to prevent timeout
    const urlsToValidate = formatValidUrls.slice(0, MAX_VALIDATIONS);
    if (urlsToValidate.length > 0) {
      console.log(
        `[normalizeCar] Validating ${urlsToValidate.length} URLs (limited from ${formatValidUrls.length})...`,
      );
      validImages = await validateUrls(urlsToValidate);
      console.log("[normalizeCar] Accessible URLs count:", validImages.length);
    } else {
      validImages = [];
    }

    // Get total photos count from various sources
    const totalPhotos = extractedUrls.length || 0;

    // Fill with placeholders if needed to match original photo count
    const imagesToUse = [...validImages];
    if (totalPhotos > validImages.length) {
      const needed = totalPhotos - validImages.length;
      console.log(`[normalizeCar] Adding ${needed} placeholder images`);
      for (let i = 0; i < needed; i++) {
        imagesToUse.push(PLACEHOLDERS[i % PLACEHOLDERS.length]);
      }
    }

    // If no valid accessible images, use placeholder
    if (imagesToUse.length === 0) {
      imagesToUse.push(PLACEHOLDERS[0]);
    }

    // Use first valid image or placeholder
    const image = validImages[0] || PLACEHOLDERS[0];

    console.log("[normalizeCar] Final _processed_urls:", imagesToUse);

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

    // Build media object with processed URLs for easy access
    const media: MediaData = {
      _processed_urls: imagesToUse,
      photo_links:
        validImages.length > 0 ? validImages : car.media?.photo_links,
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
 * Generate cache key from page and optional filters
 */
function getCacheKey(page: number, filters?: Record<string, string>): string {
  const filterStr = filters ? JSON.stringify(filters) : "";
  return `${page}-${filterStr}`;
}

/**
 * Clear cache when filters change (exported for future use)
 */
export function clearCache(): void {
  carCache.clear();
  console.log("[clearCache] Cache cleared due to filter change");
}

/**
 * Fetch cars from MarketCheck API with caching and deduplication
 * @param page - Page number (1-indexed)
 * @param filters - Optional filters for the request
 * @returns Promise with normalized cars and total count
 */
async function fetchCarsFromMarketCheck(
  page: number,
  filters?: Record<string, string>,
): Promise<{ cars: NormalizedCar[]; total: number }> {
  // Enforce max page validation - never allow page > MAX_PAGE
  if (page > MAX_PAGE) {
    console.log(
      `[fetchCarsFromMarketCheck] Page ${page} exceeds MAX_PAGE (${MAX_PAGE}). Returning empty results.`,
    );
    return { cars: [], total: 0 };
  }

  // Generate cache key
  const cacheKey = getCacheKey(page, filters);

  // Check cache first
  const cached = carCache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    console.log(`[fetchCarsFromMarketCheck] Cache hit for page ${page}`);
    return { cars: cached.cars, total: cached.total };
  }

  // Check if request is already in-flight (request deduplication)
  const existingRequest = inFlightRequests.get(cacheKey);
  if (existingRequest) {
    console.log(
      `[fetchCarsFromMarketCheck] Returning in-flight request for page ${page}`,
    );
    return existingRequest;
  }

  // Create the fetch promise and track it
  const fetchPromise = (async (): Promise<{
    cars: NormalizedCar[];
    total: number;
  }> => {
    try {
      return await doFetchCarsFromMarketCheck(page, filters);
    } finally {
      // Remove from in-flight requests when done
      inFlightRequests.delete(cacheKey);
    }
  })();

  inFlightRequests.set(cacheKey, fetchPromise);
  return fetchPromise;
}

/**
 * Internal function to fetch cars from MarketCheck API
 * @param page - Page number (1-indexed)
 * @param _filters - Optional filters for the request (reserved for future use)
 * @returns Promise with normalized cars and total count
 */
async function doFetchCarsFromMarketCheck(
  page: number,
  _filters?: Record<string, string>,
): Promise<{ cars: NormalizedCar[]; total: number }> {
  const start = (page - 1) * ITEMS_PER_PAGE;

  const searchParams = new URLSearchParams();
  searchParams.append("api_key", MARKETCHECK_API_KEY);
  searchParams.append("rows", String(ITEMS_PER_PAGE));
  searchParams.append("start", String(start));
  searchParams.append("sort_by", "dom");
  searchParams.append("sort_order", "desc");

  const url = `${MARKETCHECK_BASE_URL}/v2/search/car/active?${searchParams.toString()}`;

  console.log(
    `[fetchCarsFromMarketCheck] Fetching page ${page}, start=${start}`,
  );

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: getAuthHeader(),
        Accept: "application/json",
      },
    });

    console.log(
      `[fetchCarsFromMarketCheck] MarketCheck API response status: ${response.status}, page: ${page}, start: ${start}`,
    );

    // Check for error status codes - some may be recoverable
    if (!response.ok) {
      const errorText = await response.text();
      console.error(
        `[fetchCarsFromMarketCheck] MarketCheck API error: HTTP ${response.status}, page: ${page}, start: ${start}, error: ${errorText}`,
      );

      // For high page numbers (high start value), API may return errors
      // Instead of throwing, return empty results gracefully
      if (start >= MAX_OFFSET || response.status >= 400) {
        console.log(
          `[fetchCarsFromMarketCheck] Page ${page} exceeds safe limit (start=${start}, MAX_OFFSET=${MAX_OFFSET}). Returning empty gracefully.`,
        );
        return { cars: [], total: 0 };
      }
    }

    const data = await response.json();

    console.log(
      `[fetchCarsFromMarketCheck] MarketCheck response status: ${response.status}, has listings: ${!!data.listings}, has results: ${!!data.results}, is array: ${Array.isArray(data)}, data keys: ${Object.keys(data || {})}`,
    );

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

    console.log(
      `[fetchCarsFromMarketCheck] Parsed response: ${cars.length} cars, total: ${total}, page: ${page}, start: ${start}`,
    );

    // Handle edge case: if we're past the available data, return empty
    if (start >= total && total > 0) {
      console.log(
        `[fetchCarsFromMarketCheck] Page ${page} is beyond available data (start=${start}, total=${total}), returning empty`,
      );
      return { cars: [], total };
    }

    console.log(
      `[fetchCarsFromMarketCheck] Page ${page} - Starting normalizeCar for ${cars.length} cars`,
    );
    const normalizeStartTime = Date.now();

    const normalizedCars = await Promise.all(
      cars.map((car, index) =>
        normalizeCar(car).catch((err) => {
          console.error(
            `[fetchCarsFromMarketCheck] normalizeCar failed for car index ${index}:`,
            err,
          );
          return null;
        }),
      ),
    ).then((results) =>
      results.filter((car): car is NormalizedCar => car !== null),
    );

    const normalizeDuration = Date.now() - normalizeStartTime;
    console.log(
      `[fetchCarsFromMarketCheck] Page ${page} - Normalized ${normalizedCars.length} cars in ${normalizeDuration}ms`,
    );

    return { cars: normalizedCars, total };
  } catch (error) {
    console.error("Error fetching cars from MarketCheck:", error);
    // Return empty results instead of throwing to keep previous data visible
    return { cars: [], total: 0 };
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

    // Validate page - enforce max limit
    if (isNaN(page) || page < 1) {
      return NextResponse.json(
        { error: "Invalid page parameter. Must be a positive integer." },
        { status: 400 },
      );
    }

    // Enforce max page limit - never allow page > MAX_PAGE
    if (page > MAX_PAGE) {
      console.log(
        `[GET] Page ${page} exceeds MAX_PAGE (${MAX_PAGE}). Returning empty results with message.`,
      );
      return NextResponse.json({
        cars: [],
        total: 0,
        page: MAX_PAGE,
        totalPages: MAX_PAGE,
        message: "No more results available",
      });
    }

    // Extract filters from query params (for cache clearing)
    const filters: Record<string, string> = {};
    searchParams.forEach((value, key) => {
      if (key !== "page") {
        filters[key] = value;
      }
    });

    // Fetch from MarketCheck API (uses cache and deduplication internally)
    const result = await fetchCarsFromMarketCheck(page, filters);
    const cars = result.cars;
    const total = result.total;

    // Calculate total pages (capped at MAX_PAGE for safety)
    const totalPages = Math.min(Math.ceil(total / ITEMS_PER_PAGE), MAX_PAGE);

    // Check if we're at the edge of available data
    const start = (page - 1) * ITEMS_PER_PAGE;
    let message: string | undefined;
    if (page >= MAX_PAGE || (total > 0 && start >= total)) {
      message = "No more results available";
    }

    const response: ApiResponse = {
      cars,
      total,
      page,
      totalPages,
      ...(message && { message }),
    };

    // Cache the response
    const cacheKey = getCacheKey(page, filters);
    carCache.set(cacheKey, { cars, total, timestamp: Date.now() });

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
        message: "No more results available",
      },
      { status: 500 },
    );
  }
}
