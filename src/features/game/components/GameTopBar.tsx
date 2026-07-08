import { ProgressBar } from './ProgressBar';
import { QuestionCountdown } from './QuestionCountdown';
import styles from './GameTopBar.module.css';

interface Props {
  current: number;
  total: number;
  /** Salir de la partida (vuelve a Home). */
  onExit: () => void;
  /**
   * Solo en rondas COMPETITIVAS: la cuenta regresiva se integra en la barra
   * (§13) con el límite del modo (`limitMs`: 10 s MC/mixto, 15 s escrito).
   * `questionKey` remonta el reloj por pregunta; `paused` lo detiene cuando la
   * hoja está abierta.
   */
  countdown?: {
    startedAt: number;
    limitMs: number;
    paused: boolean;
    onTimeout: () => void;
    questionKey: string;
  };
}

/**
 * Barra superior de la partida (§11.2): reemplaza al AppHeader e integra el
 * progreso `[✕ Salir] [regla de progreso] [03 / 10]` en una sola fila compacta.
 * En competitivo añade la mecha del countdown a ras del borde inferior (§13).
 */
export function GameTopBar({ current, total, onExit, countdown }: Props) {
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
      {countdown && (
        <QuestionCountdown
          key={countdown.questionKey}
          startedAt={countdown.startedAt}
          limitMs={countdown.limitMs}
          paused={countdown.paused}
          onTimeout={countdown.onTimeout}
        />
      )}
    </div>
  );
}
