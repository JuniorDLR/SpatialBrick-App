"use client";

import React, { useState, type ChangeEvent } from "react";
import { ShieldCheck, Loader2 } from "lucide-react";
import { useBfaStore } from "@/store/bfaStore";
import type { UserDemographics } from "@/types/bfa";
import { DarkCard, PrimaryButton, TextInput } from "@/components/ui";
import { registrarCandidato, type CandidatoData } from "@/services/api";

type WelcomeFieldElement = HTMLInputElement | HTMLSelectElement;

const genderOptions = [
  { label: "Femenino", value: "FEMENINO" },
  { label: "Masculino", value: "MASCULINO" },
  { label: "Otro", value: "OTRO" },
];

const educationLevelOptions = [
  { label: "Primaria", value: "PRIMARIA" },
  { label: "Secundaria", value: "SECUNDARIA" },
  { label: "Bachillerato", value: "BACHILLERATO" },
  { label: "Técnico", value: "TECNICO" },
  { label: "Licenciatura", value: "LICENCIATURA" },
  { label: "Maestría", value: "MAESTRIA" },
  { label: "Doctorado", value: "DOCTORADO" },
  { label: "Otro", value: "OTRO" },
];

const jobPositionOptions = [
  { label: "Ingeniería Civil", value: "INGENIERIA_CIVIL" },
  { label: "Ingeniería Mecánica", value: "INGENIERIA_MECANICA" },
  { label: "Ingeniería Industrial", value: "INGENIERIA_INDUSTRIAL" },
  { label: "Topografía", value: "TOPOGRAFIA" },
  { label: "Mecatrónica", value: "MECATRONICA" },
  { label: "Arquitectura", value: "ARQUITECTURA" },
  { label: "Diseño Gráfico", value: "DISENO_GRAFICO" },
  { label: "Diseño de Interiores", value: "DISENO_DE_INTERIORES" },
  { label: "Diseño Industrial", value: "DISENO_INDUSTRIAL" },
  { label: "Artes Plásticas", value: "ARTES_PLASTICAS" },
  { label: "Dibujo Técnico CAD", value: "DIBUJO_TECNICO_CAD" },
  { label: "Animación 3D", value: "ANIMACION_3D" },
  { label: "Cirugía Especializada", value: "CIRUGIA_ESPECIALIZADA" },
  { label: "Odontología", value: "ODONTOLOGIA" },
  { label: "Piloto de Aviación", value: "PILOTO_AVIACION" },
  { label: "Control de Tráfico Aéreo", value: "CONTROL_TRAFICO_AEREO" },
  { label: "Física Cuántica", value: "FISICA_CUANTICA" },
  { label: "Robótica y Automatización", value: "ROBOTICA_Y_AUTOMATIZACION" },
  { label: "Desarrollo de Videojuegos", value: "DESARROLLO_VIDEOJUEGOS" },
  { label: "Otro", value: "OTRO" },
];

const initialForm: UserDemographics = {
  identificacion: "",
  fullName: "",
  birthDate: "",
  gender: "",
  educationLevel: "",
  email: "",
  phone: "",
  jobPosition: "",
  profession: "",
};

