import { useContext } from 'react';
import { OnlineContext, type OnlineContextValue } from './OnlineContext';

/** Consume el contexto online. Lanza si se usa fuera de <OnlineProvider>. */
export function useOnline(): OnlineContextValue {
  const ctx = useContext(OnlineContext);
  if (!ctx) {
    throw new Error('useOnline debe usarse dentro de <OnlineProvider>');
  }
  return ctx;
}
