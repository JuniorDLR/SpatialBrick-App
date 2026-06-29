"use client";

import { useEffect } from "react";
import { getQuestionIdsForSection } from "@/data/bfaTest";
import { useBfaStore } from "@/store/bfaStore";
import { SectionTimerBar } from "./SectionTimerBar";

type SectionTransitionControllerProps = {
  children: React.ReactNode;
};

/**
 * Orquesta la transicion forzada entre bloques:
 * - Solo corre el timer en fase `test`.
 * - Al expirar, delega en el store (omisiones + siguiente instrucciones).
 */
export function SectionTransitionController({
  children,
}: SectionTransitionControllerProps) {
  const phase = useBfaStore((state) => state.phase);
  const currentSection = useBfaStore((state) => state.getCurrentSectionConfig());

  useEffect(() => {
    if (phase !== "test" || !currentSection) {
      return;
    }

    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = "";
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [currentSection, phase]);

  const questionIds = currentSection
    ? getQuestionIdsForSection(currentSection.id)
    : [];

  return (
    <div className="flex min-h-screen flex-col">
      {phase === "test" ? (
        <div className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 px-6 py-4 backdrop-blur transition-colors duration-300 ease-in-out dark:border-silver-400/10 dark:bg-obsidian-950/95">
          <SectionTimerBar questionIds={questionIds} />
        </div>
      ) : null}
      {children}
    </div>
  );
}
