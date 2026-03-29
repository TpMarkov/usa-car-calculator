"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ChevronRight, CheckCircle2 } from "lucide-react";
import Step from "@/components/ui/Step";

export default function Features() {
  const features = [
    {
      title: "Complete Cost Breakdown",
      desc: "Every fee explained clearly before you buy. No hidden surprises.",
    },
    {
      title: "Real Shipping Data",
      desc: "Based on logistics routes from the USA to Bulgaria with live carrier rates.",
    },
    {
      title: "Import Guidance",
      desc: "Understand taxes, duties, and the full legal process for Bulgarian registration.",
    },
  ];

  const steps = [
    {
      number: "01",
      title: "Find a Car",
      description:
        "Browse US marketplaces like Copart or IAAI and copy the listing link of your dream vehicle.",
      image: "https://images.unsplash.com/photo-1550355291-bbee04a92027",
    },
    {
      number: "02",
      title: "Paste the Link",
      description:
        "Enter the car URL into our calculator. We'll automatically pull the vehicle data for you.",
      image: "https://images.unsplash.com/photo-1581091870627-3c7a5bde9b8b",
    },
    {
      number: "03",
      title: "Get Full Price",
      description:
        "See the total cost including shipping, customs, and taxes delivered to Bulgaria.",
      image: "https://images.unsplash.com/photo-1605902711622-cfb43c44367f",
    },
  ];

  return (
    <>
      {/* How It Works Section (Preview) */}
      <section id="how-it-works" className="py-32 px-6 bg-surface">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-24">
            <div className="max-w-2xl">
              <div className="text-brand font-bold uppercase tracking-[0.3em] text-sm mb-6">
                Process
              </div>
              <h2 className="text-6xl md:text-8xl font-display font-bold tracking-tighter leading-[0.9]">
                How It Works
              </h2>
            </div>
            <Link
              href="/how-it-works"
              className="flex items-center gap-2 font-bold uppercase tracking-widest text-sm text-brand hover:text-ink transition-colors group"
            >
              <span>View Full Guide</span>
              <ChevronRight
                size={18}
                className="group-hover:translate-x-1 transition-transform"
              />
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            {steps.map((step, index) => (
              <Step
                key={index}
                index={index}
                number={step.number}
                title={step.title}
                description={step.description}
                image={step.image}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-32 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div className="grid grid-cols-1 gap-8">
              {features.map((feature, i) => (
                <motion.article
                  key={i}
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="p-10 bg-surface rounded-[2.5rem] border border-ink/5 hover:border-brand/20 transition-all group"
                >
                  <h3 className="text-3xl font-bold mb-4 group-hover:text-brand transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-ink/60 text-lg leading-relaxed">{feature.desc}</p>
                </motion.article>
              ))}
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-brand/5 rounded-[4rem] blur-3xl" />
              <div className="relative z-10">
                <h2 className="text-7xl font-display font-bold mb-10 tracking-tighter leading-none">
                  What You <span className="text-brand">Get</span>
                </h2>
                <p className="text-2xl text-ink/60 leading-relaxed mb-12 font-medium">
                  We provide the most accurate data in the industry, ensuring you make an
                  informed decision on your next vehicle import.
                </p>
                <div className="w-24 h-24 bg-brand rounded-full flex items-center justify-center text-white">
                  <CheckCircle2 size={48} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}