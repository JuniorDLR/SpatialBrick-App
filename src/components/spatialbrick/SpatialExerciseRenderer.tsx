"use client";

import { construirUrlImagen } from "@/services/api";
import { cn } from "@/lib/cn";
import { useTestStore } from "@/store/useTestStore";

function resolveImageSrc(imagenUrl: string | null): string | null {
  if (!imagenUrl) return null;
  if (imagenUrl.startsWith("http://") || imagenUrl.startsWith("https://")) {
    return imagenUrl;
  }
  if (imagenUrl.startsWith("/rest/")) {
    return imagenUrl;
  }
  if (/^\d+$/.test(imagenUrl)) {
    return construirUrlImagen(imagenUrl);
  }
  return imagenUrl;
}

export function SpatialExerciseRenderer() {
  const currentExerciseIndex = useTestStore((state) => state.currentExerciseIndex);
  const ejercicios = useTestStore((state) => state.ejercicios);
  const respuestas = useTestStore((state) => state.respuestas);
  const responderActual = useTestStore((state) => state.responderActual);

  const ejercicio = ejercicios[currentExerciseIndex];
  if (!ejercicio) {
    return null;
  }

  const selected = respuestas[ejercicio.numeroEjercicio] ?? null;
  const imageSrc = resolveImageSrc(ejercicio.imagenUrl);

  return (
    <section className="rounded-2xl border border-slate-200 bg-white/90 p-5 shadow-sm transition-colors duration-300 ease-in-out dark:border-silver-400/10 dark:bg-charcoal-900/65 dark:shadow-none">
      <header className="mb-4">
        <p className="text-sm uppercase tracking-[0.2em] text-slate-500 dark:text-silver-500">
          Ejercicio {ejercicio.numeroEjercicio}
        </p>
      </header>

      {imageSrc ? (
        <div className="mb-5 overflow-hidden rounded-xl border border-slate-200 bg-slate-50 p-2 transition-colors duration-300 ease-in-out dark:border-silver-400/10 dark:bg-obsidian-950">
          {/* API de SpatialBrick entrega URL directa; por contrato se inyecta en <img src="..."/> */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imageSrc}
            alt={`Ejercicio ${ejercicio.numeroEjercicio}`}
            className="h-auto w-full object-contain"
          />
        </div>
      ) : (
        <div className="mb-5 rounded-xl border border-slate-200 bg-slate-50 px-4 py-5 text-sm text-slate-500 transition-colors duration-300 ease-in-out dark:border-silver-400/10 dark:bg-obsidian-950 dark:text-silver-400">
          Este ejercicio no incluye imagen en la metadata.
        </div>
      )}

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {ejercicio.opciones.map((opcion) => {
          const isSelected = selected === opcion;
          return (
            <button
              key={opcion}
              type="button"
              onClick={() => responderActual(opcion)}
              className={cn(
                "rounded-xl border px-4 py-3 text-sm font-semibold transition-colors duration-300 ease-in-out",
                isSelected
                  ? "border-brand-accent/70 bg-brand-accent/15 text-brand-accent shadow-sm dark:border-gold-300/60 dark:bg-gold-300/10 dark:text-gold-300 dark:shadow-none"
                  : "border-slate-200 bg-slate-50 text-slate-700 hover:border-brand-accent/50 hover:bg-white dark:border-silver-400/15 dark:bg-obsidian-900 dark:text-silver-100 dark:hover:border-gold-300/35",
              )}
            >
              Opcion {opcion}
            </button>
          );
        })}
      </div>
    </section>
  );
}

