"use client";

import { useTestStore } from "@/store/useTestStore";
import { SpatialFinishedView } from "./SpatialFinishedView";
import { SpatialInstructions } from "./SpatialInstructions";
import { SpatialTestRunner } from "./SpatialTestRunner";
import { SpatialWelcomeForm } from "./SpatialWelcomeForm";

export function SpatialTestApp() {
  const phase = useTestStore((state) => state.phase);

  if (phase === "welcome" || phase === "loading" || phase === "error") {
    return <SpatialWelcomeForm />;
  }

  if (phase === "instructions") {
    return <SpatialInstructions />;
  }

  if (phase === "running" || phase === "submitting") {
    return <SpatialTestRunner />;
  }

  return <SpatialFinishedView />;
}

