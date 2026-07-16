"use client";

import { useState } from "react";
import { resetProblems, getStatus } from "@/app/actions";

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<{ total: number; usedCount: number } | null>(null);

  async function handleReset(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage(null);

    const result = await resetProblems(password);
    setSuccess(result.success);
    setMessage(result.message);
    setPassword("");
    setIsSubmitting(false);

    if (result.success) {
      const newStatus = await getStatus();
      setStatus(newStatus);
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-zinc-50 p-8 dark:bg-black">
      <h1 className="text-2xl font-bold text-neutral-800 dark:text-neutral-100">
        관리자 페이지
      </h1>
      <p className="text-sm text-neutral-500 dark:text-neutral-400">
        전체 문제를 초기화하려면 관리자 비밀번호를 입력하세요.
      </p>

      <form onSubmit={handleReset} className="flex flex-col items-center gap-4">
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="관리자 비밀번호"
          className="w-64 rounded-lg border border-neutral-300 px-4 py-2 text-center focus:border-orange-500 focus:outline-none dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100"
        />
        <button
          type="submit"
          disabled={isSubmitting || password.length === 0}
          className="rounded-full bg-orange-500 px-6 py-2 font-semibold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:bg-neutral-300"
        >
          {isSubmitting ? "초기화 중..." : "전체 문제 초기화"}
        </button>
      </form>

      {message && (
        <p
          className={`text-sm font-medium ${
            success ? "text-green-600" : "text-red-500"
          }`}
        >
          {message}
        </p>
      )}

      {status && (
        <p className="text-sm text-neutral-500 dark:text-neutral-400">
          현재 상태: 전체 {status.total}문제 중 {status.usedCount}문제 사용됨
        </p>
      )}

      <a
        href="/"
        className="mt-4 text-sm text-neutral-400 underline hover:text-neutral-600 dark:hover:text-neutral-200"
      >
        메인으로 돌아가기
      </a>
    </div>
  );
}
