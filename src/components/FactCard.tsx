import { FlagImage } from './FlagImage';
import type { Country } from '../features/game/types';
import styles from './FactCard.module.css';

interface FactCardProps {
  country: Country;
  /**
   * full: todos los facts (detalle de país, con hoist propio) ·
   * sheet: nota de campo dentro de la hoja (specimen + facts que scrollean).
   */
  variant?: 'full' | 'sheet';
  /** Facts concretos a mostrar (la hoja pasa los 2 elegidos al azar). */
  facts?: string[];
  /** Omitir la regla de hoist en latón (la hoja la aporta una sola vez). */
  noHoist?: boolean;
}

/**
 * Ficha cultural "nota de campo": papel cálido (Nota) con regla de hoist en
 * latón — el mismo signature de las tarjetas de bandera. Ver docs/design.md
 * §5.4 y §10.2 (variante `sheet` dentro del bottom sheet de feedback).
 */
export function FactCard({
  country,
  variant = 'full',
  facts,
  noHoist = false,
}: FactCardProps) {
  const isSheet = variant === 'sheet';
  const shownFacts = facts ?? country.facts;

  const classes = [
    styles.card,
    isSheet ? styles.inSheet : '',
    noHoist ? styles.noHoist : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <aside className={classes}>
      {isSheet ? (
        <div className={styles.specimen}>
          <span className={styles.specimenFlag}>
            <FlagImage country={country} size="sm" />
          </span>
          <div className={styles.specimenText}>
            <p className={styles.eyebrow}>Nota de campo</p>
            <p className={styles.country}>{country.name}</p>
          </div>
        </div>
      ) : (
        <p className={styles.eyebrow}>Notas de campo</p>
      )}
      <ul className={styles.facts}>
        {shownFacts.map((fact) => (
          <li key={fact} className={styles.fact}>
            {fact}
          </li>
        ))}
      </ul>
    </aside>
  );
}
