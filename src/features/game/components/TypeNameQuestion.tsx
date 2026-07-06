import { useState } from 'react';
import { FlagImage } from '../../../components/FlagImage';
import { Button } from '../../../components/Button';
import type { AnswerRecord, QuizQuestion } from '../types';
import styles from './Question.module.css';

interface Props {
  question: QuizQuestion;
  answered: AnswerRecord | null;
  onAnswer: (text: string) => void;
}

// El padre monta este componente con key={question.id}, así el input se
// reinicia solo al cambiar de pregunta.
export function TypeNameQuestion({ question, answered, onAnswer }: Props) {
  const [value, setValue] = useState('');

  const inputStateClass = answered
    ? answered.correct
      ? styles.inputCorrect
      : styles.inputIncorrect
    : '';

  return (
    <div className={styles.question}>
      <p className={styles.prompt}>¿De qué país es esta bandera?</p>
      <div className={styles.hero}>
        <FlagImage
          country={question.country}
          size="md"
          active={!answered}
          alt={answered ? `Bandera de ${question.country.name}` : 'Bandera a identificar'}
        />
      </div>
      <form
        className={styles.typeForm}
        onSubmit={(e) => {
          e.preventDefault();
          if (!answered && value.trim().length > 0) onAnswer(value);
        }}
      >
        <input
          className={`${styles.input} ${inputStateClass}`}
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Escribe el país…"
          aria-label="Nombre del país"
          aria-describedby="type-help"
          autoComplete="off"
          autoCapitalize="off"
          spellCheck={false}
          disabled={answered != null}
        />
        <p id="type-help" className={styles.help}>
          No importan tildes ni mayúsculas
        </p>
        {!answered && (
          <Button type="submit" disabled={value.trim().length === 0}>
            Comprobar
          </Button>
        )}
      </form>
    </div>
  );
}
