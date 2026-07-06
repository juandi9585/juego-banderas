// Sistema de puntuación PURO (sin React, sin estado). PROPIEDAD: frontend-engineer.
// Contrato y fórmula: docs/competitivo.md §4 "Puntuación — [DECIDIDO 2026-07-06]".
// Estilo Kahoot: la velocidad da puntos reales, con multiplicador de racha.
// Hoy alimenta SOLO el panel informativo del casual (ResultPage). El competitivo
// (countdown de 10 s, timeouts, récords) reutilizará esta misma función tal cual.
import type { GameResult } from './types';

// ── Constantes (§4.1). Exportadas para tests y UI. ───────────────────────────
export const SCORE_BASE = 100; // puntos base por acierto
export const SCORE_SPEED_BONUS_MAX = 50; // bonus máximo de velocidad
export const SCORE_GRACE_MS = 2_000; // ventana de gracia: bonus pleno
export const SCORE_TIME_LIMIT_MS = 10_000; // desde aquí el bonus de velocidad es 0
export const SCORE_STREAK_STEP = 0.1; // +0.1 al multiplicador por acierto seguido
export const SCORE_STREAK_MAX_MULT = 1.5; // tope del multiplicador de racha

export interface Score {
  points: number; // suma de §4.1 (entero)
  correct: number; // aciertos (= result.correctCount)
  total: number; // preguntas (= result.total)
  accuracy: number; // correct / total (0 si total === 0, nunca NaN)
  maxStreak: number; // mejor racha de aciertos consecutivos de la partida
  durationMs?: number; // finishedAt − startedAt (si está disponible)
}

/**
 * Bonus de velocidad por pregunta (§4.1). `elapsedMs` = ms desde que la pregunta
 * es visible hasta responder. Continuo, SIN redondear aquí (el redondeo es por
 * pregunta, dentro de computeScore):
 *   - t ≤ 2 000            → 50 (gracia: leer 4 opciones toma ~2 s; no premia el tap ciego).
 *   - 2 000 < t < 10 000   → decae lineal: 50 × (10 000 − t) / 8 000.
 *   - t ≥ 10 000           → 0.
 *   - t indefinido (sin medición) → 0.
 */
export function speedBonus(elapsedMs?: number): number {
  // NaN/Infinity → 0: hoy el reducer siempre mide con Date.now(), pero esta
  // función también puntuará récords persistidos (competitivo) — sin blindaje,
  // un NaN contaminaría el total entero.
  if (elapsedMs == null || !Number.isFinite(elapsedMs)) return 0;
  if (elapsedMs <= SCORE_GRACE_MS) return SCORE_SPEED_BONUS_MAX;
  if (elapsedMs >= SCORE_TIME_LIMIT_MS) return 0;
  return (
    (SCORE_SPEED_BONUS_MAX * (SCORE_TIME_LIMIT_MS - elapsedMs)) /
    (SCORE_TIME_LIMIT_MS - SCORE_GRACE_MS)
  );
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

  let points = 0;
  let correct = 0;
  let streak = 0; // aciertos consecutivos, contando el actual
  let maxStreak = 0;

  // Recorremos por índice hasta `total` para que los huecos (answers[i] ausente)
  // cuenten como fallo, no se salten (a diferencia de forEach/for..of sobre holes).
  for (let i = 0; i < total; i++) {
    const answer = result.answers[i];
    if (answer && answer.correct) {
      streak += 1;
      correct += 1;
      const mult = Math.min(
        1 + SCORE_STREAK_STEP * (streak - 1),
        SCORE_STREAK_MAX_MULT,
      );
      points += Math.round((SCORE_BASE + speedBonus(answer.elapsedMs)) * mult);
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
  };
}
