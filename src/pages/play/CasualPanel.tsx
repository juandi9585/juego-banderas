import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '../../features/game/useGame';
import { countries } from '../../data/dataset';
import { Button } from '../../components/Button';
import { SegmentedControl } from '../../components/SegmentedControl';
import { CategoryMultiPicker } from '../../components/CategoryMultiPicker';
import {
  DEFAULT_QUESTION_COUNT,
  MODE_LABELS,
  QUESTION_COUNT_PRESETS,
  type QuestionCountPreset,
} from '../../features/game/constants';
import { filterByCategories, type CategoryId } from '../../features/game/categories';
import type { GameMode } from '../../features/game/types';
import styles from './CasualPanel.module.css';

const MODE_OPTIONS = (Object.keys(MODE_LABELS) as GameMode[]).map((m) => ({
  value: m,
  label: MODE_LABELS[m],
}));

const COUNT_OPTIONS = QUESTION_COUNT_PRESETS.map((p) => ({
  value: String(p),
  label: p === 'all' ? 'Todas' : String(p),
}));

/**
 * Panel Casual del módulo Jugar: mix & match de modo, categorías y nº de
 * preguntas — sin cronómetro ni récords. Es el formulario de la Home original.
 */
export function CasualPanel() {
  const navigate = useNavigate();
  const { startGame } = useGame();

  const [mode, setMode] = useState<GameMode>('flag-to-name');
  const [categories, setCategories] = useState<CategoryId[]>([]);
  const [countPreset, setCountPreset] = useState<QuestionCountPreset>(
    DEFAULT_QUESTION_COUNT,
  );

  // Nº de países disponibles con las categorías elegidas (hint del pool).
  // `[]` = todas → el pool completo.
  const poolSize = useMemo(
    () => filterByCategories(categories, countries).length,
    [categories],
  );

  function handleStart() {
    const questionCount =
      countPreset === 'all' ? Number.MAX_SAFE_INTEGER : countPreset;
    startGame({ mode, categories, questionCount });
    // Cross-fade del panel al arrancar la partida (§23.5); corte seco si no hay
    // soporte o reduced-motion (el CSS salta la animación).
    navigate('/jugar', { viewTransition: true });
  }

  return (
    <section className={styles.panel} aria-label="Configura la ronda">
      {/* Orden calcado del competitivo (§26.4.1): controles cortos arriba, el
          índice largo de zonas abajo, y "Empezar" en una barra sticky. */}
      <div className={styles.field}>
        <p className={styles.fieldLabel}>Modo de juego</p>
        <SegmentedControl
          label="Modo de juego"
          options={MODE_OPTIONS}
          value={mode}
          onChange={setMode}
          direction="column"
        />
      </div>

      <div className={styles.field}>
        <p className={styles.fieldLabel}>Preguntas</p>
        <SegmentedControl
          label="Número de preguntas"
          options={COUNT_OPTIONS}
          value={String(countPreset)}
          onChange={(v) =>
            setCountPreset(v === 'all' ? 'all' : (Number(v) as QuestionCountPreset))
          }
        />
      </div>

      <div className={styles.field}>
        <p className={styles.fieldLabel}>Categorías</p>
        <CategoryMultiPicker value={categories} onChange={setCategories} />
      </div>

      {/* Barra sticky (§26.4.5): "Empezar" siempre a mano + el pool vivo como
          resumen de la unión de categorías. */}
      <div className={styles.startBar}>
        <Button onClick={handleStart}>Empezar</Button>
        <p className={styles.startHint}>
          {poolSize} {poolSize === 1 ? 'país en juego' : 'países en juego'}
        </p>
      </div>
    </section>
  );
}
