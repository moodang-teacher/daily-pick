export const DIFFICULTIES = ["상", "중상", "중", "하"] as const;

export const DRAW_ORDER = ["하", "중", "중상", "상"] as const;

export type Difficulty = (typeof DIFFICULTIES)[number];

export const PROBLEM_IDS_BY_DIFFICULTY: Record<Difficulty, readonly number[]> = {
  상: [6, 12, 16, 19],
  중상: [10, 11, 17, 21, 29],
  중: [1, 3, 4, 7, 8, 13, 18, 23, 24, 25, 26, 27, 28, 30],
  하: [2, 5, 9, 14, 15, 20, 22],
};

const difficultyById = new Map<number, Difficulty>(
  DIFFICULTIES.flatMap((difficulty) =>
    PROBLEM_IDS_BY_DIFFICULTY[difficulty].map((id) => [id, difficulty] as const)
  )
);

export function getDifficulty(id: number): Difficulty | undefined {
  return difficultyById.get(id);
}

export function getNextDifficulty(
  problems: readonly { id: number; isUsed: boolean }[]
): Difficulty | null {
  const totals = Object.fromEntries(
    DRAW_ORDER.map((difficulty) => [
      difficulty,
      problems.filter((problem) => getDifficulty(problem.id) === difficulty).length,
    ])
  ) as Record<Difficulty, number>;
  const simulated = Object.fromEntries(
    DRAW_ORDER.map((difficulty) => [difficulty, 0])
  ) as Record<Difficulty, number>;
  let cursor = 0;

  for (let draw = 0; draw < problems.filter((problem) => problem.isUsed).length; draw++) {
    let skipped = 0;
    while (simulated[DRAW_ORDER[cursor]] >= totals[DRAW_ORDER[cursor]]) {
      cursor = (cursor + 1) % DRAW_ORDER.length;
      skipped++;
      if (skipped === DRAW_ORDER.length) return null;
    }
    simulated[DRAW_ORDER[cursor]]++;
    cursor = (cursor + 1) % DRAW_ORDER.length;
  }

  for (let offset = 0; offset < DRAW_ORDER.length; offset++) {
    const difficulty = DRAW_ORDER[(cursor + offset) % DRAW_ORDER.length];
    if (problems.some((problem) => !problem.isUsed && getDifficulty(problem.id) === difficulty)) {
      return difficulty;
    }
  }
  return null;
}
