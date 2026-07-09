import { describe, it, expect } from 'vitest';
import { resultToPayload } from '../payload';
import type { AnswerRecord, GameResult, QuizConfig } from '../../game/types';
import type { CategoryId } from '../../game/categories';

/** GameResult sintético a partir de un config + respuestas. */
function makeResult(config: QuizConfig, answers: AnswerRecord[]): GameResult {
  return {
    config,
    total: answers.length,
    correctCount: answers.filter((a) => a.correct).length,
    answers,
  };
}

const answer = (over: Partial<AnswerRecord>): AnswerRecord => ({
  questionId: 'q',
  correct: false,
  correctCode: 'fr',
  ...over,
});

describe('resultToPayload', () => {
  it('mapea una ronda competitiva mixta 1:1, quitando campos que el servidor recomputa', () => {
    const config: QuizConfig = {
      mode: 'mixto',
      categories: ['caribe' as CategoryId],
      questionCount: 20,
      competitive: { seed: 12345 },
    };
    const result = makeResult(config, [
      answer({ questionId: '0-cu', correct: true, correctCode: 'cu', givenCode: 'cu', elapsedMs: 1500 }),
      answer({ questionId: '1-jm', correct: false, correctCode: 'jm', givenCode: 'ht', elapsedMs: 9800, timedOut: true }),
    ]);

    const payload = resultToPayload(result);
    expect(payload).not.toBeNull();
    expect(payload!.seed).toBe(12345);
    expect(payload!.categoryId).toBe('caribe');
    expect(payload!.mode).toBe('mixto');
    expect(payload!.answers).toEqual([
      { givenCode: 'cu', elapsedMs: 1500 },
      { givenCode: 'ht', elapsedMs: 9800, timedOut: true },
    ]);
    // Nunca se filtran questionId/correct/correctCode (el servidor los decide).
    expect(payload!.answers[0]).not.toHaveProperty('questionId');
    expect(payload!.answers[0]).not.toHaveProperty('correct');
    expect(payload!.answers[0]).not.toHaveProperty('correctCode');
    // timedOut solo cuando es true (respuesta normal no lo lleva).
    expect(payload!.answers[0]).not.toHaveProperty('timedOut');
  });

  it('mapea el modo escrito con givenText', () => {
    const config: QuizConfig = {
      mode: 'type-name',
      categories: ['europa' as CategoryId],
      questionCount: 20,
      competitive: { seed: 7 },
    };
    const payload = resultToPayload(
      makeResult(config, [answer({ correct: true, givenText: 'Francia', elapsedMs: 4000 })]),
    );
    expect(payload!.mode).toBe('type-name');
    expect(payload!.answers).toEqual([{ givenText: 'Francia', elapsedMs: 4000 }]);
  });

  it('devuelve null para una ronda casual (sin competitive.seed)', () => {
    const config: QuizConfig = { mode: 'flag-to-name', categories: [], questionCount: 10 };
    expect(resultToPayload(makeResult(config, [answer({ correct: true, elapsedMs: 100 })]))).toBeNull();
  });

  it('devuelve null si el modo no es rankeable aunque haya seed', () => {
    const config: QuizConfig = {
      mode: 'flag-to-name',
      categories: ['mundo' as CategoryId],
      questionCount: 20,
      competitive: { seed: 1 },
    };
    expect(resultToPayload(makeResult(config, [answer({ elapsedMs: 1 })]))).toBeNull();
  });

  it('devuelve null si no hay categoría', () => {
    const config: QuizConfig = { mode: 'mixto', categories: [], questionCount: 20, competitive: { seed: 1 } };
    expect(resultToPayload(makeResult(config, [answer({ elapsedMs: 1 })]))).toBeNull();
  });

  it('rellena un hueco (respuesta ausente) con elapsedMs 0 para conservar la longitud', () => {
    const config: QuizConfig = {
      mode: 'mixto',
      categories: ['oceania' as CategoryId],
      questionCount: 20,
      competitive: { seed: 99 },
    };
    // total = 2 pero solo hay una respuesta en el índice 0.
    const result: GameResult = {
      config,
      total: 2,
      correctCount: 1,
      answers: [answer({ correct: true, givenCode: 'au', elapsedMs: 800 })],
    };
    const payload = resultToPayload(result);
    expect(payload!.answers).toHaveLength(2);
    expect(payload!.answers[1]).toEqual({ elapsedMs: 0 });
  });

  it('normaliza la seed a uint32', () => {
    const config: QuizConfig = {
      mode: 'mixto',
      categories: ['asia' as CategoryId],
      questionCount: 20,
      competitive: { seed: -1 }, // >>> 0 → 4294967295
    };
    const payload = resultToPayload(makeResult(config, [answer({ elapsedMs: 1 })]));
    expect(payload!.seed).toBe(0xffffffff);
  });
});
