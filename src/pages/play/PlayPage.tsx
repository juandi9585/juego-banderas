import { useState, type CSSProperties } from 'react';
import { NavLink } from 'react-router-dom';
import { countries, TOTAL_COUNTRIES } from '../../data/dataset';
import { FlagImage } from '../../components/FlagImage';
import { CasualPanel } from './CasualPanel';
import { CompetitivePanel } from './CompetitivePanel';
import styles from './PlayPage.module.css';

export type PlayTab = 'casual' | 'competitivo';

/**
 * Módulo Jugar (docs/design.md §19): un solo punto de entrada con pestañas de
 * carpeta Casual/Competitivo. Las pestañas son ENLACES (rutas `/` y
 * `/competitivo`): deep-linkables y con botón atrás; el nav "Jugar" cubre
 * ambas. Escalabilidad prevista: el leaderboard será un módulo aparte (tercer
 * enlace del nav) y el selector de modo del competitivo (mixto/escrito) vive
 * dentro de su panel, no aquí.
 */
export function PlayPage({ tab }: { tab: PlayTab }) {
  // Espécimen del masthead: un país al azar por visita (estable en el montaje).
  const [specimen] = useState(
    () => countries[Math.floor(Math.random() * countries.length)],
  );

  const tabClass = ({ isActive }: { isActive: boolean }) =>
    isActive ? `${styles.tab} ${styles.tabActive}` : styles.tab;

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

      {/* viewTransition (§23.5): react-router 6.30 lo envuelve en
          document.startViewTransition (con fallback si no hay soporte). Solo el
          panel cross-fadea (view-transition-name: play-panel); reduced-motion lo
          neutraliza vía CSS. */}
      <nav
        className={styles.tabs}
        aria-label="Tipo de partida"
        style={{ '--tab-index': tab === 'casual' ? 0 : 1 } as CSSProperties}
      >
        {/* Hoist de latón: una sola barra que RESBALA entre pestañas (§26.3). Con
            View Transitions morphea (play-tab-hoist); sin ellas, la instancia de
            PlayPage persiste y anima la transición CSS de `left`. Decorativa. */}
        <span className={styles.tabHoist} aria-hidden="true" />
        <NavLink to="/" end className={tabClass} viewTransition>
          Casual
        </NavLink>
        <NavLink to="/competitivo" className={tabClass} viewTransition>
          Competitivo
        </NavLink>
      </nav>

      <div className={styles.panelSlot}>
        {tab === 'casual' ? <CasualPanel /> : <CompetitivePanel />}
      </div>
    </div>
  );
}
