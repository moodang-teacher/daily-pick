export default function ProgressGauge({
  total,
  usedCount,
}: {
  total: number;
  usedCount: number;
}) {
  const percent = total === 0 ? 0 : Math.round((usedCount / total) * 100);

  return (
    <div className="w-full max-w-md">
      <div className="mb-2 flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1 text-sm font-medium text-neutral-600 dark:text-neutral-300">
        <span>전체 진행도</span>
        <span>
          전체 {total}문제 중 <span className="font-bold text-orange-500">{usedCount}</span>문제 완료!
        </span>
      </div>
      <div className="h-4 w-full overflow-hidden rounded-full bg-neutral-200 dark:bg-neutral-800">
        <div
          className="h-full rounded-full bg-gradient-to-r from-amber-400 to-orange-500 transition-all duration-500"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
