import { createContext } from 'react';
import type { GameResult } from '../game/types';
import type { PlayerProfile, SubmitOutcome, SubmitResponse } from './types';

// Contexto de la capa online (Fase C). Separado del Provider para no romper Fast
// Refresh. `null` fuera del provider (useOnline lo detecta y lanza).
//
// Diseño extensible: el estado vive aquí (perfil, sesión, onboarding) y crece sin
// reescribir cuando lleguen amigos/insignias — el motor de juego y los récords
// locales siguen intactos y desacoplados de esto.
export interface OnlineContextValue {
  /** ¿Hay config (env vars)? Si es false, todo online está apagado. */
  enabled: boolean;
  /** Resolviendo sesión/perfil iniciales. */
  loading: boolean;
  /** Perfil del jugador (fila en players), o null si aún no creó apodo. */
  profile: PlayerProfile | null;
  /** La sesión actual es anónima (mostrar "Guardar progreso con Google"). */
  isAnonymous: boolean;
  /**
   * Hay sesión de auth viva aunque NO exista perfil todavía — el estado en que
   * queda quien vuelve del OAuth de Google sin haber elegido apodo. Sin esta
   * distinción la UI pintaría "crea tu cuenta" a alguien ya conectado.
   */
  hasSession: boolean;
  /** Email de la sesión (cuenta Google); null en anónimas o sin sesión. */
  sessionEmail: string | null;

  /** Envía una ronda competitiva terminada al ranking (idempotente por seed). */
  submitResult: (result: GameResult) => Promise<SubmitOutcome>;
  /** Crea el perfil (apodo) con auth anónima si hace falta. */
  createProfile: (nickname: string) => Promise<{ ok: boolean; error?: string }>;
  /** Cambia el apodo del perfil existente (apodo distinto ⇒ nuevo #número). */
  updateProfile: (nickname: string) => Promise<{ ok: boolean; error?: string }>;
  /** Upgrade de anónimo a Google conservando el uid (y el historial). */
  linkGoogle: () => Promise<{ ok: boolean; error?: string }>;
  /** Inicia sesión con Google (volver a entrar en otro dispositivo). */
  signInGoogle: () => Promise<{ ok: boolean; error?: string }>;

  /** Estado y control del sheet de onboarding (apodo). */
  onboardingOpen: boolean;
  openOnboarding: () => void;
  closeOnboarding: () => void;

  /**
   * Suscribe una callback al resultado del submit de una ronda concreta (por
   * `id` de dedupe). Se dispara cuando la cola termina de publicar esa ronda
   * (p. ej. tras el onboarding). Devuelve la función para desuscribir.
   */
  subscribeOutcome: (id: string, cb: (res: SubmitResponse) => void) => () => void;
}

export const OnlineContext = createContext<OnlineContextValue | null>(null);
