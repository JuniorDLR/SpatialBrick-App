"use client";

import { useBfaTestStore } from "@/store/bfa-test-store";
import { BfaFinishedView } from "./BfaFinishedView";
import { BfaInstructionsView } from "./BfaInstructionsView";
import { BfaIntroView } from "./BfaIntroView";
import { BfaTestStageView } from "./BfaTestStageView";

export function BfaModularApp() {
  const phase = useBfaTestStore((state) => state.phase);

  switch (phase) {
    case "INTRO":
      return <BfaIntroView />;
    case "INSTRUCTIONS":
      return <BfaInstructionsView />;
    case "TEST":
      return <BfaTestStageView />;
    case "FINISHED":
      return <BfaFinishedView />;
    default:
      return <BfaIntroView />;
  }
}

