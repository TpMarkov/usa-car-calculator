"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import type { ProcessStep, FAQItem } from "@/types";

export default function GuideView() {
  const steps: ProcessStep[] = [
    {
      step: "1",
      title: "Find a Car in the USA",
      desc: "Search for vehicles on US marketplaces. You can choose from auctions, dealers, or private sellers.",
      image: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7",
    },
    {
      step: "2",
      title: "Check the Vehicle Details",
      desc: "Review the condition, mileage, and history of the vehicle before making a decision.",
      image: "https://images.unsplash.com/photo-1581091215367-59ab6b1b8f3b",
    },
    {
      step: "3",
      title: "Calculate Total Import Cost",
      desc: "Use our calculator to estimate shipping, taxes, and additional fees for importing the car to Bulgaria.",
      image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f",
      link: true,
    },
    {
      step: "4",
      title: "Arrange Shipping",
      desc: "Choose a shipping method such as container shipping or roll-on/roll-off (RoRo).",
      image: "https://images.unsplash.com/photo-1565891741441-64926e441838",
    },
    {
      step: "5",
      title: "Customs Clearance in Bulgaria",
      desc: "Pay customs duty and VAT, and complete the import process through Bulgarian authorities.",
      image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d",
    },
    {
      step: "6",
      title: "Receive Your Car",
      desc: "After clearance, your car is ready for pickup or delivery to your location.",
      image: "https://images.unsplash.com/photo-1502877338535-766e1452684a",
    },
  ];

  const costItems = [
    "Car purchase price",
    "Transport within the USA",
    "Ocean shipping",
    "Customs duty (~10%)",
    "VAT (20%)",
    "Port and handling fees",
  ];

  const faqs: FAQItem[] = [
    {
      q: "Is it cheaper to import a car from the USA?",
      a: "In many cases, yes. Even with shipping and taxes, prices can be lower compared to the local market.",
    },
    {
      q: "How long does shipping take?",
      a: "Shipping usually takes between 6 and 10 weeks.",
    },
    {
      q: "Can I import any car?",
      a: "Most cars can be imported, but they must meet EU regulations and standards.",
    },
  ];

  return (
    <main className="pt-32 pb-32 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Intro Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-24"
        >
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-1 bg-brand" />
            <span className="text-brand font-bold uppercase tracking-[0.3em] text-sm">
              Full Guide
            </span>
          </div>
          <h1 className="text-7xl md:text-9xl font-display font-bold tracking-tighter leading-[0.85] mb-8">
            How to <span className="text-brand">Import</span>
          </h1>
          <p className="text-2xl text-ink/40 max-w-3xl font-medium leading-tight">
            Importing a car from the United States can save you money and give you access to a
            wider selection of vehicles. Here is a complete step-by-step guide to the process.
          </p>
        </motion.section>

        {/* Step by Step Process */}
        <section className="mb-32">
          <h2 className="text-5xl font-display font-bold mb-16 tracking-tighter">
            Step-by-Step Process
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12">
            {steps.map((item, i) => (
              <motion.article
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group"
              >
                <div className="aspect-video rounded-[2.5rem] overflow-hidden mb-8 bg-ink/5">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="flex items-start gap-4">
                  <span className="text-4xl font-display font-bold text-brand/20 leading-none">
                    {item.step}
                  </span>
                  <div>
                    <h3 className="text-2xl font-bold mb-4 tracking-tight">
                      {item.title}
                    </h3>
                    <p className="text-ink/60 leading-relaxed mb-4">{item.desc}</p>
                    {item.link && (
                      <Link
                        href="/"
                        className="text-brand font-bold uppercase tracking-widest text-xs flex items-center gap-2 hover:text-ink transition-colors"
                      >
                        Try the calculator <ArrowRight size={14} />
                      </Link>
                    )}
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </section>

        {/* Cost Explanation & FAQ */}
        <div className="grid lg:grid-cols-2 gap-20">
          <section>
            <h2 className="text-4xl font-display font-bold mb-12 tracking-tighter">
              What Costs Are Included?
            </h2>
            <ul className="space-y-6">
              {costItems.map((item, i) => (
                <li
                  key={i}
                  className="flex items-center gap-4 p-6 bg-white border border-ink/5 rounded-2xl font-bold text-lg"
                >
                  <div className="w-2 h-2 bg-brand rounded-full" />
                  {item}
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="text-4xl font-display font-bold mb-12 tracking-tighter">
              Frequently Asked Questions
            </h2>
            <div className="space-y-8">
              {faqs.map((faq, i) => (
                <article
                  key={i}
                  className="p-8 bg-surface border border-ink/5 rounded-3xl"
                >
                  <h3 className="text-xl font-bold mb-4 tracking-tight">{faq.q}</h3>
                  <p className="text-ink/60 leading-relaxed">{faq.a}</p>
                </article>
              ))}
            </div>
          </section>
        </div>

        {/* CTA Section */}
        <section className="mt-32">
          <div className="bg-ink text-surface p-16 md:p-24 rounded-[4rem] text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-brand/10 blur-[120px] rounded-full -mr-32 -mt-32" />
            <div className="relative z-10">
              <h2 className="text-5xl md:text-7xl font-display font-bold mb-8 tracking-tighter">
                Ready to Calculate Your Cost?
              </h2>
              <p className="text-xl font-medium mb-12 opacity-60 max-w-xl mx-auto">
                Use our tool to get an instant estimate for importing your chosen car.
              </p>
              <Link
                href="/"
                className="bg-brand text-white px-12 py-6 rounded-[2rem] font-bold text-xl hover:bg-white hover:text-ink transition-all shadow-2xl inline-block"
              >
                Go to Calculator
              </Link>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}