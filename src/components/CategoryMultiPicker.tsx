import { useState, type CSSProperties } from 'react';
import {
  GAME_CATEGORIES,
  canonicalCategories,
  type CategoryId,
} from '../features/game/categories';
import styles from './CategoryMultiPicker.module.css';

interface CategoryMultiPickerProps {
  /** Selección canónica (orden del catálogo, sin duplicados); [] = todas. */
  value: CategoryId[];
  onChange: (value: CategoryId[]) => void;
}

// El catálogo tiene 18 entradas; en el casual se muestran 17 filas: TODAS menos
// 'mundo' (la fila "Todos" cumple el rol de 'mundo' = pool completo). Continentes
// siempre visibles; los 10 sectores viven bajo el disclosure plegable (§26.4.3).
const CONTINENTES = GAME_CATEGORIES.filter(
  (c) => c.group === 'continente' && c.id !== 'mundo',
);
const SECTORES = GAME_CATEGORIES.filter((c) => c.group === 'sector');
const SECTOR_IDS = new Set<string>(SECTORES.map((c) => c.id));

/**
 * Selector MÚLTIPLE de categorías del casual — "índice de especímenes" (§26.4):
 * un ledger de filas multi-select con silueta de zona a 20px y tick que "prende".
 * Espeja el ledger competitivo (mismo chasis de hairlines) pero con casillas en
 * vez de radios y sin columnas numéricas.
 *
 * Semántica INTACTA (§26.4.4): la partida usa la unión de países de las
 * categorías activas; emite siempre selección canónica (`canonicalCategories`),
 * de modo que marcar todas colapsa a `[]` (= todos), "Todos" = 'mundo' oculto, y
 * `[]` enciende la fila "Todos".
 */
export function CategoryMultiPicker({ value, onChange }: CategoryMultiPickerProps) {
  const isAll = value.length === 0;
  // Auto-abrir Sectores si hay ≥1 sector activo al montar: una selección nunca
  // nace oculta (§26.4.3).
  const [sectorsOpen, setSectorsOpen] = useState(() =>
    value.some((id) => SECTOR_IDS.has(id)),
  );
  const activeSectors = value.filter((id) => SECTOR_IDS.has(id)).length;

  function toggle(id: CategoryId) {
    const next = value.includes(id)
      ? value.filter((v) => v !== id)
      : [...value, id];
    onChange(canonicalCategories(next));
  }

  /** Fila-especímen: label con casilla oculta + silueta de zona + etiqueta. */
  function row(id: CategoryId, label: string, opts?: { isWorld?: boolean }) {
    const isWorld = opts?.isWorld ?? false;
    // La casilla "Todos" refleja isAll; las demás, su pertenencia a la selección.
    const checked = isWorld ? isAll : value.includes(id);
    const rowClass = isWorld ? `${styles.row} ${styles.isWorld}` : styles.row;
    return (
      <label key={id} className={rowClass}>
        <input
          type="checkbox"
          className={styles.check}
          checked={checked}
          onChange={() => {
            if (isWorld) {
              // Clic en "Todos" con selección → [] (pool completo); si ya isAll,
              // no-op (no hay nada que resetear).
              if (!isAll) onChange([]);
            } else {
              toggle(id);
            }
          }}
        />
        <span className={styles.zone}>
          {/* Silueta de zona (§24.1): teñida por CSS (mask + currentColor); en la
              fila marcada "prende" a latón como el tick. Decorativa. */}
          <span
            className={styles.zoneShape}
            style={{ '--shape-src': `url(/shapes/zones/${id}.svg)` } as CSSProperties}
            aria-hidden="true"
          />
          {label}
        </span>
      </label>
    );
  }

  return (
    <div role="group" aria-label="Categorías" className={styles.ledger}>
      {/* Fila insignia "Todos" = rol de 'mundo' (por eso 'mundo' no es fila). */}
      {row('mundo', 'Todos', { isWorld: true })}

      {/* p, no heading: "Sectores" (botón) no puede serlo, y un h3 huérfano
          rompería la navegación por encabezados. La banda es decorativa. */}
      <p className={styles.groupHead}>Continentes</p>
      {CONTINENTES.map((cat) => row(cat.id, cat.label))}

      {/* Disclosure de Sectores (§26.4.3): plegado por defecto, badge con el nº de
          activas cuando está plegado, chevron que rota al abrir. */}
      <button
        type="button"
        className={styles.groupToggle}
        aria-expanded={sectorsOpen}
        aria-controls="sectores-panel"
        onClick={() => setSectorsOpen((open) => !open)}
      >
        <span>
          Sectores
          {!sectorsOpen && activeSectors > 0 && (
            <span className={styles.groupBadge}>
              {' '}
              · {activeSectors} {activeSectors === 1 ? 'activa' : 'activas'}
            </span>
          )}
        </span>
        <span className={styles.chevron} aria-hidden="true">
          ›
        </span>
      </button>

      {/* inert al plegar: saca las casillas del orden de tabulación y del árbol
          de accesibilidad sin tocar el layout (la transición 0fr↔1fr necesita el
          contenido en el DOM); cumple la promesa de aria-expanded=false. */}
      <div
        id="sectores-panel"
        inert={!sectorsOpen}
        className={
          sectorsOpen
            ? styles.collapsible
            : `${styles.collapsible} ${styles.isCollapsed}`
        }
      >
        <div className={styles.collapsibleInner}>
          {SECTORES.map((cat) => row(cat.id, cat.label))}
        </div>
      </div>
    </div>
  );
}
