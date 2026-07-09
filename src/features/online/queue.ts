// Cola de reintentos del submit online — capa PURA (sin React, sin red).
// PROPIEDAD: frontend-engineer. Contrato: docs/roadmap.md §C.
//
// Si un submit falla por red/5xx (o llega un 412 sin apodo), se encola en
// localStorage bajo una clave versionada y se reintenta al volver online, al
// arrancar la app y tras completar el onboarding. Los 422 (payload inválido) se
// DESCARTAN: reintentarlos no los arregla. Toda lectura es defensiva.
import type { SubmitPayload } from './types';

const QUEUE_KEY = 'banderas:submit-queue:v1';
// Techo defensivo: una cola sin límite podría crecer sin fin si el backend
// estuviera caído mucho tiempo. Al pasarse, se descartan los más viejos.
const MAX_QUEUE = 50;
// Caducidad: un ítem que lleva encolado demasiado (p. ej. un 401 eterno o una
// ronda que ya no interesa) se purga en vez de reintentarse por siempre.
export const QUEUE_MAX_AGE_MS = 14 * 24 * 60 * 60 * 1000; // 14 días

export interface QueuedSubmit {
  id: string; // identidad de la ronda (dedupe): seed+categoría+modo
  payload: SubmitPayload;
  enqueuedAt: number; // Date.now()
}

/**
 * Identidad de un submit para dedupe. La `seed` es un uint32 aleatorio por
 * ronda, así que basta para distinguir partidas; se añaden categoría y modo por
 * claridad y robustez.
 */
export function submitId(payload: SubmitPayload): string {
  return `${payload.seed}:${payload.categoryId}:${payload.mode}`;
}

// ── Clasificación del resultado HTTP del submit (pura, testeable) ─────────────
export type SubmitClass =
  | 'ok' // 200: guardado
  | 'needs-profile' // 412: falta fila en players
  | 'needs-session' // 401: sin sesión válida
  | 'discard' // 400/422: payload inválido, no reintentar
  | 'retry'; // red (status 0), 5xx, 429, cualquier otro: reintentar luego

/**
 * Traduce el status HTTP de submit-score a una acción. `0` = fallo de red (sin
 * respuesta). Ver contrato de errores en docs/roadmap.md §C.
 */
export function classifySubmit(status: number): SubmitClass {
  if (status === 200) return 'ok';
  if (status === 401) return 'needs-session';
  if (status === 412) return 'needs-profile';
  if (status === 400 || status === 422) return 'discard';
  return 'retry'; // 0 (red), 5xx, 429, etc.
}

/** ¿El item tiene la forma mínima esperada? (defensa contra JSON corrupto). */
function isValidItem(item: unknown): item is QueuedSubmit {
  if (item == null || typeof item !== 'object') return false;
  const it = item as Record<string, unknown>;
  if (typeof it.id !== 'string') return false;
  const p = it.payload as Record<string, unknown> | undefined;
  return (
    p != null &&
    typeof p === 'object' &&
    typeof p.seed === 'number' &&
    typeof p.categoryId === 'string' &&
    typeof p.mode === 'string' &&
    Array.isArray(p.answers)
  );
}

/**
 * Descarta ítems más antiguos que `maxAgeMs` (por defecto 14 días). Puro: la hora
 * se inyecta para poder testear. No muta el array original.
 */
export function pruneExpired(
  queue: QueuedSubmit[],
  now: number = Date.now(),
  maxAgeMs: number = QUEUE_MAX_AGE_MS,
): QueuedSubmit[] {
  return queue.filter((q) => now - q.enqueuedAt < maxAgeMs);
}

/** Carga la cola de localStorage. Corrupta/ausente → `[]`; filtra inválidos y caducados. */
export function loadQueue(): QueuedSubmit[] {
  try {
    const raw = localStorage.getItem(QUEUE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return pruneExpired(parsed.filter(isValidItem));
  } catch {
    return [];
  }
}

/** Persiste la cola. Silencioso si localStorage no está disponible. */
export function saveQueue(queue: QueuedSubmit[]): void {
  try {
    localStorage.setItem(QUEUE_KEY, JSON.stringify(queue));
  } catch {
    // best-effort: si el storage está lleno/bloqueado, se ignora.
  }
}

/**
 * Encola un submit SIN mutar el array original. Dedupe por `id`: si la ronda ya
 * estaba en cola, se reemplaza (misma identidad → un solo intento pendiente).
 * Recorta al tope descartando los más antiguos.
 */
export function enqueue(queue: QueuedSubmit[], item: QueuedSubmit): QueuedSubmit[] {
  const withoutDup = queue.filter((q) => q.id !== item.id);
  const next = [...withoutDup, item];
  return next.length > MAX_QUEUE ? next.slice(next.length - MAX_QUEUE) : next;
}

/** Quita un item por `id` SIN mutar el array original. */
export function removeFromQueue(queue: QueuedSubmit[], id: string): QueuedSubmit[] {
  return queue.filter((q) => q.id !== id);
}
