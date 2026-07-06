import { useMemo } from 'react';
import { countries } from '../../data/dataset';
import { normalize } from '../../lib/text';
import type { ContinentFilter, Country } from '../../features/game/types';

interface Indexed {
  country: Country;
  searchText: string; // nombre + officialName + code + aliases, normalizados
}

// Índice de búsqueda calculado una sola vez (módulo estático).
const INDEX: Indexed[] = countries
  .map((country) => ({
    country,
    searchText: normalize(
      `${country.name} ${country.officialName ?? ''} ${country.code} ${(country.aliases ?? []).join(' ')}`,
    ),
  }))
  .sort((a, b) => a.country.name.localeCompare(b.country.name, 'es'));

/**
 * Filtra el dataset por texto (nombre/nombre oficial/ISO, normalizados con la
 * misma regla que el modo escribir) y por continente.
 */
export function useCountries(query: string, continent: ContinentFilter): Country[] {
  return useMemo(() => {
    const q = normalize(query);
    return INDEX.filter(({ country, searchText }) => {
      if (continent !== 'all' && country.continent !== continent) return false;
      if (q.length > 0 && !searchText.includes(q)) return false;
      return true;
    }).map(({ country }) => country);
  }, [query, continent]);
}
