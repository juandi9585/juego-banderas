import { NavLink, useLocation } from 'react-router-dom';
import styles from './AppHeader.module.css';

export function AppHeader() {
  // "Jugar" cubre el módulo entero: casual (/) y competitivo (/competitivo).
  // Cuando exista el leaderboard, "Ranking" entra como tercer enlace (§19.1).
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
            to="/explorar"
            className={({ isActive }) =>
              isActive ? `${styles.link} ${styles.active}` : styles.link
            }
          >
            Explorar
          </NavLink>
        </nav>
      </div>
    </header>
  );
}
