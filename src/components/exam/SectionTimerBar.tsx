"use client";

import { BFA_SECTIONS_CONFIG } from "@/config/bfaSectionConfig";
import { useBfaSectionTransition } from "@/hooks/useBfaSectionTransition";
import { Timer } from "@/components/ui/Timer";

type SectionTimerBarProps = {
  questionIds: string[];
};

export function SectionTimerBar({ questionIds }: SectionTimerBarProps) {
  const {
    currentSection,
    currentSectionIndex,
    handleSectionExpire,
    isTestActive,
    isTimerRunning,
    setTimeRemainingSeconds,
  } = useBfaSectionTransition(questionIds);

  if (!isTestActive || !currentSection) {
    return null;
  }

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.28em] text-gold-300">
          Bloque {currentSectionIndex + 1} de {BFA_SECTIONS_CONFIG.length}
        </p>
        <p className="mt-1 text-xs text-slate-500 dark:text-silver-500">
          Avance automatico al llegar a 00:00. Sin retroceso ni avance manual.
        </p>
      </div>
      <Timer
        sectionKey={currentSection.id}
        minutes={currentSection.timeLimitMinutes}
        isRunning={isTimerRunning}
        onExpire={handleSectionExpire}
        onTick={setTimeRemainingSeconds}
      />
    </div>
  );
}
