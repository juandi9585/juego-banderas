import { useContext } from 'react';
import { GameContext } from './GameContext';
import type { GameContextValue } from './types';

/** Consume el contexto de juego. Lanza si se usa fuera de <GameProvider>. */
export function useGame(): GameContextValue {
  const ctx = useContext(GameContext);
  if (!ctx) {
    throw new Error('useGame debe usarse dentro de <GameProvider>');
  }
  return ctx;
}
