"use client";

import { useEffect, useRef, useState } from "react";
import { drawProblem, getStatus } from "./actions";
import SlotMachine from "@/components/SlotMachine";
import DrawButton from "@/components/DrawButton";
import ProgressGauge from "@/components/ProgressGauge";
import QuoteBanner from "@/components/QuoteBanner";
import type { Problem } from "@/lib/types";
import type { Quote } from "@/lib/quotes";

const SPIN_INTERVAL_MS = 90;
const SPIN_DURATION_MS = 1200;

export default function Home() {
  const [total, setTotal] = useState(0);
  const [usedCount, setUsedCount] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [spinningProblem, setSpinningProblem] = useState<Problem | null>(null);
  const [result, setResult] = useState<Problem | null>(null);
  const [quote, setQuote] = useState<Quote | null>(null);
  const [emptyPool, setEmptyPool] = useState(false);
  const spinTimer = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    getStatus().then(({ total, usedCount }) => {
      setTotal(total);
      setUsedCount(usedCount);
      if (total > 0 && usedCount >= total) setEmptyPool(true);
    });
    return () => {
      if (spinTimer.current) clearInterval(spinTimer.current);
    };
  }, []);

  async function handleDraw() {
    if (isSpinning || emptyPool || total === 0) return;
    setIsSpinning(true);

    spinTimer.current = setInterval(() => {
      const randomId = Math.floor(Math.random() * total) + 1;
      setSpinningProblem({
        id: randomId,
        title: `문제 ${String(randomId).padStart(2, "0")}`,
        imagePath: `/images/exams/exam${String(randomId).padStart(2, "0")}.png`,
        isUsed: false,
      });
    }, SPIN_INTERVAL_MS);

    const [drawResult] = await Promise.all([
      drawProblem(),
      new Promise((resolve) => setTimeout(resolve, SPIN_DURATION_MS)),
    ]);

    if (spinTimer.current) clearInterval(spinTimer.current);
    setIsSpinning(false);
    setResult(drawResult.problem);
    setQuote(drawResult.quote);
    setTotal(drawResult.total);
    setUsedCount(drawResult.usedCount);
    if (!drawResult.problem) setEmptyPool(true);
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-8 bg-zinc-50 p-8 dark:bg-black">
      <h1 className="text-2xl font-bold text-neutral-800 dark:text-neutral-100">
        오늘의 실기 문제 뽑기
      </h1>

      <SlotMachine
        spinningProblem={spinningProblem}
        result={result}
        isSpinning={isSpinning}
      />

      {emptyPool && (
        <p className="text-center text-sm font-medium text-red-500">
          모든 문제를 다 뽑았습니다! 관리자 페이지에서 초기화해 주세요.
        </p>
      )}

      <DrawButton
        onClick={handleDraw}
        disabled={isSpinning || emptyPool || total === 0}
        isSpinning={isSpinning}
      />

      <ProgressGauge total={total} usedCount={usedCount} />

      <QuoteBanner quote={quote} />
    </div>
  );
}
