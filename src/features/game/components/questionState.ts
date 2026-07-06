import type { AnswerRecord } from '../types';
import type { OptionState } from './OptionButton';

/**
 * Estado visual de una opción según la respuesta registrada:
 * la correcta se resalta siempre; la elegida errónea en rojo; el resto se atenúa.
 */
export function optionStateFor(
  optionCode: string,
  correctCode: string,
  answered: AnswerRecord | null,
): OptionState {
  if (!answered) return 'idle';
  if (optionCode === correctCode) return 'correct';
  if (answered.givenCode === optionCode) return 'incorrect';
  return 'dimmed';
}
