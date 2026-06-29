"use client";

import { useEffect, useRef } from "react";
import { DarkCard, FeedbackPanel } from "@/components/ui";
import { useTestStore } from "@/store/useTestStore";
import { SpatialExerciseRenderer } from "./SpatialExerciseRenderer";

const formatSeconds = (total: number) => {
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
};

export function SpatialTestRunner() {
  const phase = useTestStore((state) => state.phase);
  const ejercicios = useTestStore((state) => state.ejercicios);
  const respuestas = useTestStore((state) => state.respuestas);
  const currentExerciseIndex = useTestStore((state) => state.currentExerciseIndex);
  const timeRemainingSeconds = useTestStore((state) => state.timeRemainingSeconds);
  const tick = useTestStore((state) => state.tick);
  const finalizarPorTiempo = useTestStore((state) => state.finalizarPorTiempo);
  const finalizarManualSeguro = useTestStore((state) => state.finalizarManualSeguro);

  const finishedByTimeRef = useRef(false);
  const completedAnswersRef = useRef(false);

  useEffect(() => {
    finishedByTimeRef.current = false;
    completedAnswersRef.current = false;
  }, [phase]);

  useEffect(() => {
    if (phase !== "running" || timeRemainingSeconds <= 0) return;

    const id = window.setTimeout(() => {
      tick(timeRemainingSeconds - 1);
    }, 1000);
    return () => window.clearTimeout(id);
  }, [phase, tick, timeRemainingSeconds]);

  useEffect(() => {
    if (phase !== "running") return;
    if (timeRemainingSeconds > 0) return;
    if (finishedByTimeRef.current) return;

    finishedByTimeRef.current = true;
    void finalizarPorTiempo();
  }, [finalizarPorTiempo, phase, timeRemainingSeconds]);

  useEffect(() => {
    if (phase !== "running" || ejercicios.length === 0) return;
    if (completedAnswersRef.current) return;

    const allAnswered = ejercicios.every(
      (e) => Boolean(respuestas[e.numeroEjercicio]),
    );

    if (!allAnswered) return;
    completedAnswersRef.current = true;
    void finalizarManualSeguro();
  }, [ejercicios, finalizarManualSeguro, phase, respuestas]);

  const isCritical = timeRemainingSeconds <= 60;

  return (
    <main className="px-6 py-8">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
        <DarkCard className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.22em] text-gold-300">
              Ejecucion del Test
            </p>
            <p className="mt-2 text-sm text-slate-600 transition-colors duration-300 ease-in-out dark:text-silver-300">
              Ejercicio {Math.min(currentExerciseIndex + 1, ejercicios.length)} de{" "}
              {ejercicios.length}
            </p>
          </div>
          <div
            className={`rounded-xl border px-4 py-3 font-mono text-xl ${
              isCritical
                ? "animate-pulse border-red-400/60 text-red-600 dark:border-red-300/60 dark:text-red-200"
                : "border-gold-300/25 text-gold-300"
            }`}
          >
            {formatSeconds(timeRemainingSeconds)}
          </div>
        </DarkCard>

        {phase === "submitting" ? (
          <FeedbackPanel
            title="Enviando respuestas"
            message="El intento esta cerrando y se estan consolidando las respuestas pendientes."
            tone="loading"
          />
        ) : null}

        <SpatialExerciseRenderer />
      </div>
    </main>
  );
}

