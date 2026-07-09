import { describe, it, expect } from 'vitest';
import { formatDiscriminator, formatHandle, validateNickname } from '../nickname';

describe('validateNickname', () => {
  it('acepta un apodo normal y lo devuelve tal cual', () => {
    expect(validateNickname('Juan')).toEqual({ ok: true, value: 'Juan' });
  });

  it('recorta espacios en los bordes (espeja btrim del CHECK)', () => {
    expect(validateNickname('  Juan  ')).toEqual({ ok: true, value: 'Juan' });
  });

  it('rechaza menos de 2 caracteres (tras recortar)', () => {
    expect(validateNickname('a').ok).toBe(false);
    expect(validateNickname('  a  ').ok).toBe(false);
    expect(validateNickname('').ok).toBe(false);
  });

  it('rechaza más de 20 caracteres', () => {
    expect(validateNickname('a'.repeat(21)).ok).toBe(false);
    expect(validateNickname('a'.repeat(20)).ok).toBe(true);
  });

  it('rechaza el signo "#"', () => {
    expect(validateNickname('Juan#1').ok).toBe(false);
  });

  it('cuenta por puntos de código: un emoji vale 1', () => {
    // '👍' es 1 punto de código (2 unidades UTF-16) → menos de 2 → inválido.
    expect(validateNickname('👍').ok).toBe(false);
    // Dos emojis → 2 puntos → válido.
    expect(validateNickname('👍👍').ok).toBe(true);
  });
});

describe('formatDiscriminator', () => {
  it('rellena a 4 dígitos con almohadilla', () => {
    expect(formatDiscriminator(42)).toBe('#0042');
    expect(formatDiscriminator(1)).toBe('#0001');
    expect(formatDiscriminator(9999)).toBe('#9999');
    expect(formatDiscriminator(0)).toBe('#0000');
  });
});

describe('formatHandle', () => {
  it('une apodo y discriminador', () => {
    expect(formatHandle('Juan', 42)).toBe('Juan#0042');
  });
});
