"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { motion } from "framer-motion";
import { Search, Filter, ChevronLeft, ChevronRight } from "lucide-react";
import CarCard from "@/components/ui/CarCard";
import type { Car, SearchFilters } from "@/types";

const CARS_PER_PAGE = 9;

export default function MarketplaceView() {
  const [filters, setFilters] = useState<SearchFilters>({
    make: "",
    model: "",
    year: "",
    priceRange: "",
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [cars, setCars] = useState<Car[]>([]);
  const [totalCars, setTotalCars] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [debouncedFilters, setDebouncedFilters] = useState<SearchFilters>(filters);

  const totalPages = Math.ceil(totalCars / CARS_PER_PAGE);

  // Debounce filter changes (300ms)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedFilters(filters);
    }, 300);

    return () => clearTimeout(timer);
  }, [filters]);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedFilters.make, debouncedFilters.model, debouncedFilters.year, debouncedFilters.priceRange]);

  // Fetch cars from API
  const fetchCars = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // Build query params
      const params = new URLSearchParams();
      params.set("page", currentPage.toString());
      params.set("limit", CARS_PER_PAGE.toString());

      if (debouncedFilters.make) params.set("make", debouncedFilters.make);
      if (debouncedFilters.model) params.set("model", debouncedFilters.model);
      if (debouncedFilters.year) params.set("year", debouncedFilters.year);
      if (debouncedFilters.priceRange) {
        const [min, max] = debouncedFilters.priceRange.split("-");
        if (min) params.set("minPrice", min);
        if (max) params.set("maxPrice", max);
      }

      const response = await fetch(`/api/cars?${params.toString()}`);

      if (!response.ok) {
        throw new Error("Failed to fetch cars");
      }

      const data = await response.json();
      setCars(data.cars || []);
      setTotalCars(data.total || 0);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      setCars([]);
      setTotalCars(0);
    } finally {
      setLoading(false);
    }
  }, [currentPage, debouncedFilters]);

  // Fetch when page or debounced filters change
  useEffect(() => {
    fetchCars();
  }, [fetchCars]);

  const handleFilterChange = (key: keyof SearchFilters, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const isFirstPage = currentPage === 1;
  const isLastPage = currentPage >= totalPages;

  return (
    <main className="pt-32 pb-32 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Intro Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-16"
        >
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-1 bg-brand" />
            <span className="text-brand font-bold uppercase tracking-[0.3em] text-sm">
              US Marketplace
            </span>
          </div>
          <h1 className="text-7xl md:text-9xl font-display font-bold tracking-tighter leading-[0.85] mb-8">
            Find Your <span className="text-brand">Dream</span> Car
          </h1>
          <p className="text-2xl text-ink/40 max-w-3xl font-medium leading-tight">
            Browse thousands of vehicles from top US marketplaces. We handle the
            inspection, shipping, and import for you.
          </p>
        </motion.section>

        {/* Filters */}
        <section className="mb-16 p-8 bg-white border border-ink/5 rounded-[3rem] shadow-2xl shadow-ink/5">
          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6 items-end">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-ink/40 ml-4">
                Make
              </label>
              <div className="relative">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-ink/30" size={18} />
                <input
                  type="text"
                  placeholder="e.g. Toyota"
                  className="w-full bg-surface py-4 pl-14 pr-6 rounded-2xl outline-none focus:ring-2 ring-brand/20 transition-all font-medium"
                  value={filters.make}
                  onChange={(e) => handleFilterChange("make", e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-ink/40 ml-4">
                Model
              </label>
              <input
                type="text"
                placeholder="e.g. Camry"
                className="w-full bg-surface py-4 px-6 rounded-2xl outline-none focus:ring-2 ring-brand/20 transition-all font-medium"
                value={filters.model}
                onChange={(e) => handleFilterChange("model", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-ink/40 ml-4">
                Year
              </label>
              <input
                type="number"
                placeholder="Year"
                className="w-full bg-surface py-4 px-6 rounded-2xl outline-none focus:ring-2 ring-brand/20 transition-all font-medium"
                value={filters.year}
                onChange={(e) => handleFilterChange("year", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-ink/40 ml-4">
                Price Range
              </label>
              <input
                type="text"
                placeholder="min-max (e.g. 10000-50000)"
                className="w-full bg-surface py-4 px-6 rounded-2xl outline-none focus:ring-2 ring-brand/20 transition-all font-medium"
                value={filters.priceRange}
                onChange={(e) => handleFilterChange("priceRange", e.target.value)}
              />
            </div>
            <button className="bg-brand text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-ink transition-all shadow-lg shadow-brand/20">
              <Filter size={18} />
              <span>Search Cars</span>
            </button>
          </div>
        </section>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-32">
            <div className="flex flex-col items-center gap-4">
              <div className="w-12 h-12 border-4 border-brand/20 border-t-brand rounded-full animate-spin" />
              <p className="text-ink/40 font-medium">Loading cars...</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="text-center py-32">
            <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-8 text-red-400">
              <Search size={48} />
            </div>
            <h2 className="text-3xl font-display font-bold mb-4">Error loading cars</h2>
            <p className="text-ink/40 text-lg">{error}</p>
          </div>
        )}

        {/* Cars Grid */}
        {!loading && !error && (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12">
              {cars.map((car, i) => (
                <CarCard key={car.id} car={car} index={i} />
              ))}
            </div>

            {/* No Cars Found */}
            {cars.length === 0 && totalCars === 0 && (
              <div className="text-center py-32">
                <div className="w-24 h-24 bg-ink/5 rounded-full flex items-center justify-center mx-auto mb-8 text-ink/20">
                  <Search size={48} />
                </div>
                <h2 className="text-3xl font-display font-bold mb-4">No cars found</h2>
                <p className="text-ink/40 text-lg">
                  Try adjusting your filters to find what you are looking for.
                </p>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-4 mt-16">
                <button
                  onClick={handlePrevPage}
                  disabled={isFirstPage}
                  className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold transition-all ${
                    isFirstPage
                      ? "bg-ink/5 text-ink/20 cursor-not-allowed"
                      : "bg-white border border-ink/10 text-ink hover:bg-ink/5"
                  }`}
                >
                  <ChevronLeft size={20} />
                  <span>Previous</span>
                </button>

                <div className="flex items-center gap-2 px-4">
                  <span className="text-ink/60 font-medium">
                    Page {currentPage} of {totalPages}
                  </span>
                </div>

                <button
                  onClick={handleNextPage}
                  disabled={isLastPage}
                  className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold transition-all ${
                    isLastPage
                      ? "bg-ink/5 text-ink/20 cursor-not-allowed"
                      : "bg-brand text-white hover:bg-ink shadow-lg shadow-brand/20"
                  }`}
                >
                  <span>Next</span>
                  <ChevronRight size={20} />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}