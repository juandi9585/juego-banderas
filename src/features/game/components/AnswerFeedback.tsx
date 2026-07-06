import { FactCard } from '../../../components/FactCard';
import { Button } from '../../../components/Button';
import type { AnswerRecord, QuizQuestion } from '../types';
import styles from './AnswerFeedback.module.css';

interface Props {
  question: QuizQuestion;
  answer: AnswerRecord;
  isLast: boolean;
  onNext: () => void;
}

/** Feedback tras responder: banda de estado + nota de campo + siguiente. */
export function AnswerFeedback({ question, answer, isLast, onNext }: Props) {
  return (
    <div className={styles.wrap}>
      <p className={answer.correct ? styles.bandOk : styles.bandError}>
        <span aria-hidden="true">{answer.correct ? '✓' : '✕'}</span>{' '}
        {answer.correct ? (
          '¡Correcto!'
        ) : (
          <>
            Era <strong>{question.country.name}</strong>
          </>
        )}
      </p>
      <FactCard country={question.country} variant="game" />
      <Button onClick={onNext}>{isLast ? 'Ver resultado' : 'Siguiente'}</Button>
    </div>
  );
}
