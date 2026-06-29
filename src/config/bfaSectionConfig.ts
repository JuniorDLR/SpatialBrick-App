import type { BfaSectionConfig, BfaSectionId } from "@/types/bfa";

/**
 * Orden estricto de bloques y tiempos oficiales (en minutos).
 * La navegacion solo avanza hacia adelante; no hay retroceso manual.
 */
export const BFA_SECTIONS_CONFIG: readonly BfaSectionConfig[] = [
  {
    id: "VOC1",
    factor: "VOCT",
    timeLimitMinutes: 5.0,
    title: "Vocabulario Forma A",
  },
  {
    id: "VOC2",
    factor: "VOCT",
    timeLimitMinutes: 6.0,
    title: "Vocabulario Forma B",
  },
  {
    id: "S1_Identicas",
    factor: "ST",
    timeLimitMinutes: 3.0,
    title: "Espacial - Figuras Identicas",
  },
  {
    id: "S2_Desplazamiento",
    factor: "ST",
    timeLimitMinutes: 5.0,
    title: "Espacial - Desplazamiento",
  },
  {
    id: "S1_Ladrillos",
    factor: "ST",
    timeLimitMinutes: 3.5,
    title: "Espacial - Ladrillos",
  },
  {
    id: "R1",
    factor: "RT",
    timeLimitMinutes: 10.0,
    title: "Razonamiento Forma A",
  },
  {
    id: "R2",
    factor: "RT",
    timeLimitMinutes: 12.0,
    title: "Razonamiento Forma B",
  },
  {
    id: "CV",
    factor: "CV",
    timeLimitMinutes: 15.0,
    title: "Comprension Verbal",
  },
  {
    id: "N1_Sumas",
    factor: "NT",
    timeLimitMinutes: 4.0,
    title: "Numerico - Sumas",
  },
  {
    id: "N1_Mult",
    factor: "NT",
    timeLimitMinutes: 4.0,
    title: "Numerico - Multiplicaciones",
  },
  {
    id: "N2_Operaciones",
    factor: "NT",
    timeLimitMinutes: 6.0,
    title: "Numerico - Operaciones",
  },
  {
    id: "N2_Problemas",
    factor: "NT",
    timeLimitMinutes: 6.0,
    title: "Numerico - Problemas",
  },
  {
    id: "FV",
    factor: "FV",
    timeLimitMinutes: 5.0,
    title: "Fluidez Verbal",
  },
] as const;

export const BFA_SECTION_TIME_LIMITS: Record<BfaSectionId, number> =
  BFA_SECTIONS_CONFIG.reduce(
    (acc, section) => {
      acc[section.id] = section.timeLimitMinutes;
      return acc;
    },
    {} as Record<BfaSectionId, number>,
  );

export const TOTAL_EXAM_MINUTES = BFA_SECTIONS_CONFIG.reduce(
  (total, section) => total + section.timeLimitMinutes,
  0,
);

export function getSectionConfigByIndex(
  index: number,
): BfaSectionConfig | undefined {
  return BFA_SECTIONS_CONFIG[index];
}

export function getSectionConfigById(
  id: BfaSectionId,
): BfaSectionConfig | undefined {
  return BFA_SECTIONS_CONFIG.find((section) => section.id === id);
}

export function minutesToSeconds(minutes: number): number {
  return Math.round(minutes * 60);
}
