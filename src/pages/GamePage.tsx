import { useEffect, useRef } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useGame } from '../features/game/useGame';
import {
  correctSoundFor,
  streakAt,
  streakMultiplier,
  timeLimitFor,
} from '../features/game/score';
import { play } from '../lib/sound';
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

  // Sonido de respuesta (§22.2): al APARECER una respuesta nueva. La lógica de
  // acierto-vs-hito se deriva de state.answers (§22.3), nunca del reducer (puro).
  // Guarda de ref contra el doble efecto de StrictMode (una reproducción por
  // respuesta); se reinicia al avanzar (currentAnswer null).
  const lastSoundKey = useRef<string | null>(null);
  useEffect(() => {
    if (!currentAnswer) {
      lastSoundKey.current = null;
      return;
    }
    const key = questionId ?? '';
    if (lastSoundKey.current === key) return;
    lastSoundKey.current = key;
    if (currentAnswer.timedOut) play('timeout');
    else if (!currentAnswer.correct) play('fallo');
    else play(correctSoundFor(state.answers, state.currentIndex));
  }, [currentAnswer, questionId, state.answers, state.currentIndex]);

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

  // Multiplicador de racha EN VIVO para el chip (§23.1). Con la hoja abierta
  // refleja la respuesta recién dada; ya avanzada, la racha arrastrada. Derivado
  // de state.answers, sin tocar el reducer.
  const answeredIdx = sheetOpen ? state.currentIndex : state.currentIndex - 1;
  const mult =
    answeredIdx >= 0 ? streakMultiplier(streakAt(state.answers, answeredIdx)) : 1;

  function handleNext() {
    if (!isLast) focusNextPrompt.current = true;
    next();
  }

  function handleExit() {
    reset();
    // Cross-fade del panel al salir de la partida (§23.5); corte seco si el
    // navegador no soporta View Transitions o hay reduced-motion (CSS lo salta).
    navigate('/', { viewTransition: true });
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
          mult={mult}
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
