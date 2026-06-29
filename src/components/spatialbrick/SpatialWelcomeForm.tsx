"use client";

import { FormEvent, useState } from "react";
import { useTestStore } from "@/store/useTestStore";
import { DarkCard, FeedbackPanel, PrimaryButton, TextInput } from "@/components/ui";

export function SpatialWelcomeForm() {
  const iniciarFlujo = useTestStore((state) => state.iniciarFlujo);
  const phase = useTestStore((state) => state.phase);
  const errorMessage = useTestStore((state) => state.errorMessage);
  const [form, setForm] = useState({
    nombre: "",
    edad: "",
    genero: "",
    escolaridad: "",
    email: "",
    codigoTest: "LCA-001",
  });

  const isBusy = phase === "loading";

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!form.nombre.trim() || !form.codigoTest.trim()) return;

    await iniciarFlujo({
      candidato: {
        nombre: form.nombre.trim(),
        edad: form.edad.trim(),
        genero: form.genero.trim(),
        escolaridad: form.escolaridad.trim(),
        email: form.email.trim(),
      },
      codigoTest: form.codigoTest.trim(),
    });
  };

  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-10">
      <DarkCard className="w-full max-w-4xl">
        <p className="text-sm font-semibold uppercase tracking-[0.32em] text-gold-300">
          SpatialBrick API
        </p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight text-slate-900 transition-colors duration-300 ease-in-out dark:text-silver-50">
          Inicio de Test Psicometrico
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600 transition-colors duration-300 ease-in-out dark:text-silver-300">
          Registro del candidato y carga dinamica de metadata desde la API REST.
        </p>

        <form className="mt-8 grid gap-5" onSubmit={onSubmit}>
          <div className="grid gap-5 md:grid-cols-2">
            <TextInput
              label="Nombre"
              name="nombre"
              value={form.nombre}
              onChange={(e) => setForm((p) => ({ ...p, nombre: e.target.value }))}
              required
            />
            <TextInput
              label="Codigo Test"
              name="codigoTest"
              value={form.codigoTest}
              onChange={(e) =>
                setForm((p) => ({ ...p, codigoTest: e.target.value }))
              }
              required
            />
            <TextInput
              label="Edad"
              name="edad"
              value={form.edad}
              onChange={(e) => setForm((p) => ({ ...p, edad: e.target.value }))}
            />
            <TextInput
              label="Genero"
              name="genero"
              value={form.genero}
              onChange={(e) => setForm((p) => ({ ...p, genero: e.target.value }))}
            />
            <TextInput
              label="Escolaridad"
              name="escolaridad"
              value={form.escolaridad}
              onChange={(e) =>
                setForm((p) => ({ ...p, escolaridad: e.target.value }))
              }
            />
            <TextInput
              label="Email"
              name="email"
              type="email"
              value={form.email}
              onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
            />
          </div>

          {isBusy ? (
            <FeedbackPanel
              title="Conectando con SpatialBrick"
              message="Estamos iniciando el intento y cargando la estructura del test."
              tone="loading"
            />
          ) : null}

          {errorMessage ? (
            <FeedbackPanel
              title="No se pudo iniciar el test"
              message={errorMessage}
              tone="error"
            />
          ) : null}

          <div className="flex justify-end">
            <PrimaryButton type="submit" disabled={isBusy} isLoading={isBusy}>
              {isBusy ? "Cargando..." : "Iniciar Test"}
            </PrimaryButton>
          </div>
        </form>
      </DarkCard>
    </main>
  );
}

