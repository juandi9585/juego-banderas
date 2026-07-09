import { describe, it, expect, beforeEach } from 'vitest';
import {
  classifySubmit,
  enqueue,
  loadQueue,
  pruneExpired,
  QUEUE_MAX_AGE_MS,
  removeFromQueue,
  saveQueue,
  submitId,
  type QueuedSubmit,
} from '../queue';
import type { SubmitPayload } from '../types';
import type { CategoryId } from '../../game/categories';

const QUEUE_KEY = 'banderas:submit-queue:v1';

const payload = (over: Partial<SubmitPayload> = {}): SubmitPayload => ({
  seed: 111,
  categoryId: 'caribe' as CategoryId,
  mode: 'mixto',
  answers: [{ givenCode: 'cu', elapsedMs: 1000 }],
  ...over,
});

const item = (over: Partial<QueuedSubmit> = {}): QueuedSubmit => {
  const p = over.payload ?? payload();
  // enqueuedAt reciente por defecto: loadQueue purga los caducados (>14 días).
  return { id: over.id ?? submitId(p), payload: p, enqueuedAt: over.enqueuedAt ?? Date.now() };
};

beforeEach(() => {
  localStorage.clear();
});

describe('classifySubmit (status HTTP → acción)', () => {
  it('200 → ok', () => expect(classifySubmit(200)).toBe('ok'));
  it('401 → needs-session', () => expect(classifySubmit(401)).toBe('needs-session'));
  it('412 → needs-profile', () => expect(classifySubmit(412)).toBe('needs-profile'));
  it('422 y 400 → discard (payload inválido, no reintentar)', () => {
    expect(classifySubmit(422)).toBe('discard');
    expect(classifySubmit(400)).toBe('discard');
  });
  it('0 (red), 5xx y 429 → retry', () => {
    expect(classifySubmit(0)).toBe('retry');
    expect(classifySubmit(500)).toBe('retry');
    expect(classifySubmit(503)).toBe('retry');
    expect(classifySubmit(429)).toBe('retry');
  });
});

describe('submitId (identidad de dedupe)', () => {
  it('compone seed:categoría:modo', () => {
    expect(submitId(payload({ seed: 42, categoryId: 'europa' as CategoryId, mode: 'type-name' }))).toBe(
      '42:europa:type-name',
    );
  });
});

describe('enqueue (dedupe + inmutable + tope)', () => {
  it('añade sin mutar el array original', () => {
    const q: QueuedSubmit[] = [];
    const next = enqueue(q, item());
    expect(next).toHaveLength(1);
    expect(q).toHaveLength(0);
  });

  it('deduplica por id: encolar la misma ronda no crea un segundo item', () => {
    const a = item({ id: 'x', enqueuedAt: 1 });
    const b = item({ id: 'x', enqueuedAt: 2 });
    const next = enqueue(enqueue([], a), b);
    expect(next).toHaveLength(1);
    expect(next[0].enqueuedAt).toBe(2); // se reemplaza por el más reciente
  });

  it('respeta el tope de 50 descartando los más antiguos', () => {
    let q: QueuedSubmit[] = [];
    for (let i = 0; i < 55; i++) q = enqueue(q, item({ id: `id-${i}`, enqueuedAt: i }));
    expect(q).toHaveLength(50);
    expect(q[0].id).toBe('id-5'); // los 5 primeros cayeron
    expect(q[q.length - 1].id).toBe('id-54');
  });
});

describe('pruneExpired (caducidad)', () => {
  it('descarta ítems más antiguos que el máximo y conserva los frescos', () => {
    const now = 1_000_000_000_000;
    const viejo = item({ id: 'viejo', enqueuedAt: now - QUEUE_MAX_AGE_MS - 1 });
    const justo = item({ id: 'justo', enqueuedAt: now - QUEUE_MAX_AGE_MS + 1 });
    const nuevo = item({ id: 'nuevo', enqueuedAt: now });
    const kept = pruneExpired([viejo, justo, nuevo], now);
    expect(kept.map((x) => x.id)).toEqual(['justo', 'nuevo']);
  });

  it('no muta el array original', () => {
    const now = 2_000_000;
    const q = [item({ id: 'a', enqueuedAt: 0 })];
    pruneExpired(q, now, 1000);
    expect(q).toHaveLength(1);
  });

  it('loadQueue purga los caducados al cargar', () => {
    const now = Date.now();
    localStorage.setItem(
      QUEUE_KEY,
      JSON.stringify([
        item({ id: 'viejo', enqueuedAt: now - QUEUE_MAX_AGE_MS - 5000 }),
        item({ id: 'nuevo', enqueuedAt: now }),
      ]),
    );
    const loaded = loadQueue();
    expect(loaded.map((x) => x.id)).toEqual(['nuevo']);
  });
});

describe('removeFromQueue', () => {
  it('quita por id sin mutar', () => {
    const q = [item({ id: 'a' }), item({ id: 'b' })];
    const next = removeFromQueue(q, 'a');
    expect(next.map((x) => x.id)).toEqual(['b']);
    expect(q).toHaveLength(2);
  });
});

describe('load/save (localStorage, defensivo)', () => {
  it('roundtrip: lo guardado se recupera igual', () => {
    const q = [item({ id: 'a' })];
    saveQueue(q);
    expect(loadQueue()).toEqual(q);
  });

  it('sin nada guardado → []', () => {
    expect(loadQueue()).toEqual([]);
  });

  it('JSON corrupto → [] (no lanza)', () => {
    localStorage.setItem(QUEUE_KEY, '{no json');
    expect(loadQueue()).toEqual([]);
  });

  it('JSON no-array → []', () => {
    localStorage.setItem(QUEUE_KEY, '{"a":1}');
    expect(loadQueue()).toEqual([]);
  });

  it('filtra items con forma inválida (sin payload / sin id)', () => {
    localStorage.setItem(
      QUEUE_KEY,
      JSON.stringify([item({ id: 'ok' }), { id: 'malo' }, { foo: 1 }]),
    );
    const loaded = loadQueue();
    expect(loaded).toHaveLength(1);
    expect(loaded[0].id).toBe('ok');
  });
});
