"use client";

import { useEffect, useMemo, useRef } from "react";
import { getQuestionsForSection, getTestSectionById } from "@/data/bfaTest";
import { isAnswerProvided } from "@/lib/answerUtils";
import { getAnswerKey, useBfaStore } from "@/store/bfaStore";
import { DarkCard } from "@/components/ui";
import { SectionTransitionController } from "./SectionTransitionController";
import { QuestionRenderer } from "./QuestionRenderer";

export function SectionTestView() {
  const currentSectionConfig = useBfaStore((state) =>
    state.getCurrentSectionConfig(),
  );
  const fluencyVerbalLetter = useBfaStore((state) => state.fluencyVerbalLetter);
  const answers = useBfaStore((state) => state.answers);
  const saveAnswer = useBfaStore((state) => state.saveAnswer);
  const phase = useBfaStore((state) => state.phase);
  const expireCurrentSection = useBfaStore((state) => state.expireCurrentSection);
  const autoAdvancedRef = useRef(false);

  const testSection = useMemo(
    () =>
      currentSectionConfig
        ? getTestSectionById(currentSectionConfig.id)
        : undefined,
    [currentSectionConfig],
  );
  const questions = useMemo(
    () =>
      currentSectionConfig
        ? getQuestionsForSection(currentSectionConfig.id)
        : [],
    [currentSectionConfig],
  );
  const questionIds = questions.map((question) => question.id);

  useEffect(() => {
    autoAdvancedRef.current = false;
  }, [currentSectionConfig?.id]);

  useEffect(() => {
    if (phase !== "test" || questions.length !== 0) {
      return;
    }

    if (autoAdvancedRef.current) {
      return;
    }

    autoAdvancedRef.current = true;
    expireCurrentSection([]);
  }, [expireCurrentSection, phase, questions.length]);

  useEffect(() => {
    // FV usa lista larga de texto; se mantiene cierre estricto por temporizador.
    if (
      phase !== "test" ||
      !currentSectionConfig ||
      currentSectionConfig.id === "FV" ||
      questions.length === 0
    ) {
      return;
    }

    if (autoAdvancedRef.current) {
      return;
    }

    const isSectionCompleted = questions.every((question) =>
      isAnswerProvided(
        answers[getAnswerKey(currentSectionConfig.id, question.id)]?.value ?? null,
      ),
    );

    if (!isSectionCompleted) {
      return;
    }

    autoAdvancedRef.current = true;
    expireCurrentSection(questionIds);
  }, [
    answers,
    currentSectionConfig,
    expireCurrentSection,
    phase,
    questionIds,
    questions,
  ]);

  if (!currentSectionConfig) {
    return (
      <main className="px-6 py-10">
        <DarkCard className="mx-auto max-w-3xl">
          <h1 className="text-2xl font-semibold text-slate-900 dark:text-silver-50">
            No hay bloque activo.
          </h1>
        </DarkCard>
      </main>
    );
  }

  return (
    <SectionTransitionController>
      <main className="px-6 py-8">
        <div className="mx-auto flex w-full max-w-5xl flex-col gap-6">
          <DarkCard>
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-gold-300">
              {currentSectionConfig.factor}
            </p>
            <h1 className="mt-3 text-3xl font-semibold text-slate-900 transition-colors duration-300 ease-in-out dark:text-silver-50">
              {currentSectionConfig.title}
            </h1>
            {testSection?.instructions ? (
              <p className="mt-4 text-sm leading-7 text-slate-600 transition-colors duration-300 ease-in-out dark:text-silver-300">
                {testSection.instructions}
              </p>
            ) : null}
            {currentSectionConfig.id === "FV" && fluencyVerbalLetter ? (
              <p className="mt-4 rounded-2xl border border-gold-300/25 bg-gold-300/10 px-4 py-3 text-center font-mono text-3xl font-semibold text-gold-300">
                Letra asignada: {fluencyVerbalLetter}
              </p>
            ) : null}
          </DarkCard>

          <section className="grid gap-4">
            {questions.length === 0 ? (
              <DarkCard className="border-dashed border-slate-300 dark:border-silver-400/20">
                <p className="text-sm text-slate-500 dark:text-silver-400">
                  Este bloque no tiene preguntas cargadas en el JSON actual.
                </p>
              </DarkCard>
            ) : (
              questions.map((question, index) => (
                <QuestionRenderer
                  key={question.id}
                  sectionId={currentSectionConfig.id}
                  question={question}
                  questionNumber={index + 1}
                  value={
                    answers[getAnswerKey(currentSectionConfig.id, question.id)]
                      ?.value ?? null
                  }
                  onChange={(value) =>
                    saveAnswer({
                      sectionId: currentSectionConfig.id,
                      questionId: question.id,
                      value,
                    })
                  }
                />
              ))
            )}
          </section>
        </div>
      </main>
    </SectionTransitionController>
  );
}
