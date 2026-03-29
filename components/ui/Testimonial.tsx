"use client";

import { motion } from "framer-motion";
import { Quote } from "lucide-react";
import type { TestimonialProps } from "@/types";

export default function Testimonial({ quote, author, index }: TestimonialProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className="p-12 bg-white border border-ink/5 rounded-[3rem] relative"
    >
      <Quote className="absolute top-8 left-8 text-brand/10" size={60} />
      <blockquote className="text-2xl font-medium mb-8 relative z-10 leading-snug italic">
        "{quote}"
      </blockquote>
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 bg-surface rounded-full flex items-center justify-center text-brand font-bold">
          {author[0]}
        </div>
        <span className="font-bold text-ink/40 uppercase tracking-widest text-sm">
          {author}
        </span>
      </div>
    </motion.div>
  );
}