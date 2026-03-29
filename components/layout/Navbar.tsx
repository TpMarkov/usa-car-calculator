"use client";

import Link from "next/link";
import { Car } from "lucide-react";
import { cn } from "@/lib/utils";
import type { View, NavbarProps } from "@/types";

export default function Navbar({ currentView }: NavbarProps) {
  const navItems: { view: View; label: string }[] = [
    { view: "landing", label: "Home" },
    { view: "marketplace", label: "Marketplace" },
    { view: "how-it-works", label: "How it works" },
    { view: "guide", label: "Guide" },
    { view: "contact", label: "Contact" },
  ];

  const getButtonText = () => {
    return currentView === "landing" ? "Calculate Now" : "New Calculation";
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-surface/80 backdrop-blur-md border-b border-ink/5">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-2 font-display font-bold text-xl tracking-tighter cursor-pointer"
        >
          <div className="w-8 h-8 bg-brand rounded-full flex items-center justify-center text-white">
            <Car size={18} />
          </div>
          <span>
            IMPORT<span className="text-brand">CALC</span>
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-8 text-sm font-medium uppercase tracking-widest text-ink/60">
          {navItems.map((item) => (
            <Link
              key={item.view}
              href={`/${item.view === "landing" ? "" : item.view}`}
              className={cn(
                "hover:text-brand transition-colors",
                currentView === item.view && "text-brand"
              )}
            >
              {item.label}
            </Link>
          ))}
        </div>

        <Link
          href="/"
          className="bg-ink text-surface px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-brand transition-all"
        >
          {getButtonText()}
        </Link>
      </div>
    </nav>
  );
}