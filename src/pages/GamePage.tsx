import { useEffect, useRef } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useGame } from '../features/game/useGame';
import { timeLimitFor } from '../features/game/score';
import { GameTopBar } from '../features/game/components/GameTopBar';
import { FlagToNameQuestion } from '../features/game/components/FlagToNameQuestion';
import { NameToFlagQuestion } from '../features/game/components/NameToFlagQuestion';
import { TypeNameQuestion } from '../features/game/components/TypeNameQuestion';
import { FieldNoteSheet } from '../features/game/components/FieldNoteSheet';
import styles from './GamePage.module.css';

export function GamePage() {
  const {
    state,
    currentQuestion,
    currentAnswer,
    progress,
    answerCurrent,
    timeoutCurrent,
    next,
    reset,
  } = useGame();
  const navigate = useNavigate();

  // Foco: al avanzar, aterriza en el prompt de la nueva pregunta (tabindex=-1).
  const promptRef = useRef<HTMLParagraphElement>(null);
  const focusNextPrompt = useRef(false);
  const questionId = currentQuestion?.id;

  useEffect(() => {
    if (focusNextPrompt.current) {
      promptRef.current?.focus();
      focusNextPrompt.current = false;
    }
  }, [questionId]);

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
  const sheetOpen = currentAnswer != null;
  // Competitivo: countdown por pregunta con el límite del modo (10 s mixto,
  // 15 s escrito). Se detiene con la hoja abierta (pregunta respondida) y se
  // remonta por pregunta (questionKey) reiniciándose.
  const isCompetitive = state.config?.competitive != null;

  function handleNext() {
    if (!isLast) focusNextPrompt.current = true;
    next();
  }

  function handleExit() {
    reset();
    navigate('/');
  }

  return (
    <>
      {/* Fondo: la pregunta respondida queda inerte y oculta a AT mientras la
          hoja está abierta (modalidad, §10.3). */}
      <div
        className={styles.page}
        inert={sheetOpen ? true : undefined}
        aria-hidden={sheetOpen || undefined}
      >
        <GameTopBar
          current={progress.current}
          total={progress.total}
          onExit={handleExit}
          countdown={
            isCompetitive && state.config != null && state.questionStartedAt != null
              ? {
                  startedAt: state.questionStartedAt,
                  limitMs: timeLimitFor(state.config.mode),
                  paused: sheetOpen,
                  onTimeout: timeoutCurrent,
                  questionKey: currentQuestion.id,
                }
              : undefined
          }
        />

        {/* key => remonta la pregunta (resetea input y relanza la entrada). */}
        {currentQuestion.mode === 'flag-to-name' && (
          <FlagToNameQuestion
            key={currentQuestion.id}
            question={currentQuestion}
            answered={currentAnswer}
            onAnswer={answerCurrent}
            promptRef={promptRef}
          />
        )}
        {currentQuestion.mode === 'name-to-flag' && (
          <NameToFlagQuestion
            key={currentQuestion.id}
            question={currentQuestion}
            answered={currentAnswer}
            onAnswer={answerCurrent}
            promptRef={promptRef}
          />
        )}
        {currentQuestion.mode === 'type-name' && (
          <TypeNameQuestion
            key={currentQuestion.id}
            question={currentQuestion}
            answered={currentAnswer}
            onAnswer={answerCurrent}
            promptRef={promptRef}
          />
        )}
      </div>

      {sheetOpen && (
        <FieldNoteSheet
          key={currentQuestion.id}
          question={currentQuestion}
          answer={currentAnswer}
          isLast={isLast}
          onNext={handleNext}
        />
      )}
    </>
  );
}
