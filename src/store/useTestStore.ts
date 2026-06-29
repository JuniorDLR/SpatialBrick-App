"use client";

import { create } from "zustand";
import {
  finalizarTest,
  iniciarTest,
  obtenerEstructuraTest,
  type CandidatoData,
  type EstructuraTestResponse,
  type FinalizarRespuestaItem,
} from "@/services/api";

export const NO_CONTESTADA = "NO_CONTESTADA" as const;

type TestPhase =
  | "welcome"
  | "loading"
  | "instructions"
  | "running"
  | "submitting"
  | "finished"
  | "error";

type EjercicioNormalized = {
  numeroEjercicio: number;
  imagenUrl: string | null;
  opciones: string[];
};

type TestStoreState = {
  phase: TestPhase;
  candidato: CandidatoData | null;
  codigoTest: string | null;
  idIntento: string | number | null;
  estructura: EstructuraTestResponse | null;
  ejercicios: EjercicioNormalized[];
  tiempoLimiteSegundos: number;
  timeRemainingSeconds: number;
  currentExerciseIndex: number;
  respuestas: Record<number, string | null>;
  finalResult: Record<string, unknown> | null;
  errorMessage: string | null;

  iniciarFlujo: (args: { candidato: CandidatoData; codigoTest: string }) => Promise<void>;
  iniciarEjecucion: () => void;
  tick: (seconds: number) => void;
  responderActual: (opcionElegida: string) => void;
  finalizarPorTiempo: () => Promise<void>;
  finalizarManualSeguro: () => Promise<void>;
  reset: () => void;
};

function normalizeOpciones(opciones: EstructuraTestResponse["ejercicios"][number]["opciones"]) {
  if (!Array.isArray(opciones) || opciones.length === 0) {
    return ["A", "B", "C", "D", "E"];
  }

  return opciones.map((option, index) => {
    if (typeof option === "string" && option.trim()) {
      return option.trim();
    }

    if (option && typeof option === "object") {
      if ("id" in option && typeof option.id === "string" && option.id.trim()) {
        return option.id.trim();
      }
      if ("opcion" in option && typeof option.opcion === "string" && option.opcion.trim()) {
        return option.opcion.trim();
      }
      if ("texto" in option && typeof option.texto === "string" && option.texto.trim()) {
        return option.texto.trim();
      }
      if ("label" in option && typeof option.label === "string" && option.label.trim()) {
        return option.label.trim();
      }
    }

    return String.fromCharCode(65 + (index % 26));
  });
}

function normalizeEjercicios(estructura: EstructuraTestResponse): EjercicioNormalized[] {
  return estructura.ejercicios.map((ejercicio, index) => ({
    numeroEjercicio: ejercicio.numeroEjercicio ?? index + 1,
    imagenUrl: typeof ejercicio.imagenUrl === "string" ? ejercicio.imagenUrl : null,
    opciones: normalizeOpciones(ejercicio.opciones),
  }));
}

function buildPayloadRespuestas(
  ejercicios: EjercicioNormalized[],
  respuestas: Record<number, string | null>,
): FinalizarRespuestaItem[] {
  return ejercicios.map((ejercicio) => ({
    numeroEjercicio: ejercicio.numeroEjercicio,
    opcionElegida: respuestas[ejercicio.numeroEjercicio] ?? NO_CONTESTADA,
  }));
}

const initialState = {
  phase: "welcome" as TestPhase,
  candidato: null,
  codigoTest: null,
  idIntento: null,
  estructura: null,
  ejercicios: [] as EjercicioNormalized[],
  tiempoLimiteSegundos: 0,
  timeRemainingSeconds: 0,
  currentExerciseIndex: 0,
  respuestas: {} as Record<number, string | null>,
  finalResult: null as Record<string, unknown> | null,
  errorMessage: null as string | null,
};

export const useTestStore = create<TestStoreState>()((set, get) => ({
  ...initialState,

  iniciarFlujo: async ({ candidato, codigoTest }) => {
    set({
      phase: "loading",
      candidato,
      codigoTest,
      errorMessage: null,
      finalResult: null,
      respuestas: {},
      currentExerciseIndex: 0,
    });

    try {
      const inicio = await iniciarTest(candidato);
      const effectiveCodigo = inicio.codigoTest ?? codigoTest;
      const estructura = await obtenerEstructuraTest(effectiveCodigo);
      const ejercicios = normalizeEjercicios(estructura);

      set({
        phase: "instructions",
        idIntento: inicio.idIntento,
        codigoTest: effectiveCodigo,
        estructura,
        ejercicios,
        tiempoLimiteSegundos: estructura.tiempoLimiteSegundos,
        timeRemainingSeconds: estructura.tiempoLimiteSegundos,
        currentExerciseIndex: 0,
      });
    } catch (error) {
      set({
        phase: "error",
        errorMessage:
          error instanceof Error ? error.message : "No se pudo iniciar el test.",
      });
    }
  },

  iniciarEjecucion: () => {
    const { ejercicios } = get();
    if (ejercicios.length === 0) {
      set({
        phase: "error",
        errorMessage: "La API no devolvio ejercicios para este test.",
      });
      return;
    }
    set({ phase: "running", errorMessage: null });
  },

  tick: (seconds) => set({ timeRemainingSeconds: Math.max(0, seconds) }),

  responderActual: (opcionElegida) => {
    const state = get();
    if (state.phase !== "running") return;

    const ejercicio = state.ejercicios[state.currentExerciseIndex];
    if (!ejercicio) return;

    const respuestas = {
      ...state.respuestas,
      [ejercicio.numeroEjercicio]: opcionElegida,
    };

    const nextIndex = Math.min(
      state.currentExerciseIndex + 1,
      Math.max(0, state.ejercicios.length - 1),
    );

    set({
      respuestas,
      currentExerciseIndex: nextIndex,
    });
  },

  finalizarPorTiempo: async () => {
    const state = get();
    if (
      state.phase !== "running" ||
      state.idIntento === null ||
      state.ejercicios.length === 0
    ) {
      return;
    }

    set({ phase: "submitting" });

    try {
      const payloadRespuestas = buildPayloadRespuestas(
        state.ejercicios,
        state.respuestas,
      );
      const result = await finalizarTest(state.idIntento, payloadRespuestas);
      set({
        phase: "finished",
        finalResult: result,
      });
    } catch (error) {
      set({
        phase: "error",
        errorMessage:
          error instanceof Error
            ? error.message
            : "No se pudo finalizar el test por tiempo.",
      });
    }
  },

  finalizarManualSeguro: async () => {
    const state = get();
    if (
      state.phase !== "running" ||
      state.idIntento === null ||
      state.ejercicios.length === 0
    ) {
      return;
    }

    const todasRespondidas = state.ejercicios.every(
      (ejercicio) => state.respuestas[ejercicio.numeroEjercicio],
    );

    if (!todasRespondidas) {
      return;
    }

    set({ phase: "submitting" });
    try {
      const payloadRespuestas = buildPayloadRespuestas(
        state.ejercicios,
        state.respuestas,
      );
      const result = await finalizarTest(state.idIntento, payloadRespuestas);
      set({
        phase: "finished",
        finalResult: result,
      });
    } catch (error) {
      set({
        phase: "error",
        errorMessage:
          error instanceof Error
            ? error.message
            : "No se pudo finalizar el test.",
      });
    }
  },

  reset: () => set(initialState),
}));

