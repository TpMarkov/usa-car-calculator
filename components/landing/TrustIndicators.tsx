"use client";

import { Search, Ship, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

export default function TrustIndicators() {
  const indicators = [
    { label: "Cars analyzed", value: "1000+", icon: Search },
    { label: "Shipping estimates", value: "Accurate", icon: Ship },
    { label: "No hidden fees", value: "Transparent", icon: ShieldCheck },
  ];

  return (
    <section className="py-20 border-y border-ink/5 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-0">
          {indicators.map((item, i) => (
            <div
              key={i}
              className={cn(
                "flex flex-col items-center text-center px-12",
                i !== 2 && "md:border-r border-ink/5"
              )}
            >
              <div className="w-12 h-12 bg-surface rounded-2xl flex items-center justify-center text-brand mb-6">
                <item.icon size={24} />
              </div>
              <div className="text-5xl font-display font-bold mb-2 tracking-tighter">
                {item.value}
              </div>
              <div className="text-sm font-bold uppercase tracking-widest text-ink/40">
                {item.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}