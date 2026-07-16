"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Problem } from "@/lib/types";

function ProblemCard({ problem }: { problem: Problem }) {
  const [imgFailed, setImgFailed] = useState(false);

  return (
    <div className="flex aspect-[11/14] w-[clamp(180px,26vw,480px)] max-sm:w-[66vw] flex-col items-center justify-center rounded-xl border-2 border-neutral-300 bg-white shadow-md dark:border-neutral-700 dark:bg-neutral-900">
      {!imgFailed ? (
        <img
          src={problem.imagePath}
          alt={problem.title}
          className="aspect-[9/10] w-[82%] rounded-md object-cover"
          onError={() => setImgFailed(true)}
        />
      ) : (
        <div className="flex aspect-[9/10] w-[82%] items-center justify-center rounded-md bg-neutral-100 text-[clamp(1.75rem,5vw,3.5rem)] font-bold text-neutral-400 dark:bg-neutral-800 dark:text-neutral-600">
          {problem.id}
        </div>
      )}
      <p className="mt-2 text-[clamp(0.875rem,1.3vw,1.25rem)] font-semibold text-neutral-700 dark:text-neutral-200">
        {problem.title}
      </p>
    </div>
  );
}

export default function SlotMachine({
  spinningProblem,
  result,
  isSpinning,
}: {
  spinningProblem: Problem | null;
  result: Problem | null;
  isSpinning: boolean;
}) {
  const displayed = isSpinning ? spinningProblem : result;

  return (
    <div className="flex aspect-[11/14] w-[clamp(180px,26vw,480px)] max-sm:w-[66vw] items-center justify-center">
      <AnimatePresence mode="wait">
        {displayed ? (
          <motion.div
            key={`${displayed.id}-${isSpinning}`}
            initial={{ y: isSpinning ? -20 : 30, opacity: 0 }}
            animate={{
              y: 0,
              opacity: 1,
              scale: !isSpinning ? [1, 1.08, 1] : 1,
            }}
            transition={{ duration: isSpinning ? 0.08 : 0.4 }}
          >
            <ProblemCard problem={displayed} />
          </motion.div>
        ) : (
          <div className="flex aspect-[11/14] w-[clamp(180px,26vw,480px)] max-sm:w-[66vw] items-center justify-center rounded-xl border-2 border-dashed border-neutral-300 text-neutral-400 dark:border-neutral-700">
            뽑기 대기 중
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
