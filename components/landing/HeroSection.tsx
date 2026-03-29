"use client";

import { useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import { Link as LinkIcon, ArrowRight, TrendingUp, Calculator } from "lucide-react";

interface HeroSectionProps {
  onCalculate: () => void;
}

export default function HeroSection({ onCalculate }: HeroSectionProps) {
  const [url, setUrl] = useState("");
  const [isCalculating, setIsCalculating] = useState(false);

  const handleCalculate = (e: FormEvent) => {
    e.preventDefault();
    setIsCalculating(true);
    setTimeout(() => {
      setIsCalculating(false);
      onCalculate();
    }, 1500);
  };

  return (
    <section className="relative min-screen flex items-center px-6 pt-32 pb-20 overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1511919884226-fd3cad34687c"
          alt="Luxury car ready for export"
          className="w-full h-full object-cover opacity-20 grayscale"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-surface via-surface/90 to-surface" />
      </div>

      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-20 items-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand/10 text-brand rounded-full text-xs font-bold uppercase tracking-widest mb-8">
            <TrendingUp size={14} />
            <span>Trusted by 1000+ Buyers</span>
          </div>
          <h1 className="text-7xl md:text-9xl font-display font-bold leading-[0.85] mb-8 tracking-tighter">
            Import from <span className="text-brand">USA</span> to Bulgaria
          </h1>
          <p className="text-2xl text-ink/60 max-w-lg mb-12 leading-tight font-medium">
            Instantly calculate shipping costs, import taxes, and total price. Trusted
            by car buyers across Bulgaria.
          </p>

          <form onSubmit={handleCalculate} className="relative max-w-xl">
            <div className="flex flex-col md:flex-row gap-4 p-3 bg-white border border-ink/10 rounded-[2.5rem] shadow-2xl shadow-ink/10">
              <div className="flex-1 flex items-center px-6 gap-3">
                <LinkIcon className="text-ink/30" size={20} />
                <input
                  type="url"
                  required
                  placeholder="Paste car listing URL..."
                  className="w-full py-5 bg-transparent outline-none text-ink font-medium placeholder:text-ink/30 text-lg"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                />
              </div>
              <button
                type="submit"
                disabled={isCalculating}
                className="bg-brand text-white px-10 py-5 rounded-[2rem] font-bold flex items-center justify-center gap-2 hover:bg-ink transition-all disabled:opacity-50 text-lg"
              >
                {isCalculating ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                  >
                    <Calculator size={24} />
                  </motion.div>
                ) : (
                  <>
                    <span>Calculate</span>
                    <ArrowRight size={24} />
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="hidden lg:block relative"
        >
          <div className="aspect-[4/5] rounded-[4rem] overflow-hidden border-[12px] border-white shadow-2xl rotate-3">
            <img
              src="https://images.unsplash.com/photo-1511919884226-fd3cad34687c"
              alt="Luxury car"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="absolute -bottom-10 -left-10 bg-brand text-white p-10 rounded-[3rem] shadow-2xl -rotate-6">
            <div className="text-6xl font-display font-bold mb-1 tracking-tighter">
              100%
            </div>
            <div className="text-sm font-bold uppercase tracking-widest opacity-80">
              Accuracy Rate
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}