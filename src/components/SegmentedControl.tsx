import type { CSSProperties } from 'react';
import styles from './SegmentedControl.module.css';

export interface SegmentOption<T extends string> {
  value: T;
  label: string;
}

interface SegmentedControlProps<T extends string> {
  label: string; // etiqueta accesible del grupo
  options: SegmentOption<T>[];
  value: T;
  onChange: (value: T) => void;
  /** column: segmentos apilados a ancho completo (etiquetas largas en móvil). */
  direction?: 'row' | 'column';
}

/**
 * Control segmentado con thumb SLIDER (docs/design.md §26.2): una sola pieza de
 * latón `.thumb` que se DESLIZA hasta la opción elegida. Se mide por índice con
 * `calc` (sin JS de medición: los segmentos son uniformes `flex: 1 1 0`), fijando
 * `--seg-count`/`--seg-index` en el contenedor. El thumb va detrás del texto
 * (`aria-hidden`); la a11y sigue en `aria-pressed`. Cubre fila y columna.
 */
export function SegmentedControl<T extends string>({
  label,
  options,
  value,
  onChange,
  direction = 'row',
}: SegmentedControlProps<T>) {
  // Guard del -1: un value fuera de las opciones dejaría el thumb fuera del
  // carril; con 0 queda en el primer segmento (ninguno marcado aria-pressed).
  const activeIndex = Math.max(0, options.findIndex((o) => o.value === value));
  return (
    <div
      role="group"
      aria-label={label}
      className={direction === 'column' ? `${styles.group} ${styles.column}` : styles.group}
      style={{ '--seg-count': options.length, '--seg-index': activeIndex } as CSSProperties}
    >
      {/* Carril del slider: una sola pieza de latón tenue, decorativa. */}
      <span className={styles.thumb} aria-hidden="true" />
      {options.map((opt) => {
        const selected = opt.value === value;
        return (
          <button
            key={opt.value}
            type="button"
            aria-pressed={selected}
            className={selected ? `${styles.segment} ${styles.selected}` : styles.segment}
            onClick={() => onChange(opt.value)}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
