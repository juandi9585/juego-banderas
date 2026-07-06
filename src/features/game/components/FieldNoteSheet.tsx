import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { FactCard } from '../../../components/FactCard';
import { Button } from '../../../components/Button';
import { sample } from '../../../lib/random';
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

  // 2 datos al azar del pool del país, estables durante la vida de esta
  // respuesta: el sheet se monta una vez por respuesta (key={question.id} en el
  // padre), así el inicializador corre una sola vez y varía entre partidas.
  const [shownFacts] = useState(() => sample(country.facts, FACTS_PER_ANSWER));

  const sheetRef = useRef<HTMLDivElement>(null);
  const statusRef = useRef<HTMLParagraphElement>(null);

  // Foco inicial al contenido de la hoja (barra de estado, tabindex=-1). En
  // layout effect para que el fondo `inert` ya haya soltado el foco del botón.
  useLayoutEffect(() => {
    statusRef.current?.focus();
  }, []);

  // Focus trap + Esc = avanzar (§10.3/§10.4).
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        e.preventDefault();
        onNext();
        return;
      }
      if (e.key !== 'Tab') return;

      const sheet = sheetRef.current;
      if (!sheet) return;
      const focusables = Array.from(
        sheet.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
        ),
      );
      if (focusables.length === 0) {
        e.preventDefault();
        return;
      }
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      const active = document.activeElement;

      if (e.shiftKey) {
        if (active === first || !sheet.contains(active)) {
          e.preventDefault();
          last.focus();
        }
      } else if (active === last) {
        e.preventDefault();
        first.focus();
      }
    }
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [onNext]);

  return (
    <>
      <div className={styles.scrim} aria-hidden="true" />
      <div
        ref={sheetRef}
        className={styles.sheet}
        role="dialog"
        aria-modal="true"
        aria-label={correct ? 'Respuesta correcta' : 'Respuesta incorrecta'}
      >
        {/* §A — Barra de estado (aria-live: se anuncia al abrir). */}
        <p
          ref={statusRef}
          tabIndex={-1}
          aria-live="polite"
          className={`${styles.status} ${correct ? styles.statusOk : styles.statusError}`}
        >
          <span className={styles.statusIcon} aria-hidden="true">
            {correct ? '✓' : '✕'}
          </span>
          <span className={styles.statusText}>
            {correct ? (
              '¡Correcto!'
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
        <Button className={styles.cta} onClick={onNext}>
          {isLast ? 'Ver resultado' : 'Siguiente'}
        </Button>
      </div>
    </>
  );
}
