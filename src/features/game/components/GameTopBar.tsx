import { ProgressBar } from './ProgressBar';
import { QuestionCountdown } from './QuestionCountdown';
import { SoundToggle } from '../../../components/SoundToggle';
import styles from './GameTopBar.module.css';

interface Props {
  current: number;
  total: number;
  /** Salir de la partida (vuelve a Home). */
  onExit: () => void;
  /**
   * Multiplicador de racha EN VIVO (derivado de las respuestas, §22.3/§23.1). El
   * chip de racha solo aparece con multiplicador > 1.0 (racha ≥ 2) y "hace pop"
   * al subir; a 1.0 el slot queda reservado y vacío (sin layout shift).
   */
  mult?: number;
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
export function GameTopBar({ current, total, onExit, mult = 1, countdown }: Props) {
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
      {/* Chip de racha (§23.1): slot mono reservado; muestra ×{mult} solo en racha.
          key={mult} remonta el valor al subir → relanza el pop (sobrio, ambos modos). */}
      <span className={styles.streak} aria-hidden="true">
        {mult > 1 && (
          <span key={mult} className={styles.streakValue}>
            ×{mult.toFixed(1)}
          </span>
        )}
      </span>
      {countdown && (
        <QuestionCountdown
          key={countdown.questionKey}
          startedAt={countdown.startedAt}
          limitMs={countdown.limitMs}
          paused={countdown.paused}
          onTimeout={countdown.onTimeout}
        />
      )}
      {/* Canto derecho: el mute vive aquí durante la partida (el AppHeader se oculta). */}
      <SoundToggle className={styles.sound} />
    </div>
  );
}
