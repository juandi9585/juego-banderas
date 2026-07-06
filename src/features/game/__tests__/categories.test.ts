import { describe, it, expect } from 'vitest';
import {
  GAME_CATEGORIES,
  canonicalCategories,
  filterByCategories,
} from '../categories';
import { mockCountries } from './mockCountries';

const codesOf = (arr: { code: string }[]) => arr.map((c) => c.code).sort();

describe('canonicalCategories', () => {
  it('deduplica ids repetidos', () => {
    expect(canonicalCategories(['europa', 'europa', 'europa'])).toEqual(['europa']);
  });

  it('reordena según el orden del catálogo (no el de entrada)', () => {
    // Entrada desordenada => salida en el orden alfabético del catálogo.
    expect(canonicalCategories(['oceania', 'africa', 'europa'])).toEqual([
      'africa',
      'europa',
      'oceania',
    ]);
  });

  it('dedup + orden a la vez (incluye solapes de América)', () => {
    expect(canonicalCategories(['america-sur', 'america', 'america'])).toEqual([
      'america',
      'america-sur',
    ]);
  });

  it('seleccionar TODAS las categorías colapsa a [] (= todos)', () => {
    const all = GAME_CATEGORIES.map((c) => c.id);
    expect(canonicalCategories(all)).toEqual([]);
  });

  it('[] se mantiene []', () => {
    expect(canonicalCategories([])).toEqual([]);
  });
});

describe('filterByCategories', () => {
  it('[] devuelve el pool completo (copia, no la misma referencia)', () => {
    const result = filterByCategories([], mockCountries);
    expect(result).toHaveLength(mockCountries.length);
    expect(result).not.toBe(mockCountries);
    expect(codesOf(result)).toEqual(codesOf([...mockCountries]));
  });

  it('una sola categoría filtra por su matcher (Oceanía = Australia)', () => {
    const result = filterByCategories(['oceania'], mockCountries);
    expect(codesOf(result)).toEqual(['au']);
  });

  it('solape "america" + "america-sur": unión sin duplicados', () => {
    // "america" ya cubre Norte/Centro y Sur; "america-sur" es subconjunto.
    // Cada país aparece una sola vez: us, mx (Norte y Centro) + br, ar (Sur).
    const result = filterByCategories(['america', 'america-sur'], mockCountries);
    expect(codesOf(result)).toEqual(['ar', 'br', 'mx', 'us']);
  });

  it('unión de categorías disjuntas suma ambos pools (Europa ∪ Oceanía)', () => {
    const result = filterByCategories(['europa', 'oceania'], mockCountries);
    expect(codesOf(result)).toEqual(['au', 'de', 'es', 'fr', 'it', 'pt']);
  });
});
