// Reducer de la sesión de juego. PROPIEDAD: frontend-engineer.
// La generación de preguntas (buildQuiz) ocurre en GameProvider y llega ya
// resuelta en las acciones START/RESTART, para mantener este reducer simple.
import type {
  AnswerRecord,
  GameState,
  QuizConfig,
  QuizQuestion,
} from './types';
import { checkChoice, checkTypedAnswer } from './engine';

export const initialState: GameState = {
  status: 'idle',
  config: null,
  questions: [],
  currentIndex: 0,
  answers: [],
};

export type GameAction =
  | { type: 'START'; config: QuizConfig; questions: QuizQuestion[]; startedAt: number }
  | { type: 'ANSWER'; value: string } // code (MC) o texto (escribir)
  | { type: 'NEXT'; now: number }
  | { type: 'RESTART'; questions: QuizQuestion[]; startedAt: number }
  | { type: 'RESET' };

export function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'START':
      return {
        status: 'playing',
        config: action.config,
        questions: action.questions,
        currentIndex: 0,
        answers: [],
        startedAt: action.startedAt,
        finishedAt: undefined,
      };

    case 'ANSWER': {
      const q = state.questions[state.currentIndex];
      // Ignorar si no hay pregunta o si esta ya fue respondida (idempotente).
      if (state.status !== 'playing' || !q || state.answers[state.currentIndex]) {
        return state;
      }
      const isMC = q.kind === 'multiple-choice';
      const correct = isMC
        ? checkChoice(q, action.value)
        : checkTypedAnswer(q, action.value);

      const record: AnswerRecord = {
        questionId: q.id,
        correct,
        correctCode: q.correctCode,
        ...(isMC ? { givenCode: action.value } : { givenText: action.value }),
      };

      const answers = state.answers.slice();
      answers[state.currentIndex] = record;

      // ── COSTURA gamificación ──────────────────────────────────────────────
      // Único punto donde en el futuro se incrementarán racha/puntos/vidas a
      // partir de `record.correct`. La UI leería esos valores del contexto.
      return { ...state, answers };
    }

    case 'NEXT': {
      if (state.status !== 'playing') return state;
      const isLast = state.currentIndex >= state.questions.length - 1;
      if (isLast) {
        return { ...state, status: 'finished', finishedAt: action.now };
      }
      return { ...state, currentIndex: state.currentIndex + 1 };
    }

    case 'RESTART':
      return {
        status: 'playing',
        config: state.config,
        questions: action.questions,
        currentIndex: 0,
        answers: [],
        startedAt: action.startedAt,
        finishedAt: undefined,
      };

    case 'RESET':
      return initialState;

    default:
      return state;
  }
}
