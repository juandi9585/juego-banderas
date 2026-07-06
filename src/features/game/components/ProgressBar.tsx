import type { CSSProperties } from 'react';
import styles from './ProgressBar.module.css';

interface ProgressBarProps {
  current: number; // 1-based
  total: number;
}

const pad = (n: number) => String(n).padStart(2, '0');

/** Barra de progreso "regla graduada": ticks por segmento + relleno latón. */
export function ProgressBar({ current, total }: ProgressBarProps) {
  const pct = total === 0 ? 0 : Math.round((current / total) * 100);
  // Un tick por pregunta (el gradiente usa el ancho de segmento).
  const trackStyle = { '--segment': `${100 / Math.max(total, 1)}%` } as CSSProperties;

  return (
    <div className={styles.wrap}>
      <div
        className={styles.track}
        style={trackStyle}
        role="progressbar"
        aria-label="Progreso de la ronda"
        aria-valuemin={0}
        aria-valuemax={total}
        aria-valuenow={current}
        aria-valuetext={`Pregunta ${current} de ${total}`}
      >
        <div className={styles.fill} style={{ width: `${pct}%` }} />
      </div>
      <span className={styles.counter} aria-hidden="true">
        {pad(current)} / {pad(total)}
      </span>
    </div>
  );
}
