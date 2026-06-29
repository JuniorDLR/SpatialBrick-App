"use client";

import { useEffect, useRef } from "react";
import { bfaData } from "@/data/bfa-data";
import { useBfaTestStore } from "@/store/bfa-test-store";
import { BfaTestTimer } from "./BfaTestTimer";

type BfaSectionTransitionGuardProps = {
  children: React.ReactNode;
};

/**
 * Guardia modular del motor:
 * - Renderiza cronometro sincronizado con Zustand independiente.
 * - Evita que se quede bloqueado en secciones sin preguntas.
 */
export function BfaSectionTransitionGuard({
  children,
}: BfaSectionTransitionGuardProps) {
  const phase = useBfaTestStore((state) => state.phase);
  const currentSectionIndex = useBfaTestStore((state) => state.currentSectionIndex);
  const expireCurrentSection = useBfaTestStore(
    (state) => state.expireCurrentSection,
  );

  const currentSection = bfaData.sections[currentSectionIndex];
  const autoSkippedSectionRef = useRef<string | null>(null);

  useEffect(() => {
    autoSkippedSectionRef.current = null;
  }, [currentSection?.id]);

  useEffect(() => {
    if (phase !== "TEST" || !currentSection) {
      return;
    }

    if (currentSection.questions.length > 0) {
      return;
    }

    if (autoSkippedSectionRef.current === currentSection.id) {
      return;
    }

    autoSkippedSectionRef.current = currentSection.id;
    expireCurrentSection();
  }, [currentSection, expireCurrentSection, phase]);

  return (
    <div className="flex min-h-screen flex-col">
      {phase === "TEST" ? (
        <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 px-6 py-4 backdrop-blur transition-colors duration-300 ease-in-out dark:border-silver-400/10 dark:bg-obsidian-950/95">
          <div className="mx-auto flex w-full max-w-6xl items-center justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.28em] text-gold-300">
                Bloque {currentSectionIndex + 1} de {bfaData.sections.length}
              </p>
              <p className="mt-1 text-xs text-slate-500 dark:text-silver-500">
                Transicion forzada al llegar a 00:00. Sin retroceso manual.
              </p>
            </div>
            <BfaTestTimer />
          </div>
        </header>
      ) : null}
      {children}
    </div>
  );
}

