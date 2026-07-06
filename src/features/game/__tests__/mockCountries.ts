import type { Country } from '../types';

// Pool de países MOCK para los tests del motor. NO depende del dataset real de
// data-curator; usa la taxonomía de 6 continentes acordada. ~15 países con
// suficientes por continente/región para ejercitar los distractores.
export const mockCountries: Country[] = [
  // ── Europa (5; dos regiones) ──────────────────────────────────────────────
  {
    code: 'fr',
    name: 'Francia',
    continent: 'Europa',
    region: 'Europa Occidental',
    capital: 'París',
    flag: '/flags/fr.svg',
    facts: ['Tiene la torre Eiffel.'],
  },
  {
    code: 'de',
    name: 'Alemania',
    continent: 'Europa',
    region: 'Europa Occidental',
    capital: 'Berlín',
    flag: '/flags/de.svg',
    facts: ['País más poblado de la UE.'],
  },
  {
    code: 'es',
    name: 'España',
    continent: 'Europa',
    region: 'Europa del Sur',
    capital: 'Madrid',
    flag: '/flags/es.svg',
    facts: ['La siesta es una tradición.'],
    aliases: ['Reino de España'],
  },
  {
    code: 'it',
    name: 'Italia',
    continent: 'Europa',
    region: 'Europa del Sur',
    capital: 'Roma',
    flag: '/flags/it.svg',
    facts: ['Cuna del Imperio romano.'],
  },
  {
    code: 'pt',
    name: 'Portugal',
    continent: 'Europa',
    region: 'Europa del Sur',
    capital: 'Lisboa',
    flag: '/flags/pt.svg',
    facts: ['Tiene una gran tradición marinera.'],
  },
  // ── Asia (3) ──────────────────────────────────────────────────────────────
  {
    code: 'jp',
    name: 'Japón',
    continent: 'Asia',
    region: 'Asia Oriental',
    capital: 'Tokio',
    flag: '/flags/jp.svg',
    facts: ['El monte Fuji es su símbolo.'],
  },
  {
    code: 'cn',
    name: 'China',
    continent: 'Asia',
    region: 'Asia Oriental',
    capital: 'Pekín',
    flag: '/flags/cn.svg',
    facts: ['Tiene la Gran Muralla.'],
  },
  {
    code: 'in',
    name: 'India',
    continent: 'Asia',
    region: 'Asia del Sur',
    capital: 'Nueva Delhi',
    flag: '/flags/in.svg',
    facts: ['Es la democracia más poblada.'],
  },
  // ── América del Norte y Centro (2; una con aliases) ───────────────────────
  {
    code: 'us',
    name: 'Estados Unidos',
    officialName: 'Estados Unidos de América',
    continent: 'América del Norte y Centro',
    region: 'América del Norte',
    capital: 'Washington D. C.',
    flag: '/flags/us.svg',
    facts: ['Tiene 50 estados.'],
    aliases: ['EEUU', 'EE.UU.', 'USA', 'Estados Unidos de América'],
  },
  {
    code: 'mx',
    name: 'México',
    continent: 'América del Norte y Centro',
    region: 'América Central',
    capital: 'Ciudad de México',
    flag: '/flags/mx.svg',
    facts: ['Cuna de la civilización maya y azteca.'],
    aliases: ['Mejico'],
  },
  // ── América del Sur (2) ───────────────────────────────────────────────────
  {
    code: 'br',
    name: 'Brasil',
    continent: 'América del Sur',
    region: 'América del Sur',
    capital: 'Brasilia',
    flag: '/flags/br.svg',
    facts: ['El país más grande de Sudamérica.'],
  },
  {
    code: 'ar',
    name: 'Argentina',
    continent: 'América del Sur',
    region: 'América del Sur',
    capital: 'Buenos Aires',
    flag: '/flags/ar.svg',
    facts: ['El tango nació aquí.'],
  },
  // ── África (2) ────────────────────────────────────────────────────────────
  {
    code: 'eg',
    name: 'Egipto',
    continent: 'África',
    region: 'Norte de África',
    capital: 'El Cairo',
    flag: '/flags/eg.svg',
    facts: ['Tiene las pirámides de Giza.'],
  },
  {
    code: 'ng',
    name: 'Nigeria',
    continent: 'África',
    region: 'África Occidental',
    capital: 'Abuya',
    flag: '/flags/ng.svg',
    facts: ['El país más poblado de África.'],
  },
  // ── Oceanía (1) ───────────────────────────────────────────────────────────
  {
    code: 'au',
    name: 'Australia',
    continent: 'Oceanía',
    region: 'Australasia',
    capital: 'Canberra',
    flag: '/flags/au.svg',
    facts: ['Es a la vez país y continente.'],
  },
];

/** RNG determinista (mulberry32) para tests reproducibles. */
export function seededRng(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export const byCode = (code: string): Country => {
  const c = mockCountries.find((x) => x.code === code);
  if (!c) throw new Error(`mock país no encontrado: ${code}`);
  return c;
};
