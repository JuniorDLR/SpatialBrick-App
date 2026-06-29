"use client";

import { useMemo } from "react";
import { cn } from "@/lib/cn";
import type { AnswerValue, BfaQuestion, BfaSectionId } from "@/types/bfa";
import { BfaImage } from "@/components/ui";

type QuestionRendererProps = {
  sectionId: BfaSectionId;
  question: BfaQuestion;
  questionNumber: number;
  value: AnswerValue;
  onChange: (value: AnswerValue) => void;
};

function getChoiceBadgeClass(isSelected: boolean) {
  return cn(
    "flex h-7 w-7 items-center justify-center rounded-full border text-xs font-semibold transition-colors duration-300 ease-in-out",
    isSelected
      ? "border-brand-accent/70 bg-brand-accent/15 text-brand-accent dark:border-gold-300/70 dark:bg-gold-300/15 dark:text-gold-300"
      : "border-slate-200 bg-white text-slate-500 dark:border-silver-400/20 dark:bg-obsidian-950 dark:text-silver-400",
  );
}

function normalizeTextListValue(
  value: AnswerValue,
  numberOfInputs: number,
): string[] {
  const base = Array.from({ length: numberOfInputs }, () => "");

  if (!Array.isArray(value)) {
    return base;
  }

  return base.map((_, index) => value[index] ?? "");
}

export function QuestionRenderer({
  sectionId,
  question,
  questionNumber,
  value,
  onChange,
}: QuestionRendererProps) {
  const fieldName = `${sectionId}-${question.id}`;
  const textListValues = useMemo(() => {
    if (question.type !== "TYPE_TEXT_LIST_RANDOM") {
      return [];
    }

    const inputsCount = question.numberOfInputs ?? 0;
    return normalizeTextListValue(value, inputsCount);
  }, [question.numberOfInputs, question.type, value]);

  const sharedQuestionHeader = (
    <header className="mb-5 flex items-start gap-4">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-brand-accent/35 bg-brand-accent/10 font-mono text-sm text-brand-accent transition-colors duration-300 ease-in-out dark:border-gold-300/30 dark:bg-charcoal-900 dark:text-gold-300">
        {questionNumber}
      </span>
      <div>
        <p className="text-base leading-7 text-slate-800 transition-colors duration-300 ease-in-out dark:text-silver-100">
          {question.text ?? `Pregunta ${questionNumber}`}
        </p>
      </div>
    </header>
  );

  return (
    <article className="rounded-2xl border border-slate-200 bg-white/90 p-5 shadow-sm transition-colors duration-300 ease-in-out dark:border-silver-400/10 dark:bg-charcoal-900/65 dark:shadow-none">
      {sharedQuestionHeader}

      {question.imageUrl ? (
        <div className="mb-5 overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 p-2 transition-colors duration-300 ease-in-out dark:border-silver-400/10 dark:bg-obsidian-950">
          <BfaImage
            src={question.imageUrl}
            alt={`Imagen de la pregunta ${questionNumber}`}
            width={720}
            height={420}
          />
        </div>
      ) : null}

      {(question.type === "TYPE_RADIO_5" ||
        question.type === "TYPE_RADIO_4" ||
        question.type === "TYPE_RADIO_3" ||
        question.type === "TYPE_TRUE_FALSE") && (
        <div className="grid gap-3">
          {question.options.map((option) => {
            const isSelected = value === option.id;
            return (
              <label
                key={option.id}
                className={cn(
                  "flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 transition-colors duration-300 ease-in-out",
                  isSelected
                    ? "border-brand-accent/70 bg-brand-accent/15 shadow-sm dark:border-gold-300/60 dark:bg-gold-300/10 dark:shadow-none"
                    : "border-slate-200 bg-slate-50 text-slate-700 hover:border-brand-accent/50 hover:bg-white dark:border-silver-400/15 dark:bg-obsidian-900 dark:text-silver-100 dark:hover:border-gold-300/35",
                )}
              >
                <input
                  type="radio"
                  name={fieldName}
                  checked={isSelected}
                  onChange={() => onChange(option.id)}
                  className="h-4 w-4 accent-gold-400"
                />
                <span className={getChoiceBadgeClass(isSelected)}>{option.id}</span>
                <span className="text-sm text-slate-800 transition-colors duration-300 ease-in-out dark:text-silver-100">
                  {option.label ?? option.id}
                </span>
              </label>
            );
          })}
        </div>
      )}

      {question.type === "TYPE_CHECKBOX_IMAGE" && (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {question.options.map((option) => {
            const selectedValues = Array.isArray(value) ? value : [];
            const isSelected = selectedValues.includes(option.id);

            return (
              <label
                key={option.id}
                className={cn(
                  "cursor-pointer rounded-xl border p-3 transition-colors duration-300 ease-in-out",
                  isSelected
                    ? "border-brand-accent/70 bg-brand-accent/15 shadow-sm dark:border-gold-300/60 dark:bg-gold-300/10 dark:shadow-none"
                    : "border-slate-200 bg-slate-50 hover:border-brand-accent/50 hover:bg-white dark:border-silver-400/15 dark:bg-obsidian-900 dark:hover:border-gold-300/35",
                )}
              >
                <div className="mb-3 flex items-center gap-3">
                  <input
                    type="checkbox"
                    name={fieldName}
                    checked={isSelected}
                    onChange={() => {
                      const next = isSelected
                        ? selectedValues.filter((entry) => entry !== option.id)
                        : [...selectedValues, option.id];
                      onChange(next);
                    }}
                    className="h-4 w-4 accent-gold-400"
                  />
                  <span className={getChoiceBadgeClass(isSelected)}>
                    {option.id}
                  </span>
                  <span className="text-xs uppercase tracking-[0.18em] text-slate-500 dark:text-silver-400">
                    Opcion
                  </span>
                </div>
                {option.imageUrl ? (
                  <div className="overflow-hidden rounded-lg border border-slate-200 bg-white p-1 transition-colors duration-300 ease-in-out dark:border-silver-400/10 dark:bg-charcoal-950">
                    <BfaImage
                      src={option.imageUrl}
                      alt={`Opcion ${option.id}`}
                      width={260}
                      height={180}
                    />
                  </div>
                ) : option.label ? (
                  <p className="text-sm text-slate-700 dark:text-silver-200">{option.label}</p>
                ) : null}
              </label>
            );
          })}
        </div>
      )}

      {question.type === "TYPE_TEXT_LIST_RANDOM" && (
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
          {textListValues.map((entry, index) => (
            <label
              key={`${question.id}-input-${index + 1}`}
              className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 transition-colors duration-300 ease-in-out dark:border-silver-400/10 dark:bg-obsidian-900"
            >
              <span className="w-7 shrink-0 text-right font-mono text-xs text-brand-accent dark:text-gold-300">
                {index + 1}.
              </span>
              <input
                value={entry}
                onChange={(event) => {
                  const nextValues = [...textListValues];
                  nextValues[index] = event.target.value;
                  onChange(nextValues);
                }}
                className="w-full bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-400 dark:text-silver-100 dark:placeholder:text-silver-600"
                placeholder="palabra"
              />
            </label>
          ))}
        </div>
      )}
    </article>
  );
}
