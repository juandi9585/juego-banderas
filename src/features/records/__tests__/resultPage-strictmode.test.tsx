import { StrictMode } from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ResultPage } from '../../../pages/ResultPage';
import { RecordsContext, type RecordsContextValue } from '../RecordsContext';
import { OnlineContext, type OnlineContextValue } from '../../online/OnlineContext';
import { isBetter, type RecordEntry } from '../records';
import { GameContext } from '../../game/GameContext';
import { computeScore } from '../../game/score';
import type { CategoryId } from '../../game/categories';
import type {
  AnswerRecord,
  GameContextValue,
  GameResult,
  GameState,
  QuizConfig,
  QuizQuestion,
  RoundMode,
} from '../../game/types';
import { countries } from '../../../data/dataset';

// ─────────────────────────────────────────────────────────────────────────────
// Guarda anti doble-submit de StrictMode (ResultPage, `submittedRef`). En dev la
// app se monta bajo <StrictMode> (main.tsx), que invoca los efectos DOS veces al
// montar. Sin la guarda, el récord se registraría dos veces y el segundo pase
// (marca ya igualada) volcaría la UI de "¡Nuevo récord!" a "marca a batir". Aquí
// se monta la ResultPage competitiva bajo <StrictMode> con contextos falsos y se
// verifica que `submit` se llama UNA sola vez. Aislado: no necesita fake timers
// (el motivo por el que el flujo del competitivo usa fireEvent, no userEvent).
// ─────────────────────────────────────────────────────────────────────────────

const CATEGORY: CategoryId = 'asia-meridional';
const MODE: RoundMode = 'mixto';

/** Ronda competitiva TERMINADA sintética: 3 aciertos rápidos, una categoría. */
function makeFinishedCompetitive(): { state: GameState; result: GameResult } {
  const pool = countries.slice(0, 3);
  const questions: QuizQuestion[] = pool.map((country, i) => ({
    id: `${i}-${country.code}`,
    mode: 'flag-to-name',
    kind: 'multiple-choice',
    country,
    correctCode: country.code,
    options: pool,
  }));
  const answers: AnswerRecord[] = pool.map((country, i) => ({
    questionId: `${i}-${country.code}`,
    correct: true,
    correctCode: country.code,
    givenCode: country.code,
    elapsedMs: 1000,
  }));
  const config: QuizConfig = {
    mode: MODE,
    categories: [CATEGORY], // exactamente una (invariante): clave del récord
    questionCount: pool.length,
    competitive: { seed: 12345 },
  };
  const result: GameResult = {
    config,
    total: pool.length,
    correctCount: pool.length,
    answers,
    durationMs: 30_000,
  };
  const state: GameState = {
    status: 'finished',
    config,
    questions,
    currentIndex: pool.length - 1,
    answers,
    startedAt: 0,
    finishedAt: 30_000,
  };
  return { state, result };
}

/** Contexto de récords con `submit` espiado; mantiene la mejor marca en memoria. */
function makeRecordsSpy() {
  const store = new Map<string, RecordEntry>();
  const submit = vi.fn(
    (categoryId: CategoryId, mode: RoundMode, entry: RecordEntry): boolean => {
      const key = `${categoryId}:${mode}`;
      const existing = store.get(key);
      const isNew = !existing || isBetter(entry, existing);
      if (isNew) store.set(key, entry);
      return isNew;
    },
  );
  const getBest = (categoryId: CategoryId, mode: RoundMode): RecordEntry | null =>
    store.get(`${categoryId}:${mode}`) ?? null;
  const value: RecordsContextValue = { submit, getBest };
  return { value, submit, getBest };
}

/** OnlineContextValue apagado: la publicación online es no-op (kind:'disabled')
 * y no interfiere con las aserciones del récord local. */
function makeOnlineValue(): OnlineContextValue {
  return {
    enabled: false,
    loading: false,
    profile: null,
    isAnonymous: false,
    hasSession: false,
    sessionEmail: null,
    submitResult: vi.fn(async () => ({ kind: 'disabled' as const })),
    createProfile: vi.fn(async () => ({ ok: true })),
    updateProfile: vi.fn(async () => ({ ok: true })),
    linkGoogle: vi.fn(async () => ({ ok: true })),
    signInGoogle: vi.fn(async () => ({ ok: true })),
    onboardingOpen: false,
    openOnboarding: vi.fn(),
    closeOnboarding: vi.fn(),
    subscribeOutcome: vi.fn(() => () => {}),
  };
}

/** GameContextValue mínimo alrededor de un resultado ya calculado. */
function makeGameValue(state: GameState, result: GameResult): GameContextValue {
  return {
    state,
    startGame: vi.fn(),
    answerCurrent: vi.fn(),
    timeoutCurrent: vi.fn(),
    next: vi.fn(),
    restart: vi.fn(),
    reset: vi.fn(),
    currentQuestion: null,
    currentAnswer: null,
    progress: { current: result.total, total: result.total },
    result,
  };
}

describe('ResultPage competitiva bajo StrictMode', () => {
  it('registra el récord UNA sola vez pese al doble efecto de StrictMode', () => {
    const { state, result } = makeFinishedCompetitive();
    const records = makeRecordsSpy();
    const game = makeGameValue(state, result);

    render(
      <StrictMode>
        <MemoryRouter initialEntries={['/resultado']}>
          <RecordsContext.Provider value={records.value}>
            <OnlineContext.Provider value={makeOnlineValue()}>
              <GameContext.Provider value={game}>
                <ResultPage />
              </GameContext.Provider>
            </OnlineContext.Provider>
          </RecordsContext.Provider>
        </MemoryRouter>
      </StrictMode>,
    );

    // El doble montaje de StrictMode NO duplica el submit.
    expect(records.submit).toHaveBeenCalledTimes(1);

    // La marca guardada coincide con el puntaje calculado (sin duplicaciones): un
    // getBest posterior devuelve los puntos correctos.
    const expectedPoints = computeScore(result).points;
    expect(records.getBest(CATEGORY, MODE)?.points).toBe(expectedPoints);

    // Y la UI mantiene el latón de "¡Nuevo récord!" (el segundo pase, sin guarda,
    // lo habría degradado a "marca a batir").
    expect(screen.getByText('¡Nuevo récord!')).toBeInTheDocument();
    expect(screen.getByText('Tu primer récord')).toBeInTheDocument();
  });
});
