"use client";

import { Car } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="py-20 px-6 bg-white border-t border-ink/5">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center gap-12 mb-20">
          <div className="flex items-center gap-2 font-display font-bold text-2xl tracking-tighter">
            <div className="w-10 h-10 bg-brand rounded-full flex items-center justify-center text-white">
              <Car size={20} />
            </div>
            <span>
              IMPORT<span className="text-brand">CALC</span>
            </span>
          </div>

          <div className="flex flex-wrap justify-center gap-12 text-sm font-bold uppercase tracking-widest">
            <a href="#" className="hover:text-brand transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-brand transition-colors">
              Terms of Service
            </a>
            <a href="#" className="hover:text-brand transition-colors">
              Cookies
            </a>
            <a href="/contact" className="hover:text-brand transition-colors">
              Contact
            </a>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center gap-6 text-ink/40 text-sm">
          <p>&copy; {currentYear} Car Import Calculator. All rights reserved.</p>
          <div className="flex items-center gap-8">
            <a href="#" className="hover:text-ink transition-colors">
              Twitter
            </a>
            <a href="#" className="hover:text-ink transition-colors">
              LinkedIn
            </a>
            <a href="#" className="hover:text-ink transition-colors">
              Instagram
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}