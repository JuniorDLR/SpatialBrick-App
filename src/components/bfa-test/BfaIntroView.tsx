"use client";

import { ShieldCheck } from "lucide-react";
import { DarkCard, PrimaryButton } from "@/components/ui";
import { useBfaTestStore } from "@/store/bfa-test-store";

export function BfaIntroView() {
  const startEngine = useBfaTestStore((state) => state.startEngine);
  const resetEngine = useBfaTestStore((state) => state.resetEngine);

  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-10">
      <DarkCard className="w-full max-w-4xl">
        <div className="mb-8 flex items-start gap-4">
          <div className="rounded-2xl border border-gold-300/25 bg-gold-300/10 p-3 text-gold-300">
            <ShieldCheck className="h-6 w-6" aria-hidden="true" />
          </div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.32em] text-gold-300">
              BFA V1
            </p>
            <h1 className="mt-3 text-4xl font-semibold tracking-tight text-slate-900 transition-colors duration-300 ease-in-out dark:text-silver-50">
              Bateria Factorial de Aptitudes
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600 transition-colors duration-300 ease-in-out dark:text-silver-300">
              Motor modular independiente para la prueba psicometrica.
              Cronometro estricto, avance automatico y registro de omisiones.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap justify-end gap-3">
          <PrimaryButton
            type="button"
            onClick={resetEngine}
            variant="secondary"
          >
            Reiniciar
          </PrimaryButton>
          <PrimaryButton type="button" onClick={startEngine}>
            Iniciar prueba
          </PrimaryButton>
        </div>
      </DarkCard>
    </main>
  );
}

