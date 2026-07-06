import type { Ref } from 'react';
import { FlagImage } from '../../../components/FlagImage';
import { OptionButton } from './OptionButton';
import { optionStateFor } from './questionState';
import type { AnswerRecord, QuizQuestion } from '../types';
import styles from './Question.module.css';

interface Props {
  question: QuizQuestion;
  answered: AnswerRecord | null;
  onAnswer: (code: string) => void;
  /** El padre enfoca este prompt al avanzar de pregunta (tabindex=-1). */
  promptRef?: Ref<HTMLParagraphElement>;
}

export function FlagToNameQuestion({ question, answered, onAnswer, promptRef }: Props) {
  return (
    <div className={styles.question}>
      <p ref={promptRef} tabIndex={-1} className={styles.prompt}>
        ¿De qué país es esta bandera?
      </p>
      <div className={styles.hero}>
        <FlagImage
          country={question.country}
          size="md"
          active={!answered}
          fill
          alt={answered ? `Bandera de ${question.country.name}` : 'Bandera a identificar'}
        />
      </div>
      <div className={styles.options}>
        {question.options?.map((opt) => (
          <OptionButton
            key={opt.code}
            state={optionStateFor(opt.code, question.correctCode, answered)}
            disabled={answered != null}
            onClick={() => onAnswer(opt.code)}
          >
            {opt.name}
          </OptionButton>
        ))}
      </div>
    </div>
  );
}
