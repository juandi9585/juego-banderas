import { createContext } from 'react';
import type { GameContextValue } from './types';

// Contexto de la sesión de juego. `null` fuera del provider (useGame lo detecta).
// Separado del componente Provider para no romper Fast Refresh.
export const GameContext = createContext<GameContextValue | null>(null);
