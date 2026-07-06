import { describe, it, expect } from 'vitest';
import { normalize, matchesCountryName } from '../../../lib/text';
import { byCode } from './mockCountries';

describe('normalize', () => {
  it('pasa a minúsculas y recorta espacios', () => {
    expect(normalize('  FRANCIA  ')).toBe('francia');
  });

  it('elimina diacríticos (tildes, ñ, diéresis)', () => {
    expect(normalize('España')).toBe('espana');
    expect(normalize('Perú')).toBe('peru');
    expect(normalize('São Tomé')).toBe('sao tome');
  });

  it('elimina puntuación (EE.UU. -> eeuu)', () => {
    expect(normalize('EE.UU.')).toBe('eeuu');
    expect(normalize('U.S.A.')).toBe('usa');
  });

  it('colapsa espacios internos múltiples', () => {
    expect(normalize('Estados   Unidos')).toBe('estados unidos');
  });

  it('cadena solo de puntuación/espacios queda vacía', () => {
    expect(normalize('  .,-  ')).toBe('');
  });
});

describe('matchesCountryName', () => {
  it('coincide con el nombre normalizado', () => {
    const es = byCode('es');
    expect(matchesCountryName('  ESPAÑA ', es)).toBe(true);
    expect(matchesCountryName('espana', es)).toBe(true);
  });

  it('coincide con el nombre oficial', () => {
    const us = byCode('us'); // officialName: "Estados Unidos de América"
    expect(matchesCountryName('estados unidos de america', us)).toBe(true);
  });

  it('coincide con aliases', () => {
    const us = byCode('us');
    expect(matchesCountryName('EEUU', us)).toBe(true);
    expect(matchesCountryName('usa', us)).toBe(true);
    expect(matchesCountryName('EE. UU.', us)).toBe(false); // alias es "EE.UU." sin espacio interno
    const mx = byCode('mx');
    expect(matchesCountryName('mejico', mx)).toBe(true);
  });

  it('rechaza no coincidencias y cadenas vacías', () => {
    const fr = byCode('fr');
    expect(matchesCountryName('Alemania', fr)).toBe(false);
    expect(matchesCountryName('', fr)).toBe(false);
    expect(matchesCountryName('   ', fr)).toBe(false);
  });
});
