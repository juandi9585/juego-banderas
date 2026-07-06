import { describe, it, expect } from 'vitest';
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { countries, findCountry, TOTAL_COUNTRIES } from '../dataset';
import { buildQuiz } from '../../features/game/engine';
import { matchesCountryName } from '../../lib/text';
import type { Continent, QuizConfig } from '../../features/game/types';

const CONTINENTS: Continent[] = [
  'África',
  'América del Norte',
  'América del Sur',
  'Asia',
  'Europa',
  'Oceanía',
];

const flagsDir = join(process.cwd(), 'public', 'flags');

describe('Integridad del dataset', () => {
  it('tiene 194 países y TOTAL_COUNTRIES coincide', () => {
    expect(countries.length).toBe(194);
    expect(TOTAL_COUNTRIES).toBe(194);
  });

  it('no hay códigos ni nombres duplicados', () => {
    const codes = countries.map((c) => c.code);
    const names = countries.map((c) => c.name);
    expect(new Set(codes).size).toBe(codes.length);
    expect(new Set(names).size).toBe(names.length);
  });

  it('cada país tiene código en minúsculas, capital, continente válido y 2–4 facts', () => {
    for (const c of countries) {
      expect(c.code).toMatch(/^[a-z]{2}$/);
      expect(c.capital.trim().length).toBeGreaterThan(0);
      expect(CONTINENTS).toContain(c.continent);
      expect(c.facts.length).toBeGreaterThanOrEqual(2);
      expect(c.facts.length).toBeLessThanOrEqual(4);
      c.facts.forEach((f) => expect(f.trim().length).toBeGreaterThan(0));
      expect(c.flag).toBe(`/flags/${c.code}.svg`);
    }
  });

  it('el reparto por continente es el esperado (Oceanía = 14)', () => {
    const byCont: Record<string, number> = {};
    for (const c of countries) byCont[c.continent] = (byCont[c.continent] ?? 0) + 1;
    expect(byCont['Oceanía']).toBe(14);
    expect(Object.values(byCont).reduce((a, b) => a + b, 0)).toBe(194);
  });
});

describe('Integridad de las banderas (public/flags)', () => {
  it('todos los SVG referenciados existen, no están vacíos y son SVG (no HTML de error)', () => {
    const problemas: string[] = [];
    for (const c of countries) {
      const file = join(flagsDir, `${c.code}.svg`);
      if (!existsSync(file)) {
        problemas.push(`${c.code}: no existe`);
        continue;
      }
      const raw = readFileSync(file, 'utf8').trim();
      if (raw.length === 0) {
        problemas.push(`${c.code}: vacío`);
        continue;
      }
      if (!raw.toLowerCase().includes('<svg')) {
        problemas.push(`${c.code}: no contiene <svg`);
      }
      if (/<html|<!doctype html/i.test(raw)) {
        problemas.push(`${c.code}: parece HTML de error`);
      }
    }
    expect(problemas).toEqual([]);
  });
});

describe('Motor + dataset real: filtro por continente', () => {
  const base: Omit<QuizConfig, 'continent'> = {
    mode: 'flag-to-name',
    questionCount: 1000,
  };

  it('una ronda filtrada por Oceanía solo pregunta países de Oceanía (14)', () => {
    const quiz = buildQuiz(countries, { ...base, continent: 'Oceanía' });
    expect(quiz).toHaveLength(14);
    expect(quiz.every((q) => q.country.continent === 'Oceanía')).toBe(true);
    // Los distractores también salen del pool filtrado => todos de Oceanía.
    for (const q of quiz) {
      expect(q.options!.every((o) => o.continent === 'Oceanía')).toBe(true);
    }
  });

  it('preset "todas" + "todos los continentes" genera 194 preguntas sin reventar', () => {
    const quiz = buildQuiz(countries, {
      ...base,
      continent: 'all',
      questionCount: Number.MAX_SAFE_INTEGER,
    });
    expect(quiz).toHaveLength(194);
    // Cada pregunta MC tiene 4 opciones con la correcta incluida.
    for (const q of quiz.slice(0, 20)) {
      expect(q.options).toHaveLength(4);
      expect(q.options!.map((o) => o.code)).toContain(q.correctCode);
    }
    // Sin país repetido como respuesta.
    const answerCodes = quiz.map((q) => q.correctCode);
    expect(new Set(answerCodes).size).toBe(answerCodes.length);
  });
});

describe('Normalización con dataset real (modo escribir)', () => {
  it('"peru" acierta para Perú (sin tilde)', () => {
    expect(matchesCountryName('peru', findCountry('pe')!)).toBe(true);
  });

  it('"  FRANCIA  " acierta para Francia (mayúsculas + espacios)', () => {
    expect(matchesCountryName('  FRANCIA  ', findCountry('fr')!)).toBe(true);
  });

  it('"EEUU" y "Estados Unidos" aciertan para us', () => {
    const us = findCountry('us')!;
    expect(matchesCountryName('EEUU', us)).toBe(true);
    expect(matchesCountryName('Estados Unidos', us)).toBe(true);
    expect(matchesCountryName('EE.UU.', us)).toBe(true);
  });

  it('respuesta vacía y mal escrita no aciertan', () => {
    const fr = findCountry('fr')!;
    expect(matchesCountryName('', fr)).toBe(false);
    expect(matchesCountryName('   ', fr)).toBe(false);
    expect(matchesCountryName('alemanixa', fr)).toBe(false);
  });
});
