import { NextRequest, NextResponse } from "next/server";

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
}

interface ApiResponse {
  cars: NormalizedCar[];
  total: number;
  page: number;
  totalPages: number;
}

// Mock car data for testing
const mockCars: NormalizedCar[] = [
  {
    id: "1",
    title: "2024 Toyota Camry SE",
    price: 26500,
    image: "",
    year: 2024,
    make: "Toyota",
    model: "Camry",
    location: "Houston, TX",
  },
  {
    id: "2",
    title: "2023 Honda Civic LX",
    price: 24000,
    image: "",
    year: 2023,
    make: "Honda",
    model: "Civic",
    location: "Dallas, TX",
  },
  {
    id: "3",
    title: "2022 Ford Mustang GT",
    price: 42000,
    image: "",
    year: 2022,
    make: "Ford",
    model: "Mustang",
    location: "Miami, FL",
  },
  {
    id: "4",
    title: "2024 Toyota RAV4 XLE",
    price: 32000,
    image: "",
    year: 2024,
    make: "Toyota",
    model: "RAV4",
    location: "Phoenix, AZ",
  },
  {
    id: "5",
    title: "2023 Chevrolet Silverado 1500",
    price: 48000,
    image: "",
    year: 2023,
    make: "Chevrolet",
    model: "Silverado",
    location: "Denver, CO",
  },
  {
    id: "6",
    title: "2022 Nissan Altima SR",
    price: 28000,
    image: "",
    year: 2022,
    make: "Nissan",
    model: "Altima",
    location: "Atlanta, GA",
  },
  {
    id: "7",
    title: "2024 Mazda CX-5 Touring",
    price: 33500,
    image: "",
    year: 2024,
    make: "Mazda",
    model: "CX-5",
    location: "Seattle, WA",
  },
  {
    id: "8",
    title: "2023 Subaru Outback Limited",
    price: 38500,
    image: "",
    year: 2023,
    make: "Subaru",
    model: "Outback",
    location: "Portland, OR",
  },
  {
    id: "9",
    title: "2022 Jeep Grand Cherokee L",
    price: 45000,
    image: "",
    year: 2022,
    make: "Jeep",
    model: "Grand Cherokee",
    location: "Chicago, IL",
  },
  {
    id: "10",
    title: "2024 Hyundai Sonata SEL",
    price: 29000,
    image: "",
    year: 2024,
    make: "Hyundai",
    model: "Sonata",
    location: "Los Angeles, CA",
  },
  {
    id: "11",
    title: "2023 Kia K5 GT-Line",
    price: 31000,
    image: "",
    year: 2023,
    make: "Kia",
    model: "K5",
    location: "San Diego, CA",
  },
  {
    id: "12",
    title: "2022 Volkswagen Jetta SEL",
    price: 27000,
    image: "",
    year: 2022,
    make: "Volkswagen",
    model: "Jetta",
    location: "Austin, TX",
  },
  {
    id: "13",
    title: "2024 Honda Accord Sport",
    price: 33000,
    image: "",
    year: 2024,
    make: "Honda",
    model: "Accord",
    location: "Boston, MA",
  },
  {
    id: "14",
    title: "2023 Toyota Corolla SE",
    price: 25000,
    image: "",
    year: 2023,
    make: "Toyota",
    model: "Corolla",
    location: "Philadelphia, PA",
  },
  {
    id: "15",
    title: "2022 Ford F-150 Lariat",
    price: 52000,
    image: "",
    year: 2022,
    make: "Ford",
    model: "F-150",
    location: "Detroit, MI",
  },
];

/**
 * GET handler for car listings
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // Parse query parameters
    const page = parseInt(searchParams.get("page") || String(DEFAULT_PAGE), 10);
    const make = searchParams.get("make");
    const model = searchParams.get("model");
    const year = searchParams.get("year");
    const priceRange = searchParams.get("priceRange");

    console.log("Request params:", { page, make, model, year, priceRange });

    // Validate page
    if (isNaN(page) || page < 1) {
      return NextResponse.json(
        { error: "Invalid page parameter. Must be a positive integer." },
        { status: 400 },
      );
    }

    // Parse price range
    let priceMin: number | undefined;
    let priceMax: number | undefined;
    if (priceRange) {
      const parts = priceRange.split("-");
      if (parts.length === 2) {
        priceMin = parseInt(parts[0], 10);
        priceMax = parseInt(parts[1], 10);
      }
    }

    // Parse year filter
    let yearNum: number | undefined;
    if (year) {
      yearNum = parseInt(year, 10);
      if (
        isNaN(yearNum) ||
        yearNum < 1900 ||
        yearNum > new Date().getFullYear() + 1
      ) {
        return NextResponse.json(
          { error: "Invalid year parameter." },
          { status: 400 },
        );
      }
    }

    // Filter cars
    let filteredCars = mockCars;

    if (make) {
      filteredCars = filteredCars.filter(
        (c) => c.make.toLowerCase() === make.toLowerCase(),
      );
    }

    if (model) {
      filteredCars = filteredCars.filter(
        (c) => c.model.toLowerCase() === model.toLowerCase(),
      );
    }

    if (yearNum) {
      filteredCars = filteredCars.filter((c) => c.year === yearNum);
    }

    if (priceMin !== undefined) {
      filteredCars = filteredCars.filter((c) => c.price >= priceMin!);
    }

    if (priceMax !== undefined) {
      filteredCars = filteredCars.filter((c) => c.price <= priceMax!);
    }

    const total = filteredCars.length;
    const totalPages = Math.ceil(total / DEFAULT_ROWS);

    // Pagination
    const start = (page - 1) * DEFAULT_ROWS;
    const end = start + DEFAULT_ROWS;
    const paginatedCars = filteredCars.slice(start, end);

    console.log("Filtered cars:", paginatedCars.length, "total:", total);

    // Return response
    return NextResponse.json({
      cars: paginatedCars,
      total,
      page,
      totalPages,
    });
  } catch (error) {
    console.error("API route error:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { error: "Internal server error: " + errorMessage },
      { status: 500 },
    );
  }
}
