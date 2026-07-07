import { useCallback, useMemo, useState, type ReactNode } from 'react';
import { RecordsContext, type RecordsContextValue } from './RecordsContext';
import {
  isBetter,
  loadRecords,
  recordKey,
  saveRecords,
  type RecordEntry,
  type RecordsMap,
} from './records';
import type { CategoryId } from '../game/categories';
import type { RoundMode } from '../game/types';

/**
 * Provider de récords locales (docs/competitivo.md §5, Fase 1). Envuelve la app
 * por ENCIMA del GameProvider y NO lo acopla: la ResultPage le entrega el
 * puntaje ya calculado. Lee localStorage al montar y escribe en cada `submit`.
 */
export function RecordsProvider({ children }: { children: ReactNode }) {
  const [records, setRecords] = useState<RecordsMap>(() => loadRecords());

  const getBest = useCallback(
    (categoryId: CategoryId, mode: RoundMode): RecordEntry | null =>
      records[recordKey(categoryId, mode)] ?? null,
    [records],
  );

  const submit = useCallback(
    (categoryId: CategoryId, mode: RoundMode, entry: RecordEntry): boolean => {
      // Defensa en profundidad: sin categoría no hay clave válida (la guarda real
      // vive en la ResultPage). Evita persistir un récord bajo ':mixto'.
      if (!categoryId) return false;
      const key = recordKey(categoryId, mode);
      const existing = records[key];
      // Nuevo récord si no había marca o la supera estrictamente. Se calcula de
      // forma SÍNCRONA desde `records` (no dentro del updater de setState) para
      // poder devolver el booleano ya; la ResultPage llama a `submit` una sola
      // vez por partida (guarda de ref contra el doble efecto de StrictMode).
      const isNew = !existing || isBetter(entry, existing);
      if (isNew) {
        const next = { ...records, [key]: entry };
        setRecords(next);
        saveRecords(next);
      }
      return isNew;
    },
    [records],
  );

  const value = useMemo<RecordsContextValue>(
    () => ({ getBest, submit }),
    [getBest, submit],
  );

  return <RecordsContext.Provider value={value}>{children}</RecordsContext.Provider>;
}
