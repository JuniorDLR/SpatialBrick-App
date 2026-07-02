"use client";

import { AlertTriangle, Clock3, Lock } from "lucide-react";
import { useBfaStore } from "@/store/bfaStore";
import { Card, PrimaryButton } from "@/components/ui";

export function InstructionsView() {
  const activeTest = useBfaStore((state) => state.activeTest);
  const startTest = useBfaStore((state) => state.startTest);

  if (!activeTest) {
    return null;
  }

  const totalSegundos = activeTest.tiempoLimiteSegundos;
  const minutos = Math.floor(totalSegundos / 60);
  const segundos = totalSegundos % 60;
  
  let textoTiempo = "";
  if (minutos > 0) {
    textoTiempo += `${minutos} minuto${minutos !== 1 ? 's' : ''}`;
  }
  if (segundos > 0) {
    if (textoTiempo) textoTiempo += " y ";
    textoTiempo += `${segundos} segundo${segundos !== 1 ? 's' : ''}`;
  }
  if (!textoTiempo) textoTiempo = "0 segundos";

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-6 py-10 dark:bg-obsidian-900">
      <Card variant="elevated" className="w-full max-w-4xl p-8 lg:p-12">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gold-500 dark:text-gold-400">
          Evaluación Psicométrica
        </p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight text-slate-900 dark:text-silver-50">
          {activeTest.codigoTest || "Batería Factorial de Aptitudes"}
        </h1>
        
        {activeTest.instrucciones && (
          <div className="mt-8 rounded-xl bg-slate-100/50 p-6 shadow-inner ring-1 ring-slate-900/5 dark:bg-obsidian-950/50 dark:ring-white/5">
            <h3 className="mb-3 font-semibold text-slate-900 dark:text-silver-100">Instrucciones del examen:</h3>
            <p 
              className="whitespace-pre-line text-base leading-relaxed text-slate-700 dark:text-silver-300"
              dangerouslySetInnerHTML={{ __html: activeTest.instrucciones }}
            />
          </div>
        )}
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-obsidian-800">
            <Clock3 className="h-6 w-6 text-gold-500" aria-hidden="true" />
            <h2 className="mt-4 font-semibold text-slate-900 dark:text-silver-50">Tiempo estricto</h2>
            <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-silver-400">
              Contarás con un máximo de {textoTiempo} para resolver los {activeTest.ejercicios.length} ejercicios.
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-obsidian-800">
            <Lock className="h-6 w-6 text-gold-500" aria-hidden="true" />
            <h2 className="mt-4 font-semibold text-slate-900 dark:text-silver-50">Bloqueo automático</h2>
            <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-silver-400">
              El examen se enviará automáticamente una vez que el tiempo llegue a cero.
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-obsidian-800">
            <AlertTriangle className="h-6 w-6 text-gold-500" aria-hidden="true" />
            <h2 className="mt-4 font-semibold text-slate-900 dark:text-silver-50">Omisiones</h2>
            <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-silver-400">
              Cualquier pregunta sin responder al finalizar el tiempo contará como incorrecta/omitida.
            </p>
          </div>
        </div>

        <div className="mt-10 flex justify-end">
          <PrimaryButton onClick={startTest} className="px-8 py-3 text-lg">
            Comenzar Evaluación
          </PrimaryButton>
        </div>
      </Card>
    </main>
  );
}
