import { useState, type CSSProperties } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '../../features/game/useGame';
import { useRecords } from '../../features/records/useRecords';
import { countries } from '../../data/dataset';
import { Button } from '../../components/Button';
import { SegmentedControl, type SegmentOption } from '../../components/SegmentedControl';
import { randomSeed } from '../../lib/random';
import { timeLimitFor } from '../../features/game/score';
import type { RoundMode } from '../../features/game/types';
import {
  GAME_CATEGORIES,
  filterByCategories,
  type CategoryId,
} from '../../features/game/categories';
import styles from './CompetitivePanel.module.css';

// Modos de ronda del competitivo (roadmap §A): mixto (opción múltiple alternada)
// y escrito ('type-name': teclear el nombre, 15 s). La clave de récord
// `${categoría}:${modo}` los separa sin migración.
type CompetitiveMode = Extract<RoundMode, 'mixto' | 'type-name'>;

const MODE_OPTIONS: SegmentOption<CompetitiveMode>[] = [
  { value: 'mixto', label: 'Mixto' },
  { value: 'type-name', label: 'Escrito' },
];

// Qué se hace en cada modo; los segundos por pregunta salen de timeLimitFor
// (única fuente) para que el copy nunca se desincronice del countdown real.
const MODE_HINT: Record<CompetitiveMode, string> = {
  mixto: 'Toca la opción correcta.',
  'type-name': 'Escribe el nombre de cada país.',
};

// Partida competitiva: min(20, pool), récord por (categoría, modo).
const MAX_QUESTIONS = 20;

// Tamaño del pool por categoría (una vez; el dataset no cambia en runtime). Con
// él se calcula el nº de preguntas honesto por fila: q = min(20, pool).
const POOL_SIZE: Record<string, number> = Object.fromEntries(
  GAME_CATEGORIES.map((cat) => [cat.id, filterByCategories([cat.id], countries).length]),
);

const questionsFor = (id: CategoryId) => Math.min(MAX_QUESTIONS, POOL_SIZE[id]);

const CONTINENTES = GAME_CATEGORIES.filter(
  (c) => c.group === 'continente' && c.id !== 'mundo',
);
const SECTORES = GAME_CATEGORIES.filter((c) => c.group === 'sector');
const WORLD = GAME_CATEGORIES.find((c) => c.id === 'mundo')!;

/**
 * Panel Competitivo del módulo Jugar (docs/design.md §19.4): libro de registro
 * (ledger) con las 18 zonas en un solo card — una fila por zona con columnas
 * mono de preguntas y récord. Selección simple (radio); "Comenzar" arranca una
 * ronda del modo elegido con semilla nueva y va a /jugar.
 *
 * Entre la cabecera y el ledger vive el SegmentedControl de modo
 * (Mixto | Escrito): la columna Récord y el CTA leen el modo elegido (la clave
 * `${categoría}:${modo}` los mantiene separados).
 */
export function CompetitivePanel() {
  const navigate = useNavigate();
  const { startGame } = useGame();
  const { getBest } = useRecords();

  const [mode, setMode] = useState<CompetitiveMode>('mixto');
  const [selected, setSelected] = useState<CategoryId | null>(null);

  function handleStart() {
    if (!selected) return;
    startGame({
      mode,
      categories: [selected], // exactamente una (invariante): clave del récord
      questionCount: MAX_QUESTIONS, // el motor recorta al pool → min(20, pool)
      competitive: { seed: randomSeed() },
    });
    // Cross-fade del panel al arrancar la partida (§23.5); corte seco si no hay
    // soporte o reduced-motion (el CSS salta la animación).
    navigate('/jugar', { viewTransition: true });
  }

  function ledgerRow(cat: (typeof GAME_CATEGORIES)[number]) {
    const best = getBest(cat.id, mode);
    const rowClass = cat.id === 'mundo' ? `${styles.row} ${styles.isWorld}` : styles.row;
    return (
      <label key={cat.id} className={rowClass}>
        <input
          type="radio"
          name="zona"
          className={styles.radio}
          value={cat.id}
          checked={selected === cat.id}
          onChange={() => setSelected(cat.id)}
        />
        <span className={styles.zone}>
          {/* Silueta de zona (§24.1): teñida por CSS (mask + currentColor); en la
              fila elegida "prende" a latón como el hoist. Decorativa. */}
          <span
            className={styles.zoneShape}
            style={{ '--shape-src': `url(/shapes/zones/${cat.id}.svg)` } as CSSProperties}
            aria-hidden="true"
          />
          {cat.label}
        </span>
        <span className={styles.cellQ}>{questionsFor(cat.id)}</span>
        {best ? (
          <span className={styles.cellRecord}>
            {best.points.toLocaleString('es-ES')}
          </span>
        ) : (
          <span
            className={`${styles.cellRecord} ${styles.isEmpty}`}
            aria-label="Aún sin récord"
          >
            —
          </span>
        )}
      </label>
    );
  }

  return (
    <section className={styles.panel} aria-label="Partida competitiva">
      <header>
        <h2 className={styles.title}>Contrarreloj</h2>
        <p className={styles.subtitle}>
          Elige modo y zona, y bate tu récord.
        </p>
      </header>

      <div>
        <SegmentedControl
          label="Modo de juego"
          options={MODE_OPTIONS}
          value={mode}
          onChange={setMode}
        />
        {/* aria-live: al cambiar de modo, el lector anuncia qué se juega y con
            cuánto tiempo (el hint es la única descripción del modo elegido). */}
        <p className={styles.modeHint} aria-live="polite">
          {MODE_HINT[mode]} {timeLimitFor(mode) / 1000} segundos por pregunta.
        </p>
      </div>

      <div
        className={styles.ledger}
        role="radiogroup"
        aria-label="Elige dónde competir"
      >
        {/* Cabecera de columnas del libro de registro (decorativa: cada radio
            ya tiene su nombre accesible completo en la fila). */}
        <div className={styles.colHead} aria-hidden="true">
          <span>Zona</span>
          <span className={styles.colNum}>Preguntas</span>
          <span className={styles.colNum}>Récord</span>
        </div>

        {ledgerRow(WORLD)}

        <h3 className={styles.groupRow}>Continentes</h3>
        {CONTINENTES.map((cat) => ledgerRow(cat))}

        <h3 className={styles.groupRow}>Sectores</h3>
        {SECTORES.map((cat) => ledgerRow(cat))}
      </div>

      <div className={styles.startBar}>
        <Button onClick={handleStart} disabled={selected == null}>
          Comenzar
        </Button>
        {selected == null && (
          <p className={styles.startHint}>Primero elige dónde competir.</p>
        )}
      </div>
    </section>
  );
}
