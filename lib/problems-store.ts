import { isFirebaseConfigured } from "./firebase";
import * as local from "./problems-local";
import * as firestore from "./problems-firestore";
import type { Problem } from "./types";
import type { Difficulty } from "./difficulties";

const impl = isFirebaseConfigured ? firestore : local;

export async function getAllProblems(): Promise<Problem[]> {
  return impl.getAllProblems();
}

export async function getAvailableProblems(difficulty: Difficulty): Promise<Problem[]> {
  return impl.getAvailableProblems(difficulty);
}

export async function selectProblem(): Promise<Problem | null> {
  return impl.selectProblem();
}

export async function resetAllProblems(): Promise<void> {
  return impl.resetAllProblems();
}
