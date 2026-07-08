import { describe, it, expect } from 'vitest';
import {
  computeScore,
  speedBonus,
  timeLimitFor,
  graceFor,
  SCORE_SPEED_BONUS_MAX,
  SCORE_GRACE_MS,
  SCORE_TIME_LIMIT_MS,
  SCORE_GRACE_TYPED_MS,
  SCORE_TIME_LIMIT_TYPED_MS,
} from '../score';
import type { AnswerRecord, GameResult, QuizConfig, RoundMode } from '../types';

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
  mode: RoundMode = config.mode,
): GameResult {
  const real = answers.filter((a): a is AnswerRecord => a != null);
  return {
    config: { ...config, mode },
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

describe('límites por modo — escrito 15 s (roadmap §A)', () => {
  it('timeLimitFor: 10 s en opción múltiple y mixto, 15 s en escrito', () => {
    expect(timeLimitFor('flag-to-name')).toBe(SCORE_TIME_LIMIT_MS);
    expect(timeLimitFor('name-to-flag')).toBe(SCORE_TIME_LIMIT_MS);
    expect(timeLimitFor('mixto')).toBe(SCORE_TIME_LIMIT_MS);
    expect(timeLimitFor('type-name')).toBe(SCORE_TIME_LIMIT_TYPED_MS);
    expect(SCORE_TIME_LIMIT_TYPED_MS).toBe(15_000);
  });

  it('graceFor: 2 s en opción múltiple y mixto, 3 s en escrito', () => {
    expect(graceFor('mixto')).toBe(SCORE_GRACE_MS);
    expect(graceFor('flag-to-name')).toBe(SCORE_GRACE_MS);
    expect(graceFor('type-name')).toBe(SCORE_GRACE_TYPED_MS);
    expect(SCORE_GRACE_TYPED_MS).toBe(3_000);
  });

  it('speedBonus escrito: gracia hasta 3 s y decaimiento lineal hasta 15 s', () => {
    // 2 500 ms: fuera de la gracia MC (bonus parcial) pero DENTRO de la escrita.
    expect(speedBonus(2500)).toBeLessThan(SCORE_SPEED_BONUS_MAX);
    expect(speedBonus(2500, 'type-name')).toBe(SCORE_SPEED_BONUS_MAX);
    expect(speedBonus(3000, 'type-name')).toBe(50); // borde exacto de la gracia
    expect(speedBonus(9000, 'type-name')).toBe(25); // punto medio (3 s … 15 s)
    expect(speedBonus(15000, 'type-name')).toBe(0); // límite duro
    expect(speedBonus(12000, 'mixto')).toBe(0); // el mixto sigue muriendo a 10 s
  });

  it('computeScore puntúa con el límite del MODO de la ronda', () => {
    // La misma respuesta de 12 s: en ronda escrita aún conserva bonus
    // (50 × (15 000 − 12 000) / 12 000 = 12,5 → round(112,5) = 113); en ronda
    // mixta el bonus ya es 0 desde los 10 s.
    const answers = [ans(true, 12_000)];
    expect(computeScore(makeResult(answers, undefined, 'mixto')).points).toBe(100);
    expect(computeScore(makeResult(answers, undefined, 'type-name')).points).toBe(113);
  });

  it('partida escrita perfecta (20 aciertos ≤ 3 s) = 4 275, igual que el mixto', () => {
    // A 2 500 ms por respuesta: gracia plena en escrito. El máximo teórico no
    // cambia entre modos (mismo bonus tope), solo la ventana para lograrlo.
    const s = computeScore(
      makeResult(
        Array.from({ length: 20 }, () => ans(true, 2500)),
        undefined,
        'type-name',
      ),
    );
    expect(s.points).toBe(4275);
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

describe('computeScore — cotas de la fórmula (§4.2)', () => {
  // Estas corridas usan 25 aciertos como SONDA de la fórmula (racha ya en su
  // tope), no como tamaño real de partida: la competitiva juega min(20, pool).
  it('25 aciertos rápidos (todos ≤ 2 s, bonus pleno) = 5 400', () => {
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

  it('partida competitiva perfecta (20 aciertos rápidos) = 4 275', () => {
    // 20 = MAX_QUESTIONS del competitivo. elapsed dentro de la ventana de gracia
    // (< SCORE_GRACE_MS) ⇒ bonus de velocidad pleno en las 20. Puntaje: rampa de
    // racha Q1–Q5 = 900 y Q6–Q20 al tope ×1.5 (15 × 225 = 3 375) ⇒ 4 275.
    const fastMs = SCORE_GRACE_MS - 500; // 1 500 ms: claramente "rápido"
    const s = computeScore(
      makeResult(Array.from({ length: 20 }, () => ans(true, fastMs))),
    );
    expect(s.points).toBe(4275);
    expect(s.correct).toBe(20);
    expect(s.total).toBe(20);
    expect(s.maxStreak).toBe(20);
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

  it('answeredMs suma el tiempo de aciertos, fallos y timeouts por igual', () => {
    // 1 000 (acierto) + 4 000 (fallo) + 10 000 (timeout) = 15 000. Los huecos y
    // las respuestas sin medición no aportan. Es el desempate de récords (§5):
    // solo tiempo respondiendo, sin el tiempo de lectura de la ficha.
    const timeout: AnswerRecord = { ...ans(false, 10000), timedOut: true };
    const s = computeScore(
      makeResult([ans(true, 1000), ans(false, 4000), timeout, undefined, ans(true)]),
    );
    expect(s.answeredMs).toBe(15000);
  });

  it('answeredMs es 0 sin respuestas y no se contamina con elapsedMs no finito', () => {
    expect(computeScore(makeResult([])).answeredMs).toBe(0);
    expect(computeScore(makeResult([ans(true, Number.NaN)])).answeredMs).toBe(0);
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
