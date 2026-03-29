import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import HowItWorksView from "@/components/views/HowItWorksView";

export const metadata: Metadata = {
  title: "How It Works | USA Car Import Calculator",
  description: "Step-by-step guide to importing a car from the USA to Bulgaria. Learn about the process, costs, and timeline.",
};

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-surface">
      <Navbar currentView="how-it-works" />
      <HowItWorksView />
      <Footer />
    </div>
  );
}