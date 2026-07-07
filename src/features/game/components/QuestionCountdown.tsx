import { useEffect, useRef, useState } from 'react';
import { SCORE_TIME_LIMIT_MS, SCORE_TIME_WARN_MS } from '../score';
import styles from './GameTopBar.module.css';

interface Props {
  /** Instante (reloj de pared) en que la pregunta quedó visible. */
  startedAt: number;
  /** La hoja está abierta (pregunta ya respondida): el reloj se detiene. */
  paused: boolean;
  /** Se llama UNA vez al agotarse los 10 s (fallo automático). */
  onTimeout: () => void;
}

// Cadencia del reloj. Cada tick recalcula desde Date.now() (no acumula), así el
// countdown es reloj de pared: volver de segundo plano salta directo al restante
// real (antitrampa, §4.3). 100 ms basta para una mecha fluida y dígitos crisp.
const TICK_MS = 100;

function remainingFrom(startedAt: number): number {
  return Math.max(0, SCORE_TIME_LIMIT_MS - (Date.now() - startedAt));
}

/**
 * Cuenta regresiva de 10 s del competitivo (docs/design.md §13). Vive DENTRO del
 * GameTopBar: una mecha a ras del borde inferior (se consume) + un slot mono
 * (glifo ◷ en calma, segundos en rojo los últimos 3 s). No roba altura ni
 * provoca layout shift. El padre lo remonta por pregunta (key), reiniciando el
 * reloj; cuando la hoja se abre (`paused`) el reloj se detiene.
 */
export function QuestionCountdown({ startedAt, paused, onTimeout }: Props) {
  const [remaining, setRemaining] = useState(() => remainingFrom(startedAt));
  const [announce, setAnnounce] = useState('');
  const firedRef = useRef(false); // timeout una sola vez
  const announcedRef = useRef(false); // aviso "quedan 3 s" una sola vez

  useEffect(() => {
    // Pregunta ya respondida (por clic o por expiración): no corre el reloj.
    if (paused) return;

    function tick() {
      const r = remainingFrom(startedAt);
      setRemaining(r);
      if (r <= SCORE_TIME_WARN_MS && !announcedRef.current) {
        announcedRef.current = true;
        setAnnounce('Quedan 3 segundos.'); // aviso one-shot para lectores (§13.4)
      }
      if (r <= 0 && !firedRef.current) {
        firedRef.current = true;
        onTimeout();
      }
    }

    tick(); // cálculo inmediato al montar (sin esperar al primer intervalo)
    const id = setInterval(tick, TICK_MS);
    return () => clearInterval(id);
  }, [startedAt, paused, onTimeout]);

  const isWarn = remaining <= SCORE_TIME_WARN_MS;
  const seconds = Math.ceil(remaining / 1000);
  const fillPct = (remaining / SCORE_TIME_LIMIT_MS) * 100;

  return (
    <>
      {/* Instrumento visual: aria-hidden (no se locuta cada segundo, §13.4). */}
      <span
        className={`${styles.countdownReadout} ${isWarn ? styles.isWarn : ''}`}
        aria-hidden="true"
      >
        <span className={styles.countdownGlyph}>◷</span>
        <span className={styles.countdownSeconds}>{seconds}</span>
      </span>
      <div
        className={`${styles.countdownFuse} ${isWarn ? styles.isWarn : ''}`}
        aria-hidden="true"
      >
        <i style={{ width: `${fillPct}%` }} />
      </div>
      {/* Único anuncio: al cruzar el umbral de 3 s (assertive, one-shot). La
          expiración la anuncia la hoja (§17), no se duplica aquí. */}
      <span className={styles.srOnly} aria-live="assertive">
        {announce}
      </span>
    </>
  );
}
