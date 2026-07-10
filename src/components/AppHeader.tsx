import { Link, NavLink, useLocation } from 'react-router-dom';
import { SoundToggle } from './SoundToggle';
import styles from './AppHeader.module.css';

export function AppHeader() {
  // "Jugar" es el casual (/); "Competir" cubre el módulo competitivo entero:
  // clasificación + partida (/ranking) y récords propios (/records).
  const { pathname } = useLocation();
  const competeActive = pathname === '/ranking' || pathname === '/records';

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <span className={styles.wordmark}>Banderas del Mundo</span>
        <nav aria-label="Navegación principal" className={styles.nav}>
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              isActive ? `${styles.link} ${styles.active}` : styles.link
            }
          >
            Jugar
          </NavLink>
          {/* Link plano (no NavLink): el activo cubre /ranking Y /records, y
              NavLink solo emite aria-current cuando SU ruta matchea. */}
          <Link
            to="/ranking"
            aria-current={competeActive ? 'page' : undefined}
            className={
              competeActive ? `${styles.link} ${styles.active}` : styles.link
            }
          >
            Competir
          </Link>
          <NavLink
            to="/explorar"
            className={({ isActive }) =>
              isActive ? `${styles.link} ${styles.active}` : styles.link
            }
          >
            Explorar
          </NavLink>
          {/* Preferencia global de sonido (§22.4); durante la partida vive en la
              GameTopBar porque este header se oculta en /jugar. */}
          <SoundToggle className={styles.sound} />
        </nav>
      </div>
    </header>
  );
}
