"use client";

import { useEffect, useState, useRef } from "react";
import { useBfaStore } from "@/store/bfaStore";
import { Card, PrimaryButton } from "@/components/ui";
import { construirUrlImagen, finalizarTest } from "@/services/api";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/cn";

const OPTIONS = ["A", "B", "C", "D", "E", "OMITIDA"];

export function SectionTestView() {
  const activeTest = useBfaStore((state) => state.activeTest);
  const idIntento = useBfaStore((state) => state.idIntento);
  const answers = useBfaStore((state) => state.answers);
  const saveAnswer = useBfaStore((state) => state.saveAnswer);
  const timeRemainingSeconds = useBfaStore((state) => state.timeRemainingSeconds);
  const getPayloadToSubmit = useBfaStore((state) => state.getPayloadToSubmit);
  const completeTest = useBfaStore((state) => state.completeTest);
  const isTimerRunning = useBfaStore((state) => state.isTimerRunning);
  const setTimeRemainingSeconds = useBfaStore((state) => state.setTimeRemainingSeconds);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const hasSubmittedRef = useRef(false);

  // Timer logic
  useEffect(() => {
    if (!isTimerRunning || timeRemainingSeconds <= 0 || hasSubmittedRef.current) return;
    
    const interval = setInterval(() => {
      setTimeRemainingSeconds(timeRemainingSeconds - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [isTimerRunning, timeRemainingSeconds, setTimeRemainingSeconds]);

  // Auto-submit when time is up
  useEffect(() => {
    if (timeRemainingSeconds === 0 && isTimerRunning && !hasSubmittedRef.current) {
      handleSubmit();
    }
  }, [timeRemainingSeconds, isTimerRunning]);

  const handleSubmit = async () => {
    if (hasSubmittedRef.current || !idIntento) return;
    hasSubmittedRef.current = true;
    setIsSubmitting(true);

    try {
      const payload = getPayloadToSubmit();
      await finalizarTest(
        idIntento, 
        payload.respuestas, 
        payload.minutosConsumidos, 
        payload.segundosConsumidos
      );
      completeTest();
    } catch (err) {
      console.error("Error al finalizar el test", err);
      // Incluso con error terminamos la prueba para que no se quede bloqueado
      completeTest();
    }
  };

  if (!activeTest) return null;

  const formatTime = (totalSeconds: number) => {
    const m = Math.floor(totalSeconds / 60);
    const s = totalSeconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-24 pt-16 dark:bg-transparent">
      {/* Sticky Header */}
      <div className="fixed inset-x-0 top-0 z-50 border-b border-slate-200 bg-white/80 px-6 py-4 backdrop-blur-md dark:border-white/10 dark:bg-obsidian-900/80">
        <div className="mx-auto flex max-w-4xl items-center justify-between">
          <div>
            <h2 className="font-bold text-slate-900 dark:text-silver-50">
              {activeTest.codigoTest}
            </h2>
            <p className="text-sm text-slate-500 dark:text-silver-400">
              Contesta todas las preguntas posibles
            </p>
          </div>
          <div className={cn(
            "rounded-full px-5 py-2 font-mono text-2xl font-bold border shadow-sm transition-colors",
            timeRemainingSeconds <= 60 
            ? "border-red-200 bg-red-50 text-red-600 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-400 animate-pulse" 
            : "border-slate-200 bg-white text-slate-900 dark:border-white/10 dark:bg-obsidian-800 dark:text-silver-50"
          )}>
            {formatTime(timeRemainingSeconds)}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-3xl space-y-8 px-6 pt-12">
        {activeTest.instrucciones && (
          <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-slate-900/5 dark:bg-obsidian-800 dark:ring-white/10">
            <h3 className="mb-2 font-semibold text-slate-900 dark:text-silver-100">Instrucciones del examen</h3>
            <p 
              className="whitespace-pre-line text-base leading-7 text-slate-600 dark:text-silver-300"
              dangerouslySetInnerHTML={{ __html: activeTest.instrucciones }}
            />
          </div>
        )}
        {activeTest.ejercicios.map((ej) => {
          const selectedOption = answers[ej.numeroEjercicio];
          const hasAnswered = !!selectedOption;

          return (
            <Card key={ej.numeroEjercicio} id={`question-${ej.numeroEjercicio}`} className={cn(
              "overflow-hidden transition-all duration-300 border-2",
              hasAnswered 
                ? "border-gold-300 dark:border-gold-900/50 shadow-md bg-white dark:bg-obsidian-800" 
                : "border-transparent shadow-sm bg-white dark:bg-obsidian-800/80 hover:shadow-md"
            )}>
              <div className="bg-slate-50 dark:bg-obsidian-900/50 px-6 py-4 flex items-center gap-4 border-b border-slate-100 dark:border-white/5">
                 <div className={cn(
                   "flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold shadow-sm ring-1 ring-inset",
                   hasAnswered 
                    ? "bg-gold-500 text-white ring-transparent" 
                    : "bg-white text-slate-500 ring-slate-900/10 dark:bg-obsidian-800 dark:text-silver-400 dark:ring-white/10"
                 )}>
                   {ej.numeroEjercicio}
                 </div>
                 <h3 className="font-semibold text-slate-800 dark:text-silver-200">Ejercicio {ej.numeroEjercicio}</h3>
                 {hasAnswered && (
                   <span className="ml-auto text-xs font-semibold text-gold-600 dark:text-gold-400 bg-gold-50 dark:bg-gold-500/10 px-3 py-1 rounded-full ring-1 ring-inset ring-gold-500/20">
                     Completado
                   </span>
                 )}
              </div>
              
              <div className="p-8 flex flex-col items-center gap-8">
                {ej.imagenUrl && (
                  <div className="relative w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-900/5 dark:bg-obsidian-950 p-2">
                    <img
                      src={construirUrlImagen(ej.imagenUrl)}
                      alt={`Ejercicio ${ej.numeroEjercicio}`}
                      className="object-contain w-full h-auto rounded-xl"
                      loading="lazy"
                    />
                  </div>
                )}

                {/* Options Row */}
                <div className="flex flex-wrap justify-center gap-3 sm:gap-6 w-full mt-4">
                  {OPTIONS.map((opt) => {
                    const isSelected = selectedOption === opt;
                    return (
                      <button
                        key={opt}
                        onClick={() => saveAnswer(ej.numeroEjercicio, opt)}
                        disabled={isSubmitting}
                        className={cn(
                          "relative flex h-14 min-w-[3.5rem] items-center justify-center rounded-2xl px-3 text-lg sm:text-xl font-bold shadow-sm ring-1 ring-inset transition-all active:scale-95 disabled:opacity-50",
                          isSelected
                            ? "bg-gold-500 text-slate-900 ring-gold-500 shadow-gold-500/20 hover:bg-gold-600 scale-110"
                            : "bg-white text-slate-600 ring-slate-200 hover:bg-slate-50 hover:ring-slate-300 dark:bg-obsidian-800 dark:text-silver-300 dark:ring-white/10 dark:hover:bg-obsidian-700 dark:hover:ring-white/20"
                        )}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>
              </div>
            </Card>
          );
        })}

        <div className="mt-16 flex justify-center pb-12">
          <PrimaryButton
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="w-full max-w-sm py-4 text-lg sm:text-xl font-semibold shadow-xl shadow-gold-500/20"
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="h-6 w-6 animate-spin" /> Guardando resultados...
              </span>
            ) : (
              "Finalizar Evaluación"
            )}
          </PrimaryButton>
        </div>
      </div>
    </div>
  );
}
