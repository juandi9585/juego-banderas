import { useContext } from 'react';
import { RecordsContext, type RecordsContextValue } from './RecordsContext';

/** Consume el contexto de récords. Lanza si se usa fuera de <RecordsProvider>. */
export function useRecords(): RecordsContextValue {
  const ctx = useContext(RecordsContext);
  if (!ctx) {
    throw new Error('useRecords debe usarse dentro de <RecordsProvider>');
  }
  return ctx;
}
