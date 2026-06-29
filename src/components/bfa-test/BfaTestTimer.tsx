"use client";

import { useEffect, useMemo, useRef } from "react";
import { Clock3 } from "lucide-react";
import { bfaData } from "@/data/bfa-data";
import { cn } from "@/lib/cn";
import { useBfaTestStore } from "@/store/bfa-test-store";

const formatTime = (totalSeconds: number) => {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
};

/**
 * Cronometro sincronizado con el store independiente del test BFA.
 * No expone navegacion manual; al llegar a 0 fuerza `expireCurrentSection`.
 */
export function BfaTestTimer({ className }: { className?: string }) {
  const phase = useBfaTestStore((state) => state.phase);
  const isTimerRunning = useBfaTestStore((state) => state.isTimerRunning);
  const currentSectionIndex = useBfaTestStore((state) => state.currentSectionIndex);
  const timeRemainingSeconds = useBfaTestStore(
    (state) => state.timeRemainingSeconds,
  );
  const tick = useBfaTestStore((state) => state.tick);
  const expireCurrentSection = useBfaTestStore(
    (state) => state.expireCurrentSection,
  );

  const currentSection = bfaData.sections[currentSectionIndex];
  const expiredSectionRef = useRef<string | null>(null);

  useEffect(() => {
    expiredSectionRef.current = null;
  }, [currentSection?.id]);

  useEffect(() => {
    if (phase !== "TEST" || !isTimerRunning || !currentSection) {
      return;
    }

    if (timeRemainingSeconds <= 0) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      tick(timeRemainingSeconds - 1);
    }, 1000);

    return () => window.clearTimeout(timeoutId);
  }, [
    currentSection,
    isTimerRunning,
    phase,
    tick,
    timeRemainingSeconds,
  ]);

  useEffect(() => {
    if (phase !== "TEST" || !currentSection) {
      return;
    }

    if (timeRemainingSeconds > 0) {
      return;
    }

    if (expiredSectionRef.current === currentSection.id) {
      return;
    }

    expiredSectionRef.current = currentSection.id;
    expireCurrentSection();
  }, [currentSection, expireCurrentSection, phase, timeRemainingSeconds]);

  const isCritical = useMemo(() => timeRemainingSeconds <= 60, [timeRemainingSeconds]);

  if (phase !== "TEST" || !currentSection) {
    return null;
  }

  return (
    <div
      aria-live="polite"
      role="timer"
      className={cn(
        "inline-flex items-center gap-3 rounded-2xl border border-brand-accent/25 bg-white px-4 py-3 text-brand-accent shadow-sm transition-colors duration-300 ease-in-out dark:border-gold-300/25 dark:bg-charcoal-900/95 dark:text-gold-300 dark:shadow-gold-soft",
        isCritical && "animate-pulse border-red-400/55 text-red-600 dark:border-red-300/55 dark:text-red-200",
        className,
      )}
    >
      <Clock3 className="h-5 w-5 shrink-0" aria-hidden="true" />
      <div className="flex flex-col leading-tight">
        <span className="text-[10px] uppercase tracking-[0.24em] text-slate-500 dark:text-silver-500">
          Tiempo restante
        </span>
        <span className="font-mono text-xl font-semibold tracking-[0.18em]">
          {formatTime(timeRemainingSeconds)}
        </span>
      </div>
      <span className="sr-only">
        Tiempo restante para {currentSection.title}:{" "}
        {formatTime(timeRemainingSeconds)}
      </span>
    </div>
  );
}

