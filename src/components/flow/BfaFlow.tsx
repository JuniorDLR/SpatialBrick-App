"use client";

import { useState, useEffect } from "react";
import { useBfaStore } from "@/store/bfaStore";
import { LoginView } from "./LoginView";
import { DashboardView } from "./DashboardView";
import { WelcomeForm as RegisterView } from "./WelcomeForm";
import { InstructionsView } from "./InstructionsView";
import { SectionTestView } from "@/components/exam/SectionTestView";
import { ThankYouView } from "./ThankYouView";

export function BfaFlow() {
  const phase = useBfaStore((state) => state.phase);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  // Sincronizar URL con la fase usando Hash (#) para evitar 404 al recargar
  useEffect(() => {
    if (isHydrated) {
      const hash = phase === "login" ? "" : `#${phase}`;
      if (window.location.hash !== hash && window.location.hash !== `#${phase}`) {
        // Usar pushState para que se guarde en el historial del navegador
        window.history.pushState(null, "", hash || "/");
      }
    }
  }, [phase, isHydrated]);

  // Manejar los botones de Atrás y Adelante del navegador
  useEffect(() => {
    if (!isHydrated) return;

    const handlePopState = () => {
      const hash = window.location.hash.replace("#", "");
      
      // Si el hash está vacío, es el login
      if (!hash) {
        useBfaStore.setState({ phase: "login" });
        return;
      }

      // Validamos fases conocidas
      const validPhases = ["login", "register", "dashboard", "instructions", "test", "completed"];
      if (validPhases.includes(hash)) {
        useBfaStore.setState({ phase: hash as any });
      }
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [isHydrated]);

  if (!isHydrated) {
    return null; // Prevents mismatch on hydration
  }

  // Rutador principal SPA
  switch (phase) {
    case "login":
      return <LoginView />;
    case "register":
    case "welcome":
      return <RegisterView />;
    case "dashboard":
      return <DashboardView />;
    case "instructions":
      return <InstructionsView />;
    case "test":
      return <SectionTestView />;
    case "completed":
      return <ThankYouView />;
    default:
      return (
        <div className="flex h-screen items-center justify-center text-red-500">
          Error: Phase "{phase}" no reconocida.
        </div>
      );
  }
}
