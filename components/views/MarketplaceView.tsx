"use client";

import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { motion } from "framer-motion";
import { Search, ChevronLeft, ChevronRight, Car } from "lucide-react";
import CarCard from "@/components/ui/CarCard";
import { useCars } from "@/context/CarsContext";
import type { Car as CarType } from "@/types";

const CARS_PER_PAGE = 50;
const MAX_OFFSET = 1000;
const MAX_PAGE = Math.floor(MAX_OFFSET / CARS_PER_PAGE); // 20
const LAST_PAGE_KEY = "lastMarketplacePage";
const CARS_TOTAL_KEY = "carsTotal";

// Simple LRU cache for storing previously fetched pages
interface CacheEntry {
  cars: CarType[];
  total: number;
  timestamp: number;
}

interface MarketplaceViewProps {
  onSelectCar?: (car: CarType) => void;
}

// Load cached cars from localStorage - now page-specific
function getCachedCars(page: number): { cars: CarType[]; total: number } | null {
  if (typeof window === "undefined") return null;
  try {
    // Check for page-specific cache key
    const cachedCars = localStorage.getItem(`carsPage_${page}`);
    // Get page-specific total
    const cachedTotal = localStorage.getItem(`carsTotal_${page}`);
    if (cachedCars && cachedTotal) {
      return {
        cars: JSON.parse(cachedCars),
        total: parseInt(cachedTotal, 10)
      };
    }
  } catch (error) {
    console.error("Failed to load cached cars:", error);
  }
  return null;
}

class PageCache {
  private cache: Map<number, CacheEntry> = new Map();
  private maxSize = 10;
  private accessOrder: number[] = [];

  get(page: number): CacheEntry | null {
    const entry = this.cache.get(page);
    if (entry) {
      // Update access order
      this.accessOrder = this.accessOrder.filter(p => p !== page);
      this.accessOrder.push(page);
      return entry;
    }
    return null;
  }

  set(page: number, data: { cars: CarType[]; total: number }): void {
    // Remove oldest if at max capacity
    if (this.cache.size >= this.maxSize && this.accessOrder.length > 0) {
      const oldest = this.accessOrder.shift();
      if (oldest !== undefined) {
        this.cache.delete(oldest);
      }
    }

    this.cache.set(page, {
      ...data,
      timestamp: Date.now(),
    });
    this.accessOrder.push(page);
  }

  clear(): void {
    this.cache.clear();
    this.accessOrder = [];
  }
}

