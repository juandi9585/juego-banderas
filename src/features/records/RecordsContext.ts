import { createContext } from 'react';
import type { CategoryId } from '../game/categories';
import type { RoundMode } from '../game/types';
import type { RecordEntry } from './records';

// Contexto de récords locales. Independiente del GameProvider: no sabe nada del
// motor de juego; solo recibe datos ya calculados (docs/competitivo.md §5).
// Separado del componente Provider para no romper Fast Refresh.
export interface RecordsContextValue {
  /** Mejor marca de una (categoría, modo), o `null` si aún no hay récord. */
  getBest(categoryId: CategoryId, mode: RoundMode): RecordEntry | null;
  /** Registra una marca; devuelve `true` si supera el récord previo (nuevo récord). */
  submit(categoryId: CategoryId, mode: RoundMode, entry: RecordEntry): boolean;
}

export const RecordsContext = createContext<RecordsContextValue | null>(null);
