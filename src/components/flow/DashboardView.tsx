"use client";

import { useEffect, useState } from "react";
import { Play, CheckCircle2, Lock, Loader2, User, LogOut } from "lucide-react";
import { useBfaStore } from "@/store/bfaStore";
import { Card, PrimaryButton } from "@/components/ui";
import { obtenerTestsCandidato, iniciarTest, obtenerEstructuraTest } from "@/services/api";

type TestStatus = {
  codigoTest: string;
  nombreTest: string;
  estado: "DISPONIBLE" | "COMPLETADO" | "INACTIVO";
};

export function DashboardView() {
  const user = useBfaStore((state) => state.user);
  const setupTest = useBfaStore((state) => state.setupTest);
  
  const [tests, setTests] = useState<TestStatus[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isStarting, setIsStarting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (user?.identificacion) {
      loadTests(user.identificacion);
    }
  }, [user]);

  const loadTests = async (identificacion: string) => {
    try {
      const data = await obtenerTestsCandidato(identificacion);
      setTests(data);
      setIsLoading(false);
    } catch (err: any) {
      handleLogout();
    }
  };

  const handleStartTest = async (codigoTest: string) => {
    if (!user?.identificacion) return;
    
    setIsStarting(true);
    setError("");

    try {
      const data = await iniciarTest(user.identificacion, codigoTest);
      const testData = await obtenerEstructuraTest(codigoTest);
      
      setupTest(data.idIntento, testData);
    } catch (err: any) {
      handleLogout();
    }
  };

  const handleLogout = () => {
    // Para hacer logout, blanqueamos el store y volvemos al login
    useBfaStore.setState({ user: null, phase: "login", idIntento: null, answers: {} });
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-coral-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-transparent">
      {/* Decorative gradient header background */}
      <div className="absolute inset-x-0 top-0 h-64 bg-gradient-to-b from-slate-200/50 to-transparent dark:from-onyx-800/50" />
      
      <div className="relative mx-auto max-w-4xl p-6 pt-12 animate-fade-in-up">
        <div className="mb-12 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-silver-100">
            Panel de Evaluaciones
          </h1>
          <p className="mt-2 text-slate-600 dark:text-silver-400">
            Bienvenido/a, <span className="font-semibold text-slate-800 dark:text-silver-200">{user?.fullName}</span>
          </p>
        </div>
        <div className="flex gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white dark:bg-onyx-800 ring-1 ring-slate-200 dark:ring-white/10 shadow-sm">
            <User className="h-6 w-6 text-coral-500" />
          </div>
          <button 
            onClick={handleLogout}
            title="Cerrar sesión"
            className="flex h-12 w-12 items-center justify-center rounded-full bg-white dark:bg-onyx-800 ring-1 ring-slate-200 dark:ring-white/10 shadow-sm text-slate-500 hover:text-coral-500 dark:text-silver-400 dark:hover:text-coral-400 transition-colors"
          >
            <LogOut className="h-5 w-5" />
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-8 rounded-lg bg-red-500/10 p-4 text-red-400 border border-red-500/20">
          {error}
        </div>
      )}

      <h2 className="mb-6 text-xl font-semibold text-slate-800 dark:text-silver-200">Pruebas Asignadas</h2>

      {tests.length === 0 ? (
        <Card variant="elevated" className="p-12 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 dark:bg-onyx-800">
            <Lock className="h-8 w-8 text-slate-400 dark:text-silver-500" />
          </div>
          <p className="text-lg text-slate-600 dark:text-silver-400">No tienes ninguna prueba asignada en este momento.</p>
        </Card>
      ) : (
        <div className="grid gap-8 md:grid-cols-2">
          {tests.map((test) => (
            <Card variant="elevated" key={test.codigoTest} className="relative overflow-hidden p-8 transition-all hover:-translate-y-1 hover:shadow-2xl">
              {test.estado === "DISPONIBLE" && (
                <div className="absolute right-0 top-0 h-16 w-16 -translate-y-8 translate-x-8 rounded-full bg-coral-500/20 blur-xl" />
              )}
              
              <div className="mb-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-medium text-coral-400">
                    COD: {test.codigoTest}
                  </span>
                  {test.estado === "COMPLETADO" && (
                    <span className="flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-400">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      Completado
                    </span>
                  )}
                  {test.estado === "INACTIVO" && (
                    <span className="flex items-center gap-1 rounded-full bg-slate-100 dark:bg-onyx-700 px-2.5 py-1 text-xs font-medium text-slate-500 dark:text-silver-500">
                      <Lock className="h-3.5 w-3.5" />
                      Inactivo
                    </span>
                  )}
                </div>
                <h3 className="mt-3 text-xl font-bold text-slate-900 dark:text-silver-100">{test.nombreTest}</h3>
              </div>

              <div className="mt-8">
                {test.estado === "DISPONIBLE" ? (
                  <PrimaryButton
                    onClick={() => handleStartTest(test.codigoTest)}
                    disabled={isStarting}
                    className="w-full flex items-center justify-center gap-2"
                  >
                    {isStarting ? (
                      <>
                        <Loader2 className="animate-spin" />
                        Iniciando...
                      </>
                    ) : (
                      <>
                        <Play className="h-4 w-4" />
                        Iniciar Evaluación
                      </>
                    )}
                  </PrimaryButton>
                ) : (
                  <button
                    disabled
                    className="w-full rounded-xl bg-slate-100 dark:bg-onyx-800/50 py-3 text-sm font-semibold text-slate-400 dark:text-silver-500 ring-1 ring-inset ring-slate-200 dark:ring-white/5"
                  >
                    {test.estado === "COMPLETADO" ? "Evaluación finalizada" : "No disponible actualmente"}
                  </button>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
      </div>
    </div>
  );
}
