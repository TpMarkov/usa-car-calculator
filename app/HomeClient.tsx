"use client";

import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/landing/HeroSection";
import TrustIndicators from "@/components/landing/TrustIndicators";
import Features from "@/components/landing/Features";
import CostBreakdown from "@/components/landing/CostBreakdown";
import VehicleInfo from "@/components/landing/VehicleInfo";
import type { View } from "@/types";

export default function HomeClient() {
  const [currentView, setCurrentView] = useState<View>("landing");

  const handleCalculate = () => {
    setCurrentView("breakdown");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-surface">
      <Navbar currentView={currentView} />

      {currentView === "landing" && (
        <HeroSection onCalculate={handleCalculate} />
      )}

      {currentView === "landing" && <TrustIndicators />}
      {currentView === "landing" && <Features />}
      {currentView === "landing" && <VehicleInfo />}

      {currentView === "breakdown" && <CostBreakdown />}

      <Footer />
    </div>
  );
}