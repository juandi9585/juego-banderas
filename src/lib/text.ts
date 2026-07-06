import type { Country } from '../features/game/types';

/**
 * Normaliza texto para comparar respuestas escritas:
 * elimina diacríticos (NFD + combining marks), pasa a minúsculas, quita signos
 * de puntuación y colapsa/recorta espacios.
 *   "  ESPAÑA  " -> "espana"
 *   "EE.UU."     -> "eeuu"
 *   "Perú"       -> "peru"
 */
export function normalize(s: string): string {
  return s
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '') // quita diacríticos (á→a, ñ→n, ü→u)
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, '') // quita puntuación (mantiene letras/números/espacios)
    .replace(/\s+/g, ' ') // colapsa espacios
    .trim();
}

/**
 * true si `input` coincide (tras normalizar) con el nombre del país, con su
 * nombre oficial o con alguno de sus `aliases`. Matching exacto-normalizado
 * (sin distancia de edición).
 */
export function matchesCountryName(input: string, country: Country): boolean {
  const t = normalize(input);
  if (t.length === 0) return false;
  if (t === normalize(country.name)) return true;
  if (country.officialName && t === normalize(country.officialName)) return true;
  return (country.aliases ?? []).some((alias) => normalize(alias) === t);
}
