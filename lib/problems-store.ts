import { isFirebaseConfigured } from "./firebase";
import * as local from "./problems-local";
import * as firestore from "./problems-firestore";
import type { Problem } from "./types";

const impl = isFirebaseConfigured ? firestore : local;

export async function getAllProblems(): Promise<Problem[]> {
  return impl.getAllProblems();
}

export async function getAvailableProblems(): Promise<Problem[]> {
  return impl.getAvailableProblems();
}

export async function selectProblem(): Promise<Problem | null> {
  return impl.selectProblem();
}

export async function resetAllProblems(): Promise<void> {
  return impl.resetAllProblems();
}
