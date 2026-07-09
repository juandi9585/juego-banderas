// Catálogo COMPARTIDO de categorías de juego. PROPIEDAD: frontend-engineer.
//
// Fuente ÚNICA de la que leen el modo casual (selección múltiple, unión de
// países) y el modo competitivo (selección simple, ranking por categoría; ver
// docs/competitivo.md). Toda categoría competitiva es una entrada más de este
// mismo array, así que el casual las hereda sin duplicar listas.
//
// `import type` (solo tipos): sin ciclo en runtime aunque `types.ts` importe de
// vuelta `CategoryId` de este módulo.
import type { Country } from './types';

/**
 * Entrada del catálogo: un id estable (clave de ranking), su etiqueta, su
 * matcher y el grupo con el que se agrupa en las UIs (Continentes / Sectores).
 */
export interface GameCategory {
  id: string; // estable (clave de récord): 'africa', 'europa-oeste', …
  label: string; // texto del chip / fila en la UI
  group: 'continente' | 'sector'; // agrupa las UIs (casual y competitivo)
  matches: (c: Country) => boolean; // ¿el país pertenece a la categoría?
}

// ── Conjuntos de subregiones por sector ──────────────────────────────────────
// Los strings están VERIFICADOS contra src/data/countries.json (valores exactos
// de `Country.region`); los conteos entre paréntesis salen de ese dataset y los
// fija el test de integridad (docs/competitivo.md §2). Cambiar el dataset obliga
// a revisar estos Sets.
const R_EUROPA_OESTE = new Set(['Europa Occidental', 'Europa del Norte', 'Europa Meridional']); // 8+10+9 = 27
const R_EUROPA_ESTE = new Set(['Europa Oriental', 'Europa Central', 'Europa Sudoriental']); // 4+6+9 = 19
const R_ASIA_OCCIDENTAL = new Set(['Asia Occidental']); // 17
const R_SUDESTE_ASIATICO = new Set(['Sudeste Asiático']); // 11
const R_ASIA_MERIDIONAL = new Set(['Asia Meridional']); // 9
const R_ASIA_ORIENTAL_CENTRAL = new Set(['Asia Oriental', 'Asia Central']); // 6+5 = 11
const R_AFRICA_NORTE_OCCIDENTAL = new Set(['África del Norte', 'África Occidental']); // 6+16 = 22
const R_AFRICA_ORIENTAL = new Set(['África Oriental']); // 17
const R_AFRICA_CENTRAL_AUSTRAL = new Set(['África Central', 'África Austral']); // 10+5 = 15
const R_CARIBE = new Set(['Caribe']); // 13

/** Matcher por subregión: true si `region` está en el conjunto del sector. */
const inRegions = (set: ReadonlySet<string>) => (c: Country) =>
  c.region != null && set.has(c.region);

// Catálogo de 18 categorías: 7 continentes (heredados de v1) + "Mundo" +
// 10 sectores subregionales. Los matchers de continente comparan contra
// `Country.continent`; los de sector, contra `Country.region` (Sets de arriba).
// El orden del array es el orden canónico de la UI (Continentes y luego
// Sectores); "Mundo" abre el grupo continente pero se trata aparte en cada UI
// (el casual lo oculta —el chip "Todos" cumple ese rol— y el competitivo lo
// destaca como carta insignia).
export const GAME_CATEGORIES = [
  // ── Nivel continente (group: 'continente') ────────────────────────────────
  { id: 'mundo',                label: 'Mundo',                          group: 'continente', matches: () => true },
  { id: 'africa',               label: 'África',                         group: 'continente', matches: (c: Country) => c.continent === 'África' },
  { id: 'america',              label: 'América',                        group: 'continente', matches: (c: Country) => c.continent === 'América del Norte y Centro' || c.continent === 'América del Sur' },
  { id: 'america-norte-centro', label: 'América del Norte y Centro',     group: 'continente', matches: (c: Country) => c.continent === 'América del Norte y Centro' },
  { id: 'america-sur',          label: 'América del Sur',                group: 'continente', matches: (c: Country) => c.continent === 'América del Sur' },
  { id: 'asia',                 label: 'Asia',                           group: 'continente', matches: (c: Country) => c.continent === 'Asia' },
  { id: 'europa',               label: 'Europa',                         group: 'continente', matches: (c: Country) => c.continent === 'Europa' },
  { id: 'oceania',              label: 'Oceanía',                        group: 'continente', matches: (c: Country) => c.continent === 'Oceanía' },
  // ── Nivel sub-regional / sectores (group: 'sector') ───────────────────────
  { id: 'europa-oeste',            label: 'Europa del Oeste',              group: 'sector', matches: inRegions(R_EUROPA_OESTE) },
  { id: 'europa-este',             label: 'Europa del Este',               group: 'sector', matches: inRegions(R_EUROPA_ESTE) },
  { id: 'asia-occidental',         label: 'Asia Occidental (Medio Oriente)', group: 'sector', matches: inRegions(R_ASIA_OCCIDENTAL) },
  { id: 'sudeste-asiatico',        label: 'Sudeste Asiático',              group: 'sector', matches: inRegions(R_SUDESTE_ASIATICO) },
  { id: 'asia-meridional',         label: 'Asia Meridional',               group: 'sector', matches: inRegions(R_ASIA_MERIDIONAL) },
  { id: 'asia-oriental-central',   label: 'Asia Oriental y Central',       group: 'sector', matches: inRegions(R_ASIA_ORIENTAL_CENTRAL) },
  { id: 'africa-norte-occidental', label: 'África del Norte y Occidental', group: 'sector', matches: inRegions(R_AFRICA_NORTE_OCCIDENTAL) },
  { id: 'africa-oriental',         label: 'África Oriental',               group: 'sector', matches: inRegions(R_AFRICA_ORIENTAL) },
  { id: 'africa-central-austral',  label: 'África Central y Austral',      group: 'sector', matches: inRegions(R_AFRICA_CENTRAL_AUSTRAL) },
  { id: 'caribe',                  label: 'Caribe',                        group: 'sector', matches: inRegions(R_CARIBE) },
] as const satisfies readonly GameCategory[];

/** Union de los ids del catálogo (estable, seguro para persistir/rankear). */
export type CategoryId = (typeof GAME_CATEGORIES)[number]['id'];

// Categorías que el casual puede combinar como chips: TODAS menos 'mundo' (el
// chip "Todos" ya cubre el pool completo). El colapso "todas seleccionadas" se
// mide contra esta cuenta.
const SELECTABLE_COUNT = GAME_CATEGORIES.length - 1; // 18 − 'mundo' = 17

/**
 * Normaliza una selección MÚLTIPLE (casual): dedup + orden del catálogo.
 * - Si incluye 'mundo' → `[]` (el pool completo; 'mundo' equivale a "todos").
 * - Si están TODAS las categorías seleccionables (todas menos 'mundo') → `[]`.
 * En ambos casos `[]` = pool completo, la forma canónica de "todos".
 * NOTA: el competitivo NO pasa por aquí (envía exactamente una categoría cruda,
 * incluida 'mundo', para que `categories[0]` sea la clave del récord).
 */
export function canonicalCategories(ids: readonly CategoryId[]): CategoryId[] {
  const selected = new Set(ids);
  if (selected.has('mundo')) return [];
  const canonical = GAME_CATEGORIES.filter(
    (cat) => cat.id !== 'mundo' && selected.has(cat.id),
  ).map((cat) => cat.id);
  return canonical.length === SELECTABLE_COUNT ? [] : canonical;
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
