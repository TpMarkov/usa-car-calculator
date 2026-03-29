"use client";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import MarketplaceView from "@/components/views/MarketplaceView";
import CarDetailsView from "@/components/views/CarDetailsView";
import { CarsProvider } from "@/context/CarsContext";
import { useState } from "react";
import type { Car } from "@/types";

// Metadata is handled by parent layout (app/layout.tsx)

function MarketplacePageContent() {
  const [selectedCarId, setSelectedCarId] = useState<string | null>(null);

  const handleSelectCar = (car: Car) => {
    console.log('[MarketplacePage] handleSelectCar called with car:', car?.id);
    setSelectedCarId(car.id);
  };

  const handleBackToMarketplace = () => {
    setSelectedCarId(null);
  };

  return (
    <div className="min-h-screen bg-surface">
      <Navbar currentView="marketplace" />
      {selectedCarId ? (
        <CarDetailsView carId={selectedCarId} onBack={handleBackToMarketplace} />
      ) : (
        <MarketplaceView onSelectCar={handleSelectCar} />
      )}
      <Footer />
    </div>
  );
}

export default function MarketplacePage() {
  return (
    <CarsProvider>
      <MarketplacePageContent />
    </CarsProvider>
  );
}