// Catálogo COMPARTIDO de categorías de juego. PROPIEDAD: frontend-engineer.
//
// Fuente única de la que leen el modo casual (selección múltiple, unión de
// países) y —en el futuro— el modo competitivo (selección simple, ranking por
// categoría; ver docs/competitivo.md). Cuando se acuerde el catálogo
// competitivo, sus categorías finas (Europa Este/Oeste, Asia por sectores…) se
// añaden a ESTE mismo array y el casual las hereda sin tocar la UI.
//
// `import type` (solo tipos): sin ciclo en runtime aunque `types.ts` importe de
// vuelta `CategoryId` de este módulo.
import type { Country } from './types';

/** Entrada del catálogo: un id estable, su etiqueta de chip y su matcher. */
export interface GameCategory {
  id: string; // estable (clave de ranking futuro): 'africa', 'america', …
  label: string; // texto del chip en la UI
  matches: (c: Country) => boolean; // ¿el país pertenece a la categoría?
}

// v1: 6 continentes + "América" completa (ya pedida para el competitivo). Los
// matchers de continente comparan contra `Country.continent`; las categorías
// finas futuras usarán `Country.region`. Orden alfabético para la UI.
export const GAME_CATEGORIES = [
  { id: 'africa',               label: 'África',                     matches: (c: Country) => c.continent === 'África' },
  { id: 'america',              label: 'América',                    matches: (c: Country) => c.continent === 'América del Norte y Centro' || c.continent === 'América del Sur' },
  { id: 'america-norte-centro', label: 'América del Norte y Centro', matches: (c: Country) => c.continent === 'América del Norte y Centro' },
  { id: 'america-sur',          label: 'América del Sur',            matches: (c: Country) => c.continent === 'América del Sur' },
  { id: 'asia',                 label: 'Asia',                       matches: (c: Country) => c.continent === 'Asia' },
  { id: 'europa',               label: 'Europa',                     matches: (c: Country) => c.continent === 'Europa' },
  { id: 'oceania',              label: 'Oceanía',                    matches: (c: Country) => c.continent === 'Oceanía' },
] as const satisfies readonly GameCategory[];

/** Union de los ids del catálogo (estable, seguro para persistir/rankear). */
export type CategoryId = (typeof GAME_CATEGORIES)[number]['id'];

/**
 * Normaliza una selección: dedup + orden del catálogo. Si quedan TODAS las
 * categorías, colapsa a `[]` (equivalente a "todos", el pool completo).
 */
export function canonicalCategories(ids: readonly CategoryId[]): CategoryId[] {
  const selected = new Set(ids);
  const canonical = GAME_CATEGORIES.filter((cat) => selected.has(cat.id)).map(
    (cat) => cat.id,
  );
  return canonical.length === GAME_CATEGORIES.length ? [] : canonical;
}

/**
 * Unión de países de las categorías seleccionadas. `[]` = pool completo (copia).
 * Un país que matchea varias categorías cuenta una sola vez (se filtra el pool
 * una vez con `.some`, sin duplicados).
 */
export function filterByCategories(
  ids: readonly CategoryId[],
  pool: readonly Country[],
): Country[] {
  if (ids.length === 0) return pool.slice();
  const selected = GAME_CATEGORIES.filter((cat) => ids.includes(cat.id));
  return pool.filter((c) => selected.some((cat) => cat.matches(c)));
}
