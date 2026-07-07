import { NavLink } from 'react-router-dom';
import styles from './AppHeader.module.css';

export function AppHeader() {
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
          <NavLink
            to="/competitivo"
            className={({ isActive }) =>
              isActive ? `${styles.link} ${styles.active}` : styles.link
            }
          >
            Competir
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
