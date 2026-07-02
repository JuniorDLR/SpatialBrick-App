export type CandidatoData = {
  identificacion?: string;
  nombreCompleto: string;
  fechaNacimiento?: string;
  genero?: string;
  nivelEducativo?: string;
  email?: string;
  telefono?: string;
  puestoAplica?: string;
  profesion?: string;
  [key: string]: unknown;
};

export type IniciarTestResponse = {
  idIntento: string | number;
  codigoTest?: string;
};

export type EjercicioApi = {
  numeroEjercicio: number;
  imagenUrl?: string | null;
  opciones?: Array<
    | string
    | {
        id?: string;
        opcion?: string;
        texto?: string;
        label?: string;
      }
  >;
};

export type EstructuraTestResponse = {
  codigoTest?: string;
  instrucciones?: string;
  tiempoLimiteSegundos: number;
  ejercicios: EjercicioApi[];
};

export type FinalizarRespuestaItem = {
  numeroEjercicio: number;
  opcionElegida: string | null;
};

type JsonRecord = Record<string, unknown>;

async function fetchJson<T>(input: RequestInfo | URL, init?: RequestInit): Promise<T> {
  const response = await fetch(input, init);
  if (!response.ok) {
    const fallbackMessage = `Error HTTP ${response.status}`;
    let detail = fallbackMessage;
    try {
      const raw = await response.text();
      try {
        const json = JSON.parse(raw);
        detail = json.error || raw || fallbackMessage;
      } catch {
        detail = raw || fallbackMessage;
      }
    } catch {
      detail = fallbackMessage;
    }
    throw new Error(detail);
  }

  return (await response.json()) as T;
}

function asNumber(value: unknown, fallback = 0): number {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim()) {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : fallback;
  }
  return fallback;
}

function normalizeEstructuraTest(payload: unknown): EstructuraTestResponse {
  const data = (payload ?? {}) as JsonRecord;

  const ejerciciosRaw = Array.isArray(data.ejercicios) ? data.ejercicios : [];
  const ejercicios = ejerciciosRaw.map((raw, index) => {
    const item = (raw ?? {}) as JsonRecord;
    return {
      numeroEjercicio: asNumber(item.numeroEjercicio, index + 1),
      imagenUrl:
        typeof item.imagenUrl === "string"
          ? item.imagenUrl
          : item.imagenUrl === null
            ? null
            : undefined,
      opciones: Array.isArray(item.opciones)
        ? (item.opciones as EstructuraTestResponse["ejercicios"][number]["opciones"])
        : undefined,
    };
  });

  return {
    codigoTest: typeof data.codigoTest === "string" ? data.codigoTest : undefined,
    instrucciones:
      typeof data.instrucciones === "string" ? data.instrucciones : undefined,
    tiempoLimiteSegundos: Math.max(0, asNumber(data.tiempoLimiteSegundos, 0)),
    ejercicios,
  };
}

export async function loginCandidato(identificacion: string): Promise<JsonRecord> {
  return fetchJson<JsonRecord>(`/rest/candidatos/${encodeURIComponent(identificacion)}/login`);
}

export async function registrarCandidato(candidatoData: CandidatoData): Promise<JsonRecord> {
  return fetchJson<JsonRecord>("/rest/candidatos/registro", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(candidatoData),
  });
}

export async function obtenerTestsCandidato(identificacion: string): Promise<any[]> {
  return fetchJson<any[]>(`/rest/candidatos/${encodeURIComponent(identificacion)}/tests`);
}

export async function iniciarTest(
  identificacion: string,
  codigoTest: string,
): Promise<IniciarTestResponse> {
  const data = await fetchJson<JsonRecord>(`/rest/candidatos/${encodeURIComponent(identificacion)}/test/${encodeURIComponent(codigoTest)}/iniciar`, {
    method: "POST",
  });

  const idIntento = data.idIntento ?? data.id ?? data.intentoId;
  if (idIntento === undefined || idIntento === null) {
    throw new Error("La API no devolvio idIntento.");
  }

  return {
    idIntento: idIntento as string | number,
    codigoTest: typeof data.codigoTest === "string" ? data.codigoTest : codigoTest,
  };
}

export async function obtenerEstructuraTest(
  codigoTest: string,
): Promise<EstructuraTestResponse> {
  const data = await fetchJson<unknown>(`/rest/test/${encodeURIComponent(codigoTest)}`);
  return normalizeEstructuraTest(data);
}

export function construirUrlImagen(urlOrId: string | number): string {
  const str = String(urlOrId);
  if (str.startsWith("/")) return str; // Si ya viene con "/rest/...", lo retornamos tal cual
  return `/rest/test/imagen/${encodeURIComponent(str)}`;
}

export async function finalizarTest(
  idIntento: string | number,
  respuestas: FinalizarRespuestaItem[],
  minutosConsumidos: number,
  segundosConsumidos: number
): Promise<JsonRecord> {
  return fetchJson<JsonRecord>(
    `/rest/intentos/${encodeURIComponent(String(idIntento))}/finalizar`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ respuestas, minutosConsumidos, segundosConsumidos }),
    },
  );
}

