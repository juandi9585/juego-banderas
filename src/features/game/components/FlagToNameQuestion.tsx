import { FlagImage } from '../../../components/FlagImage';
import { OptionButton } from './OptionButton';
import { optionStateFor } from './questionState';
import type { AnswerRecord, QuizQuestion } from '../types';
import styles from './Question.module.css';

interface Props {
  question: QuizQuestion;
  answered: AnswerRecord | null;
  onAnswer: (code: string) => void;
}

export function FlagToNameQuestion({ question, answered, onAnswer }: Props) {
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
