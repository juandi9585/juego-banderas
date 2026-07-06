// Motor de juego PURO (sin estado, sin React). Todas las funciones son
// deterministas si se les inyecta un RNG. PROPIEDAD: frontend-engineer.
import type {
  Country,
  GameMode,
  QuestionKind,
  QuizConfig,
  QuizQuestion,
} from './types';
import { OPTIONS_PER_QUESTION } from './constants';
import { shuffle, sample, type RNG } from '../../lib/random';
import { matchesCountryName } from '../../lib/text';

export type { RNG };

/**
 * Elige `count` distractores plausibles para `answer`:
 * prioridad misma región → mismo continente → resto. Baraja dentro de cada
 * nivel. Nunca incluye `answer` ni duplicados. Si el pool no alcanza, devuelve
 * menos de `count`.
 */
export function pickDistractors(
  answer: Country,
  pool: readonly Country[],
  count: number,
  rng: RNG = Math.random,
): Country[] {
  const others = pool.filter((c) => c.code !== answer.code);

  const sameRegion = answer.region
    ? others.filter((c) => c.region != null && c.region === answer.region)
    : [];
  const sameRegionCodes = new Set(sameRegion.map((c) => c.code));

  const sameContinent = others.filter(
    (c) => c.continent === answer.continent && !sameRegionCodes.has(c.code),
  );
  const rest = others.filter((c) => c.continent !== answer.continent);

  // Niveles por prioridad; barajar dentro de cada uno para variedad.
  const tiers = [shuffle(sameRegion, rng), shuffle(sameContinent, rng), shuffle(rest, rng)];

  const picked: Country[] = [];
  for (const tier of tiers) {
    for (const c of tier) {
      if (picked.length >= count) break;
      picked.push(c);
    }
    if (picked.length >= count) break;
  }
  return picked;
}

/**
 * Construye una sola pregunta: país correcto + (en MC) distractores barajados.
 * El `id` es provisional (= code); `buildQuiz` le antepone el índice de ronda.
 */
export function buildQuestion(
  mode: GameMode,
  answer: Country,
  pool: readonly Country[],
  rng: RNG = Math.random,
): QuizQuestion {
  const kind: QuestionKind = mode === 'type-name' ? 'text-input' : 'multiple-choice';

  const base: QuizQuestion = {
    id: answer.code,
    mode,
    kind,
    country: answer,
    correctCode: answer.code,
  };

  if (kind === 'multiple-choice') {
    const distractors = pickDistractors(answer, pool, OPTIONS_PER_QUESTION - 1, rng);
    base.options = shuffle([answer, ...distractors], rng);
  }
  return base;
}

/**
 * Construye una ronda completa. Filtra el pool por continente, elige respuestas
 * SIN reemplazo (no se repite país) y limita al tamaño del pool si hace falta.
 * Los distractores salen del pool YA filtrado (coherente con el filtro).
 */
export function buildQuiz(
  pool: readonly Country[],
  config: QuizConfig,
  rng: RNG = Math.random,
): QuizQuestion[] {
  const filtered =
    config.continent === 'all'
      ? pool.slice()
      : pool.filter((c) => c.continent === config.continent);

  const count = Math.min(config.questionCount, filtered.length);
  const answers = sample(filtered, count, rng);

  return answers.map((answer, index) => {
    const q = buildQuestion(config.mode, answer, filtered, rng);
    return { ...q, id: `${index}-${answer.code}` };
  });
}

/** Valida una respuesta de opción múltiple. */
export function checkChoice(question: QuizQuestion, chosenCode: string): boolean {
  return chosenCode === question.correctCode;
}

/** Valida una respuesta escrita (normalización + aliases). */
export function checkTypedAnswer(question: QuizQuestion, input: string): boolean {
  return matchesCountryName(input, question.country);
}
