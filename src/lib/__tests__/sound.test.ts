import { describe, it, expect, beforeEach, vi } from 'vitest';

// ─────────────────────────────────────────────────────────────────────────────
// Módulo de audio (docs/design.md §22.1). En jsdom NO hay AudioContext, así que
// se ejercita el contrato de MUTE (fuente única persistida) y la robustez de
// `play` (no-op silencioso, nunca lanza). Cada test reimporta el módulo con
// `vi.resetModules()` para releer localStorage al montar (muted se fija al import).
// ─────────────────────────────────────────────────────────────────────────────

const KEY = 'banderas:sound';

beforeEach(() => {
  localStorage.clear();
  vi.resetModules();
});

describe('sound.ts — mute persistente (§22.1)', () => {
  it('ON por defecto cuando no hay preferencia guardada', async () => {
    const { isMuted } = await import('../sound');
    expect(isMuted()).toBe(false);
  });

  it('respeta "off" persistido al cargar', async () => {
    localStorage.setItem(KEY, 'off');
    const { isMuted } = await import('../sound');
    expect(isMuted()).toBe(true);
  });

  it('setMuted persiste "off"/"on" y actualiza isMuted', async () => {
    const { setMuted, isMuted } = await import('../sound');
    setMuted(true);
    expect(isMuted()).toBe(true);
    expect(localStorage.getItem(KEY)).toBe('off');
    setMuted(false);
    expect(isMuted()).toBe(false);
    expect(localStorage.getItem(KEY)).toBe('on');
  });

  it('toggleMuted alterna el estado', async () => {
    const { toggleMuted, isMuted } = await import('../sound');
    expect(isMuted()).toBe(false);
    toggleMuted();
    expect(isMuted()).toBe(true);
    toggleMuted();
    expect(isMuted()).toBe(false);
  });

  it('subscribeMuted notifica cambios y permite desuscribirse', async () => {
    const { subscribeMuted, setMuted } = await import('../sound');
    const seen: boolean[] = [];
    const unsub = subscribeMuted((m) => seen.push(m));
    setMuted(true);
    setMuted(false);
    unsub();
    setMuted(true); // ya no se observa
    expect(seen).toEqual([true, false]);
  });
});

describe('sound.ts — play nunca lanza sin AudioContext (jsdom)', () => {
  it('es no-op silencioso activo, silenciado y para todos los ids', async () => {
    const { play, setMuted } = await import('../sound');
    setMuted(false);
    expect(() => play('acierto')).not.toThrow();
    expect(() => play('racha')).not.toThrow();
    expect(() => play('fallo')).not.toThrow();
    expect(() => play('timeout')).not.toThrow();
    expect(() => play('tick')).not.toThrow();
    expect(() => play('record')).not.toThrow();
    setMuted(true);
    expect(() => play('acierto')).not.toThrow();
  });
});
