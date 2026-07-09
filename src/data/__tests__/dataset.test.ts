import { describe, it, expect } from 'vitest';
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { countries, findCountry, TOTAL_COUNTRIES } from '../dataset';
import { buildQuiz } from '../../features/game/engine';
import {
  GAME_CATEGORIES,
  filterByCategories,
  type CategoryId,
} from '../../features/game/categories';
import { matchesCountryName } from '../../lib/text';
import type { Continent, QuizConfig } from '../../features/game/types';

const CONTINENTS: Continent[] = [
  'África',
  'América del Norte y Centro',
  'América del Sur',
  'Asia',
  'Europa',
  'Oceanía',
];

const flagsDir = join(process.cwd(), 'public', 'flags');

describe('Integridad del dataset', () => {
  it('tiene 197 países y TOTAL_COUNTRIES coincide', () => {
    expect(countries.length).toBe(197);
    expect(TOTAL_COUNTRIES).toBe(197);
  });

  it('no hay códigos ni nombres duplicados', () => {
    const codes = countries.map((c) => c.code);
    const names = countries.map((c) => c.name);
    expect(new Set(codes).size).toBe(codes.length);
    expect(new Set(names).size).toBe(names.length);
  });

  it('cada país tiene código en minúsculas, capital, continente válido y 5–8 facts', () => {
    for (const c of countries) {
      expect(c.code).toMatch(/^[a-z]{2}$/);
      expect(c.capital.trim().length).toBeGreaterThan(0);
      expect(CONTINENTS).toContain(c.continent);
      expect(c.facts.length).toBeGreaterThanOrEqual(5);
      expect(c.facts.length).toBeLessThanOrEqual(8);
      c.facts.forEach((f) => expect(f.trim().length).toBeGreaterThan(0));
      expect(c.flag).toBe(`/flags/${c.code}.svg`);
    }
  });

  it('el reparto por continente es el esperado (Oceanía = 14)', () => {
    const byCont: Record<string, number> = {};
    for (const c of countries) byCont[c.continent] = (byCont[c.continent] ?? 0) + 1;
    expect(byCont['Oceanía']).toBe(14);
    expect(Object.values(byCont).reduce((a, b) => a + b, 0)).toBe(197);
  });

  it('Cuba está en el continente renombrado "América del Norte y Centro"', () => {
    expect(findCountry('cu')?.continent).toBe('América del Norte y Centro');
  });
});

describe('Catálogo de categorías ↔ dataset (conteos exactos, §2.3)', () => {
  // Ancla catálogo ↔ datos: si el dataset cambia y descuadra un sector, este
  // test lo detecta. Conteos verificados sobre src/data/countries.json.
  const EXPECTED: Record<CategoryId, number> = {
    mundo: 197,
    africa: 54,
    asia: 48,
    europa: 46,
    america: 35,
    'america-norte-centro': 23,
    'america-sur': 12,
    oceania: 14,
    'europa-oeste': 27,
    'europa-este': 19,
    'asia-occidental': 17,
    'sudeste-asiatico': 11,
    'asia-meridional': 9,
    'asia-oriental-central': 11,
    'africa-norte-occidental': 22,
    'africa-oriental': 17,
    'africa-central-austral': 15,
    caribe: 13,
  };

  it('el catálogo tiene exactamente 18 categorías', () => {
    expect(GAME_CATEGORIES).toHaveLength(18);
  });

  it('cada categoría filtra el nº de países esperado', () => {
    for (const cat of GAME_CATEGORIES) {
      expect(filterByCategories([cat.id], countries)).toHaveLength(EXPECTED[cat.id]);
    }
  });

  it('todas las categorías cumplen la regla de ≥ 8 países (4 opciones distintas)', () => {
    for (const cat of GAME_CATEGORIES) {
      expect(filterByCategories([cat.id], countries).length).toBeGreaterThanOrEqual(8);
    }
  });

  it('sumas por continente: Europa 27+19, Asia 17+11+9+11, África 22+17+15, América 23+12', () => {
    expect(EXPECTED['europa-oeste'] + EXPECTED['europa-este']).toBe(EXPECTED.europa);
    expect(
      EXPECTED['asia-occidental'] +
        EXPECTED['sudeste-asiatico'] +
        EXPECTED['asia-meridional'] +
        EXPECTED['asia-oriental-central'],
    ).toBe(EXPECTED.asia);
    expect(
      EXPECTED['africa-norte-occidental'] +
        EXPECTED['africa-oriental'] +
        EXPECTED['africa-central-austral'],
    ).toBe(EXPECTED.africa);
    expect(EXPECTED['america-norte-centro'] + EXPECTED['america-sur']).toBe(
      EXPECTED.america,
    );
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

describe('Motor + dataset real: filtro por categorías', () => {
  const base: Omit<QuizConfig, 'categories'> = {
    mode: 'flag-to-name',
    questionCount: 1000,
  };

  it('una ronda filtrada por Oceanía solo pregunta países de Oceanía (14)', () => {
    const quiz = buildQuiz(countries, { ...base, categories: ['oceania'] });
    expect(quiz).toHaveLength(14);
    expect(quiz.every((q) => q.country.continent === 'Oceanía')).toBe(true);
    // Los distractores también salen del pool filtrado => todos de Oceanía.
    for (const q of quiz) {
      expect(q.options!.every((o) => o.continent === 'Oceanía')).toBe(true);
    }
  });

  it('preset "todas" + todas las categorías genera 197 preguntas sin reventar', () => {
    const quiz = buildQuiz(countries, {
      ...base,
      categories: [],
      questionCount: Number.MAX_SAFE_INTEGER,
    });
    expect(quiz).toHaveLength(197);
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
