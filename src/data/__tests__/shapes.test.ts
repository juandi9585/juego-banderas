import { describe, it, expect } from 'vitest';
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { countries } from '../dataset';
import { GAME_CATEGORIES } from '../../features/game/categories';

// ─────────────────────────────────────────────────────────────────────────────
// Assets de la Iteración B leídos del disco (public/), fuente de verdad. Las
// siluetas se generan con `npm run shapes` y los sonidos con `npm run sounds`.
// Se verifica cobertura, el xmlns OBLIGATORIO (sin él, url()/mask no renderiza)
// y los presupuestos de bytes (roadmap §B.3 siluetas; §B.1 sonidos ≤ 60 KB).
// ─────────────────────────────────────────────────────────────────────────────

const publicDir = join(process.cwd(), 'public');
const zonesDir = join(publicDir, 'shapes', 'zones');
const countriesDir = join(publicDir, 'shapes', 'countries');
const soundsDir = join(publicDir, 'sounds');

const XMLNS = 'xmlns="http://www.w3.org/2000/svg"';
// Límites de validación (holgura sobre el enforce de 1,5 KB del generador).
const VALID_COUNTRY = 1536;
const VALID_ZONE = 1536;
const VALID_WORLD = 4096; // "mundo" tiene presupuesto propio (roadmap §B.3)

describe('Siluetas de zona (public/shapes/zones)', () => {
  it('existe una por cada una de las 18 zonas, con xmlns y dentro de presupuesto', () => {
    expect(GAME_CATEGORIES).toHaveLength(18);
    const problems: string[] = [];
    for (const cat of GAME_CATEGORIES) {
      const file = join(zonesDir, `${cat.id}.svg`);
      if (!existsSync(file)) {
        problems.push(`${cat.id}: no existe`);
        continue;
      }
      const raw = readFileSync(file, 'utf8');
      const bytes = Buffer.byteLength(raw, 'utf8');
      if (!raw.includes(XMLNS)) problems.push(`${cat.id}: sin xmlns`);
      if (!raw.toLowerCase().includes('<svg')) problems.push(`${cat.id}: no es SVG`);
      const limit = cat.id === 'mundo' ? VALID_WORLD : VALID_ZONE;
      if (bytes > limit) problems.push(`${cat.id}: ${bytes} B > ${limit}`);
    }
    expect(problems).toEqual([]);
  });
});

describe('Siluetas de país (public/shapes/countries)', () => {
  it('existe una por cada uno de los 194 países, con xmlns y ≤ 1,5 KiB', () => {
    expect(countries).toHaveLength(194);
    const problems: string[] = [];
    for (const c of countries) {
      const file = join(countriesDir, `${c.code}.svg`);
      if (!existsSync(file)) {
        problems.push(`${c.code}: no existe`);
        continue;
      }
      const raw = readFileSync(file, 'utf8');
      const bytes = Buffer.byteLength(raw, 'utf8');
      if (!raw.includes(XMLNS)) problems.push(`${c.code}: sin xmlns`);
      if (bytes > VALID_COUNTRY) problems.push(`${c.code}: ${bytes} B > ${VALID_COUNTRY}`);
    }
    expect(problems).toEqual([]);
  });
});

describe('Sonidos (public/sounds)', () => {
  const SOUND_IDS = ['acierto', 'racha', 'fallo', 'timeout', 'tick', 'record'];

  it('existen los 6 WAV, son RIFF/WAVE válidos y suman ≤ 60 KB (precache §B.1)', () => {
    const problems: string[] = [];
    let total = 0;
    for (const id of SOUND_IDS) {
      const file = join(soundsDir, `${id}.wav`);
      if (!existsSync(file)) {
        problems.push(`${id}: no existe`);
        continue;
      }
      const buf = readFileSync(file);
      total += buf.length;
      const isWav =
        buf.subarray(0, 4).toString('ascii') === 'RIFF' &&
        buf.subarray(8, 12).toString('ascii') === 'WAVE';
      if (!isWav) problems.push(`${id}: no es WAV`);
    }
    expect(problems).toEqual([]);
    expect(total).toBeLessThanOrEqual(60 * 1024);
  });
});