export function WelcomeForm() {
  const storeUser = useBfaStore((state) => state.user);
  const setUser = useBfaStore((state) => state.setUser);
  const setPhase = useBfaStore((state) => state.setPhase);
  const [form, setForm] = useState<UserDemographics>(() => ({
    ...initialForm,
    identificacion: storeUser?.identificacion || "",
  }));
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateField =
    (field: keyof UserDemographics) =>
    (event: ChangeEvent<WelcomeFieldElement>) => {
      setForm((currentForm) => ({
        ...currentForm,
        [field]: event.target.value,
      }));
      setError("");
    };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (
      !form.identificacion.trim() ||
      !form.fullName.trim() ||
      !form.birthDate.trim() ||
      !form.gender.trim() ||
      !form.educationLevel.trim() ||
      !form.email.trim() ||
      !form.phone.trim() ||
      !form.jobPosition.trim() ||
      !form.profession.trim()
    ) {
      setError("Complete todos los campos obligatorios antes de continuar.");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const candidatoData = {
        identificacion: form.identificacion.trim(),
        nombreCompleto: form.fullName.trim(),
        fechaNacimiento: new Date(form.birthDate).toISOString(),
        genero: form.gender,
        nivelEducativo: form.educationLevel,
        email: form.email.trim(),
        telefono: form.phone.trim(),
        puestoAplica: form.jobPosition,
        profesion: form.profession.trim(),
      };

      await registrarCandidato(candidatoData);

      setUser({
        identificacion: form.identificacion.trim(),
        fullName: form.fullName.trim(),
        birthDate: form.birthDate.trim(),
        gender: form.gender,
        educationLevel: form.educationLevel,
        email: form.email.trim(),
        phone: form.phone.trim(),
        jobPosition: form.jobPosition,
        profession: form.profession.trim(),
      });
      // El setUser ya cambia la phase a dashboard, pero aseguramos:
      setPhase("dashboard");
    } catch (err: any) {
      setError(err.message || "Error al registrar sus datos.");
      setIsSubmitting(false);
    }
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
          <div className="grid gap-6 md:grid-cols-2">
            <TextInput
              id="identificacion"
              name="identificacion"
              label="Cédula / Identificación *"
              placeholder="Ej. 001-000000-0000A"
              value={form.identificacion}
              onChange={updateField("identificacion")}
              required
              disabled={!!storeUser?.identificacion}
            />
            <TextInput
              id="fullName"
              name="fullName"
              label="Nombre Completo *"
              placeholder="Ej. María Pérez"
              value={form.fullName}
              onChange={updateField("fullName")}
              required
            />
            <TextInput
              label="Fecha de Nacimiento *"
              name="birthDate"
              value={form.birthDate}
              onChange={updateField("birthDate")}
              placeholder="dd/mm/aaaa"
              type="date"
              required
            />
            <TextInput
              label="Correo electrónico *"
              name="email"
              value={form.email}
              onChange={updateField("email")}
              placeholder="correo@ejemplo.com"
              type="email"
              required
            />
            <TextInput
              label="Teléfono (con prefijo +) *"
              name="phone"
              value={form.phone}
              onChange={updateField("phone")}
              placeholder="Ej. +505 8888 8888"
              type="tel"
              required
            />
            <label className="block" htmlFor="gender">
              <span className="mb-2 block text-sm font-medium text-slate-700 transition-colors duration-300 ease-in-out dark:text-silver-100">
                Género *
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
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
            <label className="block" htmlFor="educationLevel">
              <span className="mb-2 block text-sm font-medium text-slate-700 transition-colors duration-300 ease-in-out dark:text-silver-100">
                Nivel educativo *
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
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
            <label className="block" htmlFor="jobPosition">
              <span className="mb-2 block text-sm font-medium text-slate-700 transition-colors duration-300 ease-in-out dark:text-silver-100">
                Puesto al que aplica *
              </span>
              <select
                id="jobPosition"
                name="jobPosition"
                value={form.jobPosition}
                onChange={updateField("jobPosition")}
                required
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-base text-slate-900 outline-none transition-colors duration-300 ease-in-out focus:border-brand-accent/80 focus:ring-2 focus:ring-brand-accent/20 dark:border-silver-400/15 dark:bg-charcoal-900 dark:text-silver-50 dark:focus:border-gold-300/70 dark:focus:ring-gold-300/20"
              >
                <option value="">Seleccione una opcion</option>
                {jobPositionOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
            <TextInput
              label="Profesión *"
              name="profession"
              value={form.profession}
              onChange={updateField("profession")}
              placeholder="Ej. Arquitecto"
              required
            />
          </div>

          {error ? <p className="text-sm text-red-600 dark:text-red-300">{error}</p> : null}

          <div className="flex justify-end">
            <PrimaryButton type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Iniciando...
                </>
              ) : (
                "Continuar"
              )}
            </PrimaryButton>
          </div>
        </form>
      </DarkCard>
    </main>
  );
}
