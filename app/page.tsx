import type { Metadata } from "next";
import HomeClient from "./HomeClient";

export const metadata: Metadata = {
  title: "USA Car Import Calculator",
  description: "Calculate the total cost of importing a car from the USA to Bulgaria. Get instant estimates for shipping, customs duties, and VAT.",
};

export default function Home() {
  return <HomeClient />;
}