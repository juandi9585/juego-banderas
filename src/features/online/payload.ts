// Mapeo GameResult → payload del submit online — capa PURA (sin React, sin red).
// PROPIEDAD: frontend-engineer. Contrato: docs/roadmap.md §C.
//
// El servidor reconstruye la ronda con la seed y recomputa correctitud y puntaje,
// así que el cliente solo envía lo que NO puede recomputar: qué respondió y cuánto
// tardó. Se quitan questionId/correct/correctCode del AnswerRecord.
import type { GameResult } from '../game/types';
import type { CategoryId } from '../game/categories';
import type { OnlineMode, SubmitAnswer, SubmitPayload } from './types';

/** ¿Es un modo que el ranking online acepta? (mixto / escrito). */
function isOnlineMode(mode: string): mode is OnlineMode {
  return mode === 'mixto' || mode === 'type-name';
}

/**
 * Construye el payload de submit desde un GameResult terminado, o `null` si la
 * ronda no es competitiva/publicable (sin seed, modo no rankeable o sin
 * categoría). Las respuestas van EN ORDEN de pregunta y con longitud = total.
 */
export function resultToPayload(result: GameResult): SubmitPayload | null {
  const seed = result.config.competitive?.seed;
  if (seed == null) return null; // ronda casual: no se publica
  if (!isOnlineMode(result.config.mode)) return null;

  // Invariante del competitivo: exactamente una categoría; es la clave del récord.
  const categoryId = result.config.categories[0] as CategoryId | undefined;
  if (categoryId == null) return null;

  const answers: SubmitAnswer[] = [];
  // Recorremos por índice hasta `total` para que un hueco (no debería existir en
  // competitivo, pero por robustez) cuente como respuesta vacía (fallo), no se
  // salte: el servidor exige answers.length === nº de preguntas de la ronda.
  for (let i = 0; i < result.total; i++) {
    const a = result.answers[i];
    const answer: SubmitAnswer = {
      // El servidor exige un número finito ≥ 0; sin medición usamos 0 (el peor
      // caso da bonus 0, nunca infla el puntaje).
      elapsedMs: a?.elapsedMs != null && Number.isFinite(a.elapsedMs) ? a.elapsedMs : 0,
    };
    if (a?.givenCode != null) answer.givenCode = a.givenCode;
    if (a?.givenText != null) answer.givenText = a.givenText;
    if (a?.timedOut) answer.timedOut = true;
    answers.push(answer);
  }

  return {
    seed: seed >>> 0, // uint32 (el servidor valida 0..0xffffffff)
    categoryId,
    mode: result.config.mode,
    answers,
  };
}
