import { useState } from 'react';
import { countries, TOTAL_COUNTRIES } from '../../data/dataset';
import { FlagImage } from '../../components/FlagImage';
import { InstallPrompt } from '../../components/InstallPrompt';
import { CasualPanel } from './CasualPanel';
import styles from './PlayPage.module.css';

/**
 * Módulo Jugar (docs/design.md §19): la portada casual de la app. Las pestañas
 * Casual/Competitivo se retiraron — competir vive en el módulo Competitivo
 * (/ranking), que reúne clasificación, récord y CTA de partida en una vista.
 */
export function PlayPage() {
  // Espécimen del masthead: un país al azar por visita (estable en el montaje).
  const [specimen] = useState(
    () => countries[Math.floor(Math.random() * countries.length)],
  );

  return (
    <div className={styles.page}>
      <header className={styles.masthead}>
        <div>
          <p className={styles.eyebrow}>
            Guía de campo · {TOTAL_COUNTRIES} países
          </p>
          <h1 className={styles.title}>Banderas del mundo</h1>
        </div>
        <div className={styles.specimen} aria-hidden="true">
          <FlagImage country={specimen} size="sm" active alt="" />
          <p className={styles.specimenMeta}>
            {specimen.code.toUpperCase()} · {specimen.name}
          </p>
        </div>
      </header>

      {/* Aviso de instalación de la PWA (§27): solo aparece si hay algo que
          ofrecer (Chromium instalable o guía iOS) y es descartable 14 días. */}
      <InstallPrompt />

      <CasualPanel />
    </div>
  );
}
