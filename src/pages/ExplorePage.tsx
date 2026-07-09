import { useEffect, useState } from 'react';
import { useCountries } from '../features/explore/useCountries';
import { CountryCard } from '../features/explore/CountryCard';
import { ContinentPicker } from '../components/ContinentPicker';
import { TOTAL_COUNTRIES } from '../data/dataset';
import type { ContinentFilter } from '../features/game/types';
import styles from './ExplorePage.module.css';

export function ExplorePage() {
  const [query, setQuery] = useState('');
  const [continent, setContinent] = useState<ContinentFilter>('all');
  const results = useCountries(query, continent);
  const count = results.length;

  // El conteo visible cambia en cada tecla; el anuncio a lectores se difiere para
  // no leer un número nuevo por pulsación (se locuta solo cuando la búsqueda para).
  const [announced, setAnnounced] = useState(count);
  useEffect(() => {
    const t = setTimeout(() => setAnnounced(count), 500);
    return () => clearTimeout(t);
  }, [count]);

  const countLabel = (n: number) => `${n} ${n === 1 ? 'país' : 'países'}`;

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <p className={styles.eyebrow}>Enciclopedia · {TOTAL_COUNTRIES} países</p>
        <h1 className={styles.title}>Explorar</h1>
      </header>

      <div className={styles.controls}>
        <input
          className={styles.search}
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Busca un país…"
          aria-label="Buscar país"
          autoComplete="off"
        />
        <ContinentPicker value={continent} onChange={setContinent} />
      </div>

      <p className={styles.count}>{countLabel(count)}</p>
      {/* Anuncio diferido para lectores de pantalla (sin spam por tecla). */}
      <p className={styles.srOnly} aria-live="polite">
        {countLabel(announced)}
      </p>

      {results.length > 0 ? (
        <ul className={styles.grid}>
          {results.map((country) => (
            <li key={country.code}>
              <CountryCard country={country} />
            </li>
          ))}
        </ul>
      ) : (
        <p className={styles.empty}>
          Ningún país coincide con la búsqueda. Prueba con otro nombre o cambia
          el continente.
        </p>
      )}
    </div>
  );
}
