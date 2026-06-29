"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted ? resolvedTheme === "dark" : true;

  return (
    <button
      type="button"
      aria-label={isDark ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-brand-light-border bg-brand-light-surface text-slate-800 shadow-sm transition-colors duration-300 ease-in-out hover:border-brand-accent hover:text-brand-accent focus:outline-none focus:ring-2 focus:ring-brand-accent focus:ring-offset-2 focus:ring-offset-brand-light dark:border-brand-dark-border dark:bg-brand-dark-surface dark:text-brand-silver dark:shadow-none dark:hover:border-brand-accent dark:hover:text-brand-accent dark:focus:ring-offset-brand-dark"
    >
      {isDark ? <Sun aria-hidden className="h-5 w-5" /> : <Moon aria-hidden className="h-5 w-5" />}
    </button>
  );
}
