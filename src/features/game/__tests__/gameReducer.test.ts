import { describe, it, expect } from 'vitest';
import { gameReducer, initialState } from '../gameReducer';
import type { QuizConfig, QuizQuestion } from '../types';
import { byCode } from './mockCountries';

// ─────────────────────────────────────────────────────────────────────────────
// Tests del reducer centrados en la CAPTURA DE TIEMPO (§4.3): con timestamps
// inyectados manualmente se comprueba que elapsedMs mide desde que la pregunta
// queda visible (START/NEXT) hasta responder (ANSWER), y que el tiempo pasado en
// la hoja de datos curiosos (entre ANSWER y NEXT) NO cuenta.
// ─────────────────────────────────────────────────────────────────────────────

const config: QuizConfig = {
  mode: 'flag-to-name',
  categories: [],
  questionCount: 2,
};

const mc = (id: string, code: string, distractor: string): QuizQuestion => ({
  id,
  mode: 'flag-to-name',
  kind: 'multiple-choice',
  country: byCode(code),
  correctCode: code,
  options: [byCode(code), byCode(distractor)],
});

const questions: QuizQuestion[] = [mc('0-fr', 'fr', 'de'), mc('1-jp', 'jp', 'cn')];

describe('gameReducer — captura de tiempo (elapsedMs)', () => {
  it('START marca questionStartedAt; ANSWER mide el tiempo hasta responder', () => {
    let state = gameReducer(initialState, {
      type: 'START',
      config,
      questions,
      startedAt: 1000,
    });
    expect(state.questionStartedAt).toBe(1000);
    expect(state.startedAt).toBe(1000);

    state = gameReducer(state, { type: 'ANSWER', value: 'fr', at: 4000 });
    expect(state.answers[0].elapsedMs).toBe(3000); // 4000 − 1000
    expect(state.answers[0].correct).toBe(true);
  });

  it('el tiempo en la hoja (entre ANSWER y NEXT) no cuenta: NEXT reinicia el reloj', () => {
    let state = gameReducer(initialState, {
      type: 'START',
      config,
      questions,
      startedAt: 1000,
    });
    // Responde la 1.ª en t=4000 y luego se queda 6 s en la hoja de datos.
    state = gameReducer(state, { type: 'ANSWER', value: 'fr', at: 4000 });
    // Avanza en t=10000: la 2.ª pregunta queda visible AHORA.
    state = gameReducer(state, { type: 'NEXT', now: 10000 });
    expect(state.currentIndex).toBe(1);
    expect(state.questionStartedAt).toBe(10000);

    // Responde la 2.ª en t=12500 → 2500 ms, NO 12500 − 1000 ni contando la hoja.
    state = gameReducer(state, { type: 'ANSWER', value: 'jp', at: 12500 });
    expect(state.answers[1].elapsedMs).toBe(2500);
  });

  it('ANSWER es idempotente: una 2.ª respuesta no pisa elapsedMs', () => {
    let state = gameReducer(initialState, {
      type: 'START',
      config,
      questions,
      startedAt: 1000,
    });
    state = gameReducer(state, { type: 'ANSWER', value: 'fr', at: 4000 });
    const answered = state;

    const again = gameReducer(state, { type: 'ANSWER', value: 'de', at: 9000 });
    expect(again).toBe(answered); // misma referencia: se ignoró
    expect(again.answers[0].elapsedMs).toBe(3000); // intacto
    expect(again.answers[0].givenCode).toBe('fr');
  });

  it('clamp defensivo: elapsedMs nunca es negativo si el reloj retrocede', () => {
    let state = gameReducer(initialState, {
      type: 'START',
      config,
      questions,
      startedAt: 5000,
    });
    state = gameReducer(state, { type: 'ANSWER', value: 'fr', at: 3000 }); // at < start
    expect(state.answers[0].elapsedMs).toBe(0);
  });

  it('RESTART resetea questionStartedAt (y la ronda)', () => {
    let state = gameReducer(initialState, {
      type: 'START',
      config,
      questions,
      startedAt: 1000,
    });
    state = gameReducer(state, { type: 'ANSWER', value: 'fr', at: 4000 });
    state = gameReducer(state, { type: 'NEXT', now: 10000 });
    expect(state.questionStartedAt).toBe(10000);

    state = gameReducer(state, { type: 'RESTART', questions, startedAt: 50000 });
    expect(state.questionStartedAt).toBe(50000);
    expect(state.currentIndex).toBe(0);
    expect(state.answers).toEqual([]);
  });
});
