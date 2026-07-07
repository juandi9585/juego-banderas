import { describe, it, expect, beforeEach } from 'vitest';
import {
  isBetter,
  loadRecords,
  saveRecords,
  recordKey,
  type RecordEntry,
} from '../records';

const STORAGE_KEY = 'banderas:records:v1';

/** Marca base; se sobreescriben los campos relevantes en cada caso. */
const entry = (over: Partial<RecordEntry> = {}): RecordEntry => ({
  points: 1000,
  correct: 10,
  total: 20,
  maxStreak: 5,
  durationMs: 60000,
  achievedAt: 1_700_000_000_000,
  ...over,
});

beforeEach(() => {
  localStorage.clear();
});

describe('isBetter (criterios en orden, estricto)', () => {
  it('gana por más points', () => {
    expect(isBetter(entry({ points: 1200 }), entry({ points: 1000 }))).toBe(true);
    expect(isBetter(entry({ points: 900 }), entry({ points: 1000 }))).toBe(false);
  });

  it('a igualdad de points, gana por más correct', () => {
    expect(
      isBetter(entry({ points: 1000, correct: 12 }), entry({ points: 1000, correct: 10 })),
    ).toBe(true);
    expect(
      isBetter(entry({ points: 1000, correct: 8 }), entry({ points: 1000, correct: 10 })),
    ).toBe(false);
  });

  it('a igualdad de points y correct, gana por MENOR durationMs', () => {
    expect(
      isBetter(
        entry({ points: 1000, correct: 10, durationMs: 40000 }),
        entry({ points: 1000, correct: 10, durationMs: 60000 }),
      ),
    ).toBe(true);
    expect(
      isBetter(
        entry({ points: 1000, correct: 10, durationMs: 90000 }),
        entry({ points: 1000, correct: 10, durationMs: 60000 }),
      ),
    ).toBe(false);
  });

  it('es ESTRICTO: un empate total no es mejor (no se pisa un récord idéntico)', () => {
    expect(isBetter(entry(), entry())).toBe(false);
  });
});

describe('recordKey', () => {
  it('compone `<categoria>:<modo>`', () => {
    expect(recordKey('mundo', 'mixto')).toBe('mundo:mixto');
    expect(recordKey('caribe', 'mixto')).toBe('caribe:mixto');
  });
});

describe('load/save (localStorage)', () => {
  it('roundtrip: lo guardado se recupera igual', () => {
    const map = { 'mundo:mixto': entry({ points: 3200 }) };
    saveRecords(map);
    expect(loadRecords()).toEqual(map);
  });

  it('sin nada guardado devuelve {}', () => {
    expect(loadRecords()).toEqual({});
  });

  it('JSON corrupto devuelve {} (no lanza)', () => {
    localStorage.setItem(STORAGE_KEY, '{no es json válido');
    expect(loadRecords()).toEqual({});
  });

  it('JSON válido pero no-objeto (array / número) devuelve {}', () => {
    localStorage.setItem(STORAGE_KEY, '[1,2,3]');
    expect(loadRecords()).toEqual({});
    localStorage.setItem(STORAGE_KEY, '42');
    expect(loadRecords()).toEqual({});
  });
});
