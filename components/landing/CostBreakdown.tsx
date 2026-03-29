"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Car, DollarSign, MapPin, Fuel, CheckCircle2, Clock, ShieldCheck, ArrowRight, Euro } from "lucide-react";
import CostRow from "@/components/ui/CostRow";

export default function CostBreakdown() {
  return (
    <main className="pt-32 pb-32 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Page Title */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-20"
        >
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-1 bg-brand" />
            <span className="text-brand font-bold uppercase tracking-[0.3em] text-sm">
              Calculation Result
            </span>
          </div>
          <h1 className="text-7xl md:text-9xl font-display font-bold tracking-tighter leading-[0.85] mb-8">
            Your Car <span className="text-brand">Import</span> Cost
          </h1>
          <p className="text-2xl text-ink/40 max-w-2xl font-medium leading-tight">
            Here is the estimated total cost to import your selected vehicle from the USA
            to Bulgaria.
          </p>
        </motion.section>

        <div className="grid lg:grid-cols-12 gap-12">
          {/* Left Column: Vehicle Info & Delivery */}
          <div className="lg:col-span-5 space-y-12">
            {/* Vehicle Information */}
            <motion.section
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white p-10 rounded-[3rem] border border-ink/5 shadow-xl shadow-ink/5"
            >
              <div className="flex items-center gap-3 mb-10">
                <Car className="text-brand" size={24} />
                <h2 className="text-3xl font-bold tracking-tight">
                  Vehicle Information
                </h2>
              </div>

              <div className="aspect-video rounded-[2rem] overflow-hidden mb-10 bg-surface">
                <img
                  src="https://images.unsplash.com/photo-1552519507-da3b142c6e3d"
                  alt="Selected car"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>

              <h3 className="text-4xl font-display font-bold mb-8 tracking-tighter">
                Chevrolet Corvette C8
              </h3>

              <div className="grid grid-cols-2 gap-6">
                {[
                  { label: "Price", value: "$12,500", icon: DollarSign },
                  { label: "Location", value: "California, USA", icon: MapPin },
                  { label: "Engine", value: "2.0L Petrol", icon: Fuel },
                  { label: "Condition", value: "Used", icon: CheckCircle2 },
                ].map((item, i) => (
                  <div key={i} className="p-6 bg-surface rounded-2xl">
                    <div className="flex items-center gap-2 text-ink/40 mb-2">
                      <item.icon size={14} />
                      <span className="text-[10px] font-bold uppercase tracking-widest">
                        {item.label}
                      </span>
                    </div>
                    <div className="font-bold text-lg">{item.value}</div>
                  </div>
                ))}
              </div>
            </motion.section>

            {/* Delivery Info */}
            <motion.section
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-ink text-surface p-10 rounded-[3rem] relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-brand/20 blur-[100px] rounded-full -mr-32 -mt-32" />
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-8">
                  <Clock className="text-brand" size={24} />
                  <h2 className="text-3xl font-bold tracking-tight">
                    Estimated Delivery
                  </h2>
                </div>
                <div className="text-5xl font-display font-bold text-brand mb-4 tracking-tighter">
                  6–10 Weeks
                </div>
                <p className="text-surface/60 text-lg leading-relaxed">
                  Delivery includes transport from the USA to a Bulgarian port
                  (Varna/Burgas) and full customs clearance.
                </p>
              </div>
            </motion.section>

            {/* Trust Info */}
            <motion.section
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="p-10 border border-ink/10 rounded-[3rem] bg-white/50"
            >
              <div className="flex items-center gap-3 mb-6">
                <Info className="text-ink/40" size={20} />
                <h2 className="text-xl font-bold uppercase tracking-widest text-ink/40">
                  Transparent Pricing
                </h2>
              </div>
              <p className="text-ink/60 leading-relaxed">
                All estimates are based on real logistics data and current Bulgarian
                import regulations. Final costs may vary slightly depending on the provider
                and specific auction fees.
              </p>
            </motion.section>
          </div>

          {/* Right Column: Cost Breakdown & CTA */}
          <div className="lg:col-span-7 space-y-12">
            {/* Cost Breakdown */}
            <motion.section
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white p-12 md:p-16 rounded-[4rem] border border-ink/5 shadow-2xl shadow-ink/5"
            >
              <div className="flex items-center gap-3 mb-12">
                <ShieldCheck className="text-brand" size={28} />
                <h2 className="text-4xl font-display font-bold tracking-tighter">
                  Cost Breakdown
                </h2>
              </div>

              <div className="space-y-2">
                <CostRow label="Car Price" value="$12,500" />
                <CostRow label="Inland Transport (USA)" value="$800" />
                <CostRow label="Ocean Shipping" value="$1,200" />
                <CostRow label="Customs Duty (10%)" value="$1,450" />
                <CostRow label="VAT (20%)" value="$3,190" />
                <CostRow label="Port Fees" value="$300" />
                <CostRow label="Broker Fees" value="$200" />
                <CostRow label="Total Estimated Cost" value="$19,640" isTotal />
              </div>

              <div className="mt-12 p-8 bg-surface rounded-3xl flex items-center gap-4 text-ink/60">
                <Euro size={20} className="shrink-0" />
                <p className="text-sm font-medium">
                  Approximately <span className="text-ink font-bold">€18,068</span>{" "}
                  at current exchange rates.
                </p>
              </div>
            </motion.section>

            {/* Next Steps / CTA */}
            <motion.section
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-brand text-white p-12 md:p-20 rounded-[4rem] relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
              <div className="relative z-10">
                <h2 className="text-6xl font-display font-bold mb-8 tracking-tighter leading-none">
                  Ready to <span className="text-ink">Import</span>?
                </h2>
                <p className="text-2xl font-medium mb-12 opacity-90 max-w-xl">
                  Want help importing this car? We can connect you with trusted
                  shipping partners and handle the entire process.
                </p>
                <Link
                  href="/contact"
                  className="bg-white text-brand px-12 py-6 rounded-[2rem] font-bold text-xl hover:bg-ink hover:text-white transition-all flex items-center gap-4 shadow-2xl inline-block"
                >
                  <span>Request Assistance</span>
                  <ArrowRight
                    size={24}
                    className="group-hover:translate-x-2 transition-transform"
                  />
                </Link>
              </div>
            </motion.section>
          </div>
        </div>
      </div>
    </main>
  );
}

// Add missing import
import { Info } from "lucide-react";