"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Clock3 } from "lucide-react";
import { cn } from "@/lib/cn";

type TimerProps = {
  minutes: number;
  sectionKey: string;
  onExpire: () => void;
  className?: string;
  isRunning?: boolean;
  onTick?: (secondsRemaining: number) => void;
};

const formatTime = (totalSeconds: number) => {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
};

export function Timer({
  minutes,
  sectionKey,
  onExpire,
  className,
  isRunning = true,
  onTick,
}: TimerProps) {
  const initialSeconds = useMemo(
    () => Math.max(0, Math.round(minutes * 60)),
    [minutes],
  );
  const [secondsRemaining, setSecondsRemaining] = useState(initialSeconds);
  const hasExpiredRef = useRef(false);
  const onExpireRef = useRef(onExpire);
  const onTickRef = useRef(onTick);

  useEffect(() => {
    onExpireRef.current = onExpire;
    onTickRef.current = onTick;
  }, [onExpire, onTick]);

  useEffect(() => {
    hasExpiredRef.current = false;
    setSecondsRemaining(initialSeconds);
    onTickRef.current?.(initialSeconds);
  }, [initialSeconds, sectionKey]);

  useEffect(() => {
    if (!isRunning || hasExpiredRef.current) {
      return;
    }

    if (secondsRemaining <= 0) {
      hasExpiredRef.current = true;
      onExpireRef.current();
      return;
    }

    const intervalId = window.setInterval(() => {
      setSecondsRemaining((currentSeconds) => {
        const nextSeconds = Math.max(0, currentSeconds - 1);
        onTickRef.current?.(nextSeconds);
        return nextSeconds;
      });
    }, 1000);

    return () => window.clearInterval(intervalId);
  }, [isRunning, secondsRemaining]);

  const isCritical = secondsRemaining <= 60;

  return (
    <div
      aria-live="polite"
      role="timer"
      className={cn(
        "inline-flex items-center gap-3 rounded-2xl border border-brand-accent/25 bg-white px-4 py-3 text-brand-accent shadow-sm transition-colors duration-300 ease-in-out dark:border-gold-300/25 dark:bg-charcoal-900/95 dark:text-gold-300 dark:shadow-gold-soft",
        isCritical && "animate-pulse border-red-400/50 text-red-600 dark:border-red-300/50 dark:text-red-200",
        className,
      )}
    >
      <Clock3 className="h-5 w-5 shrink-0" aria-hidden="true" />
      <div className="flex flex-col">
        <span className="text-[10px] uppercase tracking-[0.24em] text-slate-500 dark:text-silver-500">
          Tiempo restante
        </span>
        <span className="font-mono text-xl font-semibold tracking-[0.18em]">
          {formatTime(secondsRemaining)}
        </span>
      </div>
      <span className="sr-only">
        Tiempo restante: {formatTime(secondsRemaining)}
      </span>
    </div>
  );
}
