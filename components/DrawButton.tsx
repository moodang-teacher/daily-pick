export default function DrawButton({
  onClick,
  disabled,
  isSpinning,
}: {
  onClick: () => void;
  disabled: boolean;
  isSpinning: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="rounded-full bg-orange-500 px-8 py-3 text-lg font-bold text-white shadow-lg transition hover:bg-orange-600 active:scale-95 disabled:cursor-not-allowed disabled:bg-neutral-300 disabled:text-neutral-500 dark:disabled:bg-neutral-700"
    >
      {isSpinning ? "뽑는 중..." : "오늘의 문제 뽑기"}
    </button>
  );
}
