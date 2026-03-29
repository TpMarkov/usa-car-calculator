"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Filter } from "lucide-react";
import CarCard from "@/components/ui/CarCard";
import type { Car, SearchFilters } from "@/types";

export default function MarketplaceView() {
  const [search, setSearch] = useState<SearchFilters>({
    make: "",
    model: "",
    year: "",
    priceRange: "",
  });

  const cars: Car[] = [
    {
      id: 1,
      make: "Toyota",
      model: "Camry",
      year: 2022,
      price: 24500,
      image: "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb",
      mileage: "12,000 mi",
      location: "Miami, FL",
    },
    {
      id: 2,
      make: "Ford",
      model: "F-150",
      year: 2021,
      price: 38900,
      image: "https://images.unsplash.com/photo-1583121274602-3e2820c69888",
      mileage: "25,000 mi",
      location: "Dallas, TX",
    },
    {
      id: 3,
      make: "Tesla",
      model: "Model 3",
      year: 2023,
      price: 42000,
      image: "https://images.unsplash.com/photo-1560958089-b8a1929cea89",
      mileage: "5,000 mi",
      location: "Los Angeles, CA",
    },
    {
      id: 4,
      make: "BMW",
      model: "X5",
      year: 2020,
      price: 45000,
      image: "https://images.unsplash.com/photo-1555215695-3004980ad54e",
      mileage: "30,000 mi",
      location: "New York, NY",
    },
    {
      id: 5,
      make: "Honda",
      model: "Civic",
      year: 2019,
      price: 18500,
      image: "https://images.unsplash.com/photo-1594070319944-7c0c63146b77",
      mileage: "45,000 mi",
      location: "Chicago, IL",
    },
    {
      id: 6,
      make: "Porsche",
      model: "911",
      year: 2021,
      price: 115000,
      image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70",
      mileage: "8,000 mi",
      location: "San Francisco, CA",
    },
  ];

  const filteredCars = cars.filter((car) => {
    const matchMake = car.make.toLowerCase().includes(search.make.toLowerCase());
    const matchModel = car.model
      .toLowerCase()
      .includes(search.model.toLowerCase());
    const matchYear = search.year ? car.year.toString() === search.year : true;
    let matchPrice = true;
    if (search.priceRange) {
      const [min, max] = search.priceRange.split("-").map(Number);
      matchPrice = car.price >= min && (max ? car.price <= max : true);
    }
    return matchMake && matchModel && matchYear && matchPrice;
  });

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
                  value={search.make}
                  onChange={(e) => setSearch({ ...search, make: e.target.value })}
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
                value={search.model}
                onChange={(e) => setSearch({ ...search, model: e.target.value })}
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
                value={search.year}
                onChange={(e) => setSearch({ ...search, year: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-ink/40 ml-4">
                Price Range
              </label>
              <select
                className="w-full bg-surface py-4 px-6 rounded-2xl outline-none focus:ring-2 ring-brand/20 transition-all font-medium appearance-none"
                value={search.priceRange}
                onChange={(e) =>
                  setSearch({ ...search, priceRange: e.target.value })
                }
              >
                <option value="">Any Price</option>
                <option value="0-10000">Under $10k</option>
                <option value="10000-20000">$10k - $20k</option>
                <option value="20000-50000">$20k - $50k</option>
                <option value="50000-1000000">$50k+</option>
              </select>
            </div>
            <button className="bg-brand text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-ink transition-all shadow-lg shadow-brand/20">
              <Filter size={18} />
              <span>Search Cars</span>
            </button>
          </div>
        </section>

        {/* Cars Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12">
          {filteredCars.map((car, i) => (
            <CarCard key={car.id} car={car} index={i} />
          ))}
        </div>

        {filteredCars.length === 0 && (
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
      </div>
    </main>
  );
}