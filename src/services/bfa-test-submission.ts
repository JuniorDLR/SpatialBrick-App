import type { BfaStoredAnswer } from "@/store/bfa-test-store";

export type BfaTestSubmissionPayload = {
  testId: string;
  completedAt: string | null;
  assignedFvLetter: string | null;
  resultsByFactor: Record<
    string,
    Array<{
      sectionId: string;
      answers: Array<{ questionId: string; value: BfaStoredAnswer }>;
    }>
  >;
};

export type BfaSubmitResult = {
  ok: boolean;
  status: number;
  message: string;
};

export async function submitBfaTestPayload(
  payload: BfaTestSubmissionPayload,
): Promise<BfaSubmitResult> {
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
      message: "No fue posible confirmar el envio del payload BFA.",
    };
  }

  return {
    ok: true,
    status: response.status,
    message: "Payload BFA enviado correctamente.",
  };
}

