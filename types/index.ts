// View type for routing
export type View =
  | "landing"
  | "breakdown"
  | "how-it-works"
  | "guide"
  | "contact"
  | "marketplace";

// Car listing type
export interface Car {
  id: number;
  make: string;
  model: string;
  year: number;
  price: number;
  image: string;
  mileage: string;
  location: string;
}

// Testimonial type
export interface TestimonialProps {
  quote: string;
  author: string;
  index: number;
}

// Step type for how-it-works
export interface StepProps {
  number: string;
  title: string;
  description: string;
  image: string;
  index: number;
}

// Cost row type
export interface CostRowProps {
  label: string;
  value: string;
  isTotal?: boolean;
}

// Navbar props
export interface NavbarProps {
  currentView: View;
}

// Footer props - no additional props needed
export type FooterProps = Record<string, never>;

// Search filters type
export interface SearchFilters {
  make: string;
  model: string;
  year: string;
  priceRange: string;
}

// Feature type
export interface Feature {
  title: string;
  desc: string;
}

// Process step type for guide
export interface ProcessStep {
  step: string;
  title: string;
  desc: string;
  image: string;
  link?: boolean;
}

// FAQ item type
export interface FAQItem {
  q: string;
  a: string;
}
