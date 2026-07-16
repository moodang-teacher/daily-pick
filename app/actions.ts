"use server";

import {
  getAllProblems,
  selectProblem,
  resetAllProblems,
} from "@/lib/problems-store";
import { getRandomQuote, type Quote } from "@/lib/quotes";
import type { Problem } from "@/lib/types";

export interface DrawResult {
  problem: Problem | null;
  quote: Quote;
  total: number;
  usedCount: number;
}

export async function getStatus(): Promise<{ total: number; usedCount: number }> {
  const problems = await getAllProblems();
  return {
    total: problems.length,
    usedCount: problems.filter((p) => p.isUsed).length,
  };
}

export async function drawProblem(): Promise<DrawResult> {
  const problem = await selectProblem();
  const problems = await getAllProblems();
  return {
    problem,
    quote: getRandomQuote(),
    total: problems.length,
    usedCount: problems.filter((p) => p.isUsed).length,
  };
}

export async function resetProblems(
  password: string
): Promise<{ success: boolean; message: string }> {
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword) {
    return {
      success: false,
      message: "관리자 비밀번호가 서버에 설정되어 있지 않습니다.",
    };
  }
  if (password !== adminPassword) {
    return { success: false, message: "비밀번호가 올바르지 않습니다." };
  }
  await resetAllProblems();
  return { success: true, message: "전체 문제가 초기화되었습니다." };
}
