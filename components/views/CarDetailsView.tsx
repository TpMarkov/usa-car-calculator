"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, MapPin, Gauge, Fuel, Calendar, DollarSign, Car as CarIcon, Warehouse } from "lucide-react";
import type { Car, MediaData } from "@/types";

// Helper function to safely format numbers
const formatNumber = (num?: number): string => {
  if (num == null || typeof num !== "number" || isNaN(num)) return "N/A";
  return num.toLocaleString();
};

// Format mileage for display
const formatMileage = (miles?: number | string): string => {
  if (!miles && miles !== 0) return "N/A";
  const numMiles = typeof miles === "string" ? parseInt(miles, 10) : miles;
  if (isNaN(numMiles)) return "N/A";
  return `${formatNumber(numMiles)} mi`;
};

interface CarDetailsViewProps {
  carId?: string;
  onBack?: () => void;
}

// Try to get car from localStorage as fallback
function getCarFromStorage(carId: string): Car | null {
  if (typeof window === "undefined") return null;
  try {
    const stored = localStorage.getItem("carsCache");
    if (stored) {
      const cars: Car[] = JSON.parse(stored);
      return cars.find((c) => c.id === carId) || null;
    }
  } catch (error) {
    console.error("Failed to get car from localStorage:", error);
  }
  return null;
}

// Helper to extract valid URLs from various possible media fields
function extractAllUrls(media: MediaData | undefined): string[] {
  if (!media) return [];

  const urls: string[] = [];
  const addUrls = (arr: (string | { url?: string; photo?: string; src?: string; image?: string })[] | undefined) => {
    if (!arr || !Array.isArray(arr)) return;
    for (const item of arr) {
      let url = "";
      if (typeof item === "string") {
        url = item;
      } else if (typeof item === "object" && item !== null) {
        url = (item as any).url || (item as any).photo || (item as any).src || (item as any).image || "";
      }
      if (url && typeof url === "string" && !url.includes("photo_unavailable") && !url.includes("placeholder")) {
        urls.push(url);
      }
    }
  };

  // Try photo_links first
  addUrls(media.photo_links);
  // Then all_photos
  addUrls(media.all_photos);
  // Then images
  addUrls(media.images);
  // Finally photos
  addUrls(media.photos);

  // Deduplicate
  return [...new Set(urls)];
}

