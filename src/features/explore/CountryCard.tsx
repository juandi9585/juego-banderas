import { memo } from 'react';
import { Link } from 'react-router-dom';
import { FlagImage } from '../../components/FlagImage';
import type { Country } from '../game/types';
import styles from './CountryCard.module.css';

interface Props {
  country: Country;
}

/** Tarjeta de país en Explorar (docs/design.md §5.5). Memo: la lista es larga. */
export const CountryCard = memo(function CountryCard({ country }: Props) {
  return (
    <Link to={`/explorar/${country.code}`} className={styles.card}>
      <FlagImage country={country} size="sm" lazy alt="" />
      <span className={styles.name}>{country.name}</span>
      <span className={styles.meta}>
        {country.code.toUpperCase()} · {country.continent}
      </span>
    </Link>
  );
});
