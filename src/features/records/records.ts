// Récords locales del modo competitivo — capa PURA (sin React, sin estado).
// PROPIEDAD: frontend-engineer. Contrato: docs/competitivo.md §5 (Fase 1).
//
// La mejor marca se guarda por (categoría, modo de ronda). Persistencia en
// localStorage bajo una clave versionada; toda lectura es defensiva (JSON
// corrupto o storage no disponible → mapa vacío) para no romper la app.
import type { CategoryId } from '../game/categories';
import type { RoundMode } from '../game/types';

// Clave de récord: categoría + modo de ronda (§3.2). Hoy siempre '<cat>:mixto';
// la futura variante escrita añadiría '<cat>:type-name' sin migración.
export type RecordKey = `${CategoryId}:${RoundMode}`;

export interface RecordEntry {
  points: number;
  correct: number;
  total: number;
  maxStreak: number;
  // Suma de elapsedMs de las respuestas (= Score.answeredMs): solo el tiempo
  // respondiendo; el tiempo leyendo la ficha entre preguntas no cuenta (§5).
  durationMs: number;
  achievedAt: number; // Date.now() de cuándo se logró
}

/** Mapa persistido: clave de récord → mejor marca. */
export type RecordsMap = Partial<Record<RecordKey, RecordEntry>>;

const STORAGE_KEY = 'banderas:records:v1';

/** Construye la clave de récord de una (categoría, modo). */
export function recordKey(categoryId: CategoryId, mode: RoundMode): RecordKey {
  return `${categoryId}:${mode}`;
}

/**
 * ¿`a` es ESTRICTAMENTE mejor marca que `b`? Criterios en orden: más `points`
 * → más `correct` → menor `durationMs`. Estricto: un empate total devuelve
 * `false` (no se pisa un récord idéntico, solo se supera de verdad).
 */
export function isBetter(a: RecordEntry, b: RecordEntry): boolean {
  if (a.points !== b.points) return a.points > b.points;
  if (a.correct !== b.correct) return a.correct > b.correct;
  return a.durationMs < b.durationMs;
}

/** Carga el mapa de récords de localStorage. Corrupto/ausente → `{}`. */
export function loadRecords(): RecordsMap {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed: unknown = JSON.parse(raw);
    // Un JSON válido pero que no sea un objeto (p. ej. "5", "[]") se descarta.
    if (parsed == null || typeof parsed !== 'object' || Array.isArray(parsed)) {
      return {};
    }
    return parsed as RecordsMap;
  } catch {
    return {}; // JSON corrupto o localStorage no disponible.
  }
}

/** Persiste el mapa de récords. Silencioso si localStorage no está disponible. */
export function saveRecords(records: RecordsMap): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
  } catch {
    // Storage lleno o bloqueado: los récords son best-effort, se ignora.
  }
}
