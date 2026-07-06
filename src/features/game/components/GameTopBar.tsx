import { ProgressBar } from './ProgressBar';
import styles from './GameTopBar.module.css';

interface Props {
  current: number;
  total: number;
  /** Salir de la partida (vuelve a Home). */
  onExit: () => void;
}

/**
 * Barra superior de la partida (§11.2): reemplaza al AppHeader e integra el
 * progreso `[✕ Salir] [regla de progreso] [03 / 10]` en una sola fila compacta.
 */
export function GameTopBar({ current, total, onExit }: Props) {
  return (
    <div className={styles.topbar}>
      <button
        type="button"
        className={styles.exit}
        onClick={onExit}
        aria-label="Salir del juego"
      >
        <span aria-hidden="true">✕</span>
      </button>
      <div className={styles.progress}>
        <ProgressBar current={current} total={total} />
      </div>
    </div>
  );
}
