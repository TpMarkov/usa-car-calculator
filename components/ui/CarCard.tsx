"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, MapPin, TrendingUp, Fuel } from "lucide-react";
import type { Car } from "@/types";

interface CarCardProps {
  car: Car;
  index: number;
}

export default function CarCard({ car, index }: CarCardProps) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className="group bg-white rounded-[3rem] overflow-hidden border border-ink/5 hover:shadow-2xl transition-all duration-500"
    >
      <div className="aspect-[4/3] overflow-hidden relative">
        <img
          src={car.image}
          alt={`${car.year} ${car.make} ${car.model}`}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          referrerPolicy="no-referrer"
        />
        <div className="absolute top-6 right-6 bg-white/90 backdrop-blur-md px-4 py-2 rounded-full text-sm font-bold shadow-sm">
          {car.year}
        </div>
      </div>
      <div className="p-8">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-2xl font-bold tracking-tight mb-1">
              {car.make} {car.model}
            </h3>
            <div className="flex items-center gap-2 text-ink/40 text-sm font-medium">
              <MapPin size={14} />
              <span>{car.location}</span>
            </div>
          </div>
          <div className="text-2xl font-display font-bold text-brand">
            ${car.price.toLocaleString()}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="p-4 bg-surface rounded-2xl flex items-center gap-3">
            <TrendingUp size={16} className="text-brand" />
            <span className="text-sm font-bold">{car.mileage}</span>
          </div>
          <div className="p-4 bg-surface rounded-2xl flex items-center gap-3">
            <Fuel size={16} className="text-brand" />
            <span className="text-sm font-bold">Gasoline</span>
          </div>
        </div>

        <Link
          href="/contact"
          className="w-full bg-ink text-white py-5 rounded-2xl font-bold hover:bg-brand transition-all flex items-center justify-center gap-2"
        >
          <span>Import This Car</span>
          <ArrowRight size={18} />
        </Link>
      </div>
    </motion.article>
  );
}