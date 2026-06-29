import { NO_CONTESTADA, type AnswerValue, type StoredAnswerValue } from "@/types/bfa";

export function getAnswerKey(sectionId: string, questionId: string): string {
  return `${sectionId}:${questionId}`;
}

export function isAnswerProvided(value: AnswerValue | undefined): boolean {
  if (value === null || value === undefined) {
    return false;
  }

  if (Array.isArray(value)) {
    return value.some((entry) => entry.trim().length > 0);
  }

  return value.trim().length > 0;
}

export function normalizeStoredAnswer(value: AnswerValue | undefined): StoredAnswerValue {
  if (!isAnswerProvided(value)) {
    return NO_CONTESTADA;
  }

  if (Array.isArray(value)) {
    return value.map((entry) => entry.trim());
  }

  return value!.trim();
}
