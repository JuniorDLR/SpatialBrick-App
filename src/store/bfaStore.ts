"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { EstructuraTestResponse, FinalizarRespuestaItem } from "@/services/api";
import type { ExamPhase, UserDemographics } from "@/types/bfa";

type BfaStoreState = {
  phase: ExamPhase;
  user: UserDemographics | null;
  
  // Datos del test activo
  idIntento: string | number | null;
  activeTest: EstructuraTestResponse | null;
  
  // Respuestas (key: numeroEjercicio, value: opcionElegida)
  answers: Record<number, string>;
  
  // Timer state
  timeRemainingSeconds: number;
  isTimerRunning: boolean;
  startedAt: string | null;
  completedAt: string | null;

  // Acciones
  setUser: (user: UserDemographics | null) => void;
  setPhase: (phase: ExamPhase) => void;
  
  // Test actions
  setupTest: (idIntento: string | number, testData: EstructuraTestResponse) => void;
  startTest: () => void;
  saveAnswer: (numeroEjercicio: number, opcionElegida: string) => void;
  getAnswerValue: (numeroEjercicio: number) => string | null;
  
  // Timer actions
  setTimeRemainingSeconds: (seconds: number) => void;
  pauseTimer: () => void;
  resumeTimer: () => void;
  
  // Finalization
  completeTest: () => void;
  getPayloadToSubmit: () => FinalizarRespuestaItem[];
  resetExam: () => void;
};

const initialState = {
  phase: "login" as ExamPhase,
  user: null,
  idIntento: null,
  activeTest: null,
  answers: {},
  timeRemainingSeconds: 0,
  isTimerRunning: false,
  startedAt: null,
  completedAt: null,
};

export const useBfaStore = create<BfaStoreState>()(
  persist(
    (set, get) => ({
      ...initialState,

  setUser: (user) => set({ user, phase: user ? "dashboard" : "login" }),
  
  setPhase: (phase) => set({ phase }),

  setupTest: (idIntento, testData) => {
    set({
      idIntento,
      activeTest: testData,
      phase: "instructions",
      answers: {},
      isTimerRunning: false,
      timeRemainingSeconds: testData.tiempoLimiteSegundos,
    });
  },

  startTest: () => {
    set({
      phase: "test",
      isTimerRunning: true,
      startedAt: new Date().toISOString(),
    });
  },

  saveAnswer: (numeroEjercicio, opcionElegida) => {
    if (get().phase !== "test") return;
    set((state) => ({
      answers: {
        ...state.answers,
        [numeroEjercicio]: opcionElegida,
      },
    }));
  },

  getAnswerValue: (numeroEjercicio) => get().answers[numeroEjercicio] ?? null,

  setTimeRemainingSeconds: (seconds) => set({ timeRemainingSeconds: Math.max(0, seconds) }),
  
  pauseTimer: () => set({ isTimerRunning: false }),
  
  resumeTimer: () => {
    if (get().phase === "test") {
      set({ isTimerRunning: true });
    }
  },

  completeTest: () => {
    set({
      phase: "completed",
      isTimerRunning: false,
      completedAt: new Date().toISOString(),
    });
  },

  getPayloadToSubmit: () => {
    const { activeTest, answers } = get();
    if (!activeTest) return [];
    
    // Devolvemos el array de respuestas formatedo para la API
    return activeTest.ejercicios.map((ej) => ({
      numeroEjercicio: ej.numeroEjercicio,
      opcionElegida: answers[ej.numeroEjercicio] ?? null,
    }));
  },

  resetExam: () => {
    // Al resetear, limpiamos el test pero conservamos el usuario
    set({ ...initialState, user: get().user, phase: "dashboard" });
  },
    }),
    {
      name: "bfa-storage",
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);
