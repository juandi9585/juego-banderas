import type { CSSProperties } from 'react';
import { Link } from 'react-router-dom';
import { useRecords } from '../features/records/useRecords';
import { GAME_CATEGORIES, type CategoryId } from '../features/game/categories';
import type { RoundMode } from '../features/game/types';
import styles from './RecordsPage.module.css';

const fmt = (n: number) => n.toLocaleString('es-ES');

const CONTINENTES = GAME_CATEGORIES.filter(
  (c) => c.group === 'continente' && c.id !== 'mundo',
);
const SECTORES = GAME_CATEGORIES.filter((c) => c.group === 'sector');
const WORLD = GAME_CATEGORIES.find((c) => c.id === 'mundo')!;

// Los dos modos competitivos, en el orden de las columnas del ledger.
const MODES: RoundMode[] = ['mixto', 'type-name'];

/**
 * Mis récords (/records): todas tus marcas locales juntas, de un vistazo.
 * Hereda el ledger del retirado panel Jugar>Competitivo — las 18 zonas en un
 * card con filas de hairline — pero con una columna por modo (Mixto | Escrito)
 * en vez de radios: aquí no se elige, se consulta. Cada fila enlaza a la
 * clasificación de su zona (/ranking?zona=…), donde vive el CTA para jugarla.
 */
export function RecordsPage() {
  const { getBest } = useRecords();

  function recordCell(catId: CategoryId, mode: RoundMode) {
    const best = getBest(catId, mode);
    return best ? (
      <span className={styles.cellRecord}>{fmt(best.points)}</span>
    ) : (
      <span
        className={`${styles.cellRecord} ${styles.isEmpty}`}
        aria-label="Aún sin récord"
      >
        —
      </span>
    );
  }

  function ledgerRow(cat: (typeof GAME_CATEGORIES)[number]) {
    const rowClass = cat.id === 'mundo' ? `${styles.row} ${styles.isWorld}` : styles.row;
    return (
      <Link key={cat.id} to={`/ranking?zona=${cat.id}`} className={rowClass}>
        <span className={styles.zone}>
          {/* Silueta de zona (§24.1): teñida por CSS (mask + currentColor). */}
          <span
            className={styles.zoneShape}
            style={{ '--shape-src': `url(/shapes/zones/${cat.id}.svg)` } as CSSProperties}
            aria-hidden="true"
          />
          {cat.label}
        </span>
        {MODES.map((mode) => (
          <span key={mode} className={styles.cellSlot}>
            {recordCell(cat.id, mode)}
          </span>
        ))}
      </Link>
    );
  }

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div>
          <p className={styles.eyebrow}>Contrarreloj · tus marcas</p>
          <h1 className={styles.title}>Mis récords</h1>
        </div>
      </header>

      <p className={styles.hint}>
        Tu mejor puntaje por zona y modo, guardado en este dispositivo. Toca una
        zona para ver su clasificación y jugarla.
      </p>

      <div className={styles.ledger}>
        {/* Cabecera de columnas (decorativa: cada fila-enlace ya lee completa). */}
        <div className={styles.colHead} aria-hidden="true">
          <span>Zona</span>
          <span className={styles.colNum}>Mixto</span>
          <span className={styles.colNum}>Escrito</span>
        </div>

        {ledgerRow(WORLD)}

        <h2 className={styles.groupRow}>Continentes</h2>
        {CONTINENTES.map((cat) => ledgerRow(cat))}

        <h2 className={styles.groupRow}>Sectores</h2>
        {SECTORES.map((cat) => ledgerRow(cat))}
      </div>
    </div>
  );
}
