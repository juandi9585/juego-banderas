import { Link, useParams } from 'react-router-dom';
import { findCountry } from '../data/dataset';
import { FlagImage } from '../components/FlagImage';
import { FactCard } from '../components/FactCard';
import { NotFoundPage } from './NotFoundPage';
import styles from './CountryDetailPage.module.css';

const numberFormat = new Intl.NumberFormat('es-ES');

export function CountryDetailPage() {
  const { code } = useParams<{ code: string }>();
  const country = findCountry(code);

  if (!country) {
    return <NotFoundPage />;
  }

  return (
    <div className={styles.page}>
      <Link to="/explorar" className={styles.back}>
        <span aria-hidden="true">←</span> Explorar
      </Link>

      <FlagImage country={country} size="lg" active />

      <header>
        <h1 className={styles.name}>{country.name}</h1>
        {country.officialName && country.officialName !== country.name && (
          <p className={styles.official}>{country.officialName}</p>
        )}
      </header>

      <dl className={styles.data}>
        <div className={styles.row}>
          <dt className={styles.dt}>ISO</dt>
          <dd className={styles.dd}>{country.code.toUpperCase()}</dd>
        </div>
        <div className={styles.row}>
          <dt className={styles.dt}>Continente</dt>
          <dd className={styles.dd}>
            {country.continent}
            {country.region ? ` · ${country.region}` : ''}
          </dd>
        </div>
        <div className={styles.row}>
          <dt className={styles.dt}>Capital</dt>
          <dd className={styles.dd}>{country.capital}</dd>
        </div>
        {country.population != null && (
          <div className={styles.row}>
            <dt className={styles.dt}>Población</dt>
            <dd className={styles.dd}>{numberFormat.format(country.population)}</dd>
          </div>
        )}
      </dl>

      <FactCard country={country} variant="full" />
    </div>
  );
}
