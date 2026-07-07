import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '../features/game/useGame';
import { useRecords } from '../features/records/useRecords';
import { countries } from '../data/dataset';
import { Button } from '../components/Button';
import { randomSeed } from '../lib/random';
import {
  GAME_CATEGORIES,
  filterByCategories,
  type CategoryId,
} from '../features/game/categories';
import styles from './CompetitivePage.module.css';

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
 * Página del modo competitivo (docs/design.md §14). Selección SIMPLE (radio) de
 * las 18 categorías agrupadas; cada fila muestra países, nº de preguntas y tu
 * récord. "Comenzar" arranca una ronda mixta con semilla nueva y va a /jugar.
 */
export function CompetitivePage() {
  const navigate = useNavigate();
  const { startGame } = useGame();
  const { getBest } = useRecords();

  const [selected, setSelected] = useState<CategoryId | null>(null);

  // Récord por fila (mono en latón / "Aún sin récord"). Cálculo barato por fila;
  // se re-lee en cada render (getBest ya refleja lo que hay en localStorage).
  const recordText = (id: CategoryId): { text: string; empty: boolean } => {
    const best = getBest(id, COMPETITIVE_MODE);
    return best
      ? { text: `Récord ${best.points.toLocaleString('es-ES')} pts`, empty: false }
      : { text: 'Aún sin récord', empty: true };
  };

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

  function regionRow(cat: (typeof GAME_CATEGORIES)[number], isWorld = false) {
    const rec = recordText(cat.id);
    const q = questionsFor(cat.id);
    const meta = isWorld
      ? `Los ${POOL_SIZE[cat.id]} países · ${q} preguntas`
      : `${POOL_SIZE[cat.id]} países · ${q} preguntas`;
    return (
      <label
        key={cat.id}
        className={`${styles.region} ${isWorld ? styles.world : ''}`}
      >
        <input
          type="radio"
          name="zona"
          className={styles.radio}
          value={cat.id}
          checked={selected === cat.id}
          onChange={() => setSelected(cat.id)}
        />
        <span className={styles.regionName}>{cat.label}</span>
        <span className={styles.regionMeta}>{meta}</span>
        <span
          className={`${styles.regionRecord} ${rec.empty ? styles.isEmpty : ''}`}
        >
          {rec.text}
        </span>
      </label>
    );
  }

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <p className={styles.eyebrow}>Modo competitivo</p>
        <h1 className={styles.title}>Contrarreloj</h1>
        <p className={styles.subtitle}>
          10 segundos por bandera. Elige dónde competir y bate tu récord.
        </p>
      </header>

      <div
        className={styles.regions}
        role="radiogroup"
        aria-label="Elige dónde competir"
      >
        {/* Mundo (destacada, primera, sobre los dos grupos). */}
        {regionRow(WORLD, true)}

        <h2 className={styles.groupHead}>Continentes</h2>
        {CONTINENTES.map((cat) => regionRow(cat))}

        <h2 className={styles.groupHead}>Sectores</h2>
        {SECTORES.map((cat) => regionRow(cat))}
      </div>

      <div className={styles.startBar}>
        <Button onClick={handleStart} disabled={selected == null}>
          Comenzar
        </Button>
        {selected == null && (
          <p className={styles.startHint}>Primero elige dónde competir.</p>
        )}
      </div>
    </div>
  );
}