export default function CarDetailsView({ carId, onBack }: CarDetailsViewProps) {
  const [car, setCar] = useState<Car | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [fetchError, setFetchError] = useState<string | null>(null);

  useEffect(() => {
    if (!carId) {
      setLoading(false);
      return;
    }

    // Try to get car from localStorage first
    const storedCar = getCarFromStorage(carId);
    if (storedCar) {
      setCar(storedCar);
      setLoading(false);
      return;
    }

    // If not in localStorage, try to fetch from API using single-car endpoint
    const fetchCarFromApi = async () => {
      try {
        const response = await fetch(`/api/cars/${encodeURIComponent(carId)}`);
        if (!response.ok) {
          if (response.status === 404) {
            setFetchError(`Car with ID ${carId} not found in current inventory`);
          } else {
            throw new Error('Failed to fetch car');
          }
          setLoading(false);
          return;
        }
        const data = await response.json();
        
        const foundCar = data.car;
        if (foundCar) {
          setCar(foundCar);
          // Cache in localStorage for future visits
          try {
            const existingCache = localStorage.getItem('carsCache');
            const cars: Car[] = existingCache ? JSON.parse(existingCache) : [];
            const existingIndex = cars.findIndex(c => c.id === foundCar.id);
            if (existingIndex >= 0) {
              cars[existingIndex] = foundCar;
            } else {
              cars.push(foundCar);
            }
            localStorage.setItem('carsCache', JSON.stringify(cars));
          } catch (e) {
            console.error('Failed to cache car:', e);
          }
        } else {
          setFetchError(`Car with ID ${carId} not found in current inventory`);
        }
      } catch (error) {
        console.error('API fetch failed:', error);
        setFetchError('Failed to load car data');
      } finally {
        setLoading(false);
      }
    };

    fetchCarFromApi();
  }, [carId]);

  // Reset selected image when car changes
  useEffect(() => {
    setSelectedImageIndex(0);
  }, [car?.id]);

  // Get all available images - with diagnostic logging
  const allImages = (() => {
    const media = car?.media;
    console.log("[CarDetailsView] Media structure:", JSON.stringify(media, null, 2));

    // Try _processed_urls first (from API processing)
    if (media?._processed_urls && Array.isArray(media._processed_urls) && media._processed_urls.length > 0) {
      console.log("[CarDetailsView] Using _processed_urls:", media._processed_urls.length);
      return media._processed_urls;
    }

    // Otherwise extract from various fields
    const urls = extractAllUrls(media);
    console.log("[CarDetailsView] Extracted URLs:", urls.length);
    return urls;
  })();

  // If no images in media, use the main image
  const displayImages = allImages.length > 0 ? allImages : (car?.image ? [car.image] : []);
  const currentImage = displayImages[selectedImageIndex] || "/missing-image.png";

  // Get display title
  const displayTitle = car?.title || `${car?.year} ${car?.make} ${car?.model}`.trim();
  const displayMakeModel = `${car?.make} ${car?.model}`.trim();

  // Handle back navigation
  const handleBack = () => {
    if (onBack) {
      onBack();
    } else if (typeof window !== "undefined") {
      window.history.back();
    }
  };

  // Loading state
  if (loading) {
    return (
      <main className="pt-28 pb-20 px-4 sm:px-6" suppressHydrationWarning>
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center py-20 sm:py-32">
            <div className="flex flex-col items-center gap-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 border-[3px] border-brand/20 border-t-brand rounded-full animate-spin" />
              <p className="text-gray-400 font-medium text-sm">Loading car details...</p>
            </div>
          </div>
        </div>
      </main>
    );
  }

  // Not found state
  if (!car) {
    return (
      <main className="pt-28 pb-20 px-4 sm:px-6" suppressHydrationWarning>
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16 sm:py-24"
          >
            <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-300">
              <CarIcon size={40} />
            </div>
            <h2 className="text-2xl sm:text-3xl font-display font-bold mb-3">Car data not available</h2>
            <p className="text-gray-400 text-base mb-2">
              Please return to marketplace to view car details.
            </p>
            {fetchError && (
              <p className="text-gray-500 text-sm mb-4">Debug: {fetchError}</p>
            )}
            {carId && (
              <p className="text-gray-500 text-xs mb-4">Debug: carId={carId}</p>
            )}
            <button
              onClick={handleBack}
              className="px-6 py-3 bg-brand text-white rounded-xl font-semibold hover:bg-brand/90 transition-colors inline-flex items-center gap-2"
            >
              <ArrowLeft size={18} />
              <span>Back to Marketplace</span>
            </button>
          </motion.div>
        </div>
      </main>
    );
  }

  return (
    <main className="pt-28 pb-20 px-4 sm:px-6" suppressHydrationWarning>
      <div className="max-w-7xl mx-auto">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <button
            onClick={handleBack}
            className="inline-flex items-center gap-2 text-gray-600 hover:text-brand transition-colors font-medium"
          >
            <ArrowLeft size={18} />
            <span>Back to Marketplace</span>
          </button>
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Image */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-2"
          >
            {/* Main Image */}
            <div className="aspect-[16/10] rounded-2xl overflow-hidden bg-gray-100 mb-3">
              <img
                src={currentImage}
                alt={displayTitle}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "/missing-image.png";
                }}
              />
            </div>

            {/* Image Gallery Thumbnails */}
            {displayImages.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2">
                {displayImages.map((img: string, index: number) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`flex-shrink-0 w-20 h-14 rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImageIndex === index
                        ? "border-brand shadow-md"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <img
                      src={img}
                      alt={`${displayTitle} - Image ${index + 1}`}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "/missing-image.png";
                      }}
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Image counter for multiple images */}
            {displayImages.length > 1 && (
              <p className="text-sm text-gray-500 mt-2 text-center">
                {selectedImageIndex + 1} of {displayImages.length} photos
              </p>
            )}
          </motion.div>

          {/* Right Column - Overview */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            {/* Title & Price */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100">
              <h1 className="text-2xl sm:text-3xl font-display font-bold tracking-tight mb-2">
                {displayMakeModel}
              </h1>
              {car.location && (
                <div className="flex items-center gap-1.5 text-gray-500 text-sm mb-4">
                  <MapPin size={14} />
                  <span>{car.location}</span>
                </div>
              )}

              {car.price != null && car.price > 0 && (
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-display font-bold text-brand">
                    ${formatNumber(car.price)}
                  </span>
                  <span className="text-gray-400 text-sm">USD</span>
                </div>
              )}
            </div>

            {/* Quick Specs */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100">
              <h2 className="text-lg font-bold mb-4">Quick Specs</h2>
              <div className="space-y-3">
                <div className="flex items-center justify-between py-2 border-b border-gray-50">
                  <span className="flex items-center gap-2 text-gray-500">
                    <Calendar size={16} />
                    <span>Year</span>
                  </span>
                  <span className="font-semibold">{car.year || "N/A"}</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-gray-50">
                  <span className="flex items-center gap-2 text-gray-500">
                    <Gauge size={16} />
                    <span>Mileage</span>
                  </span>
                  <span className="font-semibold">{formatMileage(car.mileage)}</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-gray-50">
                  <span className="flex items-center gap-2 text-gray-500">
                    <Fuel size={16} />
                    <span>Fuel Type</span>
                  </span>
                  <span className="font-semibold">{car.fuel || "N/A"}</span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="flex items-center gap-2 text-gray-500">
                    <CarIcon size={16} />
                    <span>Engine</span>
                  </span>
                  <span className="font-semibold">{car.engine || "N/A"}</span>
                </div>
              </div>
            </div>

            {/* CTA Button */}
            <a
              href="/contact"
              className="w-full bg-brand text-white py-4 rounded-xl font-semibold hover:bg-brand/90 transition-colors flex items-center justify-center gap-2"
            >
              <DollarSign size={18} />
              <span>Import This Car</span>
            </a>
          </motion.div>
        </div>

        {/* Detailed Sections */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8"
        >
          {/* Specifications */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100">
            <h2 className="text-xl font-bold mb-4">Specifications</h2>
            <div className="space-y-4">
              <div className="flex justify-between py-2 border-b border-gray-50">
                <span className="text-gray-500">Make</span>
                <span className="font-semibold">{car.make}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-50">
                <span className="text-gray-500">Model</span>
                <span className="font-semibold">{car.model}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-50">
                <span className="text-gray-500">Year</span>
                <span className="font-semibold">{car.year || "N/A"}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-50">
                <span className="text-gray-500">Mileage</span>
                <span className="font-semibold">{formatMileage(car.mileage)}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-50">
                <span className="text-gray-500">Engine</span>
                <span className="font-semibold">{car.engine || "N/A"}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-gray-500">Fuel Type</span>
                <span className="font-semibold">{car.fuel || "N/A"}</span>
              </div>
            </div>
          </div>

          {/* Vehicle Details */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100">
            <h2 className="text-xl font-bold mb-4">Vehicle Details</h2>
            <div className="space-y-4">
              <div className="flex justify-between py-2 border-b border-gray-50">
                <span className="text-gray-500">VIN</span>
                <span className="font-semibold text-sm">{car.vin || "N/A"}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-50">
                <span className="text-gray-500">Location</span>
                <span className="font-semibold">{car.location || "N/A"}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-50">
                <span className="text-gray-500">Price</span>
                <span className="font-semibold text-brand">
                  ${car.price ? formatNumber(car.price) : "N/A"}
                </span>
              </div>
            </div>
          </div>

          {/* Dealer Info */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100">
            <h2 className="text-xl font-bold mb-4">Dealer Information</h2>
            <div className="space-y-4">
              <div className="flex items-start gap-3 py-2">
                <Warehouse className="text-brand mt-1" size={20} />
                <div>
                  <p className="font-semibold">Authorized US Dealer</p>
                  <p className="text-gray-500 text-sm">
                    Verified seller with full documentation
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 py-2">
                <MapPin className="text-brand mt-1" size={20} />
                <div>
                  <p className="font-semibold">{car.location || "US Location"}</p>
                  <p className="text-gray-500 text-sm">
                    Vehicle located in USA, ready for export
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </main>
  );
}