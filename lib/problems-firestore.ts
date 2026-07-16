import {
  collection,
  getDocs,
  query,
  where,
  doc,
  updateDoc,
  writeBatch,
} from "firebase/firestore";
import { db } from "./firebase";
import type { Problem } from "./types";

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

export async function getAvailableProblems(): Promise<Problem[]> {
  const q = query(
    collection(requireDb(), COLLECTION),
    where("isUsed", "==", false)
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => d.data() as Problem);
}

export async function selectProblem(): Promise<Problem | null> {
  const available = await getAvailableProblems();
  if (available.length === 0) return null;

  const picked = available[Math.floor(Math.random() * available.length)];
  await updateDoc(doc(requireDb(), COLLECTION, String(picked.id)), {
    isUsed: true,
  });
  return picked;
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
