import { useCallback, useMemo, useReducer, type ReactNode } from 'react';
import { gameReducer, initialState } from './gameReducer';
import { buildQuiz } from './engine';
import { GameContext } from './GameContext';
import { mulberry32, randomSeed } from '../../lib/random';
import type { Country, GameContextValue, GameResult, QuizConfig } from './types';

/**
 * Construye la ronda de una config. En competitivo usa el PRNG determinista
 * sembrado (ronda reproducible); en casual usa el RNG por defecto (Math.random).
 */
function buildRound(countries: readonly Country[], config: QuizConfig) {
  return config.competitive
    ? buildQuiz(countries, config, mulberry32(config.competitive.seed))
    : buildQuiz(countries, config);
}

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
      const questions = buildRound(countries, config);
      dispatch({ type: 'START', config, questions, startedAt: Date.now() });
    },
    [countries],
  );

  const answerCurrent = useCallback((value: string) => {
    // `at` = reloj de pared al responder; el reducer calcula elapsedMs (§4.3).
    dispatch({ type: 'ANSWER', value, at: Date.now() });
  }, []);

  const timeoutCurrent = useCallback(() => {
    // El countdown competitivo lo llama al agotar los 10 s (fallo automático).
    dispatch({ type: 'TIMEOUT', at: Date.now() });
  }, []);

  const next = useCallback(() => {
    dispatch({ type: 'NEXT', now: Date.now() });
  }, []);

  const restart = useCallback(() => {
    if (!state.config) return;
    // Competitivo: SEMILLA NUEVA en cada reinicio. Reutilizar la semilla dejaría
    // memorizar la ronda (mismos países y mismo orden de opciones) y farmear el
    // récord; randomSeed() garantiza una ronda distinta. El casual conserva su
    // config tal cual (sin semilla).
    const config = state.config.competitive
      ? { ...state.config, competitive: { seed: randomSeed() } }
      : state.config;
    const questions = buildRound(countries, config);
    dispatch({ type: 'RESTART', config, questions, startedAt: Date.now() });
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
            durationMs:
              state.finishedAt != null && state.startedAt != null
                ? state.finishedAt - state.startedAt
                : undefined,
          }
        : null;

    return {
      state,
      startGame,
      answerCurrent,
      timeoutCurrent,
      next,
      restart,
      reset,
      currentQuestion,
      currentAnswer,
      progress,
      result,
    };
  }, [state, startGame, answerCurrent, timeoutCurrent, next, restart, reset]);

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}
