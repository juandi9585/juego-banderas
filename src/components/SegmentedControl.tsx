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

export function SegmentedControl<T extends string>({
  label,
  options,
  value,
  onChange,
  direction = 'row',
}: SegmentedControlProps<T>) {
  return (
    <div
      role="group"
      aria-label={label}
      className={direction === 'column' ? `${styles.group} ${styles.column}` : styles.group}
    >
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
