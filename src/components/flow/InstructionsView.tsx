"use client";

import { useEffect } from "react";
import { AlertTriangle, Clock3, Lock } from "lucide-react";
import {
  BFA_SECTIONS_CONFIG,
  TOTAL_EXAM_MINUTES,
} from "@/config/bfaSectionConfig";
import { getTestSectionById } from "@/data/bfaTest";
import { useBfaStore } from "@/store/bfaStore";
import { DarkCard, PrimaryButton } from "@/components/ui";

export function InstructionsView() {
  const currentSectionConfig = useBfaStore((state) =>
    state.getCurrentSectionConfig(),
  );
  const currentSectionIndex = useBfaStore((state) => state.currentSectionIndex);
  const fluencyVerbalLetter = useBfaStore((state) => state.fluencyVerbalLetter);
  const ensureFluencyLetterForCurrentSection = useBfaStore(
    (state) => state.ensureFluencyLetterForCurrentSection,
  );
  const startCurrentSection = useBfaStore((state) => state.startCurrentSection);

  useEffect(() => {
    ensureFluencyLetterForCurrentSection();
  }, [ensureFluencyLetterForCurrentSection, currentSectionIndex]);

  if (!currentSectionConfig) {
    return null;
  }

  const testSection = getTestSectionById(currentSectionConfig.id);
  const instructions =
    testSection?.instructions ??
    "Lea atentamente las instrucciones antes de iniciar este bloque.";

  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-10">
      <DarkCard className="w-full max-w-4xl">
        <p className="text-sm font-semibold uppercase tracking-[0.32em] text-gold-300">
          Instrucciones · Bloque {currentSectionIndex + 1} de{" "}
          {BFA_SECTIONS_CONFIG.length}
        </p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight text-slate-900 transition-colors duration-300 ease-in-out dark:text-silver-50">
          {currentSectionConfig.title}
        </h1>
        <p className="mt-4 max-w-3xl text-base leading-7 text-slate-600 transition-colors duration-300 ease-in-out dark:text-silver-300">
          {instructions}
        </p>

        {currentSectionConfig.id === "FV" && fluencyVerbalLetter ? (
          <div className="mt-6 rounded-2xl border border-gold-300/25 bg-gold-300/10 px-6 py-5 text-center">
            <p className="text-sm uppercase tracking-[0.24em] text-slate-500 dark:text-silver-400">
              Letra asignada para Fluidez Verbal
            </p>
            <p className="mt-2 font-mono text-5xl font-semibold text-gold-300">
              {fluencyVerbalLetter}
            </p>
          </div>
        ) : null}

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 transition-colors duration-300 ease-in-out dark:border-silver-400/10 dark:bg-charcoal-900/70">
            <Clock3 className="h-6 w-6 text-gold-300" aria-hidden="true" />
            <h2 className="mt-4 font-semibold text-slate-900 dark:text-silver-50">Tiempo estricto</h2>
            <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-silver-400">
              Este bloque: {currentSectionConfig.timeLimitMinutes} min. Total del
              examen: {TOTAL_EXAM_MINUTES} min.
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 transition-colors duration-300 ease-in-out dark:border-silver-400/10 dark:bg-charcoal-900/70">
            <Lock className="h-6 w-6 text-gold-300" aria-hidden="true" />
            <h2 className="mt-4 font-semibold text-slate-900 dark:text-silver-50">Sin retroceso</h2>
            <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-silver-400">
              No podra volver a bloques anteriores ni avanzar manualmente.
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 transition-colors duration-300 ease-in-out dark:border-silver-400/10 dark:bg-charcoal-900/70">
            <AlertTriangle className="h-6 w-6 text-gold-300" aria-hidden="true" />
            <h2 className="mt-4 font-semibold text-slate-900 dark:text-silver-50">Omisiones</h2>
            <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-silver-400">
              Al agotarse el tiempo, las preguntas sin respuesta se registran como
              NO_CONTESTADA.
            </p>
          </div>
        </div>

        <div className="mt-8 flex justify-end">
          <PrimaryButton onClick={startCurrentSection}>Comenzar bloque</PrimaryButton>
        </div>
      </DarkCard>
    </main>
  );
}
