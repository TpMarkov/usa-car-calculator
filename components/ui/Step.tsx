"use client";

import { motion } from "framer-motion";
import type { StepProps } from "@/types";

export default function Step({
  number,
  title,
  description,
  image,
  index,
}: StepProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.2 }}
      className="group"
    >
      <div className="relative aspect-[4/5] overflow-hidden rounded-[2.5rem] mb-8 bg-ink/5">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
          referrerPolicy="no-referrer"
        />
        <div className="absolute top-6 left-6 w-12 h-12 bg-brand text-white rounded-full flex items-center justify-center font-display font-bold text-xl">
          {number}
        </div>
      </div>
      <h3 className="text-3xl font-bold mb-4">{title}</h3>
      <p className="text-ink/60 leading-relaxed text-lg">{description}</p>
    </motion.div>
  );
}