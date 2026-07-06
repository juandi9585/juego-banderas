import { GAME_CATEGORIES, canonicalCategories, type CategoryId } from '../features/game/categories';
// Reutiliza los chips de ContinentPicker (cero CSS nuevo): mismo look y a11y.
import styles from './ContinentPicker.module.css';

interface CategoryMultiPickerProps {
  /** Selección canónica (orden del catálogo, sin duplicados); [] = todas. */
  value: CategoryId[];
  onChange: (value: CategoryId[]) => void;
}

/**
 * Selector MÚLTIPLE de categorías para el modo casual: la partida usa la unión
 * de países de las categorías activas. Emite siempre una selección canónica
 * (`canonicalCategories`), de modo que marcar todas colapsa a `[]` (= todos) y
 * el orden es estable.
 */
export function CategoryMultiPicker({ value, onChange }: CategoryMultiPickerProps) {
  const isAll = value.length === 0;

  function toggle(id: CategoryId) {
    const next = value.includes(id)
      ? value.filter((v) => v !== id)
      : [...value, id];
    onChange(canonicalCategories(next));
  }

  return (
    <div role="group" aria-label="Categorías" className={styles.chips}>
      <button
        type="button"
        aria-pressed={isAll}
        className={isAll ? `${styles.chip} ${styles.selected}` : styles.chip}
        onClick={() => {
          if (!isAll) onChange([]);
        }}
      >
        Todos
      </button>
      {GAME_CATEGORIES.map((cat) => {
        const selected = value.includes(cat.id);
        return (
          <button
            key={cat.id}
            type="button"
            aria-pressed={selected}
            className={selected ? `${styles.chip} ${styles.selected}` : styles.chip}
            onClick={() => toggle(cat.id)}
          >
            {cat.label}
          </button>
        );
      })}
    </div>
  );
}
