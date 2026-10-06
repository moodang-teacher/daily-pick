"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { DRAW_ORDER, PROBLEM_IDS_BY_DIFFICULTY, type Difficulty } from "@/lib/difficulties";

interface CatalogProblem {
  id: number;
  title: string;
  imagePath: string;
}

export default function DifficultyCatalog({ problems }: { problems: CatalogProblem[] }) {
  const [active, setActive] = useState<Difficulty>("하");
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const items = problems
    .filter((problem) => PROBLEM_IDS_BY_DIFFICULTY[active].includes(problem.id))
    .sort((a, b) => a.id - b.id);

  function handleTabKeyDown(event: React.KeyboardEvent<HTMLButtonElement>, index: number) {
    let nextIndex: number;
    if (event.key === "ArrowRight") nextIndex = (index + 1) % DRAW_ORDER.length;
    else if (event.key === "ArrowLeft") nextIndex = (index - 1 + DRAW_ORDER.length) % DRAW_ORDER.length;
    else if (event.key === "Home") nextIndex = 0;
    else if (event.key === "End") nextIndex = DRAW_ORDER.length - 1;
    else return;
    event.preventDefault();
    setActive(DRAW_ORDER[nextIndex]);
    tabRefs.current[nextIndex]?.focus();
  }

  return (
    <div>
      <div role="tablist" aria-label="문제 난이도" className="grid grid-cols-4 gap-2 border-b border-neutral-200 pb-3 dark:border-neutral-800">
        {DRAW_ORDER.map((difficulty, index) => (
          <button
            key={difficulty}
            ref={(element) => { tabRefs.current[index] = element; }}
            id={`tab-${difficulty}`}
            role="tab"
            type="button"
            tabIndex={active === difficulty ? 0 : -1}
            aria-selected={active === difficulty}
            aria-controls="difficulty-panel"
            onClick={() => setActive(difficulty)}
            onKeyDown={(event) => handleTabKeyDown(event, index)}
            className={`rounded-xl px-3 py-3 text-sm font-bold transition focus-visible:outline-2 focus-visible:outline-orange-500 ${
              active === difficulty
                ? "bg-orange-500 text-white"
                : "bg-neutral-100 text-neutral-700 hover:bg-orange-100 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800"
            }`}
          >
            {difficulty} <span className="font-normal opacity-75">{PROBLEM_IDS_BY_DIFFICULTY[difficulty].length}</span>
          </button>
        ))}
      </div>

      <section id="difficulty-panel" role="tabpanel" aria-labelledby={`tab-${active}`} className="pt-6">
        <h2 className="mb-5 text-xl font-bold text-neutral-900 dark:text-neutral-100">
          {active} 난이도 <span className="text-orange-500">{items.length}문제</span>
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {items.map((problem) => (
            <article key={problem.id} className="flex items-center gap-4 rounded-2xl border border-neutral-200 bg-white p-3 dark:border-neutral-800 dark:bg-neutral-900">
              <Image
                src={problem.imagePath}
                alt={problem.title}
                width={96}
                height={120}
                className="h-28 w-20 shrink-0 rounded-lg object-cover"
              />
              <div>
                <p className="text-xs font-bold text-orange-500">문제 {String(problem.id).padStart(2, "0")}</p>
                <h3 className="mt-1 font-semibold text-neutral-800 dark:text-neutral-100">{problem.title}</h3>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
