/** Constante canonica para preguntas omitidas al agotarse el tiempo. */
export const NO_CONTESTADA = "NO_CONTESTADA" as const;

export type BfaFactor = "VOCT" | "ST" | "RT" | "CV" | "NT" | "FV";

export type BfaSectionId =
  | "VOC1"
  | "VOC2"
  | "S1_Identicas"
  | "S2_Desplazamiento"
  | "S1_Ladrillos"
  | "R1"
  | "R2"
  | "CV"
  | "N1_Sumas"
  | "N1_Mult"
  | "N2_Operaciones"
  | "N2_Problemas"
  | "FV";

export type QuestionType =
  | "TYPE_RADIO_5"
  | "TYPE_RADIO_4"
  | "TYPE_RADIO_3"
  | "TYPE_TRUE_FALSE"
  | "TYPE_CHECKBOX_IMAGE"
  | "TYPE_TEXT_LIST_RANDOM";

export type ExamPhase = "welcome" | "instructions" | "test" | "completed";

export type QuestionOption = {
  id: string;
  label: string | null;
  imageUrl: string | null;
};

export type BfaQuestion = {
  id: string;
  type: QuestionType;
  text: string | null;
  imageUrl: string | null;
  numberOfInputs?: number;
  options: QuestionOption[];
};

export type BfaSection = {
  id: BfaSectionId;
  title: string;
  factor: BfaFactor;
  instructions: string;
  timeLimitMinutes: number;
  questions: BfaQuestion[];
};

export type BfaTestDefinition = {
  testId: string;
  testName: string;
  sections: BfaSection[];
};

export type BfaSectionConfig = {
  id: BfaSectionId;
  factor: BfaFactor;
  timeLimitMinutes: number;
  title: string;
};

export type UserDemographics = {
  fullName: string;
  age: string;
  gender: string;
  educationLevel: string;
  institution?: string;
};

/** Valor en UI durante la prueba; null = sin responder aun. */
export type AnswerValue = string | string[] | null;

/** Valor persistido al cerrar una seccion o al enviar el payload. */
export type StoredAnswerValue = string | string[] | typeof NO_CONTESTADA;

export type BfaAnswer = {
  sectionId: BfaSectionId;
  questionId: string;
  value: StoredAnswerValue;
  answeredAt: string;
};

export type FactorSubmissionBlock = {
  sections: Array<{
    sectionId: BfaSectionId;
    answers: BfaAnswer[];
  }>;
};

export type BfaSubmissionPayload = {
  testId: "BFA_STANDARD";
  testName: string;
  candidate: UserDemographics;
  metadata: {
    startedAt: string | null;
    completedAt: string | null;
    fluencyVerbalLetter: string | null;
  };
  results: Record<BfaFactor, FactorSubmissionBlock>;
};
