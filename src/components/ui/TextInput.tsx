import type { InputHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";

type TextInputProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  helperText?: ReactNode;
  error?: string;
};

export function TextInput({
  id,
  label,
  helperText,
  error,
  className,
  ...props
}: TextInputProps) {
  const inputId = id ?? props.name;

  return (
    <label className="block" htmlFor={inputId}>
      <span className="mb-2 block text-sm font-medium text-slate-700 transition-colors duration-300 ease-in-out dark:text-silver-100">
        {label}
      </span>
      <input
        id={inputId}
        className={cn(
          "w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-base text-slate-900 outline-none transition-colors duration-300 ease-in-out",
          "placeholder:text-slate-400 focus:border-brand-accent/80 focus:ring-2 focus:ring-brand-accent/20",
          "dark:border-silver-400/15 dark:bg-charcoal-900 dark:text-silver-50 dark:placeholder:text-silver-500 dark:focus:border-gold-300/70 dark:focus:ring-gold-300/20",
          error && "border-red-400/70 focus:border-red-400 focus:ring-red-300/20 dark:focus:border-red-300",
          className,
        )}
        {...props}
      />
      {error ? (
        <span className="mt-2 block text-sm text-red-600 dark:text-red-300">{error}</span>
      ) : helperText ? (
        <span className="mt-2 block text-sm text-slate-500 dark:text-silver-400">{helperText}</span>
      ) : null}
    </label>
  );
}
