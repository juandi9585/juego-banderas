import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '../../features/game/useGame';
import { useRecords } from '../../features/records/useRecords';
import { countries } from '../../data/dataset';
import { Button } from '../../components/Button';
import { randomSeed } from '../../lib/random';
import {
  GAME_CATEGORIES,
  filterByCategories,
  type CategoryId,
} from '../../features/game/categories';
import styles from './CompetitivePanel.module.css';

// Partida competitiva: mixto, min(20, pool), récord por (categoría, 'mixto').
const COMPETITIVE_MODE = 'mixto' as const;
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
 * ronda mixta con semilla nueva y va a /jugar.
 *
 * Escalabilidad: cuando exista la variante "escrito", entre la cabecera y el
 * ledger va un SegmentedControl de modo (Mixto | Escrito) y la columna Récord
 * lee el RoundMode elegido (la clave `${categoría}:${modo}` ya lo soporta).
 */
export function CompetitivePanel() {
  const navigate = useNavigate();
  const { startGame } = useGame();
  const { getBest } = useRecords();

  const [selected, setSelected] = useState<CategoryId | null>(null);

  function handleStart() {
    if (!selected) return;
    startGame({
      mode: COMPETITIVE_MODE,
      categories: [selected], // exactamente una (invariante): clave del récord
      questionCount: MAX_QUESTIONS, // el motor recorta al pool → min(20, pool)
      competitive: { seed: randomSeed() },
    });
    navigate('/jugar');
  }

  function ledgerRow(cat: (typeof GAME_CATEGORIES)[number]) {
    const best = getBest(cat.id, COMPETITIVE_MODE);
    return (
      <label key={cat.id} className={styles.row}>
        <input
          type="radio"
          name="zona"
          className={styles.radio}
          value={cat.id}
          checked={selected === cat.id}
          onChange={() => setSelected(cat.id)}
        />
        <span className={styles.zone}>{cat.label}</span>
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
          10 segundos por pregunta. Elige tu zona y bate tu récord.
        </p>
      </header>

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
