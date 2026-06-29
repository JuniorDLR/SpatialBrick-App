"use client";

import { create } from "zustand";
import {
  BFA_FACTORS,
  BFA_TEST_ID,
  BFA_TEST_NAME,
  FLUENCY_VERBAL_LETTERS,
} from "@/config/bfaConstants";
import {
  BFA_SECTIONS_CONFIG,
  getSectionConfigByIndex,
  minutesToSeconds,
} from "@/config/bfaSectionConfig";
import {
  getAnswerKey,
  isAnswerProvided,
  normalizeStoredAnswer,
} from "@/lib/answerUtils";
import {
  NO_CONTESTADA,
  type AnswerValue,
  type BfaAnswer,
  type BfaFactor,
  type BfaSectionId,
  type BfaSubmissionPayload,
  type ExamPhase,
  type UserDemographics,
} from "@/types/bfa";

type BfaStoreState = {
  phase: ExamPhase;
  user: UserDemographics | null;
  answers: Record<string, BfaAnswer>;
  currentSectionIndex: number;
  timeRemainingSeconds: number;
  isTimerRunning: boolean;
  fluencyVerbalLetter: string | null;
  startedAt: string | null;
  completedAt: string | null;

  setUser: (user: UserDemographics) => void;
  goToInstructions: () => void;
  ensureFluencyLetterForCurrentSection: () => void;
  startCurrentSection: () => void;
  saveAnswer: (params: {
    sectionId: BfaSectionId;
    questionId: string;
    value: AnswerValue;
  }) => void;
  getAnswerValue: (sectionId: BfaSectionId, questionId: string) => AnswerValue;
  setTimeRemainingSeconds: (seconds: number) => void;
  pauseTimer: () => void;
  resumeTimer: () => void;
  finalizeSectionAnswers: (questionIds: string[]) => void;
  expireCurrentSection: (questionIds: string[]) => void;
  completeExam: () => void;
  buildSubmissionPayload: () => BfaSubmissionPayload | null;
  resetExam: () => void;

  getCurrentSectionConfig: () => (typeof BFA_SECTIONS_CONFIG)[number] | undefined;
  getNextSectionConfig: () => (typeof BFA_SECTIONS_CONFIG)[number] | undefined;
  isLastSection: () => boolean;
  canNavigateBack: () => boolean;
  canNavigateForwardManually: () => boolean;
};

const pickRandomFluencyLetter = (): string => {
  const index = Math.floor(Math.random() * FLUENCY_VERBAL_LETTERS.length);
  return FLUENCY_VERBAL_LETTERS[index];
};

const createEmptyFactorResults = (): BfaSubmissionPayload["results"] => ({
  VOCT: { sections: [] },
  ST: { sections: [] },
  RT: { sections: [] },
  CV: { sections: [] },
  NT: { sections: [] },
  FV: { sections: [] },
});

const initialState = {
  phase: "welcome" as ExamPhase,
  user: null,
  answers: {},
  currentSectionIndex: 0,
  timeRemainingSeconds: 0,
  isTimerRunning: false,
  fluencyVerbalLetter: null,
  startedAt: null,
  completedAt: null,
};

export { getAnswerKey, NO_CONTESTADA };

