import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '../features/game/useGame';
import { countries, TOTAL_COUNTRIES } from '../data/dataset';
import { FlagImage } from '../components/FlagImage';
import { Button } from '../components/Button';
import { SegmentedControl } from '../components/SegmentedControl';
import { ContinentPicker } from '../components/ContinentPicker';
import {
  DEFAULT_QUESTION_COUNT,
  MODE_LABELS,
  QUESTION_COUNT_PRESETS,
  type QuestionCountPreset,
} from '../features/game/constants';
import type { ContinentFilter, GameMode } from '../features/game/types';
import styles from './HomePage.module.css';

const MODE_OPTIONS = (Object.keys(MODE_LABELS) as GameMode[]).map((m) => ({
  value: m,
  label: MODE_LABELS[m],
}));

const COUNT_OPTIONS = QUESTION_COUNT_PRESETS.map((p) => ({
  value: String(p),
  label: p === 'all' ? 'Todas' : String(p),
}));

export function HomePage() {
  const navigate = useNavigate();
  const { startGame } = useGame();

  // Espécimen del hero: un país al azar por visita (estable durante el montaje).
  const [specimen] = useState(
    () => countries[Math.floor(Math.random() * countries.length)],
  );

  const [mode, setMode] = useState<GameMode>('flag-to-name');
  const [continent, setContinent] = useState<ContinentFilter>('all');
  const [countPreset, setCountPreset] = useState<QuestionCountPreset>(
    DEFAULT_QUESTION_COUNT,
  );

  // Nº de países disponibles con el filtro elegido (para el hint del pool).
  const poolSize = useMemo(
    () =>
      continent === 'all'
        ? TOTAL_COUNTRIES
        : countries.filter((c) => c.continent === continent).length,
    [continent],
  );

  function handleStart() {
    const questionCount =
      countPreset === 'all' ? Number.MAX_SAFE_INTEGER : countPreset;
    startGame({ mode, continent, questionCount });
    navigate('/jugar');
  }

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <p className={styles.eyebrow}>Guía de campo · {TOTAL_COUNTRIES} países</p>
        <h1 className={styles.title}>Banderas del mundo</h1>
        <p className={styles.tagline}>
          Aprende a identificarlas, país a país, con un dato curioso en cada
          respuesta.
        </p>
        <div className={styles.specimen}>
          <FlagImage country={specimen} size="md" active alt="" />
          <p className={styles.specimenMeta} aria-hidden="true">
            {specimen.code.toUpperCase()} · {specimen.name}
          </p>
        </div>
      </section>

      <section className={styles.form} aria-label="Configura la ronda">
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
          <p className={styles.fieldLabel}>Continente</p>
          <ContinentPicker value={continent} onChange={setContinent} />
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
          <p className={styles.hint}>
            {poolSize} {poolSize === 1 ? 'país disponible' : 'países disponibles'}
          </p>
        </div>

        <Button onClick={handleStart}>Empezar</Button>
      </section>
    </div>
  );
}
