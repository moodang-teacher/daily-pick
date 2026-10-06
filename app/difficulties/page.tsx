import Link from "next/link";
import problems from "@/data/problems.json";
import DifficultyCatalog from "@/components/DifficultyCatalog";

export default function DifficultiesPage() {
  const items = problems.map(({ id, title, imagePath }) => ({ id, title, imagePath }));

  return (
    <main className="mx-auto min-h-screen max-w-5xl px-5 py-10 sm:px-8">
      <Link href="/" className="text-sm font-medium text-neutral-500 hover:text-orange-500 dark:text-neutral-400">
        ← 문제 뽑기로 돌아가기
      </Link>
      <div className="mt-8 mb-8">
        <p className="text-sm font-semibold text-orange-500">실기 문제 30개</p>
        <h1 className="mt-2 text-3xl font-bold text-neutral-900 dark:text-neutral-100">난이도별 문제 목록</h1>
        <p className="mt-3 text-sm text-neutral-500 dark:text-neutral-400">
          탭을 눌러 각 난이도에 포함된 문제를 확인하세요.
        </p>
      </div>
      <DifficultyCatalog problems={items} />
    </main>
  );
}
