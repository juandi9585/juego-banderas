import { describe, it, expect } from 'vitest';
import {
  computeScore,
  speedBonus,
  SCORE_SPEED_BONUS_MAX,
} from '../score';
import type { AnswerRecord, GameResult, QuizConfig } from '../types';

// ─────────────────────────────────────────────────────────────────────────────
// Tests del sistema de puntuación (docs/competitivo.md §4). Función pura: se le
// pasan GameResult sintéticos con elapsedMs controlados y se comprueba la
// fórmula (bonus de velocidad, multiplicador de racha, redondeo por pregunta).
// ─────────────────────────────────────────────────────────────────────────────

const config: QuizConfig = {
  mode: 'flag-to-name',
  categories: [],
  questionCount: 25,
};

/** Construye un AnswerRecord mínimo con acierto/fallo y (opcional) elapsedMs. */
function ans(correct: boolean, elapsedMs?: number): AnswerRecord {
  return { questionId: 'q', correct, correctCode: 'xx', elapsedMs };
}

/** Envuelve un array de respuestas (con posibles huecos) en un GameResult. */
function makeResult(
  answers: Array<AnswerRecord | undefined>,
  durationMs?: number,
): GameResult {
  const real = answers.filter((a): a is AnswerRecord => a != null);
  return {
    config,
    total: answers.length,
    correctCount: real.filter((a) => a.correct).length,
    answers: answers as AnswerRecord[],
    durationMs,
  };
}

describe('speedBonus (§4.1)', () => {
  it('devuelve el bonus pleno dentro de la ventana de gracia (t ≤ 2 000)', () => {
    expect(speedBonus(0)).toBe(SCORE_SPEED_BONUS_MAX); // 50
    expect(speedBonus(1999)).toBe(50);
    expect(speedBonus(2000)).toBe(50); // borde exacto de la gracia
  });

  it('decae lineal entre 2 000 y 10 000', () => {
    expect(speedBonus(6000)).toBe(25); // punto medio exacto
    expect(speedBonus(9999)).toBeGreaterThan(0); // aún queda un pelo de bonus
    expect(speedBonus(9999)).toBeCloseTo(0.00625, 5);
  });

  it('es 0 a partir del límite duro de 10 s', () => {
    expect(speedBonus(10000)).toBe(0); // borde exacto
    expect(speedBonus(10001)).toBe(0);
    expect(speedBonus(60000)).toBe(0);
  });

  it('es 0 cuando no hay medición de tiempo', () => {
    expect(speedBonus(undefined)).toBe(0);
  });
});

