"use client";

import { Ship } from "lucide-react";
import Testimonial from "@/components/ui/Testimonial";

export default function VehicleInfo() {
  const testimonials = [
    {
      quote:
        "I finally understood the real cost before buying my car. Saved me thousands in unexpected customs fees.",
      author: "Ivan, Sofia",
    },
    {
      quote:
        "Super easy to use and very accurate estimates. The shipping data was spot on with the final invoice.",
      author: "Georgi, Plovdiv",
    },
  ];

  return (
    <>
      {/* Testimonials */}
      <section className="py-32 px-6 bg-surface">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-24">
            <h2 className="text-6xl font-display font-bold tracking-tighter">
              What Our Users Say
            </h2>
          </div>
          <div className="grid md:grid-cols-2 gap-12">
            {testimonials.map((t, i) => (
              <Testimonial
                key={i}
                index={i}
                quote={t.quote}
                author={t.author}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Partners / Logistics */}
      <section className="py-32 px-6 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div>
              <h2 className="text-6xl font-display font-bold mb-8 tracking-tighter">
                Shipping & Logistics
              </h2>
              <p className="text-xl text-ink/60 leading-relaxed mb-12">
                We work with international shipping partners to deliver your
                vehicle safely. From the auction yard in the US to the port in
                Bulgaria, your car is in safe hands.
              </p>
              <div className="flex items-center gap-6 p-8 bg-surface rounded-3xl border border-ink/5">
                <Ship className="text-brand" size={40} />
                <p className="font-bold text-ink/60 uppercase tracking-widest text-sm">
                  Weekly departures from NY, Savannah, and Houston.
                </p>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-video rounded-[3rem] overflow-hidden shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1564859228273-274232fdb516"
                  alt="Container ship"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 bg-ink text-surface p-8 rounded-3xl font-bold uppercase tracking-widest text-xs">
                Global Network
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-6">
        <div className="max-w-7xl mx-auto bg-brand text-white rounded-[4rem] p-16 md:p-32 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
          <div className="relative z-10">
            <h2 className="text-7xl md:text-9xl font-display font-bold mb-10 tracking-tighter leading-[0.85]">
              Ready to Import Your Car?
            </h2>
            <p className="text-2xl md:text-3xl font-medium mb-16 opacity-80 max-w-2xl mx-auto">
              Start by calculating your total cost now and join thousands of happy
              owners.
            </p>
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="bg-white text-brand px-16 py-8 rounded-[2.5rem] font-bold text-2xl hover:bg-ink hover:text-white transition-all shadow-2xl"
            >
              Calculate Now
            </button>
          </div>
        </div>
      </section>
    </>
  );
}