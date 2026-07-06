import type { Country } from '../features/game/types';
import styles from './FactCard.module.css';

interface FactCardProps {
  country: Country;
  /** game: 1–2 facts tras responder · full: todos los facts (detalle de país) */
  variant?: 'game' | 'full';
}

/**
 * Ficha cultural "nota de campo": papel cálido (Nota) con regla de hoist en
 * latón — el mismo signature de las tarjetas de bandera. Ver docs/design.md §5.4.
 */
export function FactCard({ country, variant = 'game' }: FactCardProps) {
  const facts = variant === 'game' ? country.facts.slice(0, 2) : country.facts;

  return (
    <aside className={styles.card}>
      <p className={styles.eyebrow}>
        {variant === 'game' ? 'Nota de campo' : 'Notas de campo'}
      </p>
      {variant === 'game' && <p className={styles.country}>{country.name}</p>}
      <ul className={styles.facts}>
        {facts.map((fact) => (
          <li key={fact} className={styles.fact}>
            {fact}
          </li>
        ))}
      </ul>
    </aside>
  );
}
