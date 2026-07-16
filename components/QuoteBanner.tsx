"use client";

import { motion, AnimatePresence } from "framer-motion";
import type { Quote } from "@/lib/quotes";

export default function QuoteBanner({ quote }: { quote: Quote | null }) {
  if (!quote) return null;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={quote.text}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.4 }}
        className="max-w-md text-center"
      >
        <p className="text-sm italic text-neutral-500 dark:text-neutral-400">
          “{quote.text}”
        </p>
        <p className="mt-1 text-xs text-neutral-400 dark:text-neutral-500">
          - {quote.author} -
        </p>
      </motion.div>
    </AnimatePresence>
  );
}
