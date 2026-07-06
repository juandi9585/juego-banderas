import { Navigate } from 'react-router-dom';
import { useGame } from '../features/game/useGame';
import { ProgressBar } from '../features/game/components/ProgressBar';
import { FlagToNameQuestion } from '../features/game/components/FlagToNameQuestion';
import { NameToFlagQuestion } from '../features/game/components/NameToFlagQuestion';
import { TypeNameQuestion } from '../features/game/components/TypeNameQuestion';
import { AnswerFeedback } from '../features/game/components/AnswerFeedback';
import styles from './GamePage.module.css';

export function GamePage() {
  const { state, currentQuestion, currentAnswer, progress, answerCurrent, next } =
    useGame();

  // Guardas: en idle vuelve al inicio; al terminar redirige al resultado.
  if (state.status === 'idle') {
    return <Navigate to="/" replace />;
  }
  if (state.status === 'finished') {
    return <Navigate to="/resultado" replace />;
  }
  if (!currentQuestion) {
    return <Navigate to="/" replace />;
  }

  const isLast = state.currentIndex >= state.questions.length - 1;

  return (
    <div className={styles.page}>
      <ProgressBar current={progress.current} total={progress.total} />

      {/* key => remonta la pregunta (resetea input y relanza la entrada). */}
      {currentQuestion.mode === 'flag-to-name' && (
        <FlagToNameQuestion
          key={currentQuestion.id}
          question={currentQuestion}
          answered={currentAnswer}
          onAnswer={answerCurrent}
        />
      )}
      {currentQuestion.mode === 'name-to-flag' && (
        <NameToFlagQuestion
          key={currentQuestion.id}
          question={currentQuestion}
          answered={currentAnswer}
          onAnswer={answerCurrent}
        />
      )}
      {currentQuestion.mode === 'type-name' && (
        <TypeNameQuestion
          key={currentQuestion.id}
          question={currentQuestion}
          answered={currentAnswer}
          onAnswer={answerCurrent}
        />
      )}

      {/* Región viva persistente: anuncia el resultado al responder. */}
      <div aria-live="polite">
        {currentAnswer && (
          <AnswerFeedback
            question={currentQuestion}
            answer={currentAnswer}
            isLast={isLast}
            onNext={next}
          />
        )}
      </div>
    </div>
  );
}
