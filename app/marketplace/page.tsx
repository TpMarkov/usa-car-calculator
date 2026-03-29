import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import MarketplaceView from "@/components/views/MarketplaceView";

export const metadata: Metadata = {
  title: "Marketplace | USA Car Import Calculator",
  description: "Browse and search vehicles from US marketplaces. Find your dream car and calculate import costs.",
};

export default function MarketplacePage() {
  return (
    <div className="min-h-screen bg-surface">
      <Navbar currentView="marketplace" />
      <MarketplaceView />
      <Footer />
    </div>
  );
}