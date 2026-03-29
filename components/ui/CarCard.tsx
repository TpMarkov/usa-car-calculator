"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, MapPin, Gauge, Fuel } from "lucide-react";
import type { Car } from "@/types";

interface CarCardProps {
  car: Car;
  index: number;
  onSelectCar?: (car: Car) => void;
}

// Helper function to safely format numbers
const formatNumber = (num?: number): string => {
  if (num == null || typeof num !== 'number' || isNaN(num)) return 'N/A';
  return num.toLocaleString();
};

export default function CarCard({ car, index, onSelectCar }: CarCardProps) {
  // Handle card click
  const handleCardClick = () => {
    console.log('[CarCard] handleCardClick called with car:', car?.id);
    console.log('[CarCard] onSelectCar is:', typeof onSelectCar);
    if (onSelectCar) {
      console.log('[CarCard] Calling onSelectCar with car:', car?.id);
      onSelectCar(car);
    } else {
      console.log('[CarCard] onSelectCar is NOT defined!');
    }
  };

  // Format mileage for display
  const formatMileage = (miles?: number | string) => {
    if (!miles && miles !== 0) return "N/A";
    const numMiles = typeof miles === "string" ? parseInt(miles, 10) : miles;
    if (isNaN(numMiles)) return "N/A";
    return `${formatNumber(numMiles)} mi`;
  };

  // Get display title
  const displayTitle = car.title || `${car.year} ${car.make} ${car.model}`.trim();
  
  // Get display make/model
  const displayMakeModel = `${car.make} ${car.model}`.trim();

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05 }}
      onClick={handleCardClick}
      className="group bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-xl transition-all duration-300 cursor-pointer"
    >
      <div className="aspect-[16/10] overflow-hidden relative bg-gray-100">
        <img
          src={car.image || "/missing-image.png"}
          alt={displayTitle}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          referrerPolicy="no-referrer"
          onError={(e) => {
            (e.target as HTMLImageElement).src = "/missing-image.png";
          }}
        />
        {car.year && (
          <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-lg text-sm font-bold shadow-sm">
            {car.year}
          </div>
        )}
        {car.fuel && (
          <div className="absolute top-4 right-4 bg-brand/90 backdrop-blur-sm px-3 py-1.5 rounded-lg text-sm font-medium text-white flex items-center gap-1.5">
            <Fuel size={14} />
            <span>{car.fuel}</span>
          </div>
        )}
      </div>
      <div className="p-5">
        <div className="mb-4">
          <h3 className="text-lg font-bold text-gray-900 tracking-tight mb-1 line-clamp-1">
            {displayMakeModel}
          </h3>
          {car.location && (
            <div className="flex items-center gap-1.5 text-gray-500 text-sm">
              <MapPin size={14} />
              <span>{car.location}</span>
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-3 mb-5">
          <div className="p-3 bg-gray-50 rounded-xl flex items-center gap-2">
            <Gauge size={16} className="text-brand flex-shrink-0" />
            <span className="text-sm font-semibold text-gray-700 truncate">
              {formatMileage(car.mileage)}
            </span>
          </div>
          <div className="p-3 bg-gray-50 rounded-xl flex items-center gap-2">
            <span className="text-sm font-semibold text-gray-700 truncate">
              {car.engine || "N/A"}
            </span>
          </div>
        </div>

        {car.price != null && car.price > 0 && (
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-gray-500">Price</span>
            <span className="text-xl font-display font-bold text-brand">
              ${car.price != null && typeof car.price === 'number' ? formatNumber(car.price) : 'N/A'}
            </span>
          </div>
        )}

        <Link
          href="/contact"
          className="w-full bg-gray-900 text-white py-3.5 rounded-xl font-semibold hover:bg-brand transition-colors flex items-center justify-center gap-2"
        >
          <span>Import This Car</span>
          <ArrowRight size={16} />
        </Link>
      </div>
    </motion.article>
  );
}