describe('computeScore — multiplicador de racha (§4.1)', () => {
  // Aciertos lentos (bonus 0) → cada acierto = round(100 × multRacha), de modo
  // que el delta por pregunta revela directamente el multiplicador.
  const slowRun = (n: number) =>
    computeScore(makeResult(Array.from({ length: n }, () => ans(true, 10000))));

  it('rampa ×1.0 → ×1.5 con tope desde el 6.º acierto', () => {
    // Totales acumulados: 100, 210, 330, 460, 600, 750, 900
    // Deltas por pregunta:  100 110 120 130 140 150 150  ← ×1.0…×1.5 y tope.
    expect(slowRun(1).points).toBe(100); // ×1.0
    expect(slowRun(2).points).toBe(210); // +110 (×1.1)
    expect(slowRun(3).points).toBe(330); // +120 (×1.2)
    expect(slowRun(4).points).toBe(460); // +130 (×1.3)
    expect(slowRun(5).points).toBe(600); // +140 (×1.4)
    expect(slowRun(6).points).toBe(750); // +150 (×1.5)
    expect(slowRun(7).points).toBe(900); // +150 (tope se mantiene desde la 6.ª)
  });

  it('un fallo reinicia la racha', () => {
    // acierto, acierto, fallo, acierto → 100 + 110 + 0 + 100 = 310; maxStreak 2.
    const s = computeScore(
      makeResult([ans(true, 10000), ans(true, 10000), ans(false), ans(true, 10000)]),
    );
    expect(s.points).toBe(310);
    expect(s.maxStreak).toBe(2);
    expect(s.correct).toBe(3);
  });

  it('un hueco (undefined) también reinicia la racha, como un fallo', () => {
    const s = computeScore(
      makeResult([ans(true, 10000), ans(true, 10000), undefined, ans(true, 10000)]),
    );
    expect(s.points).toBe(310); // idéntico al caso del fallo
    expect(s.maxStreak).toBe(2);
    expect(s.correct).toBe(3);
    expect(s.total).toBe(4); // el hueco cuenta como pregunta
  });

  it('un hole genuino del array (índice sin asignar) cuenta como fallo', () => {
    // A diferencia del undefined explícito de arriba, aquí el índice 2 nunca se
    // asigna (array sparse) — for..of/forEach lo SALTARÍAN; el bucle por índice
    // de computeScore no. Alcanzable en juego real avanzando sin responder.
    const sparse: Array<AnswerRecord | undefined> = [
      ans(true, 10000),
      ans(true, 10000),
    ];
    sparse[3] = ans(true, 10000); // deja el índice 2 como hole real
    const s = computeScore(makeResult(sparse));
    expect(s.points).toBe(310); // 100 + 110 + (hole) + 100
    expect(s.maxStreak).toBe(2);
    expect(s.correct).toBe(3);
    expect(s.total).toBe(4);
  });

  it('maxStreak es la mejor racha, no la última', () => {
    // 3 seguidas, fallo, 2 seguidas → maxStreak 3.
    const s = computeScore(
      makeResult([
        ans(true),
        ans(true),
        ans(true),
        ans(false),
        ans(true),
        ans(true),
      ]),
    );
    expect(s.maxStreak).toBe(3);
  });
});

describe('computeScore — redondeo por pregunta (§4.1)', () => {
  it('redondea cada pregunta, no la suma', () => {
    // Q1: t=8000 → bonus 12.5, ×1.0 → 112.5 → round 113
    // Q2: t=6000 → bonus 25,   ×1.1 → 137.5 → round 138   ⇒ 251
    // (Si se redondeara la SUMA: 112.5 + 137.5 = 250.0 → 250, distinto.)
    const s = computeScore(makeResult([ans(true, 8000), ans(true, 6000)]));
    expect(s.points).toBe(251);
  });
});

describe('computeScore — cotas de partida de 25 (§4.2)', () => {
  it('partida perfecta (25 aciertos, todos ≤ 2 s) = 5 400', () => {
    const s = computeScore(
      makeResult(Array.from({ length: 25 }, () => ans(true, 1000))),
    );
    expect(s.points).toBe(5400);
    expect(s.correct).toBe(25);
    expect(s.total).toBe(25);
    expect(s.accuracy).toBe(1);
    expect(s.maxStreak).toBe(25);
  });

  it('25 aciertos lentos (≥ 10 s, sin bonus) = 3 600', () => {
    const s = computeScore(
      makeResult(Array.from({ length: 25 }, () => ans(true, 10000))),
    );
    expect(s.points).toBe(3600);
    expect(s.maxStreak).toBe(25);
  });
});

describe('computeScore — bordes y datos derivados', () => {
  it('total 0 → accuracy 0 (sin NaN) y 0 puntos', () => {
    const s = computeScore(makeResult([]));
    expect(s.total).toBe(0);
    expect(s.correct).toBe(0);
    expect(s.points).toBe(0);
    expect(s.accuracy).toBe(0);
    expect(Number.isNaN(s.accuracy)).toBe(false);
  });

  it('copia durationMs del result cuando existe, e indefinido si no', () => {
    expect(computeScore(makeResult([ans(true, 1000)], 45000)).durationMs).toBe(45000);
    expect(computeScore(makeResult([ans(true, 1000)])).durationMs).toBeUndefined();
  });

  it('accuracy = correct / total con aciertos parciales', () => {
    const s = computeScore(
      makeResult([ans(true), ans(false), ans(true), ans(false)]),
    );
    expect(s.correct).toBe(2);
    expect(s.total).toBe(4);
    expect(s.accuracy).toBe(0.5);
  });
});
