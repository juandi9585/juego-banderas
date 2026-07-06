import { describe, it, expect } from 'vitest';
import {
  buildQuiz,
  buildQuestion,
  pickDistractors,
  checkChoice,
  checkTypedAnswer,
} from '../engine';
import { OPTIONS_PER_QUESTION } from '../constants';
import type { QuizConfig } from '../types';
import { mockCountries, byCode, seededRng } from './mockCountries';

const codesOf = (arr: { code: string }[]) => arr.map((c) => c.code);

describe('pickDistractors', () => {
  it('nunca incluye la respuesta correcta', () => {
    const answer = byCode('fr');
    const distractors = pickDistractors(answer, mockCountries, 3, seededRng(1));
    expect(codesOf(distractors)).not.toContain('fr');
  });

  it('no produce distractores duplicados', () => {
    const answer = byCode('jp');
    const distractors = pickDistractors(answer, mockCountries, 3, seededRng(2));
    const codes = codesOf(distractors);
    expect(new Set(codes).size).toBe(codes.length);
  });

  it('prefiere el mismo continente cuando hay suficientes', () => {
    // Europa tiene 5 países (4 distractores posibles) => los 3 deben ser Europa.
    const answer = byCode('fr');
    for (let seed = 0; seed < 25; seed++) {
      const distractors = pickDistractors(answer, mockCountries, 3, seededRng(seed));
      expect(distractors).toHaveLength(3);
      expect(distractors.every((c) => c.continent === 'Europa')).toBe(true);
    }
  });

  it('prefiere la misma región antes que el mismo continente', () => {
    // España es "Europa del Sur" (con Italia y Portugal). Pidiendo 2 distractores,
    // deben salir esos dos de la misma región, no los de "Europa Occidental".
    const answer = byCode('es');
    for (let seed = 0; seed < 25; seed++) {
      const distractors = pickDistractors(answer, mockCountries, 2, seededRng(seed));
      expect(distractors.every((c) => c.region === 'Europa del Sur')).toBe(true);
    }
  });

  it('completa con otros continentes si el propio no alcanza', () => {
    // Oceanía tiene 1 país (Australia). No hay distractores del mismo continente,
    // así que se completa desde otros continentes.
    const answer = byCode('au');
    const distractors = pickDistractors(answer, mockCountries, 3, seededRng(7));
    expect(distractors).toHaveLength(3);
    expect(codesOf(distractors)).not.toContain('au');
    expect(new Set(codesOf(distractors)).size).toBe(3);
  });
});

describe('buildQuestion', () => {
  it('modo MC: 4 opciones barajadas que incluyen la correcta', () => {
    const answer = byCode('it');
    const q = buildQuestion('flag-to-name', answer, mockCountries, seededRng(3));
    expect(q.kind).toBe('multiple-choice');
    expect(q.options).toBeDefined();
    expect(q.options).toHaveLength(OPTIONS_PER_QUESTION);
    expect(codesOf(q.options!)).toContain('it');
    expect(q.correctCode).toBe('it');
  });

  it('modo escribir: sin opciones y kind text-input', () => {
    const answer = byCode('it');
    const q = buildQuestion('type-name', answer, mockCountries, seededRng(3));
    expect(q.kind).toBe('text-input');
    expect(q.options).toBeUndefined();
  });

  it('las opciones no tienen países duplicados', () => {
    const answer = byCode('cn');
    const q = buildQuestion('name-to-flag', answer, mockCountries, seededRng(9));
    const codes = codesOf(q.options!);
    expect(new Set(codes).size).toBe(codes.length);
  });
});

