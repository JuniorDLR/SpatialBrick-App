"use client";

import { bfaData } from "@/data/bfa-data";
import { useBfaTestStore } from "@/store/bfa-test-store";
import { BfaQuestionRenderer } from "./BfaQuestionRenderer";

export function BfaSectionQuestions() {
  const currentSectionIndex = useBfaTestStore((state) => state.currentSectionIndex);
  const answers = useBfaTestStore((state) => state.answers);
  const saveAnswer = useBfaTestStore((state) => state.saveAnswer);

  const section = bfaData.sections[currentSectionIndex];

  if (!section) {
    return null;
  }

  return (
    <section className="grid gap-4">
      {section.questions.map((question, index) => (
        <BfaQuestionRenderer
          key={question.id}
          section={section}
          question={question}
          questionNumber={index + 1}
          value={answers[section.id]?.[question.id] ?? null}
          onChange={(value) =>
            saveAnswer({
              sectionId: section.id,
              questionId: question.id,
              value,
            })
          }
        />
      ))}
    </section>
  );
}

