"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Check } from "lucide-react";

export default function ContactView() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (submitted) {
    return (
      <main className="pt-32 pb-32 px-6 min-h-[80vh] flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-2xl"
        >
          <div className="w-24 h-24 bg-brand/10 text-brand rounded-full flex items-center justify-center mx-auto mb-8">
            <Check size={48} />
          </div>
          <h1 className="text-6xl font-display font-bold mb-6 tracking-tighter">
            Thank You!
          </h1>
          <p className="text-2xl text-ink/60 mb-12 leading-tight">
            Your request has been submitted successfully. Our team will review your
            details and connect you with trusted partners shortly.
          </p>
          <Link
            href="/"
            className="bg-ink text-white px-12 py-6 rounded-[2rem] font-bold text-xl hover:bg-brand transition-all"
          >
            Back to Home
          </Link>
        </motion.div>
      </main>
    );
  }

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
              Get Assistance
            </span>
          </div>
          <h1 className="text-7xl md:text-9xl font-display font-bold tracking-tighter leading-[0.85] mb-8">
            Help with <span className="text-brand">Import</span>
          </h1>
          <p className="text-2xl text-ink/40 max-w-3xl font-medium leading-tight">
            Submit your request and we will connect you with trusted shipping and
            import partners to handle the process for you.
          </p>
        </motion.section>

        <div className="grid lg:grid-cols-2 gap-20 items-start">
          {/* Form Section */}
          <section>
            <form onSubmit={handleSubmit} className="space-y-12">
              {/* Personal Info */}
              <div className="space-y-8">
                <h2 className="text-3xl font-display font-bold tracking-tight flex items-center gap-4">
                  <span className="w-8 h-8 rounded-full bg-brand/10 text-brand text-sm flex items-center justify-center">
                    01
                  </span>
                  Your Details
                </h2>
                <div className="grid gap-6">
                  <div className="space-y-2">
                    <label
                      htmlFor="name"
                      className="text-xs font-bold uppercase tracking-widest text-ink/40"
                    >
                      Full Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      required
                      className="w-full bg-surface border-b-2 border-ink/10 py-4 text-xl font-medium focus:border-brand outline-none transition-colors"
                    />
                  </div>
                  <div className="space-y-2">
                    <label
                      htmlFor="email"
                      className="text-xs font-bold uppercase tracking-widest text-ink/40"
                    >
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      required
                      className="w-full bg-surface border-b-2 border-ink/10 py-4 text-xl font-medium focus:border-brand outline-none transition-colors"
                    />
                  </div>
                  <div className="space-y-2">
                    <label
                      htmlFor="phone"
                      className="text-xs font-bold uppercase tracking-widest text-ink/40"
                    >
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      className="w-full bg-surface border-b-2 border-ink/10 py-4 text-xl font-medium focus:border-brand outline-none transition-colors"
                    />
                  </div>
                </div>
              </div>

              {/* Car Info */}
              <div className="space-y-8">
                <h2 className="text-3xl font-display font-bold tracking-tight flex items-center gap-4">
                  <span className="w-8 h-8 rounded-full bg-brand/10 text-brand text-sm flex items-center justify-center">
                    02
                  </span>
                  Car Information
                </h2>
                <div className="grid gap-6">
                  <div className="space-y-2">
                    <label
                      htmlFor="car-url"
                      className="text-xs font-bold uppercase tracking-widest text-ink/40"
                    >
                      Car Listing URL
                    </label>
                    <input
                      type="url"
                      id="car-url"
                      required
                      placeholder="https://example.com/car"
                      className="w-full bg-surface border-b-2 border-ink/10 py-4 text-xl font-medium focus:border-brand outline-none transition-colors"
                    />
                  </div>
                  <div className="space-y-2">
                    <label
                      htmlFor="budget"
                      className="text-xs font-bold uppercase tracking-widest text-ink/40"
                    >
                      Estimated Budget (€)
                    </label>
                    <input
                      type="number"
                      id="budget"
                      className="w-full bg-surface border-b-2 border-ink/10 py-4 text-xl font-medium focus:border-brand outline-none transition-colors"
                    />
                  </div>
                  <div className="space-y-2">
                    <label
                      htmlFor="notes"
                      className="text-xs font-bold uppercase tracking-widest text-ink/40"
                    >
                      Additional Details
                    </label>
                    <textarea
                      id="notes"
                      rows={4}
                      placeholder="Any specific requirements or questions..."
                      className="w-full bg-surface border-b-2 border-ink/10 py-4 text-xl font-medium focus:border-brand outline-none transition-colors resize-none"
                    />
                  </div>
                </div>
              </div>

              {/* Preferences */}
              <div className="space-y-8">
                <h2 className="text-3xl font-display font-bold tracking-tight flex items-center gap-4">
                  <span className="w-8 h-8 rounded-full bg-brand/10 text-brand text-sm flex items-center justify-center">
                    03
                  </span>
                  Preferences
                </h2>
                <div className="grid gap-4">
                  {[
                    { id: "container", label: "Container Shipping" },
                    { id: "roro", label: "Roll-on/Roll-off (RoRo)" },
                    { id: "door", label: "Door-to-door delivery" },
                  ].map((opt) => (
                    <label
                      key={opt.id}
                      className="flex items-center gap-4 p-6 bg-white border border-ink/5 rounded-2xl cursor-pointer hover:border-brand/30 transition-colors group"
                    >
                      <input type="checkbox" className="w-6 h-6 accent-brand" />
                      <span className="text-lg font-bold">{opt.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Consent & Submit */}
              <div className="space-y-8 pt-8">
                <label className="flex items-start gap-4 cursor-pointer group">
                  <input type="checkbox" required className="mt-1 w-5 h-5 accent-brand" />
                  <span className="text-sm text-ink/60 font-medium leading-relaxed">
                    I agree to the{" "}
                    <a href="/terms" className="text-brand underline">
                      Terms of Service
                    </a>{" "}
                    and{" "}
                    <a href="/privacy" className="text-brand underline">
                      Privacy Policy
                    </a>
                    . I understand my data is shared with trusted partners.
                  </span>
                </label>
                <button
                  type="submit"
                  className="w-full bg-ink text-white py-8 rounded-[2rem] font-bold text-2xl hover:bg-brand transition-all shadow-2xl flex items-center justify-center gap-4"
                >
                  Submit Request <ArrowRight size={24} />
                </button>
              </div>
            </form>
          </section>

          {/* Trust & Info Section */}
          <aside className="space-y-16 lg:sticky lg:top-32">
            <section className="p-12 bg-surface border border-ink/5 rounded-[3rem]">
              <h2 className="text-4xl font-display font-bold mb-8 tracking-tighter">
                Why Submit a Request?
              </h2>
              <ul className="space-y-8">
                {[
                  {
                    title: "Verified Partners",
                    desc: "We connect you with shipping companies we have personally vetted.",
                  },
                  {
                    title: "Save Time",
                    desc: "Avoid the hassle of researching logistics and customs paperwork.",
                  },
                  {
                    title: "Personalized Help",
                    desc: "Get a tailored solution based on your specific vehicle and budget.",
                  },
                ].map((item, i) => (
                  <li key={i} className="flex gap-6">
                    <div className="w-12 h-12 rounded-2xl bg-brand/10 text-brand flex items-center justify-center shrink-0">
                      <Check size={24} />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                      <p className="text-ink/60 leading-relaxed">{item.desc}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </section>

            <section className="p-12 bg-brand text-white rounded-[3rem] relative overflow-hidden">
              <div className="absolute inset-0 bg-white/10 blur-3xl rounded-full -ml-20 -mt-20" />
              <div className="relative z-10">
                <h2 className="text-4xl font-display font-bold mb-6 tracking-tighter">
                  Your Data is Safe
                </h2>
                <p className="text-lg font-medium opacity-80 leading-relaxed">
                  We respect your privacy. Your information is only shared with trusted
                  partners for the purpose of completing your request. We use
                  industry-standard encryption to protect your details.
                </p>
              </div>
            </section>
          </aside>
        </div>
      </div>
    </main>
  );
}