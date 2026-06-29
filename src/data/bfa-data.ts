export const BFA_SECTION_TIMES_MINUTES = {
  VOC1: 5,
  VOC2: 6,
  S1_Identicas: 3,
  S2_Desplazamiento: 5,
  S3_Ladrillos: 3.5,
  R1: 10,
  R2: 12,
  CV: 15,
  N1_Sumas: 4,
  N1_Mult: 4,
  N2_Operaciones: 6,
  N2_Problemas: 6,
  FV: 5,
} as const;

export const bfaData = {
  testId: "BFA_V1",
  sections: [
    {
      id: "VOC1",
      factor: "VOCT",
      title: "Vocabulario Forma A",
      instructions:
        "Marque la palabra que significa lo mismo que la escrita en mayusculas.",
      timeLimitMinutes: 5.0,
      questions: [
        {
          id: "v1_q3",
          type: "TYPE_RADIO_5",
          text: "3. PERCUTIR",
          options: [
            { id: "A", label: "sumergir" },
            { id: "B", label: "palpar" },
            { id: "C", label: "agarrar" },
            { id: "D", label: "golpear" },
            { id: "E", label: "violentar" },
          ],
          correctAnswer: "D",
        },
        {
          id: "v1_q4",
          type: "TYPE_RADIO_5",
          text: "4. EXPONER",
          options: [
            { id: "A", label: "ordenar" },
            { id: "B", label: "indicar" },
            { id: "C", label: "parecer" },
            { id: "D", label: "mostrar" },
            { id: "E", label: "colocar" },
          ],
          correctAnswer: "D",
        },
      ],
    },
    {
      id: "VOC2",
      factor: "VOCT",
      title: "Vocabulario Forma B",
      instructions:
        "Marque la palabra que tiene un significado distinto al conjunto.",
      timeLimitMinutes: 6.0,
      questions: [
        {
          id: "v2_q43",
          type: "TYPE_RADIO_5",
          text: "43.",
          options: [
            { id: "A", label: "escaparse" },
            { id: "B", label: "pasearse" },
            { id: "C", label: "escabullirse" },
            { id: "D", label: "evadirse" },
            { id: "E", label: "librarse" },
          ],
          correctAnswer: "B",
        },
        {
          id: "v2_q44",
          type: "TYPE_RADIO_5",
          text: "44.",
          options: [
            { id: "A", label: "sin duda" },
            { id: "B", label: "seguramente" },
            { id: "C", label: "infaliblemente" },
            { id: "D", label: "ciertamente" },
            { id: "E", label: "regularmente" },
          ],
          correctAnswer: "E",
        },
      ],
    },
    {
      id: "S1_IDENTICAS",
      factor: "ST",
      title: "Espacial - Figuras Identicas",
      instructions:
        "Seleccione la figura (A, B, C, D o E) que es identica a la de la izquierda.",
      timeLimitMinutes: 3.0,
      questions: [
        {
          id: "s1_q3",
          type: "TYPE_RADIO_5",
          text: "3.",
          imageUrl: "/assets/bfa/s1_q3_base.png",
          options: [
            { id: "A", imageUrl: "/assets/bfa/s1_q3_a.png" },
            { id: "B", imageUrl: "/assets/bfa/s1_q3_b.png" },
            { id: "C", imageUrl: "/assets/bfa/s1_q3_c.png" },
            { id: "D", imageUrl: "/assets/bfa/s1_q3_d.png" },
            { id: "E", imageUrl: "/assets/bfa/s1_q3_e.png" },
          ],
          correctAnswer: "C",
        },
      ],
    },
    {
      id: "R1",
      factor: "RT",
      title: "Razonamiento Forma A",
      instructions:
        "Seleccione el numero que completa logicamente la serie.",
      timeLimitMinutes: 10.0,
      questions: [
        {
          id: "r1_q3",
          type: "TYPE_RADIO_4",
          text: "3. 1 - 3 - 5 - 7 - [ ] - 11 - 13",
          options: [
            { id: "A", label: "8" },
            { id: "B", label: "9" },
            { id: "C", label: "10" },
            { id: "D", label: "11" },
          ],
          correctAnswer: "B",
        },
        {
          id: "r1_q11",
          type: "TYPE_RADIO_4",
          text: "11. 1 - 9 - 25 - [ ] - 81 - 121",
          options: [
            { id: "A", label: "36" },
            { id: "B", label: "49" },
            { id: "C", label: "64" },
            { id: "D", label: "15" },
          ],
          correctAnswer: "B",
        },
      ],
    },
    {
      id: "CV",
      factor: "CV",
      title: "Comprension Verbal",
      instructions:
        "Busque el pensamiento cuya significacion es la que mas se aproxima al pensamiento principal.",
      timeLimitMinutes: 15.0,
      questions: [
        {
          id: "cv_q7",
          type: "TYPE_RADIO_3",
          text: "7. RIE BIEN EL QUE RIE ULTIMO",
          options: [
            {
              id: "A",
              label:
                "Es necesario esperar haber pasado la ultima para conocer el final de la historia.",
            },
            { id: "B", label: "A picaro, picaro y medio." },
            { id: "C", label: "Lo importante es decir la ultima palabra." },
          ],
          correctAnswer: "A",
        },
      ],
    },
    {
      id: "N1_SUMAS",
      factor: "NT",
      title: "Numerico - Sumas",
      instructions:
        "Verifique si el resultado de la suma es Verdadero o Falso.",
      timeLimitMinutes: 4.0,
      questions: [
        {
          id: "n1_q3",
          type: "TYPE_TRUE_FALSE",
          text: "23 + 46 = 57",
          options: [
            { id: "A", label: "Verdadero" },
            { id: "B", label: "Falso" },
          ],
          correctAnswer: "B",
        },
        {
          id: "n1_q4",
          type: "TYPE_TRUE_FALSE",
          text: "17 + 39 = 56",
          options: [
            { id: "A", label: "Verdadero" },
            { id: "B", label: "Falso" },
          ],
          correctAnswer: "A",
        },
      ],
    },
    {
      id: "N2_PROB",
      factor: "NT",
      title: "Numerico - Problemas",
      instructions: "Resuelva el problema y marque la solucion correcta.",
      timeLimitMinutes: 6.0,
      questions: [
        {
          id: "n2_q69",
          type: "TYPE_RADIO_4",
          text:
            "69. Jaime tiene 28 bolas. Juan tiene 17 bolas mas que Jaime. ¿Cuantas bolas tienen entre los dos?",
          options: [
            { id: "A", label: "73" },
            { id: "B", label: "65" },
            { id: "C", label: "63" },
            { id: "D", label: "45" },
          ],
          correctAnswer: "A",
        },
      ],
    },
    {
      id: "FV",
      factor: "FV",
      title: "Fluidez Verbal",
      instructions: "Escriba palabras que empiecen por la letra asignada.",
      timeLimitMinutes: 5.0,
      questions: [
        {
          id: "fv_1",
          type: "TYPE_TEXT_LIST_RANDOM",
          text: null,
          numberOfInputs: 40,
          options: [],
        },
      ],
    },
  ],
} as const;

export type BfaData = typeof bfaData;
export type BfaSection = BfaData["sections"][number];
export type BfaQuestion = BfaSection["questions"][number];
export type BfaQuestionType = BfaQuestion["type"];
