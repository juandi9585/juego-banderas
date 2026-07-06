// Adaptador del dataset autogenerado al contrato tipado del juego.
// PROPIEDAD: frontend-engineer.
//
// `countries.ts` es AUTOGENERADO por data-curator con `continent: string` y sin
// `aliases` (regenerarlo pisaría cualquier edición manual). Este módulo es la
// única frontera donde se estrecha el tipo a la union `Continent` — los 6 valores
// los verifican `scripts/validate-data.mjs` (corre en `npm run build`) y el test
// de integridad `src/data/__tests__/dataset.test.ts` — y se inyectan los aliases
// curados del modo escribir. TODO el código de la app consume ESTE módulo, no
// `./countries` directamente.
import { countries as raw } from './countries';
import { COUNTRY_ALIASES } from './aliases';
import type { Country } from '../features/game/types';

export const countries: Country[] = raw.map((c) => ({
  ...(c as Country),
  aliases: COUNTRY_ALIASES[c.code],
}));

const byCode = new Map(countries.map((c) => [c.code, c]));

/** Busca un país por código ISO (minúsculas). */
export function findCountry(code: string | undefined): Country | undefined {
  return code ? byCode.get(code.toLowerCase()) : undefined;
}

export const TOTAL_COUNTRIES = countries.length;
