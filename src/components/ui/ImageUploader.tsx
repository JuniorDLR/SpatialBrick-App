"use client";

import { ChangeEvent, useState } from "react";
import { Upload } from "lucide-react";
import { buildMockUploadedImagePath } from "@/lib/bfaImageUtils";
import { cn } from "@/lib/cn";

type ImageUploaderProps = {
  onUploadComplete: (imageUrl: string) => void;
  className?: string;
  label?: string;
};

/**
 * Simula la subida de imagenes para pruebas espaciales.
 * El backend OpenXava podra reemplazar este flujo por una integracion real.
 */
export function ImageUploader({
  onUploadComplete,
  className,
  label = "Subir imagen (simulado)",
}: ImageUploaderProps) {
  const [lastUploadedPath, setLastUploadedPath] = useState<string | null>(null);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    const mockPath = buildMockUploadedImagePath(file.name);
    setLastUploadedPath(mockPath);
    onUploadComplete(mockPath);
    event.target.value = "";
  };

  return (
    <div className={cn("rounded-2xl border border-slate-200 bg-slate-50 p-4 transition-colors duration-300 ease-in-out dark:border-silver-400/10 dark:bg-charcoal-900/70", className)}>
      <label className="flex cursor-pointer flex-col items-center gap-3 text-center">
        <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl border border-gold-300/25 bg-gold-300/10 text-gold-300">
          <Upload className="h-5 w-5" aria-hidden="true" />
        </span>
        <span className="text-sm font-medium text-slate-800 dark:text-silver-100">{label}</span>
        <span className="text-xs text-slate-500 dark:text-silver-500">
          Se generara una ruta local mock en public/assets/bfa-images/uploads/
        </span>
        <input
          type="file"
          accept="image/png,image/jpeg,image/webp,image/svg+xml"
          onChange={handleFileChange}
          className="sr-only"
        />
      </label>
      {lastUploadedPath ? (
        <p className="mt-3 break-all rounded-xl border border-slate-200 bg-white px-3 py-2 font-mono text-xs text-slate-500 transition-colors duration-300 ease-in-out dark:border-silver-400/10 dark:bg-obsidian-950 dark:text-silver-400">
          {lastUploadedPath}
        </p>
      ) : null}
    </div>
  );
}
