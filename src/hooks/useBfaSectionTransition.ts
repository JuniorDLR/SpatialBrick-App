"use client";

import { useCallback } from "react";
import { useBfaStore } from "@/store/bfaStore";

export function useBfaSectionTransition(questionIds: string[]) {
  const phase = useBfaStore((state) => state.phase);
  const isTimerRunning = useBfaStore((state) => state.isTimerRunning);
  const timeRemainingSeconds = useBfaStore((state) => state.timeRemainingSeconds);
  const currentSectionIndex = useBfaStore((state) => state.currentSectionIndex);
  const expireCurrentSection = useBfaStore((state) => state.expireCurrentSection);
  const setTimeRemainingSeconds = useBfaStore(
    (state) => state.setTimeRemainingSeconds,
  );
  const getCurrentSectionConfig = useBfaStore(
    (state) => state.getCurrentSectionConfig,
  );

  const currentSection = getCurrentSectionConfig();

  const handleSectionExpire = useCallback(() => {
    if (phase !== "test") {
      return;
    }

    expireCurrentSection(questionIds);
  }, [expireCurrentSection, phase, questionIds]);

  return {
    phase,
    isTimerRunning,
    timeRemainingSeconds,
    currentSectionIndex,
    currentSection,
    handleSectionExpire,
    setTimeRemainingSeconds,
    isTestActive: phase === "test" && Boolean(currentSection),
  };
}
