import type { BfaFactor } from "@/types/bfa";

export const BFA_TEST_ID = "BFA_STANDARD" as const;
export const BFA_TEST_NAME = "Bateria Factorial de Aptitudes";

/** Letras disponibles para la prueba de Fluidez Verbal (asignacion aleatoria). */
export const FLUENCY_VERBAL_LETTERS = ["C", "P", "M", "L", "S", "A"] as const;

export const BFA_FACTORS: BfaFactor[] = [
  "VOCT",
  "ST",
  "RT",
  "CV",
  "NT",
  "FV",
];
