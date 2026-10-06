"use client";

import { useEffect, useRef, useState } from "react";
import confetti from "canvas-confetti";
import Link from "next/link";
import { drawProblem, getStatus, type Status } from "./actions";
import SlotMachine from "@/components/SlotMachine";
import DrawButton from "@/components/DrawButton";
import ProgressGauge from "@/components/ProgressGauge";
import QuoteBanner from "@/components/QuoteBanner";
import { DRAW_ORDER, getDifficulty } from "@/lib/difficulties";
import type { Problem } from "@/lib/types";
import type { Quote } from "@/lib/quotes";

const SPIN_INTERVAL_MS = 90;
const SPIN_DURATION_MS = 1200;

export default function Home() {
  const [status, setStatus] = useState<Status | null>(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [spinningProblem, setSpinningProblem] = useState<Problem | null>(null);
  const [result, setResult] = useState<Problem | null>(null);
  const [quote, setQuote] = useState<Quote | null>(null);
  const [error, setError] = useState<string | null>(null);
  const spinTimer = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    getStatus().then(setStatus).catch(() => setError("문제 현황을 불러오지 못했습니다."));
    return () => {
      if (spinTimer.current) clearInterval(spinTimer.current);
    };
  }, []);

  const nextDifficulty = status?.nextDifficulty;
  const nextProgress = nextDifficulty ? status?.byDifficulty[nextDifficulty] : undefined;
  const displayedDifficulty = !isSpinning && result
    ? getDifficulty(result.id)
    : nextDifficulty;
  const displayedProgress = displayedDifficulty
    ? status?.byDifficulty[displayedDifficulty]
    : undefined;
  const emptyPool = status !== null && nextDifficulty === null;

  async function handleDraw() {
    if (isSpinning || emptyPool || !nextProgress) return;
    setIsSpinning(true);
    setError(null);

    const available = nextProgress.availableProblems;
    spinTimer.current = setInterval(() => {
      setSpinningProblem(available[Math.floor(Math.random() * available.length)]);
    }, SPIN_INTERVAL_MS);

    try {
      const [drawResult] = await Promise.all([
        drawProblem(),
        new Promise((resolve) => setTimeout(resolve, SPIN_DURATION_MS)),
      ]);

      setResult(drawResult.problem);
      setQuote(drawResult.problem ? drawResult.quote : null);
      setStatus(drawResult.status);
      if (drawResult.problem) {
        confetti({
          particleCount: 140,
          spread: 100,
          startVelocity: 45,
          origin: { y: 0.6 },
          colors: ["#f97316", "#fb923c", "#fbbf24", "#ffffff"],
        });
      }
    } catch {
      setError("문제를 뽑지 못했습니다. 다시 시도해 주세요.");
    } finally {
      if (spinTimer.current) clearInterval(spinTimer.current);
      spinTimer.current = null;
      setIsSpinning(false);
      setSpinningProblem(null);
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center gap-8 bg-zinc-50 p-8 pt-12 dark:bg-black">
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

      {error && <p role="alert" className="text-center text-sm font-medium text-red-500">{error}</p>}

      <DrawButton
        onClick={handleDraw}
        disabled={isSpinning || emptyPool || !nextProgress}
        isSpinning={isSpinning}
      />

      {displayedDifficulty && displayedProgress && (
        <ProgressGauge
          difficulty={displayedDifficulty}
          total={displayedProgress.total}
          usedCount={displayedProgress.usedCount}
        />
      )}

      {status && (
        <p className="text-center text-sm font-medium text-neutral-600 dark:text-neutral-300">
          전체 {status.total}문제 중 <span className="font-bold text-orange-500">{status.usedCount}</span>문제 완료!
        </p>
      )}

      <QuoteBanner quote={quote} />

      <footer className="mt-auto w-full max-w-md rounded-2xl border border-neutral-200 bg-white p-5 text-center dark:border-neutral-800 dark:bg-neutral-900">
        <p className="text-sm text-neutral-500 dark:text-neutral-400">뽑기 순서</p>
        <p className="mt-1 font-semibold text-neutral-700 dark:text-neutral-200">
          {DRAW_ORDER.join(" → ")} → 반복
        </p>
        <p className="mt-3 text-lg font-bold text-orange-500">
          {nextDifficulty ? `다음 난이도: ${nextDifficulty}` : status ? "모든 문제 완료" : "문제 현황을 불러오는 중"}
        </p>
        <Link href="/difficulties" className="mt-3 inline-block text-sm text-neutral-500 underline hover:text-orange-500 dark:text-neutral-400">
          난이도별 문제 보기
        </Link>
      </footer>
    </div>
  );
}
