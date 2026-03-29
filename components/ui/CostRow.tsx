"use client";

import { cn } from "@/lib/utils";
import type { CostRowProps } from "@/types";

export default function CostRow({ label, value, isTotal = false }: CostRowProps) {
  return (
    <div
      className={cn(
        "flex justify-between items-center py-6 border-b border-ink/5",
        isTotal && "border-t-2 border-brand pt-10 mt-4 border-b-0"
      )}
    >
      <span
        className={cn(
          "text-lg",
          isTotal
            ? "font-display font-bold text-2xl uppercase tracking-widest"
            : "text-ink/60 font-medium"
        )}
      >
        {label}
      </span>
      <span
        className={cn(
          "font-display font-bold",
          isTotal ? "text-5xl text-brand" : "text-2xl"
        )}
      >
        {value}
      </span>
    </div>
  );
}