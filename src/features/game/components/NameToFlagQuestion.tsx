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

export function NameToFlagQuestion({ question, answered, onAnswer }: Props) {
  return (
    <div className={styles.question}>
      <p className={styles.prompt}>¿Cuál es la bandera de…</p>
      <p className={styles.countryName}>{question.country.name}</p>
      <div className={styles.flagGrid}>
        {question.options?.map((opt) => (
          <OptionButton
            key={opt.code}
            state={optionStateFor(opt.code, question.correctCode, answered)}
            disabled={answered != null}
            onClick={() => onAnswer(opt.code)}
            ariaLabel={opt.name}
            flagContent
          >
            <FlagImage country={opt} size="sm" alt="" />
          </OptionButton>
        ))}
      </div>
    </div>
  );
}
