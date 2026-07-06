import { useCallback, useMemo, useReducer, type ReactNode } from 'react';
import { gameReducer, initialState } from './gameReducer';
import { buildQuiz } from './engine';
import { GameContext } from './GameContext';
import type { Country, GameContextValue, GameResult, QuizConfig } from './types';

interface GameProviderProps {
  children: ReactNode;
  /**
   * Pool de países del que se generan las rondas.
   * TODO(reconectar): cuando exista `src/data/countries.ts`, App pasará el
   * dataset real: `<GameProvider countries={countries}>`. Hasta entonces, el
   * valor por defecto vacío hace que `buildQuiz` devuelva rondas vacías (la app
   * arranca y las rutas funcionan, sin contenido todavía).
   */
  countries?: Country[];
}

export function GameProvider({ children, countries = [] }: GameProviderProps) {
  const [state, dispatch] = useReducer(gameReducer, initialState);

  const startGame = useCallback(
    (config: QuizConfig) => {
      const questions = buildQuiz(countries, config);
      dispatch({ type: 'START', config, questions, startedAt: Date.now() });
    },
    [countries],
  );

  const answerCurrent = useCallback((value: string) => {
    dispatch({ type: 'ANSWER', value });
  }, []);

  const next = useCallback(() => {
    dispatch({ type: 'NEXT', now: Date.now() });
  }, []);

  const restart = useCallback(() => {
    if (!state.config) return;
    const questions = buildQuiz(countries, state.config);
    dispatch({ type: 'RESTART', questions, startedAt: Date.now() });
  }, [countries, state.config]);

  const reset = useCallback(() => {
    dispatch({ type: 'RESET' });
  }, []);

  const value = useMemo<GameContextValue>(() => {
    const currentQuestion = state.questions[state.currentIndex] ?? null;
    const currentAnswer = state.answers[state.currentIndex] ?? null;
    const progress = {
      current: state.questions.length === 0 ? 0 : state.currentIndex + 1,
      total: state.questions.length,
    };
    const result: GameResult | null =
      state.status === 'finished' && state.config
        ? {
            config: state.config,
            total: state.questions.length,
            correctCount: state.answers.filter((a) => a?.correct).length,
            answers: state.answers,
          }
        : null;

    return {
      state,
      startGame,
      answerCurrent,
      next,
      restart,
      reset,
      currentQuestion,
      currentAnswer,
      progress,
      result,
    };
  }, [state, startGame, answerCurrent, next, restart, reset]);

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}
