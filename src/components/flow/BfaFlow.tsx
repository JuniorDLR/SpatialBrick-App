"use client";

import { SectionTestView } from "@/components/exam/SectionTestView";
import { useBfaStore } from "@/store/bfaStore";
import { InstructionsView } from "./InstructionsView";
import { ThankYouView } from "./ThankYouView";
import { WelcomeForm } from "./WelcomeForm";

export function BfaFlow() {
  const phase = useBfaStore((state) => state.phase);

  switch (phase) {
    case "welcome":
      return <WelcomeForm />;
    case "instructions":
      return <InstructionsView />;
    case "test":
      return <SectionTestView />;
    case "completed":
      return <ThankYouView />;
    default:
      return <WelcomeForm />;
  }
}
