import type { BfaQuestion, BfaSection, BfaSectionId, BfaTestDefinition } from "@/types/bfa";

export const bfaTestDefinition: BfaTestDefinition = {
  testId: "BFA_STANDARD",
  testName: "Bateria Factorial de Aptitudes",
  sections: [
    {
      id: "VOC1",
      title: "Vocabulario Forma A",
      factor: "VOCT",
      instructions:
        "En cada ejercicio hay una palabra en mayusculas y cinco opciones. Marque la que significa lo mismo.",
      timeLimitMinutes: 5.0,
      questions: [
        {
          id: "q_1",
          type: "TYPE_RADIO_5",
          text: "1. GRAMA",
          imageUrl: null,
          options: [
            { id: "A", label: "pastizal", imageUrl: null },
            { id: "B", label: "cesped", imageUrl: null },
            { id: "C", label: "hierba", imageUrl: null },
            { id: "D", label: "hortaliza", imageUrl: null },
            { id: "E", label: "naturaleza", imageUrl: null },
          ],
        },
      ],
    },
    {
      id: "VOC2",
      title: "Vocabulario Forma B",
      factor: "VOCT",
      instructions:
        "Seleccione la opcion que mejor completa el significado de la palabra dada.",
      timeLimitMinutes: 6.0,
      questions: [
        {
          id: "q_12",
          type: "TYPE_RADIO_4",
          text: "12. LACONICO",
          imageUrl: null,
          options: [
            { id: "A", label: "Extenso", imageUrl: null },
            { id: "B", label: "Breve", imageUrl: null },
            { id: "C", label: "Ambiguo", imageUrl: null },
            { id: "D", label: "Improvisado", imageUrl: null },
          ],
        },
      ],
    },
    {
      id: "R1",
      title: "Razonamiento Forma A",
      factor: "RT",
      instructions:
        "Seleccione la alternativa que sigue la misma relacion logica.",
      timeLimitMinutes: 10.0,
      questions: [
        {
          id: "q_r1_1",
          type: "TYPE_RADIO_3",
          text: "Libro es a leer como cuchillo es a...",
          imageUrl: null,
          options: [
            { id: "A", label: "Cortar", imageUrl: null },
            { id: "B", label: "Cocinar", imageUrl: null },
            { id: "C", label: "Doblar", imageUrl: null },
          ],
        },
      ],
    },
    {
      id: "N1_Sumas",
      title: "Numerico - Sumas",
      factor: "NT",
      instructions: "Verifique si el resultado de la suma es Verdadero o Falso.",
      timeLimitMinutes: 4.0,
      questions: [
        {
          id: "q_32",
          type: "TYPE_TRUE_FALSE",
          text: "55 + 23 = 114",
          imageUrl: null,
          options: [
            { id: "A", label: "Verdadero", imageUrl: null },
            { id: "B", label: "Falso", imageUrl: null },
          ],
        },
      ],
    },
    {
      id: "S2_Desplazamiento",
      title: "Espacial - Desplazamiento",
      factor: "ST",
      instructions:
        "Busque la o las figuras que al desplazarse o girarse recubren exactamente la figura del modelo.",
      timeLimitMinutes: 5.0,
      questions: [
        {
          id: "q_28",
          type: "TYPE_CHECKBOX_IMAGE",
          text: "28.",
          imageUrl: "/assets/bfa-images/s2-q28-base.png",
          options: [
            { id: "A", label: null, imageUrl: "/assets/bfa-images/s2-q28-A.png" },
            { id: "B", label: null, imageUrl: "/assets/bfa-images/s2-q28-B.png" },
            { id: "C", label: null, imageUrl: "/assets/bfa-images/s2-q28-C.png" },
            { id: "D", label: null, imageUrl: "/assets/bfa-images/s2-q28-D.png" },
            { id: "E", label: null, imageUrl: "/assets/bfa-images/s2-q28-E.png" },
          ],
        },
      ],
    },
    {
      id: "FV",
      title: "Fluidez Verbal",
      factor: "FV",
      instructions:
        "Escriba palabras que empiecen por la letra asignada. No se preocupe por la ortografia.",
      timeLimitMinutes: 5.0,
      questions: [
        {
          id: "q_fv_1",
          type: "TYPE_TEXT_LIST_RANDOM",
          text: null,
          imageUrl: null,
          numberOfInputs: 40,
          options: [],
        },
      ],
    },
  ],
};

export function getTestSectionById(
  sectionId: BfaSectionId,
): BfaSection | undefined {
  return bfaTestDefinition.sections.find((section) => section.id === sectionId);
}

export function getQuestionIdsForSection(sectionId: BfaSectionId): string[] {
  return getTestSectionById(sectionId)?.questions.map((question) => question.id) ?? [];
}

export function getQuestionsForSection(sectionId: BfaSectionId): BfaQuestion[] {
  return getTestSectionById(sectionId)?.questions ?? [];
}