export default function MarketplaceView({ onSelectCar }: MarketplaceViewProps) {
  const { addCars } = useCars();
  // Get initial page from localStorage
  const getInitialPage = (): number => {
    if (typeof window === 'undefined') return 1;
    const savedPage = localStorage.getItem(LAST_PAGE_KEY);
    if (savedPage) {
      const pageNum = parseInt(savedPage, 10);
      if (!isNaN(pageNum) && pageNum >= 1) {
        return pageNum;
      }
    }
    return 1;
  };

  const [currentPage, setCurrentPage] = useState(1);
  
  // Handle car selection - store in context and allow navigation
  const handleSelectCar = (car: CarType) => {
    console.log('[MarketplaceView] handleSelectCar called with car:', car?.id);
    // Store car in context
    addCars([car]);
    // Save current page to localStorage before navigating away
    localStorage.setItem(LAST_PAGE_KEY, String(currentPage));
    // Call the navigation callback if provided
    if (onSelectCar) {
      console.log('[MarketplaceView] Calling parent onSelectCar');
      onSelectCar(car);
    } else {
      console.log('[MarketplaceView] parent onSelectCar is NOT defined!');
    }
  };
  const [cars, setCars] = useState<CarType[]>([]);
  const [totalCars, setTotalCars] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pageInput, setPageInput] = useState("");
  const [mounted, setMounted] = useState(false);
  const fetchInProgress = useRef(false);
  const pageInputDebounce = useRef<NodeJS.Timeout | null>(null);
  const preloadedPages = useRef<Set<number>>(new Set());
  
  // Use memo to prevent cache recreation on re-renders
  const pageCache = useMemo(() => new PageCache(), []);

  const totalPages = Math.min(Math.ceil(totalCars / CARS_PER_PAGE), MAX_PAGE);

  // DEBUG: Log pagination state
  console.log(`[MarketplaceView] Pagination Debug: totalCars=${totalCars}, CARS_PER_PAGE=${CARS_PER_PAGE}, totalPages=${totalPages}, MAX_PAGE=${MAX_PAGE}, loading=${loading}, error=${error}`);

  // Fetch cars from API with caching
  const fetchCars = useCallback(async (page: number) => {
    // Prevent duplicate fetches
    if (fetchInProgress.current) {
      return;
    }
    fetchInProgress.current = true;

    // Check cache first
    const cached = pageCache.get(page);
    if (cached) {
      setCars(cached.cars);
      setTotalCars(cached.total);
      fetchInProgress.current = false;
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      params.set("page", page.toString());

      const response = await fetch(`/api/cars?${params.toString()}`);

      if (!response.ok) {
        throw new Error("Failed to fetch cars");
      }

      const data = await response.json();
      
      // Cache the result
      pageCache.set(page, { 
        cars: data.cars || [], 
        total: data.total || 0 
      });
      
      const fetchedCars = data.cars || [];
      setCars(fetchedCars);
      setTotalCars(data.total || 0);
      
      // Also update localStorage cache with page-specific key
      try {
        localStorage.setItem(`carsPage_${page}`, JSON.stringify(data.cars || []));
        localStorage.setItem(`carsTotal_${page}`, String(data.total || 0));
      } catch (e) {
        console.error("Failed to cache cars:", e);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An error occurred";
      console.error(
        `[MarketplaceView] fetchCars error on page ${page}:`,
        errorMessage,
        err,
      );
      // Don't clear cars on error - keep showing previous data
      // Only show error for actual failures, not empty results
      // Empty results for high page numbers are expected behavior
      if (errorMessage.includes("Failed to fetch") || errorMessage.includes("NetworkError") || errorMessage.includes("fetch")) {
        setError("Error loading cars. Please try again.");
      } else if (page >= MAX_PAGE) {
        setError("No more results available.");
      } else {
        setError(null); // Clear any previous error
      }
      // Don't clear cars on error - keep showing previous data
    } finally {
      setLoading(false);
      fetchInProgress.current = false;
    }
  }, [pageCache]);

  // Set mounted state after hydration to prevent SSR/CSR mismatch with motion components
  useEffect(() => {
    setMounted(true);
    // Restore page from localStorage after mount
    const savedPage = getInitialPage();
    if (savedPage > 1) {
      console.log(`[MarketplaceView] Restoring page ${savedPage} from localStorage`);
      setCurrentPage(savedPage);
      // Clear the saved page so it doesn't persist for future fresh loads
      // (It will be re-saved when selecting a car again)
      localStorage.removeItem(LAST_PAGE_KEY);
    }
    
    // Clear localStorage cache for pages > 1 to ensure fresh data and pagination
    // This prevents stale error states from being cached and persists across refreshes
    if (typeof window !== 'undefined') {
      for (let p = 2; p <= MAX_PAGE; p++) {
        const cacheKey = `carsPage_${p}`;
        const cached = localStorage.getItem(cacheKey);
        if (cached) {
          try {
            const cachedData = JSON.parse(cached);
            // Clear pages with empty results or errors
            if (!cachedData || cachedData.length === 0) {
              localStorage.removeItem(cacheKey);
              localStorage.removeItem(`carsTotal_${p}`);
            }
          } catch (e) {
            // Invalid cache data, remove it
            localStorage.removeItem(cacheKey);
            localStorage.removeItem(`carsTotal_${p}`);
          }
        }
      }
    }
  }, []);

  // Fetch on mount - use cached data for cars but always fetch fresh total from API
  useEffect(() => {
    // Check localStorage cache for this specific page
    const cachedData = getCachedCars(currentPage);
    
    if (cachedData && cachedData.cars.length > 0) {
      console.log(`[MarketplaceView] Using cached cars from localStorage for page ${currentPage}:`, cachedData.cars.length);
      setCars(cachedData.cars);
      // Use cached total only if API fetch hasn't happened yet
      setTotalCars(cachedData.total);
      setError(null); // Clear any previous error when using cache
      // Also update the page cache
      pageCache.set(currentPage, { cars: cachedData.cars, total: cachedData.total });
    }

    // Always fetch fresh data from API to get accurate total and handle edge cases
    console.log(`[MarketplaceView] Fetching fresh data from API for page ${currentPage}`);
    fetchCars(currentPage);
  }, []);

  // Handle page changes - always fetch fresh data to get accurate total
  useEffect(() => {
    // Skip on mount (handled by the effect above)
    if (mounted) {
      console.log(`[MarketplaceView] Page changed to ${currentPage}, fetching fresh data`);
      
      // Check page cache first for cars display
      const cached = pageCache.get(currentPage);
      if (cached) {
        console.log(`[MarketplaceView] Using page cache for page ${currentPage}`);
        setCars(cached.cars);
        setTotalCars(cached.total);
        setError(null); // Clear any previous error when using cache
        return;
      }
      
      // Check localStorage cache
      const cachedData = getCachedCars(currentPage);
      if (cachedData && cachedData.cars.length > 0) {
        console.log(`[MarketplaceView] Using localStorage cache for page ${currentPage}`);
        setCars(cachedData.cars);
        // Use cached total as fallback, but fetch API for accurate total
        setTotalCars(cachedData.total);
        pageCache.set(currentPage, { cars: cachedData.cars, total: cachedData.total });
      }
      
      // Always fetch from API for accurate total and proper pagination
      console.log(`[MarketplaceView] Fetching page ${currentPage} from API`);
      fetchCars(currentPage);
    }
  }, [currentPage, mounted]);

  // Optional: Preload next page when on page < MAX_PAGE - 1
  useEffect(() => {
    if (mounted && currentPage < MAX_PAGE - 1 && !loading && !fetchInProgress.current) {
      const nextPage = currentPage + 1;
      // Skip if already preloaded or cached
      if (!preloadedPages.current.has(nextPage) && !pageCache.get(nextPage) && !getCachedCars(nextPage)) {
        console.log(`[MarketplaceView] Preloading page ${nextPage} in background`);
        preloadedPages.current.add(nextPage);
        
        // Background fetch without updating state
        const params = new URLSearchParams();
        params.set("page", nextPage.toString());
        
        fetch(`/api/cars?${params.toString()}`)
          .then(res => res.json())
          .then(data => {
            if (data.cars && data.cars.length > 0) {
              pageCache.set(nextPage, { 
                cars: data.cars, 
                total: data.total || 0 
              });
              // Also cache in localStorage
              try {
                localStorage.setItem(`carsPage_${nextPage}`, JSON.stringify(data.cars));
                localStorage.setItem(`carsTotal_${nextPage}`, String(data.total || 0));
              } catch (e) {
                console.error("Failed to cache preloaded cars:", e);
              }
            }
          })
          .catch(err => {
            console.log(`[MarketplaceView] Preload failed for page ${nextPage}:`, err);
          });
      }
    }
  }, [currentPage, mounted, loading]);

  // Cleanup debounce timer on unmount
  useEffect(() => {
    return () => {
      if (pageInputDebounce.current) {
        clearTimeout(pageInputDebounce.current);
      }
    };
  }, []);

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < MAX_PAGE && currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handlePageInputSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const pageNum = parseInt(pageInput, 10);
    // Clamp to valid range (1 to MAX_PAGE)
    const validPage = Math.max(1, Math.min(Math.floor(pageNum), MAX_PAGE));
    if (!isNaN(validPage) && validPage >= 1 && validPage <= MAX_PAGE) {
      setCurrentPage(validPage);
      setPageInput("");
    }
  };

  const handlePageInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Only allow numbers
    if (value === "" || /^\d+$/.test(value)) {
      setPageInput(value);
      
      // Debounce: clear previous timer and set new one
      if (pageInputDebounce.current) {
        clearTimeout(pageInputDebounce.current);
      }
      
      const inputNum = parseInt(value, 10);
      if (!isNaN(inputNum) && inputNum >= 1 && inputNum <= MAX_PAGE) {
        pageInputDebounce.current = setTimeout(() => {
          setCurrentPage(inputNum);
          setPageInput("");
        }, 400); // 400ms debounce
      }
    }
  };

  const isFirstPage = currentPage === 1;
  const isLastPage = currentPage >= MAX_PAGE || (totalPages > 0 && currentPage >= totalPages);

  // Calculate showing range - use safe values to prevent NaN errors
  const safeTotalCars = totalCars || 0;
  const showingStart = safeTotalCars > 0 ? (currentPage - 1) * CARS_PER_PAGE + 1 : 0;
  const showingEnd = Math.min(currentPage * CARS_PER_PAGE, safeTotalCars);

  return (
    <main className="pt-28 pb-20 px-4 sm:px-6" suppressHydrationWarning>
      <div className="max-w-7xl mx-auto">
        {/* Intro Section - use static div until mounted to avoid hydration mismatch */}
        {mounted ? (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-0.5 bg-brand" />
              <span className="text-brand font-bold uppercase tracking-[0.2em] text-xs">
                US Marketplace
              </span>
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-display font-bold tracking-tight leading-[0.95] mb-4">
              Find Your <span className="text-brand">Dream</span> Car
            </h1>
            <p className="text-base sm:text-lg text-gray-500 max-w-2xl font-medium leading-relaxed">
              Browse thousands of vehicles from top US marketplaces. We handle the
              inspection, shipping, and import for you.
            </p>
          </motion.section>
        ) : (
          <section className="mb-12">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-0.5 bg-brand" />
              <span className="text-brand font-bold uppercase tracking-[0.2em] text-xs">
                US Marketplace
              </span>
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-display font-bold tracking-tight leading-[0.95] mb-4">
              Find Your <span className="text-brand">Dream</span> Car
            </h1>
            <p className="text-base sm:text-lg text-gray-500 max-w-2xl font-medium leading-relaxed">
              Browse thousands of vehicles from top US marketplaces. We handle the
              inspection, shipping, and import for you.
            </p>
          </section>
        )}

        {/* Results Summary */}
        {!loading && !error && totalCars > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2"
          >
            <p className="text-sm text-gray-500">
              Showing <span className="font-semibold text-gray-900">{showingStart?.toLocaleString() ?? 0}</span>
              {" "}to{" "}
              <span className="font-semibold text-gray-900">{showingEnd?.toLocaleString() ?? 0}</span>
              {" "}of{" "}
              <span className="font-semibold text-gray-900">{totalCars?.toLocaleString() ?? 0}</span> cars
            </p>
            <p className="text-sm text-gray-500">
              Sorted by: Newest First
            </p>
          </motion.div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-20 sm:py-32">
            <div className="flex flex-col items-center gap-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 border-[3px] border-brand/20 border-t-brand rounded-full animate-spin" />
              <p className="text-gray-400 font-medium text-sm">Loading cars...</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="text-center py-16 sm:py-24">
            <div className="w-20 h-20 sm:w-24 sm:h-24 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6 text-red-400">
              <Search size={40} />
            </div>
            <h2 className="text-2xl sm:text-3xl font-display font-bold mb-3">Error loading cars</h2>
            <p className="text-gray-400 text-base mb-6">{error}</p>
            <button
              onClick={() => fetchCars(currentPage)}
              className="px-6 py-3 bg-brand text-white rounded-xl font-semibold hover:bg-brand/90 transition-colors"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Cars Grid */}
        {!loading && !error && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 sm:gap-6">
              {cars.map((car, i) => (
                <CarCard key={car.id || i} car={car} index={i} onSelectCar={handleSelectCar} />
              ))}
            </div>

            {/* No Cars Found */}
            {cars.length === 0 && totalCars === 0 && (
              <div className="text-center py-16 sm:py-24">
                <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-300">
                  <Car size={40} />
                </div>
                <h2 className="text-2xl sm:text-3xl font-display font-bold mb-3">No cars found</h2>
                <p className="text-gray-400 text-base">
                  Please check back later for new listings.
                </p>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="flex flex-col items-center gap-4 mt-10 sm:mt-12"
              >
                <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
                  {/* Previous Button */}
                  <button
                    onClick={handlePrevPage}
                    disabled={isFirstPage}
                    className={`flex items-center gap-1.5 sm:gap-2 px-4 sm:px-5 py-2.5 rounded-xl font-semibold text-sm transition-all ${
                      isFirstPage
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300"
                    }`}
                  >
                    <ChevronLeft size={18} />
                    <span className="hidden sm:inline">Previous</span>
                  </button>

                  {/* Page Numbers */}
                  <div className="flex items-center gap-1.5 px-2">
                    {currentPage > 2 && (
                      <>
                        <button
                          onClick={() => setCurrentPage(1)}
                          className="w-10 h-10 rounded-lg font-medium text-sm text-gray-600 hover:bg-gray-100 transition-colors"
                        >
                          1
                        </button>
                        {currentPage > 3 && (
                          <span className="text-gray-400 px-1">...</span>
                        )}
                      </>
                    )}
                    
                    {currentPage > 1 && (
                      <button
                        onClick={() => setCurrentPage(currentPage - 1)}
                        className="w-10 h-10 rounded-lg font-medium text-sm text-gray-600 hover:bg-gray-100 transition-colors"
                      >
                        {currentPage - 1}
                      </button>
                    )}

                    <span className="w-10 h-10 rounded-lg bg-brand text-white font-bold text-sm flex items-center justify-center">
                      {currentPage}
                    </span>

                    {currentPage < totalPages && (
                      <button
                        onClick={() => setCurrentPage(currentPage + 1)}
                        className="w-10 h-10 rounded-lg font-medium text-sm text-gray-600 hover:bg-gray-100 transition-colors"
                      >
                        {currentPage + 1}
                      </button>
                    )}

                    {currentPage < totalPages - 1 && (
                      <>
                        {currentPage < totalPages - 2 && (
                          <span className="text-gray-400 px-1">...</span>
                        )}
                        <button
                          onClick={() => setCurrentPage(totalPages)}
                          className="w-10 h-10 rounded-lg font-medium text-sm text-gray-600 hover:bg-gray-100 transition-colors"
                        >
                          {totalPages}
                        </button>
                      </>
                    )}
                  </div>

                  {/* Next Button */}
                  <button
                    onClick={handleNextPage}
                    disabled={isLastPage}
                    className={`flex items-center gap-1.5 sm:gap-2 px-4 sm:px-5 py-2.5 rounded-xl font-semibold text-sm transition-all ${
                      isLastPage
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "bg-brand text-white hover:bg-brand/90 shadow-lg shadow-brand/20"
                    }`}
                  >
                    <span className="hidden sm:inline">Next</span>
                    <ChevronRight size={18} />
                  </button>
                </div>

                {/* Page Jump Input */}
                <form onSubmit={handlePageInputSubmit} className="flex items-center gap-2 mt-2">
                  <span className="text-sm text-gray-500">Go to page:</span>
                  <input
                    type="text"
                    value={pageInput}
                    onChange={handlePageInputChange}
                    placeholder={String(currentPage)}
                    className="w-16 sm:w-20 px-3 py-2 text-sm text-center border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand"
                    maxLength={3}
                  />
                  <span className="text-sm text-gray-400">/ {MAX_PAGE}</span>
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                  >
                    Go
                  </button>
                </form>
              </motion.div>
            )}
          </>
        )}
      </div>
    </main>
  );
}