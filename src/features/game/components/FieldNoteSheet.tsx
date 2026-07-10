import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { FactCard } from '../../../components/FactCard';
import { Button } from '../../../components/Button';
import { sample } from '../../../lib/random';
import { useFocusTrap } from '../../../lib/useFocusTrap';
import type { AnswerRecord, QuizQuestion } from '../types';
import styles from './FieldNoteSheet.module.css';

interface Props {
  question: QuizQuestion;
  answer: AnswerRecord;
  isLast: boolean;
  /** Avanzar a la siguiente pregunta (o al resultado). Único camino de salida. */
  onNext: () => void;
}

/** Datos curiosos que se muestran por respuesta (§10.2, 1–2 items). */
const FACTS_PER_ANSWER = 2;

/**
 * Bottom sheet "nota de campo" (docs/design.md §10): al responder sube desde
 * abajo sobre la pregunta atenuada por un scrim. Es modal (foco atrapado,
 * fondo inert) y solo se cierra avanzando con el CTA; el scrim no cierra y
 * `Esc` equivale al CTA. Reutiliza el material de la FactCard.
 */
export function FieldNoteSheet({ question, answer, isLast, onNext }: Props) {
  const { country } = question;
  const correct = answer.correct;
  // Tercera variante de la barra de estado (§17): el fallo llegó por tiempo
  // agotado, no por un toque erróneo. Mismo tono rojo (sigue siendo 0 pts); solo
  // cambian el glifo (reloj ◷) y el copy respecto al fallo por toque.
  const timedOut = answer.timedOut === true;

  // En nombre→bandera el enunciado ya nombra al país (y la ficha de abajo lo
  // repite), así que el fallo no lo re-anuncia. Tampoco se nombra la bandera
  // pulsada: los distractores salen del pool completo y ese país puede caer
  // como pregunta más adelante en la misma ronda (ventaja, sobre todo en
  // competitivo).
  const nameInPrompt = question.mode === 'name-to-flag';

  // 2 datos al azar del pool del país, estables durante la vida de esta
  // respuesta: el sheet se monta una vez por respuesta (key={question.id} en el
  // padre), así el inicializador corre una sola vez y varía entre partidas.
  const [shownFacts] = useState(() => sample(country.facts, FACTS_PER_ANSWER));

  // Salida animada: al cerrar, la hoja baja (clase `exiting`) y el avance real
  // (onNext, que desmonta la hoja) se dispara al terminar esa bajada.
  const [exiting, setExiting] = useState(false);
  const firedRef = useRef(false);

  const sheetRef = useRef<HTMLDivElement>(null);
  const statusRef = useRef<HTMLParagraphElement>(null);

  // Avanza UNA sola vez, venga del fin de la animación o del timeout de respaldo.
  const finish = useCallback(() => {
    if (firedRef.current) return;
    firedRef.current = true;
    onNext();
  }, [onNext]);

  // Cierre: lanza la bajada y avanza al terminar. Sin animación (reduced-motion o
  // entornos sin matchMedia, p. ej. jsdom en tests) avanza en el acto.
  const requestClose = useCallback(() => {
    if (exiting || firedRef.current) return;
    const noAnim =
      typeof window === 'undefined' ||
      typeof window.matchMedia !== 'function' ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (noAnim) finish();
    else setExiting(true);
  }, [exiting, finish]);

  // Foco inicial al contenido de la hoja (barra de estado, tabindex=-1). En
  // layout effect para que el fondo `inert` ya haya soltado el foco del botón.
  useLayoutEffect(() => {
    statusRef.current?.focus();
  }, []);

  // Focus trap + Esc = avanzar (§10.3/§10.4), vía el hook compartido de modales.
  useFocusTrap(sheetRef, requestClose);

  // Respaldo: si `animationend` no llegara, avanza igual pasada la bajada.
  useEffect(() => {
    if (!exiting) return;
    const t = window.setTimeout(finish, 300);
    return () => window.clearTimeout(t);
  }, [exiting, finish]);

  return (
    <>
      <div
        className={`${styles.scrim}${exiting ? ` ${styles.exiting}` : ''}`}
        aria-hidden="true"
      />
      <div
        ref={sheetRef}
        className={`${styles.sheet}${exiting ? ` ${styles.exiting}` : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label={
          timedOut
            ? 'Se acabó el tiempo'
            : correct
              ? 'Respuesta correcta'
              : 'Respuesta incorrecta'
        }
        onAnimationEnd={(e) => {
          // Solo la animación PROPIA de la hoja (no las de sus hijos que burbujean)
          // y solo durante la salida dispara el avance.
          if (exiting && e.target === e.currentTarget) finish();
        }}
      >
        {/* §A — Barra de estado (aria-live: se anuncia al abrir). */}
        <p
          ref={statusRef}
          tabIndex={-1}
          aria-live="polite"
          className={`${styles.status} ${
            correct ? styles.statusOk : styles.statusError
          }`}
        >
          <span className={styles.statusIcon} aria-hidden="true">
            {correct ? '✓' : timedOut ? '◷' : '✕'}
          </span>
          <span className={styles.statusText}>
            {correct ? (
              '¡Correcto!'
            ) : timedOut ? (
              nameInPrompt ? (
                'Se acabó el tiempo'
              ) : (
                <>
                  Se acabó el tiempo — era <strong>{country.name}</strong>
                </>
              )
            ) : nameInPrompt ? (
              'Esa no era su bandera'
            ) : (
              <>
                Era <strong>{country.name}</strong>
              </>
            )}
          </span>
        </p>

        {/* §B specimen + §C facts (la ficha aporta el papel; el hoist lo pone la hoja). */}
        <FactCard country={country} variant="sheet" facts={shownFacts} noHoist />

        {/* §D — CTA fijo: único camino para avanzar. */}
        <Button className={styles.cta} onClick={requestClose}>
          {isLast ? 'Ver resultado' : 'Siguiente'}
        </Button>
      </div>
    </>
  );
}
