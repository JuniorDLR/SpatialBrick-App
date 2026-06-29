"use client";

import { create } from "zustand";
import { bfaData } from "@/data/bfa-data";

export const NO_CONTESTADA = "NO_CONTESTADA" as const;
export const FV_RANDOM_LETTERS = ["C", "P", "M", "L", "S", "A"] as const;

type BfaSection = (typeof bfaData.sections)[number];
type SectionId = BfaSection["id"];
type FactorId = BfaSection["factor"];

export type BfaStoredAnswer = string | string[] | typeof NO_CONTESTADA;

type SectionAnswerMap = Record<string, BfaStoredAnswer>;
type AnswerBook = Partial<Record<SectionId, SectionAnswerMap>>;

type BfaPhase = "INTRO" | "INSTRUCTIONS" | "TEST" | "FINISHED";

type BfaEngineState = {
  phase: BfaPhase;
  currentSectionIndex: number;
  timeRemainingSeconds: number;
  isTimerRunning: boolean;
  assignedFvLetter: (typeof FV_RANDOM_LETTERS)[number] | null;
  startedAt: string | null;
  completedAt: string | null;
  answers: AnswerBook;

  startEngine: () => void;
  openCurrentInstructions: () => void;
  startCurrentSection: () => void;
  tick: (seconds: number) => void;
  saveAnswer: (args: {
    sectionId: SectionId;
    questionId: string;
    value: string | string[] | null;
  }) => void;
  expireCurrentSection: () => void;
  resetEngine: () => void;
  buildSubmissionPayload: () => BfaSubmissionPayload;
};

type BfaSubmissionPayload = {
  testId: string;
  completedAt: string | null;
  assignedFvLetter: string | null;
  resultsByFactor: Record<
    FactorId,
    Array<{
      sectionId: SectionId;
      answers: Array<{ questionId: string; value: BfaStoredAnswer }>;
    }>
  >;
};

const sectionByIndex = (index: number) => bfaData.sections[index];

const minutesToSeconds = (minutes: number) => Math.round(minutes * 60);

const pickRandomLetter = () =>
  FV_RANDOM_LETTERS[Math.floor(Math.random() * FV_RANDOM_LETTERS.length)];

const isAnswered = (value: string | string[] | null | undefined): boolean => {
  if (value === null || value === undefined) {
    return false;
  }

  if (Array.isArray(value)) {
    return value.some((entry) => entry.trim().length > 0);
  }

  return value.trim().length > 0;
};

const normalizeAnswer = (
  value: string | string[] | null,
): BfaStoredAnswer | null => {
  if (!isAnswered(value)) {
    return null;
  }

  if (Array.isArray(value)) {
    return value.map((entry) => entry.trim());
  }

  if (typeof value === "string") {
    return value.trim();
  }

  return null;
};

const fillSectionWithOmissions = (
  section: BfaSection,
  answers: AnswerBook,
): AnswerBook => {
  const currentSectionAnswers: SectionAnswerMap = {
    ...(answers[section.id] ?? {}),
  };

  for (const question of section.questions) {
    if (!currentSectionAnswers[question.id]) {
      currentSectionAnswers[question.id] = NO_CONTESTADA;
    }
  }

  return {
    ...answers,
    [section.id]: currentSectionAnswers,
  };
};

const emptyResultsByFactor = (): BfaSubmissionPayload["resultsByFactor"] => ({
  VOCT: [],
  ST: [],
  RT: [],
  CV: [],
  NT: [],
  FV: [],
});

export const useBfaTestStore = create<BfaEngineState>()((set, get) => ({
  phase: "INTRO",
  currentSectionIndex: 0,
  timeRemainingSeconds: 0,
  isTimerRunning: false,
  assignedFvLetter: null,
  startedAt: null,
  completedAt: null,
  answers: {},

  startEngine: () =>
    set({
      phase: "INSTRUCTIONS",
      currentSectionIndex: 0,
      startedAt: new Date().toISOString(),
      completedAt: null,
      answers: {},
      assignedFvLetter: null,
      isTimerRunning: false,
      timeRemainingSeconds: 0,
    }),

  openCurrentInstructions: () =>
    set({
      phase: "INSTRUCTIONS",
      isTimerRunning: false,
      timeRemainingSeconds: 0,
    }),

  startCurrentSection: () => {
    const section = sectionByIndex(get().currentSectionIndex);
    if (!section) return;

    const updates: Partial<BfaEngineState> = {
      phase: "TEST",
      isTimerRunning: true,
      timeRemainingSeconds: minutesToSeconds(section.timeLimitMinutes),
    };

    if (section.id === "FV" && !get().assignedFvLetter) {
      updates.assignedFvLetter = pickRandomLetter();
    }

    set(updates);
  },

  tick: (seconds) => set({ timeRemainingSeconds: Math.max(0, seconds) }),

  saveAnswer: ({ sectionId, questionId, value }) => {
    if (get().phase !== "TEST") return;
    const normalized = normalizeAnswer(value);

    set((state) => {
      const sectionAnswers: SectionAnswerMap = {
        ...(state.answers[sectionId] ?? {}),
      };

      if (normalized === null) {
        delete sectionAnswers[questionId];
      } else {
        sectionAnswers[questionId] = normalized;
      }

      return {
        answers: {
          ...state.answers,
          [sectionId]: sectionAnswers,
        },
      };
    });
  },

  expireCurrentSection: () => {
    const state = get();
    const currentSection = sectionByIndex(state.currentSectionIndex);
    if (!currentSection) return;

    const answersWithOmissions = fillSectionWithOmissions(
      currentSection,
      state.answers,
    );

    const isLast = state.currentSectionIndex >= bfaData.sections.length - 1;

    if (isLast) {
      set({
        answers: answersWithOmissions,
        phase: "FINISHED",
        isTimerRunning: false,
        timeRemainingSeconds: 0,
        completedAt: new Date().toISOString(),
      });
      return;
    }

    set({
      answers: answersWithOmissions,
      currentSectionIndex: state.currentSectionIndex + 1,
      phase: "INSTRUCTIONS",
      isTimerRunning: false,
      timeRemainingSeconds: 0,
    });
  },

  resetEngine: () =>
    set({
      phase: "INTRO",
      currentSectionIndex: 0,
      timeRemainingSeconds: 0,
      isTimerRunning: false,
      assignedFvLetter: null,
      startedAt: null,
      completedAt: null,
      answers: {},
    }),

  buildSubmissionPayload: () => {
    const state = get();
    const finalizedResults = emptyResultsByFactor();

    for (const section of bfaData.sections) {
      const sectionAnswersWithFill = fillSectionWithOmissions(section, state.answers);
      const row = sectionAnswersWithFill[section.id] ?? {};

      finalizedResults[section.factor].push({
        sectionId: section.id,
        answers: section.questions.map((question) => ({
          questionId: question.id,
          value: row[question.id] ?? NO_CONTESTADA,
        })),
      });
    }

    return {
      testId: bfaData.testId,
      completedAt: state.completedAt,
      assignedFvLetter: state.assignedFvLetter,
      resultsByFactor: finalizedResults,
    };
  },
}));

export const bfaTestHelpers = {
  sectionByIndex,
  minutesToSeconds,
  normalizeAnswer,
  isAnswered,
};

