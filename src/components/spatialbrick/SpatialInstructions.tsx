"use client";

import { useTestStore } from "@/store/useTestStore";
import { DarkCard, PrimaryButton } from "@/components/ui";

export function SpatialInstructions() {
  const estructura = useTestStore((state) => state.estructura);
  const tiempoLimiteSegundos = useTestStore((state) => state.tiempoLimiteSegundos);
  const ejercicios = useTestStore((state) => state.ejercicios);
  const iniciarEjecucion = useTestStore((state) => state.iniciarEjecucion);

  if (!estructura) {
    return null;
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-10">
      <DarkCard className="w-full max-w-4xl">
        <p className="text-sm font-semibold uppercase tracking-[0.32em] text-gold-300">
          Instrucciones del Test
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900 transition-colors duration-300 ease-in-out dark:text-silver-50">
          Preparacion previa
        </h1>
        <p className="mt-4 max-w-3xl text-base leading-7 text-slate-600 transition-colors duration-300 ease-in-out dark:text-silver-300">
          {estructura.instrucciones ??
            "Siga las instrucciones del sistema y responda sin retroceder."}
        </p>

        <div className="mt-6 grid gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600 transition-colors duration-300 ease-in-out dark:border-silver-400/10 dark:bg-charcoal-900/70 dark:text-silver-300">
          <p>
            Tiempo limite global:{" "}
            <span className="font-mono text-gold-300">{tiempoLimiteSegundos}s</span>
          </p>
          <p>
            Ejercicios cargados:{" "}
            <span className="font-mono text-gold-300">{ejercicios.length}</span>
          </p>
          <p className="text-slate-500 dark:text-silver-500">
            El avance es automatico por flujo. Si el tiempo expira, se enviara
            NO_CONTESTADA en los pendientes.
          </p>
        </div>

        <div className="mt-8 flex justify-end">
          <PrimaryButton type="button" onClick={iniciarEjecucion}>
            Comenzar
          </PrimaryButton>
        </div>
      </DarkCard>
    </main>
  );
}

