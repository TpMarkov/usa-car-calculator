"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Calculator,
  Ship,
  CheckCircle2,
} from "lucide-react";

export default function HowItWorksView() {
  return (
    <main className="pt-32 pb-32 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Page Title */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-24"
        >
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-1 bg-brand" />
            <span className="text-brand font-bold uppercase tracking-[0.3em] text-sm">
              The Process
            </span>
          </div>
          <h1 className="text-7xl md:text-9xl font-display font-bold tracking-tighter leading-[0.85] mb-8">
            How It <span className="text-brand">Works</span>
          </h1>
          <p className="text-2xl text-ink/40 max-w-2xl font-medium leading-tight">
            A transparent, step-by-step guide to importing your dream car from
            the USA to Bulgaria.
          </p>
        </motion.section>

        <div className="space-y-32">
          {/* Step 1 */}
          <section className="grid lg:grid-cols-2 gap-20 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="text-8xl font-display font-bold text-brand/20 mb-6">
                01
              </div>
              <h2 className="text-5xl font-display font-bold mb-8 tracking-tighter">
                Find Your Vehicle
              </h2>
              <p className="text-xl text-ink/60 leading-relaxed mb-8">
                Browse major US auction platforms like Copart, IAAI, or Bring a
                Trailer. These marketplaces offer thousands of vehicles daily, from
                salvage projects to pristine luxury cars.
              </p>
              <ul className="space-y-4">
                {[
                  "Access to exclusive US auctions",
                  "Detailed vehicle history reports",
                  "Professional inspection options",
                ].map((item, i) => (
                  <li
                    key={i}
                    className="flex items-center gap-3 font-bold text-sm uppercase tracking-widest text-ink/40"
                  >
                    <CheckCircle2 className="text-brand" size={18} />
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
            <div className="aspect-[4/3] rounded-[3rem] overflow-hidden shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1550355291-bbee04a92027"
                alt="Browsing cars"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
          </section>

          {/* Step 2 */}
          <section className="grid lg:grid-cols-2 gap-20 items-center">
            <div className="order-2 lg:order-1 aspect-[4/3] rounded-[3rem] overflow-hidden shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1581091870627-3c7a5bde9b8b"
                alt="Calculating costs"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="order-1 lg:order-2"
            >
              <div className="text-8xl font-display font-bold text-brand/20 mb-6">
                02
              </div>
              <h2 className="text-5xl font-display font-bold mb-8 tracking-tighter">
                Calculate Total Cost
              </h2>
              <p className="text-xl text-ink/60 leading-relaxed mb-8">
                Paste the listing URL into our calculator. We instantly analyze the
                data to provide a full breakdown of shipping, customs duties, VAT,
                and port fees.
              </p>
              <div className="p-8 bg-white border border-ink/5 rounded-3xl shadow-xl">
                <div className="flex items-center gap-4 mb-4">
                  <Calculator className="text-brand" size={24} />
                  <span className="font-bold uppercase tracking-widest text-sm">
                    Instant Analysis
                  </span>
                </div>
                <p className="text-ink/40 text-sm">
                  Our algorithm uses real-time logistics data and current Bulgarian
                  regulations to ensure 99% accuracy.
                </p>
              </div>
            </motion.div>
          </section>

          {/* Step 3 */}
          <section className="grid lg:grid-cols-2 gap-20 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="text-8xl font-display font-bold text-brand/20 mb-6">
                03
              </div>
              <h2 className="text-5xl font-display font-bold mb-8 tracking-tighter">
                Shipping & Logistics
              </h2>
              <p className="text-xl text-ink/60 leading-relaxed mb-8">
                Once purchased, your car is transported to a US port (New Jersey,
                Savannah, or Houston) and loaded into a secure container for its
                journey across the Atlantic.
              </p>
              <div className="flex items-center gap-6 p-6 bg-ink text-surface rounded-3xl">
                <Ship className="text-brand" size={32} />
                <div>
                  <div className="font-bold uppercase tracking-widest text-xs mb-1">
                    Weekly Departures
                  </div>
                  <div className="text-surface/60 text-sm">
                    Average transit time: 4-6 weeks
                  </div>
                </div>
              </div>
            </motion.div>
            <div className="aspect-[4/3] rounded-[3rem] overflow-hidden shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1564859228273-274232fdb516"
                alt="Shipping container"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
          </section>

          {/* Step 4 */}
          <section className="grid lg:grid-cols-2 gap-20 items-center">
            <div className="order-2 lg:order-1 aspect-[4/3] rounded-[3rem] overflow-hidden shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1454165833767-027ffea9e778"
                alt="Customs clearance"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="order-1 lg:order-2"
            >
              <div className="text-8xl font-display font-bold text-brand/20 mb-6">
                04
              </div>
              <h2 className="text-5xl font-display font-bold mb-8 tracking-tighter">
                Customs & Delivery
              </h2>
              <p className="text-xl text-ink/60 leading-relaxed mb-8">
                Upon arrival at Varna or Burgas, our partners handle all customs
                documentation, duty payments, and VAT clearance. Your car is
                then ready for pickup or inland delivery to your door.
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-6 border border-ink/10 rounded-2xl">
                  <div className="font-bold text-brand mb-1">10%</div>
                  <div className="text-[10px] font-bold uppercase tracking-widest text-ink/40">
                    Customs Duty
                  </div>
                </div>
                <div className="p-6 border border-ink/10 rounded-2xl">
                  <div className="font-bold text-brand mb-1">20%</div>
                  <div className="text-[10px] font-bold uppercase tracking-widest text-ink/40">
                    Bulgarian VAT
                  </div>
                </div>
              </div>
            </motion.div>
          </section>
        </div>

        {/* Final CTA */}
        <section className="mt-32">
          <div className="bg-brand text-white p-16 md:p-24 rounded-[4rem] text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
            <div className="relative z-10">
              <h2 className="text-6xl font-display font-bold mb-8 tracking-tighter">
                Start Your Journey
              </h2>
              <p className="text-2xl font-medium mb-12 opacity-90 max-w-xl mx-auto">
                Ready to see the numbers? Use our calculator to get your first
                estimate in seconds.
              </p>
              <Link
                href="/"
                className="bg-white text-brand px-12 py-6 rounded-[2rem] font-bold text-xl hover:bg-ink hover:text-white transition-all shadow-2xl inline-block"
              >
                Back to Calculator
              </Link>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}