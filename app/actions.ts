"use server";

import {
  getAllProblems,
  selectProblem,
  resetAllProblems,
} from "@/lib/problems-store";
import { getRandomQuote, type Quote } from "@/lib/quotes";
import type { Problem } from "@/lib/types";
import { DIFFICULTIES, getDifficulty, getNextDifficulty, type Difficulty } from "@/lib/difficulties";

export interface DifficultyProgress {
  total: number;
  usedCount: number;
  availableProblems: Problem[];
}

export interface Status {
  total: number;
  usedCount: number;
  byDifficulty: Record<Difficulty, DifficultyProgress>;
  nextDifficulty: Difficulty | null;
}

export interface DrawResult {
  problem: Problem | null;
  quote: Quote;
  status: Status;
}

export async function getStatus(): Promise<Status> {
  const problems = await getAllProblems();
  const byDifficulty = {} as Status["byDifficulty"];
  for (const difficulty of DIFFICULTIES) {
    const matching = problems.filter((problem) => getDifficulty(problem.id) === difficulty);
    byDifficulty[difficulty] = {
      total: matching.length,
      usedCount: matching.filter((problem) => problem.isUsed).length,
      availableProblems: matching.filter((problem) => !problem.isUsed),
    };
  }
  return {
    total: problems.length,
    usedCount: problems.filter((p) => p.isUsed).length,
    byDifficulty,
    nextDifficulty: getNextDifficulty(problems),
  };
}

export async function drawProblem(): Promise<DrawResult> {
  const problem = await selectProblem();
  return {
    problem,
    quote: getRandomQuote(),
    status: await getStatus(),
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
