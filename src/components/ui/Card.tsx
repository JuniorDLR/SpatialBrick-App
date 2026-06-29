import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";

type CardVariant = "default" | "elevated" | "subtle";

type CardProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
  variant?: CardVariant;
};

const variantClass: Record<CardVariant, string> = {
  default:
    "border-brand-light-border bg-brand-light-surface shadow-xl shadow-slate-200/70 dark:border-silver-400/10 dark:bg-obsidian-900/90 dark:shadow-panel-dark",
  elevated:
    "border-slate-200 bg-white shadow-2xl shadow-slate-300/60 dark:border-silver-400/10 dark:bg-charcoal-900/95 dark:shadow-panel-dark",
  subtle:
    "border-slate-200 bg-slate-50 shadow-sm dark:border-silver-400/10 dark:bg-charcoal-900/70 dark:shadow-none",
};

export function Card({
  children,
  className,
  variant = "default",
  ...props
}: CardProps) {
  return (
    <div
      className={cn(
        "rounded-3xl border p-6 text-slate-800 backdrop-blur transition-colors duration-300 ease-in-out dark:text-silver-100 sm:p-8",
        variantClass[variant],
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