describe('buildQuiz', () => {
  const baseConfig: QuizConfig = {
    mode: 'flag-to-name',
    categories: [],
    questionCount: 10,
  };

  it('genera el número pedido de preguntas', () => {
    const quiz = buildQuiz(mockCountries, baseConfig, seededRng(5));
    expect(quiz).toHaveLength(10);
  });

  it('cada pregunta contiene siempre la respuesta correcta en sus opciones', () => {
    const quiz = buildQuiz(mockCountries, baseConfig, seededRng(11));
    for (const q of quiz) {
      expect(codesOf(q.options!)).toContain(q.correctCode);
    }
  });

  it('no repite país como respuesta dentro de una ronda (sin reemplazo)', () => {
    const quiz = buildQuiz(mockCountries, baseConfig, seededRng(13));
    const answerCodes = quiz.map((q) => q.correctCode);
    expect(new Set(answerCodes).size).toBe(answerCodes.length);
  });

  it('limita al tamaño del pool si se piden más preguntas de las disponibles', () => {
    const quiz = buildQuiz(
      mockCountries,
      { ...baseConfig, questionCount: 999 },
      seededRng(1),
    );
    expect(quiz).toHaveLength(mockCountries.length);
  });

  it('filtra por categoría: solo respuestas de ese continente', () => {
    const quiz = buildQuiz(
      mockCountries,
      { ...baseConfig, categories: ['europa'], questionCount: 20 },
      seededRng(2),
    );
    expect(quiz).toHaveLength(5); // 5 países europeos en el mock
    expect(quiz.every((q) => q.country.continent === 'Europa')).toBe(true);
  });

  it('unión de categorías: respuestas y opciones dentro de Europa ∪ Oceanía', () => {
    const union = new Set(['Europa', 'Oceanía']);
    const quiz = buildQuiz(
      mockCountries,
      { ...baseConfig, categories: ['europa', 'oceania'], questionCount: 20 },
      seededRng(2),
    );
    // 5 europeos + 1 oceánico en el mock.
    expect(quiz).toHaveLength(6);
    for (const q of quiz) {
      expect(union.has(q.country.continent)).toBe(true);
      // Los distractores salen del pool ya filtrado => también en la unión.
      expect(q.options!.every((o) => union.has(o.continent))).toBe(true);
    }
  });

  it('asigna ids estables y únicos por índice', () => {
    const quiz = buildQuiz(mockCountries, baseConfig, seededRng(4));
    const ids = quiz.map((q) => q.id);
    expect(new Set(ids).size).toBe(ids.length);
    expect(quiz[0].id).toBe(`0-${quiz[0].correctCode}`);
  });
});

describe('checkChoice', () => {
  it('true solo si el código elegido es el correcto', () => {
    const q = buildQuestion('flag-to-name', byCode('br'), mockCountries, seededRng(6));
    expect(checkChoice(q, 'br')).toBe(true);
    expect(checkChoice(q, 'ar')).toBe(false);
  });
});

describe('checkTypedAnswer', () => {
  it('acepta el nombre exacto', () => {
    const q = buildQuestion('type-name', byCode('fr'), mockCountries, seededRng(6));
    expect(checkTypedAnswer(q, 'Francia')).toBe(true);
  });

  it('tolera tildes, mayúsculas y espacios', () => {
    const q = buildQuestion('type-name', byCode('es'), mockCountries, seededRng(6));
    expect(checkTypedAnswer(q, '  ESPANA ')).toBe(true);
    expect(checkTypedAnswer(q, 'españa')).toBe(true);
  });

  it('acepta aliases (EEUU / USA / EE.UU.)', () => {
    const q = buildQuestion('type-name', byCode('us'), mockCountries, seededRng(6));
    expect(checkTypedAnswer(q, 'EEUU')).toBe(true);
    expect(checkTypedAnswer(q, 'usa')).toBe(true);
    expect(checkTypedAnswer(q, 'EE.UU.')).toBe(true);
    expect(checkTypedAnswer(q, 'Estados Unidos de América')).toBe(true);
  });

  it('rechaza respuestas incorrectas y vacías', () => {
    const q = buildQuestion('type-name', byCode('fr'), mockCountries, seededRng(6));
    expect(checkTypedAnswer(q, 'Alemania')).toBe(false);
    expect(checkTypedAnswer(q, '   ')).toBe(false);
  });
});
