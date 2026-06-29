"use client";

import { ChangeEvent, FormEvent, useState } from "react";
import { ShieldCheck } from "lucide-react";
import { useBfaStore } from "@/store/bfaStore";
import type { UserDemographics } from "@/types/bfa";
import { DarkCard, PrimaryButton, TextInput } from "@/components/ui";

type WelcomeFieldElement = HTMLInputElement | HTMLSelectElement;

const genderOptions = [
  "Femenino",
  "Masculino",
  "Otro",
  "Prefiero no responder",
];

const educationLevelOptions = [
  "Primaria",
  "Secundaria",
  "Bachillerato",
  "Tecnico",
  "Licenciatura",
  "Maestria",
  "Doctorado",
  "Otro",
];

const initialForm: UserDemographics = {
  fullName: "",
  age: "",
  gender: "",
  educationLevel: "",
  institution: "",
};

export function WelcomeForm() {
  const setUser = useBfaStore((state) => state.setUser);
  const [form, setForm] = useState<UserDemographics>(initialForm);
  const [error, setError] = useState("");

  const updateField =
    (field: keyof UserDemographics) =>
    (event: ChangeEvent<WelcomeFieldElement>) => {
      setForm((currentForm) => ({
        ...currentForm,
        [field]: event.target.value,
      }));
      setError("");
    };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (
      !form.fullName.trim() ||
      !form.age.trim() ||
      !form.gender.trim() ||
      !form.educationLevel.trim()
    ) {
      setError("Complete los campos obligatorios antes de continuar.");
      return;
    }

    setUser({
      fullName: form.fullName.trim(),
      age: form.age.trim(),
      gender: form.gender.trim(),
      educationLevel: form.educationLevel.trim(),
      institution: form.institution?.trim(),
    });
  };

  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-10">
      <DarkCard className="w-full max-w-4xl">
        <div className="mb-8 flex items-start gap-4">
          <div className="rounded-2xl border border-gold-300/25 bg-gold-300/10 p-3 text-gold-300">
            <ShieldCheck className="h-6 w-6" aria-hidden="true" />
          </div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.32em] text-gold-300">
              BFA
            </p>
            <h1 className="mt-3 text-4xl font-semibold tracking-tight text-slate-900 transition-colors duration-300 ease-in-out dark:text-silver-50">
              Bateria Factorial de Aptitudes
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600 transition-colors duration-300 ease-in-out dark:text-silver-300">
              Complete sus datos basicos antes de iniciar. Una vez comenzada la
              evaluacion, el avance sera continuo y no se podra regresar a
              secciones previas.
            </p>
          </div>
        </div>

        <form className="grid gap-5" onSubmit={handleSubmit}>
          <div className="grid gap-5 md:grid-cols-2">
            <TextInput
              label="Nombre completo"
              name="fullName"
              value={form.fullName}
              onChange={updateField("fullName")}
              placeholder="Nombre y apellidos"
              autoComplete="name"
              required
            />
            <TextInput
              label="Edad"
              name="age"
              value={form.age}
              onChange={updateField("age")}
              placeholder="Ej. 28"
              inputMode="numeric"
              required
            />
            <label className="block" htmlFor="gender">
              <span className="mb-2 block text-sm font-medium text-slate-700 transition-colors duration-300 ease-in-out dark:text-silver-100">
                Genero
              </span>
              <select
                id="gender"
                name="gender"
                value={form.gender}
                onChange={updateField("gender")}
                required
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-base text-slate-900 outline-none transition-colors duration-300 ease-in-out focus:border-brand-accent/80 focus:ring-2 focus:ring-brand-accent/20 dark:border-silver-400/15 dark:bg-charcoal-900 dark:text-silver-50 dark:focus:border-gold-300/70 dark:focus:ring-gold-300/20"
              >
                <option value="">Seleccione una opcion</option>
                {genderOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>
            <label className="block" htmlFor="educationLevel">
              <span className="mb-2 block text-sm font-medium text-slate-700 transition-colors duration-300 ease-in-out dark:text-silver-100">
                Nivel educativo
              </span>
              <select
                id="educationLevel"
                name="educationLevel"
                value={form.educationLevel}
                onChange={updateField("educationLevel")}
                required
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-base text-slate-900 outline-none transition-colors duration-300 ease-in-out focus:border-brand-accent/80 focus:ring-2 focus:ring-brand-accent/20 dark:border-silver-400/15 dark:bg-charcoal-900 dark:text-silver-50 dark:focus:border-gold-300/70 dark:focus:ring-gold-300/20"
              >
                <option value="">Seleccione una opcion</option>
                {educationLevelOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <TextInput
            label="Institucion"
            name="institution"
            value={form.institution}
            onChange={updateField("institution")}
            placeholder="Opcional"
          />

          {error ? <p className="text-sm text-red-600 dark:text-red-300">{error}</p> : null}

          <div className="flex justify-end">
            <PrimaryButton type="submit">Continuar</PrimaryButton>
          </div>
        </form>
      </DarkCard>
    </main>
  );
}
