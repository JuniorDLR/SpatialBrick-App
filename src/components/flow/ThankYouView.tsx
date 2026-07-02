"use client";

import { CheckCircle2 } from "lucide-react";
import { useBfaStore } from "@/store/bfaStore";
import { Card, PrimaryButton } from "@/components/ui";

export function ThankYouView() {
  const resetExam = useBfaStore((state) => state.resetExam);
  const activeTest = useBfaStore((state) => state.activeTest);

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-6 py-10 dark:bg-transparent">
      <Card variant="elevated" className="w-full max-w-2xl text-center p-12">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500">
          <CheckCircle2 className="h-10 w-10" aria-hidden="true" />
        </div>
        
        <p className="mt-8 text-sm font-bold uppercase tracking-[0.2em] text-emerald-500">
          ¡Evaluación Completada!
        </p>
        
        <h1 className="mt-4 text-4xl font-bold tracking-tight text-slate-900 dark:text-silver-50">
          {activeTest?.codigoTest || "Prueba"} Finalizada
        </h1>
        
        <p className="mx-auto mt-6 max-w-md text-lg leading-relaxed text-slate-600 dark:text-silver-300">
          Tus resultados han sido guardados exitosamente. Nuestro equipo de recursos humanos analizará tu perfil y se pondrá en contacto contigo.
        </p>
        
        <div className="mt-10">
          <PrimaryButton onClick={resetExam} className="px-8 py-3 text-lg">
            Volver al Panel Principal
          </PrimaryButton>
        </div>
      </Card>
    </main>
  );
}
