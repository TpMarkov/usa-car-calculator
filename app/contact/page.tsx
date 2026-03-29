import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ContactView from "@/components/views/ContactView";

export const metadata: Metadata = {
  title: "Contact | USA Car Import Calculator",
  description: "Get in touch with our team for assistance with importing a car from the USA to Bulgaria.",
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-surface">
      <Navbar currentView="contact" />
      <ContactView />
      <Footer />
    </div>
  );
}