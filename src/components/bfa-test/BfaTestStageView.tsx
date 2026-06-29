"use client";

import { bfaData } from "@/data/bfa-data";
import { DarkCard } from "@/components/ui";
import { useBfaTestStore } from "@/store/bfa-test-store";
import { BfaSectionQuestions } from "./BfaSectionQuestions";
import { BfaSectionTransitionGuard } from "./BfaSectionTransitionGuard";

export function BfaTestStageView() {
  const currentSectionIndex = useBfaTestStore((state) => state.currentSectionIndex);
  const assignedFvLetter = useBfaTestStore((state) => state.assignedFvLetter);

  const section = bfaData.sections[currentSectionIndex];

  if (!section) {
    return null;
  }

  return (
    <BfaSectionTransitionGuard>
      <main className="px-6 py-8">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
          <DarkCard>
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-gold-300">
              {section.factor}
            </p>
            <h1 className="mt-3 text-3xl font-semibold text-slate-900 transition-colors duration-300 ease-in-out dark:text-silver-50">
              {section.title}
            </h1>
            <p className="mt-3 text-sm leading-7 text-slate-600 transition-colors duration-300 ease-in-out dark:text-silver-300">
              {section.instructions}
            </p>

            {section.id === "FV" && assignedFvLetter ? (
              <p className="mt-4 rounded-2xl border border-gold-300/25 bg-gold-300/10 px-4 py-3 text-center font-mono text-3xl font-semibold text-gold-300">
                Letra asignada: {assignedFvLetter}
              </p>
            ) : null}
          </DarkCard>

          <BfaSectionQuestions />
        </div>
      </main>
    </BfaSectionTransitionGuard>
  );
}

