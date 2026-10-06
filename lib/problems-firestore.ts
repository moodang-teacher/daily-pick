import {
  collection,
  getDocs,
  query,
  where,
  doc,
  runTransaction,
  writeBatch,
} from "firebase/firestore";
import { db } from "./firebase";
import type { Problem } from "./types";
import { getDifficulty, getNextDifficulty, PROBLEM_IDS_BY_DIFFICULTY, type Difficulty } from "./difficulties";

const COLLECTION = "problems";

function requireDb() {
  if (!db) {
    throw new Error(
      "Firestore가 설정되어 있지 않습니다. NEXT_PUBLIC_FIREBASE_* 환경변수를 확인하세요."
    );
  }
  return db;
}

export async function getAllProblems(): Promise<Problem[]> {
  const snapshot = await getDocs(collection(requireDb(), COLLECTION));
  return snapshot.docs.map((d) => d.data() as Problem);
}

export async function getAvailableProblems(difficulty: Difficulty): Promise<Problem[]> {
  const q = query(
    collection(requireDb(), COLLECTION),
    where("isUsed", "==", false)
  );
  const snapshot = await getDocs(q);
  return snapshot.docs
    .map((d) => d.data() as Problem)
    .filter((problem) => getDifficulty(problem.id) === difficulty);
}

export async function selectProblem(): Promise<Problem | null> {
  const database = requireDb();
  const ids = Object.values(PROBLEM_IDS_BY_DIFFICULTY).flat();
  return runTransaction(database, async (transaction) => {
    const references = ids.map((id) => doc(database, COLLECTION, String(id)));
    const snapshots = await Promise.all(references.map((reference) => transaction.get(reference)));
    const problems = snapshots.filter((snapshot) => snapshot.exists()).map((snapshot) => snapshot.data() as Problem);
    const difficulty = getNextDifficulty(problems);
    if (!difficulty) return null;

    const available = problems.filter((problem) => !problem.isUsed && getDifficulty(problem.id) === difficulty);
    const picked = available[Math.floor(Math.random() * available.length)];
    transaction.update(doc(database, COLLECTION, String(picked.id)), { isUsed: true });
    return picked;
  });
}

export async function resetAllProblems(): Promise<void> {
  const problems = await getAllProblems();
  const batch = writeBatch(requireDb());
  for (const problem of problems) {
    batch.update(doc(requireDb(), COLLECTION, String(problem.id)), {
      isUsed: false,
    });
  }
  await batch.commit();
}
