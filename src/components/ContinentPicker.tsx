import { CONTINENTS } from '../features/game/constants';
import type { ContinentFilter } from '../features/game/types';
import styles from './ContinentPicker.module.css';

interface ContinentPickerProps {
  value: ContinentFilter;
  onChange: (value: ContinentFilter) => void;
  /** Etiqueta del chip "todos" (Home: "Todos"; Explorar: "Todos"). */
  allLabel?: string;
}

export function ContinentPicker({ value, onChange, allLabel = 'Todos' }: ContinentPickerProps) {
  const options: { value: ContinentFilter; label: string }[] = [
    { value: 'all', label: allLabel },
    ...CONTINENTS.map((c) => ({ value: c as ContinentFilter, label: c })),
  ];

  return (
    <div role="group" aria-label="Continente" className={styles.chips}>
      {options.map((opt) => {
        const selected = opt.value === value;
        return (
          <button
            key={opt.value}
            type="button"
            aria-pressed={selected}
            className={selected ? `${styles.chip} ${styles.selected}` : styles.chip}
            onClick={() => onChange(opt.value)}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
