import fs from "fs/promises";
import path from "path";
import type { Problem } from "./types";

const DATA_PATH = path.join(process.cwd(), "data", "problems.json");

async function readAll(): Promise<Problem[]> {
  const raw = await fs.readFile(DATA_PATH, "utf-8");
  return JSON.parse(raw) as Problem[];
}

async function writeAll(problems: Problem[]): Promise<void> {
  await fs.writeFile(DATA_PATH, JSON.stringify(problems, null, 2), "utf-8");
}

export async function getAllProblems(): Promise<Problem[]> {
  return readAll();
}

export async function getAvailableProblems(): Promise<Problem[]> {
  const problems = await readAll();
  return problems.filter((p) => !p.isUsed);
}

export async function selectProblem(): Promise<Problem | null> {
  const problems = await readAll();
  const available = problems.filter((p) => !p.isUsed);
  if (available.length === 0) return null;

  const picked = available[Math.floor(Math.random() * available.length)];
  const updated = problems.map((p) =>
    p.id === picked.id ? { ...p, isUsed: true } : p
  );
  await writeAll(updated);
  return picked;
}

export async function resetAllProblems(): Promise<void> {
  const problems = await readAll();
  const reset = problems.map((p) => ({ ...p, isUsed: false }));
  await writeAll(reset);
}
