"use client";

import { useState } from "react";
import { LogIn, Loader2, User } from "lucide-react";
import { useBfaStore } from "@/store/bfaStore";
import { DarkCard, PrimaryButton, TextInput } from "@/components/ui";
import { loginCandidato } from "@/services/api";

export function LoginView() {
  const setUser = useBfaStore((state) => state.setUser);
  const setPhase = useBfaStore((state) => state.setPhase);
  const [identificacion, setIdentificacion] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const idClean = identificacion.trim();
    if (!idClean) {
      setError("Por favor, ingrese su Cédula o Identificación.");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const data = await loginCandidato(idClean);
      // Login exitoso, guardamos el user parcial y vamos al dashboard
      setUser({
        identificacion: data.identificacion as string,
        fullName: data.nombreCompleto as string,
        birthDate: "",
        gender: "",
        educationLevel: "",
        email: "",
        phone: "",
        jobPosition: "",
        profession: "",
      });
      setPhase("dashboard");
    } catch (err: any) {
      // 404 significa que no existe
      if (err.message && err.message.includes("404")) {
        // Redirigir a registro con la identificacion precargada si quisieramos,
        // pero por ahora solo cambiamos de fase
        // Para pasar la identificacion a registro, la metemos en el store o la pide alla de nuevo
        setUser({
          identificacion: idClean,
          fullName: "",
          birthDate: "",
          gender: "",
          educationLevel: "",
          email: "",
          phone: "",
          jobPosition: "",
          profession: "",
        });
        setPhase("register");
      } else {
        setError(err.message || "Error al intentar iniciar sesión.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center p-6">
      <div className="w-full max-w-md animate-fade-in-up">
        <DarkCard className="relative overflow-hidden p-8 shadow-2xl">
          {/* Decorative background element */}
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-gradient-to-br from-coral-500/20 to-transparent blur-3xl" />
          
          <div className="relative z-10 mb-8 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-white to-slate-50 dark:from-onyx-800 dark:to-onyx-900 shadow-sm dark:shadow-inner ring-1 ring-slate-200 dark:ring-white/10">
              <User className="h-8 w-8 text-coral-500" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-silver-100">
              Acceso a Evaluaciones
            </h1>
            <p className="mt-2 text-sm text-slate-600 dark:text-silver-400">
              Ingrese su número de cédula o identificación para continuar
            </p>
          </div>

          <form onSubmit={handleSubmit} className="relative z-10 space-y-6">
            <TextInput
              id="identificacion"
              name="identificacion"
              label="Cédula / Identificación"
              placeholder="Ej. 001-000000-0000A"
              value={identificacion}
              onChange={(e) => {
                setIdentificacion(e.target.value);
                setError("");
              }}
              required
              disabled={isLoading}
            />

            {error && (
              <div className="animate-fade-in rounded-lg bg-red-500/10 p-4 text-sm text-red-400 border border-red-500/20">
                {error}
              </div>
            )}

            <PrimaryButton
              type="submit"
              disabled={isLoading}
              className="w-full py-3 text-lg flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin" />
                  Verificando...
                </>
              ) : (
                <>
                  <LogIn />
                  Entrar
                </>
              )}
            </PrimaryButton>

            <div className="pt-2 text-center text-sm text-slate-600 dark:text-silver-400">
              ¿Es tu primera vez aquí?{" "}
              <button
                type="button"
                onClick={() => setPhase("register")}
                className="font-semibold text-coral-500 hover:text-coral-600 dark:text-coral-400 dark:hover:text-coral-300 transition-colors"
              >
                Regístrate ahora
              </button>
            </div>
          </form>
        </DarkCard>
      </div>
    </div>
  );
}
