import type { Difficulty } from "@/lib/difficulties";

export default function ProgressGauge({
  difficulty,
  total,
  usedCount,
}: {
  difficulty: Difficulty;
  total: number;
  usedCount: number;
}) {
  const percent = total === 0 ? 0 : Math.round((usedCount / total) * 100);

  return (
    <div className="w-full max-w-md">
      <div className="mb-1 flex justify-between text-sm font-medium text-neutral-600 dark:text-neutral-300">
        <span>{difficulty} 난이도 진행도</span>
        <span>
          <span className="font-bold text-orange-500">{usedCount}</span>/{total}문제 뽑음
        </span>
      </div>
      {usedCount < total && (
        <p className="mb-2 text-sm text-neutral-500 dark:text-neutral-400">
          다음은 {usedCount + 1}번째 문제
        </p>
      )}
      <div className="h-4 w-full overflow-hidden rounded-full bg-neutral-200 dark:bg-neutral-800">
        <div
          className="h-full rounded-full bg-gradient-to-r from-amber-400 to-orange-500 transition-all duration-500"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
