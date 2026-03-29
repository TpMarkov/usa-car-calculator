import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import GuideView from "@/components/views/GuideView";

export const metadata: Metadata = {
  title: "Import Guide | USA Car Import Calculator",
  description: "Complete guide to importing a car from the USA to Bulgaria. Learn about the process, costs, and FAQs.",
};

export default function GuidePage() {
  return (
    <div className="min-h-screen bg-surface">
      <Navbar currentView="guide" />
      <GuideView />
      <Footer />
    </div>
  );
}