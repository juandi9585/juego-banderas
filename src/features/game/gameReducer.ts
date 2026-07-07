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
  | { type: 'ANSWER'; value: string; at: number } // code (MC) o texto; `at` = Date.now() al responder
  | { type: 'TIMEOUT'; at: number } // competitivo: se agotaron los 10 s; `at` = Date.now()
  | { type: 'NEXT'; now: number }
  // RESTART lleva su propia `config`: el competitivo reinicia con SEMILLA NUEVA
  // (config distinta), no con la de la partida anterior.
  | { type: 'RESTART'; config: QuizConfig; questions: QuizQuestion[]; startedAt: number }
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
        // La primera pregunta queda visible en el mismo instante de arranque.
        questionStartedAt: action.startedAt,
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

      // ── COSTURA gamificación ──────────────────────────────────────────────
      // La CAPTURA de tiempo ya vive aquí: elapsedMs = instante de respuesta −
      // instante en que la pregunta quedó visible (§4.3). Se omite si no hay
      // base (nunca negativo → clamp a 0). Racha/puntos NO se llevan en vivo: se
      // calculan al final con computeScore(result) (score.ts, §4.4). Este seguiría
      // siendo el punto donde incrementar un marcador en vivo si algún día hiciera falta.
      const elapsedMs =
        state.questionStartedAt != null
          ? Math.max(0, action.at - state.questionStartedAt)
          : undefined;

      const record: AnswerRecord = {
        questionId: q.id,
        correct,
        correctCode: q.correctCode,
        ...(isMC ? { givenCode: action.value } : { givenText: action.value }),
        ...(elapsedMs != null ? { elapsedMs } : {}),
      };

      const answers = state.answers.slice();
      answers[state.currentIndex] = record;

      return { ...state, answers };
    }

    case 'TIMEOUT': {
      const q = state.questions[state.currentIndex];
      // MISMA guarda idempotente que ANSWER: si la pregunta ya fue respondida
      // (por clic o por un TIMEOUT anterior), no-op. Resuelve la carrera
      // clic-vs-timer — gana quien llega primero; el segundo se ignora.
      if (state.status !== 'playing' || !q || state.answers[state.currentIndex]) {
        return state;
      }
      // Fallo automático: 0 puntos (correct:false) marcado con timedOut para
      // que la hoja muestre la variante "Se acabó el tiempo" (§17). NO avanza:
      // la hoja se abre como con cualquier respuesta y el jugador pulsa Siguiente.
      const elapsedMs =
        state.questionStartedAt != null
          ? Math.max(0, action.at - state.questionStartedAt)
          : undefined;

      const record: AnswerRecord = {
        questionId: q.id,
        correct: false,
        timedOut: true,
        correctCode: q.correctCode,
        ...(elapsedMs != null ? { elapsedMs } : {}),
      };

      const answers = state.answers.slice();
      answers[state.currentIndex] = record;

      return { ...state, answers };
    }

    case 'NEXT': {
      if (state.status !== 'playing') return state;
      const isLast = state.currentIndex >= state.questions.length - 1;
      if (isLast) {
        return { ...state, status: 'finished', finishedAt: action.now };
      }
      // Al avanzar, la nueva pregunta queda visible ahora: reinicia el reloj
      // (el tiempo pasado en la hoja de datos curiosos no cuenta, §4.3).
      return {
        ...state,
        currentIndex: state.currentIndex + 1,
        questionStartedAt: action.now,
      };
    }

    case 'RESTART':
      return {
        status: 'playing',
        config: action.config, // puede traer una semilla nueva (competitivo)
        questions: action.questions,
        currentIndex: 0,
        answers: [],
        startedAt: action.startedAt,
        finishedAt: undefined,
        questionStartedAt: action.startedAt,
      };

    case 'RESET':
      return initialState;

    default:
      return state;
  }
}
