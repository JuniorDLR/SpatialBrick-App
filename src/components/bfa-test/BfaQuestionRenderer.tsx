"use client";

import { cn } from "@/lib/cn";
import { BfaImage } from "@/components/ui";
import type { BfaQuestion, BfaSection } from "@/data/bfa-data";
import { useBfaTestStore } from "@/store/bfa-test-store";

type BfaQuestionRendererProps = {
  section: BfaSection;
  question: BfaQuestion;
  questionNumber: number;
  value: string | string[] | null;
  onChange: (value: string | string[] | null) => void;
};

function isOptionSelected(
  currentValue: string | string[] | null,
  optionId: string,
): boolean {
  if (Array.isArray(currentValue)) {
    return currentValue.includes(optionId);
  }
  return currentValue === optionId;
}

function optionLabel(option: BfaQuestion["options"][number]): string {
  if ("label" in option && typeof option.label === "string" && option.label) {
    return option.label;
  }
  return option.id;
}

function optionImage(option: BfaQuestion["options"][number]): string | null {
  if ("imageUrl" in option && typeof option.imageUrl === "string") {
    return option.imageUrl;
  }
  return null;
}

export function BfaQuestionRenderer({
  section,
  question,
  questionNumber,
  value,
  onChange,
}: BfaQuestionRendererProps) {
  const assignedFvLetter = useBfaTestStore((state) => state.assignedFvLetter);
  const fieldName = `${section.id}-${question.id}`;

  const isChoiceQuestion =
    question.type === "TYPE_RADIO_5" ||
    question.type === "TYPE_RADIO_4" ||
    question.type === "TYPE_RADIO_3" ||
    question.type === "TYPE_TRUE_FALSE";

  const isTextListQuestion = question.type === "TYPE_TEXT_LIST_RANDOM";

  const textListCount = isTextListQuestion ? question.numberOfInputs ?? 0 : 0;
  const textValues = Array.from({ length: textListCount }, (_, index) =>
    Array.isArray(value) ? value[index] ?? "" : "",
  );

  return (
    <article className="rounded-2xl border border-slate-200 bg-white/90 p-5 shadow-sm transition-colors duration-300 ease-in-out dark:border-silver-400/10 dark:bg-charcoal-900/70 dark:shadow-none">
      <header className="mb-4 flex items-start gap-3">
        <span className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-brand-accent/35 bg-brand-accent/10 font-mono text-xs text-brand-accent transition-colors duration-300 ease-in-out dark:border-gold-300/35 dark:bg-charcoal-950 dark:text-gold-300">
          {questionNumber}
        </span>
        <div className="w-full">
          <p className="text-base font-medium text-slate-800 transition-colors duration-300 ease-in-out dark:text-silver-100">
            {question.text ?? `Pregunta ${questionNumber}`}
          </p>
          {isTextListQuestion && assignedFvLetter ? (
            <p className="mt-2 rounded-lg border border-brand-accent/30 bg-brand-accent/10 px-3 py-2 font-mono text-sm text-brand-accent dark:border-gold-300/25 dark:bg-gold-300/10 dark:text-gold-300">
              Letra asignada: {assignedFvLetter}
            </p>
          ) : null}
        </div>
      </header>

      {"imageUrl" in question &&
      typeof question.imageUrl === "string" &&
      question.imageUrl ? (
        <div className="mb-4 overflow-hidden rounded-xl border border-slate-200 bg-slate-50 p-2 transition-colors duration-300 ease-in-out dark:border-silver-400/10 dark:bg-obsidian-950">
          <BfaImage
            src={question.imageUrl}
            alt={`Imagen de referencia ${question.id}`}
            width={760}
            height={380}
          />
        </div>
      ) : null}

      {isChoiceQuestion ? (
        <div className="grid gap-3">
          {question.options.map((option) => {
            const selected = isOptionSelected(value, option.id);
            return (
              <label
                key={option.id}
                className={cn(
                  "flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 transition-colors duration-300 ease-in-out",
                  selected
                    ? "border-brand-accent/70 bg-brand-accent/15 shadow-sm dark:border-gold-300/60 dark:bg-gold-300/10 dark:shadow-none"
                    : "border-slate-200 bg-slate-50 text-slate-700 hover:border-brand-accent/50 hover:bg-white dark:border-silver-400/15 dark:bg-obsidian-900 dark:text-silver-100 dark:hover:border-gold-300/35",
                )}
              >
                <input
                  type="radio"
                  name={fieldName}
                  checked={selected}
                  onChange={() => onChange(option.id)}
                  className="h-4 w-4 accent-gold-400"
                />
                <span className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-slate-200 bg-white font-mono text-xs text-slate-500 transition-colors duration-300 ease-in-out dark:border-silver-400/25 dark:bg-charcoal-950 dark:text-silver-300">
                  {option.id}
                </span>
                <div className="flex w-full flex-col gap-2">
                  <span className="text-sm text-slate-800 transition-colors duration-300 ease-in-out dark:text-silver-100">
                    {optionLabel(option)}
                  </span>
                  {optionImage(option) ? (
                    <div className="max-w-xs overflow-hidden rounded-lg border border-slate-200 bg-white p-1 transition-colors duration-300 ease-in-out dark:border-silver-400/10 dark:bg-charcoal-950">
                      <BfaImage
                        src={optionImage(option)}
                        alt={`Opcion ${option.id}`}
                        width={220}
                        height={140}
                      />
                    </div>
                  ) : null}
                </div>
              </label>
            );
          })}
        </div>
      ) : null}

      {isTextListQuestion ? (
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
          {textValues.map((textValue, index) => (
            <label
              key={`${question.id}-word-${index + 1}`}
              className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 transition-colors duration-300 ease-in-out dark:border-silver-400/10 dark:bg-obsidian-900"
            >
              <span className="w-8 shrink-0 text-right font-mono text-xs text-brand-accent dark:text-gold-300">
                {index + 1}.
              </span>
              <input
                value={textValue}
                onChange={(event) => {
                  const nextValues = [...textValues];
                  nextValues[index] = event.target.value;
                  onChange(nextValues);
                }}
                placeholder="palabra"
                className="w-full bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-400 dark:text-silver-100 dark:placeholder:text-silver-600"
              />
            </label>
          ))}
        </div>
      ) : null}
    </article>
  );
}

