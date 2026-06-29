"use client";

import { CheckCircle2, ServerCrash } from "lucide-react";
import { DarkCard, FeedbackPanel, PrimaryButton } from "@/components/ui";
import { useTestStore } from "@/store/useTestStore";

export function SpatialFinishedView() {
  const finalResult = useTestStore((state) => state.finalResult);
  const errorMessage = useTestStore((state) => state.errorMessage);
  const reset = useTestStore((state) => state.reset);

  const isError = Boolean(errorMessage);

  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-10">
      <DarkCard className="w-full max-w-3xl text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-gold-300/25 bg-gold-300/10 text-gold-300">
          {isError ? (
            <ServerCrash className="h-8 w-8" aria-hidden="true" />
          ) : (
            <CheckCircle2 className="h-8 w-8" aria-hidden="true" />
          )}
        </div>
        <p className="mt-6 text-sm font-semibold uppercase tracking-[0.32em] text-gold-300">
          Test finalizado
        </p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight text-slate-900 transition-colors duration-300 ease-in-out dark:text-silver-50">
          {isError ? "Finalizacion con errores" : "Envio exitoso a SpatialBrick"}
        </h1>
        <FeedbackPanel
          className="mx-auto mt-6 max-w-2xl text-left"
          title={isError ? "Finalizacion no confirmada" : "Intento enviado"}
          message={
            isError
              ? errorMessage
              : "El intento se envio al endpoint /rest/intentos/{idIntento}/finalizar."
          }
          tone={isError ? "error" : "success"}
        />
        {!isError && finalResult ? (
          <pre className="mt-6 overflow-auto rounded-2xl border border-slate-200 bg-slate-50 p-4 text-left text-xs text-slate-700 transition-colors duration-300 ease-in-out dark:border-silver-400/10 dark:bg-charcoal-900/70 dark:text-silver-300">
            {JSON.stringify(finalResult, null, 2)}
          </pre>
        ) : null}
        <div className="mt-8 flex justify-center">
          <PrimaryButton type="button" onClick={reset}>
            Volver al inicio
          </PrimaryButton>
        </div>
      </DarkCard>
    </main>
  );
}

