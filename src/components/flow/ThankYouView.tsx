"use client";

import { useEffect, useRef, useState } from "react";
import { CheckCircle2, Loader2, ServerCrash } from "lucide-react";
import { useBfaStore } from "@/store/bfaStore";
import { submitBfaPayload } from "@/services/bfaSubmission";
import { DarkCard, FeedbackPanel } from "@/components/ui";

type SubmissionState = "submitting" | "success" | "error";

export function ThankYouView() {
  const buildSubmissionPayload = useBfaStore(
    (state) => state.buildSubmissionPayload,
  );
  const [submissionState, setSubmissionState] =
    useState<SubmissionState>("submitting");
  const [message, setMessage] = useState("Preparando resultados...");
  const hasSubmittedRef = useRef(false);

  useEffect(() => {
    if (hasSubmittedRef.current) {
      return;
    }

    hasSubmittedRef.current = true;
    const payload = buildSubmissionPayload();

    if (!payload) {
      setSubmissionState("error");
      setMessage("No se encontro informacion del candidato para enviar.");
      return;
    }

    submitBfaPayload(payload)
      .then((result) => {
        setSubmissionState(result.ok ? "success" : "error");
        setMessage(result.message);
      })
      .catch(() => {
        setSubmissionState("error");
        setMessage(
          "El endpoint /api/submit-bfa aun no esta disponible para confirmar el envio.",
        );
      });
  }, [buildSubmissionPayload]);

  const Icon =
    submissionState === "submitting"
      ? Loader2
      : submissionState === "success"
        ? CheckCircle2
        : ServerCrash;

  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-10">
      <DarkCard className="w-full max-w-3xl text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-gold-300/25 bg-gold-300/10 text-gold-300">
          <Icon
            className={
              submissionState === "submitting"
                ? "h-8 w-8 animate-spin"
                : "h-8 w-8"
            }
            aria-hidden="true"
          />
        </div>
        <p className="mt-6 text-sm font-semibold uppercase tracking-[0.32em] text-gold-300">
          Gracias
        </p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight text-slate-900 transition-colors duration-300 ease-in-out dark:text-silver-50">
          Evaluacion BFA finalizada
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-slate-600 transition-colors duration-300 ease-in-out dark:text-silver-300">
          Sus respuestas fueron consolidadas en un payload JSON listo para
          integrarse con OpenXava.
        </p>
        <FeedbackPanel
          className="mt-6 text-left"
          title={
            submissionState === "submitting"
              ? "Enviando resultado"
              : submissionState === "success"
                ? "Resultado confirmado"
                : "No se pudo confirmar"
          }
          message={message}
          tone={
            submissionState === "submitting"
              ? "loading"
              : submissionState === "success"
                ? "success"
                : "error"
          }
        />
      </DarkCard>
    </main>
  );
}
