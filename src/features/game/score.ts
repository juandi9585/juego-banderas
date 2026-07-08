// Sistema de puntuación PURO (sin React, sin estado). PROPIEDAD: frontend-engineer.
// Contrato y fórmula: docs/competitivo.md §4 "Puntuación — [DECIDIDO 2026-07-06]".
// Estilo Kahoot: la velocidad da puntos reales, con multiplicador de racha.
// Hoy alimenta SOLO el panel informativo del casual (ResultPage). El competitivo
// (countdown de 10 s, timeouts, récords) reutilizará esta misma función tal cual.
import type { GameResult, RoundMode } from './types';

// ── Constantes (§4.1). Exportadas para tests y UI. ───────────────────────────
export const SCORE_BASE = 100; // puntos base por acierto
export const SCORE_SPEED_BONUS_MAX = 50; // bonus máximo de velocidad
export const SCORE_GRACE_MS = 2_000; // ventana de gracia: bonus pleno (opción múltiple)
export const SCORE_TIME_LIMIT_MS = 10_000; // límite de opción múltiple: bonus 0 desde aquí
// Modo ESCRITO ('type-name', roadmap §A): teclear un nombre toma más que tocar
// una opción, así que se amplían el límite (15 s) y la gracia (3 s — con 2 s
// nadie llegaría al bonus pleno escribiendo). El bonus máximo no cambia: el
// puntaje perfecto es el mismo en ambos modos (4 275 en 20 preguntas).
export const SCORE_GRACE_TYPED_MS = 3_000;
export const SCORE_TIME_LIMIT_TYPED_MS = 15_000;
export const SCORE_STREAK_STEP = 0.1; // +0.1 al multiplicador por acierto seguido
export const SCORE_STREAK_MAX_MULT = 1.5; // tope del multiplicador de racha
// Umbral de URGENCIA del countdown competitivo (§13.5): a ≤ 3 s la mecha pasa a
// rojo y aparece la lectura numérica. Es lógica de UI, no de puntuación, pero
// vive aquí junto al límite de tiempo para tener una sola fuente de constantes.
export const SCORE_TIME_WARN_MS = 3_000;

/**
 * Límite de tiempo por pregunta según el modo de RONDA (roadmap §A): 15 s en el
 * escrito ('type-name'), 10 s en mixto y opción múltiple. Única fuente para el
 * countdown (QuestionCountdown) y para el decaimiento del bonus de velocidad.
 */
export function timeLimitFor(mode: RoundMode): number {
  return mode === 'type-name' ? SCORE_TIME_LIMIT_TYPED_MS : SCORE_TIME_LIMIT_MS;
}

/** Ventana de gracia (bonus pleno) según el modo de ronda: 3 s escrito, 2 s resto. */
export function graceFor(mode: RoundMode): number {
  return mode === 'type-name' ? SCORE_GRACE_TYPED_MS : SCORE_GRACE_MS;
}

export interface Score {
  points: number; // suma de §4.1 (entero)
  correct: number; // aciertos (= result.correctCount)
  total: number; // preguntas (= result.total)
  accuracy: number; // correct / total (0 si total === 0, nunca NaN)
  maxStreak: number; // mejor racha de aciertos consecutivos de la partida
  durationMs?: number; // finishedAt − startedAt (si está disponible)
  answeredMs: number; // suma de elapsedMs: solo tiempo RESPONDIENDO (desempate de récords, §5)
}

/**
 * Bonus de velocidad por pregunta (§4.1). `elapsedMs` = ms desde que la pregunta
 * es visible hasta responder. Continuo, SIN redondear aquí (el redondeo es por
 * pregunta, dentro de computeScore). Con los límites del modo (graceFor /
 * timeLimitFor; por defecto los de opción múltiple):
 *   - t ≤ gracia           → 50 (leer 4 opciones ≈ 2 s; teclear un nombre ≈ 3 s).
 *   - gracia < t < límite  → decae lineal: 50 × (límite − t) / (límite − gracia).
 *   - t ≥ límite           → 0.
 *   - t indefinido (sin medición) → 0.
 */
export function speedBonus(elapsedMs?: number, mode: RoundMode = 'mixto'): number {
  // NaN/Infinity → 0: hoy el reducer siempre mide con Date.now(), pero esta
  // función también puntuará récords persistidos (competitivo) — sin blindaje,
  // un NaN contaminaría el total entero.
  if (elapsedMs == null || !Number.isFinite(elapsedMs)) return 0;
  const grace = graceFor(mode);
  const limit = timeLimitFor(mode);
  if (elapsedMs <= grace) return SCORE_SPEED_BONUS_MAX;
  if (elapsedMs >= limit) return 0;
  return (SCORE_SPEED_BONUS_MAX * (limit - elapsedMs)) / (limit - grace);
}

/**
 * Puntúa una partida terminada (§4). Itera `result.answers` EN ORDEN llevando la
 * racha. Sirve para ambos modos: en el casual, los `elapsedMs` largos dan bonus 0
 * y la fórmula sigue siendo válida (el puntaje casual es solo informativo).
 *
 * Por pregunta acertada: multRacha = min(1 + 0.1 × (racha − 1), 1.5) y
 * points += round((100 + bonusVelocidad) × multRacha) — redondeo POR PREGUNTA,
 * así el total siempre es entero (§4.1).
 *
 * Robustez: el array puede tener huecos/undefined (preguntas no respondidas);
 * se tratan como fallo → reinician la racha y no suman puntos. Nunca negativos.
 */
export function computeScore(result: GameResult): Score {
  const total = result.total;
  // El bonus de velocidad decae según el límite del MODO de la ronda: 15 s en
  // el escrito, 10 s en el resto (roadmap §A). En un mixto todas las preguntas
  // son de opción múltiple, así que un solo límite por ronda es exacto.
  const mode = result.config.mode;

  let points = 0;
  let correct = 0;
  let streak = 0; // aciertos consecutivos, contando el actual
  let maxStreak = 0;
  let answeredMs = 0;

  // Recorremos por índice hasta `total` para que los huecos (answers[i] ausente)
  // cuenten como fallo, no se salten (a diferencia de forEach/for..of sobre holes).
  for (let i = 0; i < total; i++) {
    const answer = result.answers[i];
    // Tiempo respondiendo: aciertos, fallos y timeouts por igual. A diferencia de
    // durationMs (reloj de pared), NO incluye el tiempo leyendo la ficha entre
    // preguntas — leer con calma no puede costar el récord (decidido 2026-07-07).
    const elapsed = answer?.elapsedMs;
    if (elapsed != null && Number.isFinite(elapsed)) answeredMs += elapsed;
    if (answer && answer.correct) {
      streak += 1;
      correct += 1;
      const mult = Math.min(
        1 + SCORE_STREAK_STEP * (streak - 1),
        SCORE_STREAK_MAX_MULT,
      );
      points += Math.round((SCORE_BASE + speedBonus(answer.elapsedMs, mode)) * mult);
      if (streak > maxStreak) maxStreak = streak;
    } else {
      streak = 0;
    }
  }

  return {
    points,
    correct,
    total,
    accuracy: total === 0 ? 0 : correct / total,
    maxStreak,
    durationMs: result.durationMs,
    answeredMs,
  };
}
