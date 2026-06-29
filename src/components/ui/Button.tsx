import type { ButtonHTMLAttributes, ReactNode } from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/cn";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  fullWidth?: boolean;
  isLoading?: boolean;
  variant?: ButtonVariant;
};

const variantClass: Record<ButtonVariant, string> = {
  primary:
    "border-brand-accent/50 bg-gradient-to-b from-brand-accent-hover to-brand-accent text-brand-accent-foreground shadow-gold-soft hover:from-brand-accent-hover hover:to-brand-accent-muted focus:ring-brand-accent dark:border-gold-300/40 dark:from-gold-300 dark:to-gold-500 dark:text-obsidian-950 dark:hover:from-gold-300 dark:hover:to-gold-400 dark:focus:ring-gold-300",
  secondary:
    "border-slate-200 bg-white text-slate-700 shadow-sm hover:border-brand-accent/45 hover:bg-slate-50 hover:text-slate-950 focus:ring-brand-accent dark:border-silver-400/15 dark:bg-charcoal-900 dark:text-silver-100 dark:hover:border-gold-300/35 dark:hover:bg-charcoal-800 dark:hover:text-silver-50 dark:focus:ring-gold-300",
  ghost:
    "border-transparent bg-transparent text-slate-600 hover:bg-slate-100 hover:text-slate-950 focus:ring-brand-accent dark:text-silver-300 dark:hover:bg-silver-400/10 dark:hover:text-silver-50 dark:focus:ring-gold-300",
  danger:
    "border-red-300/70 bg-red-50 text-red-700 hover:bg-red-100 focus:ring-red-400 dark:border-red-300/30 dark:bg-red-400/10 dark:text-red-200 dark:hover:bg-red-400/15",
};

export function Button({
  children,
  className,
  disabled,
  fullWidth = false,
  isLoading = false,
  type = "button",
  variant = "primary",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-xl border px-6 py-3 text-sm font-semibold uppercase tracking-[0.18em] transition-colors duration-300 ease-in-out",
        "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-brand-light dark:focus:ring-offset-obsidian-950",
        "disabled:cursor-not-allowed disabled:opacity-50",
        variantClass[variant],
        fullWidth && "w-full",
        className,
      )}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
      ) : null}
      {children}
    </button>
  );
}
