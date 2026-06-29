import type { ReactNode } from "react";
import { AlertTriangle, CheckCircle2, Loader2, ServerCrash } from "lucide-react";
import { cn } from "@/lib/cn";

type FeedbackTone = "loading" | "success" | "error" | "warning" | "info";

type FeedbackPanelProps = {
  title: string;
  message?: ReactNode;
  tone?: FeedbackTone;
  className?: string;
};

const toneClass: Record<FeedbackTone, string> = {
  loading:
    "border-brand-accent/25 bg-brand-accent/10 text-brand-accent dark:border-gold-300/25 dark:bg-gold-300/10 dark:text-gold-300",
  success:
    "border-emerald-300/60 bg-emerald-50 text-emerald-700 dark:border-emerald-300/25 dark:bg-emerald-300/10 dark:text-emerald-200",
  error:
    "border-red-300/70 bg-red-50 text-red-700 dark:border-red-300/25 dark:bg-red-300/10 dark:text-red-200",
  warning:
    "border-amber-300/70 bg-amber-50 text-amber-700 dark:border-amber-300/25 dark:bg-amber-300/10 dark:text-amber-200",
  info:
    "border-slate-200 bg-slate-50 text-slate-600 dark:border-silver-400/10 dark:bg-charcoal-900/70 dark:text-silver-300",
};

const iconByTone: Record<FeedbackTone, typeof AlertTriangle> = {
  loading: Loader2,
  success: CheckCircle2,
  error: ServerCrash,
  warning: AlertTriangle,
  info: AlertTriangle,
};

export function FeedbackPanel({
  title,
  message,
  tone = "info",
  className,
}: FeedbackPanelProps) {
  const Icon = iconByTone[tone];

  return (
    <div
      className={cn(
        "rounded-2xl border px-4 py-3 transition-colors duration-300 ease-in-out",
        toneClass[tone],
        className,
      )}
      role={tone === "error" ? "alert" : "status"}
    >
      <div className="flex items-start gap-3">
        <Icon
          className={cn("mt-0.5 h-4 w-4 shrink-0", tone === "loading" && "animate-spin")}
          aria-hidden="true"
        />
        <div>
          <p className="text-sm font-semibold">{title}</p>
          {message ? <div className="mt-1 text-sm opacity-85">{message}</div> : null}
        </div>
      </div>
    </div>
  );
}