export const useBfaStore = create<BfaStoreState>((set, get) => ({
  ...initialState,

  setUser: (user) =>
    set({
      user,
      phase: "instructions",
      currentSectionIndex: 0,
    }),

  goToInstructions: () =>
    set({
      phase: "instructions",
      isTimerRunning: false,
    }),

  ensureFluencyLetterForCurrentSection: () => {
    const section = getSectionConfigByIndex(get().currentSectionIndex);

    if (section?.id === "FV" && !get().fluencyVerbalLetter) {
      set({ fluencyVerbalLetter: pickRandomFluencyLetter() });
    }
  },

  startCurrentSection: () => {
    const section = getSectionConfigByIndex(get().currentSectionIndex);

    if (!section) {
      return;
    }

    const updates: Partial<BfaStoreState> = {
      phase: "test",
      timeRemainingSeconds: minutesToSeconds(section.timeLimitMinutes),
      isTimerRunning: true,
      startedAt: get().startedAt ?? new Date().toISOString(),
    };

    if (section.id === "FV" && !get().fluencyVerbalLetter) {
      updates.fluencyVerbalLetter = pickRandomFluencyLetter();
    }

    set(updates);
  },

  saveAnswer: ({ sectionId, questionId, value }) => {
    if (get().phase !== "test") {
      return;
    }

    if (!isAnswerProvided(value)) {
      set((state) => {
        const nextAnswers = { ...state.answers };
        delete nextAnswers[getAnswerKey(sectionId, questionId)];
        return { answers: nextAnswers };
      });
      return;
    }

    set((state) => ({
      answers: {
        ...state.answers,
        [getAnswerKey(sectionId, questionId)]: {
          sectionId,
          questionId,
          value: normalizeStoredAnswer(value),
          answeredAt: new Date().toISOString(),
        },
      },
    }));
  },

  getAnswerValue: (sectionId, questionId) =>
    get().answers[getAnswerKey(sectionId, questionId)]?.value ?? null,

  setTimeRemainingSeconds: (seconds) =>
    set({ timeRemainingSeconds: Math.max(0, seconds) }),

  pauseTimer: () => set({ isTimerRunning: false }),

  resumeTimer: () => {
    if (get().phase === "test") {
      set({ isTimerRunning: true });
    }
  },

  finalizeSectionAnswers: (questionIds) => {
    const state = get();
    const section = getSectionConfigByIndex(state.currentSectionIndex);

    if (!section) {
      return;
    }

    const stampedAt = new Date().toISOString();
    const nextAnswers = { ...state.answers };

    questionIds.forEach((questionId) => {
      const key = getAnswerKey(section.id, questionId);
      const existing = nextAnswers[key];

      if (existing) {
        nextAnswers[key] = {
          ...existing,
          value: normalizeStoredAnswer(existing.value as AnswerValue),
        };
        return;
      }

      nextAnswers[key] = {
        sectionId: section.id,
        questionId,
        value: NO_CONTESTADA,
        answeredAt: stampedAt,
      };
    });

    set({ answers: nextAnswers, isTimerRunning: false });
  },

  expireCurrentSection: (questionIds) => {
    const state = get();
    get().finalizeSectionAnswers(questionIds);

    if (state.isLastSection()) {
      get().completeExam();
      return;
    }

    set({
      currentSectionIndex: state.currentSectionIndex + 1,
      phase: "instructions",
      timeRemainingSeconds: 0,
      isTimerRunning: false,
    });
  },

  completeExam: () =>
    set({
      phase: "completed",
      completedAt: new Date().toISOString(),
      timeRemainingSeconds: 0,
      isTimerRunning: false,
    }),

  buildSubmissionPayload: () => {
    const state = get();

    if (!state.user) {
      return null;
    }

    const results = createEmptyFactorResults();

    BFA_SECTIONS_CONFIG.forEach((sectionConfig) => {
      const sectionAnswers = Object.values(state.answers).filter(
        (answer) => answer.sectionId === sectionConfig.id,
      );

      results[sectionConfig.factor].sections.push({
        sectionId: sectionConfig.id,
        answers: sectionAnswers,
      });
    });

    return {
      testId: BFA_TEST_ID,
      testName: BFA_TEST_NAME,
      candidate: state.user,
      metadata: {
        startedAt: state.startedAt,
        completedAt: state.completedAt,
        fluencyVerbalLetter: state.fluencyVerbalLetter,
      },
      results,
    };
  },

  resetExam: () => set(initialState),

  getCurrentSectionConfig: () => getSectionConfigByIndex(get().currentSectionIndex),

  getNextSectionConfig: () =>
    getSectionConfigByIndex(get().currentSectionIndex + 1),

  isLastSection: () => get().currentSectionIndex >= BFA_SECTIONS_CONFIG.length - 1,

  canNavigateBack: () => false,

  canNavigateForwardManually: () => false,
}));

export function getSectionsByFactor(factor: BfaFactor) {
  return BFA_SECTIONS_CONFIG.filter((section) => section.factor === factor);
}

export { BFA_SECTIONS_CONFIG, BFA_FACTORS, FLUENCY_VERBAL_LETTERS };
