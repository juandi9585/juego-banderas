import { NavLink, useLocation } from 'react-router-dom';
import { SoundToggle } from './SoundToggle';
import styles from './AppHeader.module.css';

export function AppHeader() {
  // "Jugar" cubre el módulo entero: casual (/) y competitivo (/competitivo).
  // "Ranking" es el tercer enlace (§19.1): consultar clasificaciones no es jugar.
  const { pathname } = useLocation();
  const playActive = pathname === '/' || pathname === '/competitivo';

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <span className={styles.wordmark}>Banderas del Mundo</span>
        <nav aria-label="Navegación principal" className={styles.nav}>
          <NavLink
            to="/"
            end
            className={playActive ? `${styles.link} ${styles.active}` : styles.link}
          >
            Jugar
          </NavLink>
          <NavLink
            to="/ranking"
            className={({ isActive }) =>
              isActive ? `${styles.link} ${styles.active}` : styles.link
            }
          >
            Ranking
          </NavLink>
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
