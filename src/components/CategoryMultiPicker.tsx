import { GAME_CATEGORIES, canonicalCategories, type CategoryId } from '../features/game/categories';
// Reutiliza los chips de ContinentPicker (cero CSS de chip nuevo): mismo look y
// a11y. El layout de grupos + subtítulos vive en el módulo propio.
import chip from './ContinentPicker.module.css';
import styles from './CategoryMultiPicker.module.css';

interface CategoryMultiPickerProps {
  /** Selección canónica (orden del catálogo, sin duplicados); [] = todas. */
  value: CategoryId[];
  onChange: (value: CategoryId[]) => void;
}

// El catálogo tiene 18 entradas; en el casual se muestran 17 chips: TODAS menos
// 'mundo' (el chip "Todos" ya cubre el pool completo). Se agrupan en Continentes
// y Sectores para que 17 chips sigan escaneables (§16).
const CONTINENTES = GAME_CATEGORIES.filter(
  (c) => c.group === 'continente' && c.id !== 'mundo',
);
const SECTORES = GAME_CATEGORIES.filter((c) => c.group === 'sector');

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

  function chipButton(id: CategoryId, label: string) {
    const selected = value.includes(id);
    return (
      <button
        key={id}
        type="button"
        aria-pressed={selected}
        className={selected ? `${chip.chip} ${chip.selected}` : chip.chip}
        onClick={() => toggle(id)}
      >
        {label}
      </button>
    );
  }

  return (
    <div role="group" aria-label="Categorías" className={styles.categoryGroups}>
      {/* Chip maestro "Todos": cumple el rol de 'mundo' (por eso 'mundo' se
          oculta como chip). Va FUERA de los grupos. */}
      <div className={chip.chips}>
        <button
          type="button"
          aria-pressed={isAll}
          className={isAll ? `${chip.chip} ${chip.selected}` : chip.chip}
          onClick={() => {
            if (!isAll) onChange([]);
          }}
        >
          Todos
        </button>
      </div>

      <div role="group" aria-label="Continentes">
        <p className={styles.groupHead}>Continentes</p>
        <div className={chip.chips}>
          {CONTINENTES.map((cat) => chipButton(cat.id, cat.label))}
        </div>
      </div>

      <div role="group" aria-label="Sectores">
        <p className={styles.groupHead}>Sectores</p>
        <div className={chip.chips}>
          {SECTORES.map((cat) => chipButton(cat.id, cat.label))}
        </div>
      </div>
    </div>
  );
}
