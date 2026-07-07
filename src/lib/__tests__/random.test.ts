import { describe, it, expect } from 'vitest';
import { mulberry32, randomSeed, shuffle } from '../random';

describe('mulberry32 (PRNG determinista)', () => {
  it('la misma semilla produce la MISMA secuencia', () => {
    const a = mulberry32(12345);
    const b = mulberry32(12345);
    const seqA = Array.from({ length: 10 }, () => a());
    const seqB = Array.from({ length: 10 }, () => b());
    expect(seqA).toEqual(seqB);
  });

  it('semillas distintas producen secuencias distintas', () => {
    const a = mulberry32(1);
    const b = mulberry32(2);
    const seqA = Array.from({ length: 10 }, () => a());
    const seqB = Array.from({ length: 10 }, () => b());
    expect(seqA).not.toEqual(seqB);
  });

  it('genera números en el rango [0, 1)', () => {
    const rng = mulberry32(999);
    for (let i = 0; i < 100; i++) {
      const n = rng();
      expect(n).toBeGreaterThanOrEqual(0);
      expect(n).toBeLessThan(1);
    }
  });

  it('inyectado en shuffle, baraja igual con la misma semilla (reproducible)', () => {
    const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    expect(shuffle(arr, mulberry32(7))).toEqual(shuffle(arr, mulberry32(7)));
  });
});

describe('randomSeed', () => {
  it('devuelve un entero sin signo de 32 bits', () => {
    for (let i = 0; i < 50; i++) {
      const s = randomSeed();
      expect(Number.isInteger(s)).toBe(true);
      expect(s).toBeGreaterThanOrEqual(0);
      expect(s).toBeLessThanOrEqual(0xffffffff);
    }
  });
});
