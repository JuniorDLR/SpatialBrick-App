import type { BfaSubmissionPayload } from "@/types/bfa";

export type SubmitBfaResult = {
  ok: boolean;
  status: number;
  message: string;
};

export async function submitBfaPayload(
  payload: BfaSubmissionPayload,
): Promise<SubmitBfaResult> {
  const response = await fetch("/api/submit-bfa", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    return {
      ok: false,
      status: response.status,
      message: "No fue posible confirmar el envio del resultado BFA.",
    };
  }

  return {
    ok: true,
    status: response.status,
    message: "Resultado BFA enviado correctamente.",
  };
}
