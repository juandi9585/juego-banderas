// Tipos de la capa online (Fase C). PROPIEDAD: frontend-engineer.
// Contrato del backend ya desplegado: docs/roadmap.md §C.
import type { CategoryId } from '../game/categories';

// Modo de ronda que el ranking/backend acepta (subconjunto de RoundMode). El
// competitivo solo rankea 'mixto' y 'type-name' (escrito).
export type OnlineMode = 'mixto' | 'type-name';

// ── Payload del submit (1:1 con lo que espera la Edge Function submit-score) ──
// Una respuesta en el ORDEN de la pregunta; se mapea desde AnswerRecord quitando
// questionId/correct/correctCode (el servidor los recomputa con la seed).
export interface SubmitAnswer {
  givenCode?: string; // opción múltiple: código elegido
  givenText?: string; // escrito: texto crudo del usuario
  elapsedMs: number; // ms respondiendo (obligatorio para el servidor)
  timedOut?: boolean; // true si expiró el countdown (fallo automático)
}

export interface SubmitPayload {
  seed: number; // uint32 de QuizConfig.competitive.seed
  categoryId: CategoryId;
  mode: OnlineMode;
  answers: SubmitAnswer[]; // longitud = total de la ronda (min(20, pool))
}

// Respuesta 200 de submit-score: puntaje AUTORITATIVO del servidor.
export interface SubmitResponse {
  ok: true;
  points: number;
  correct: number;
  total: number;
  maxStreak: number;
  durationMs: number;
  newRecord: boolean;
  puesto: number | null;
  totalJugadores: number | null;
}

// ── Filas del ranking (RPCs get_leaderboard / get_player_rank) ───────────────
export interface LeaderboardRow {
  puesto: number;
  player_id: string;
  nickname: string;
  discriminator: number;
  points: number;
  correct: number;
  total: number;
  max_streak: number;
  duration_ms: number;
  achieved_at: string;
}

export interface PlayerRank {
  puesto: number;
  total_jugadores: number;
}

// ── Global (RPCs get_global_leaderboard / get_player_global_rank) ─────────────
// Suma de las mejores marcas del jugador en las 18 categorías DEL MODO: cubrir
// más zonas sube el total (mecánica de completar el álbum). `zones` = nº de
// categorías con marca. Orden rank() por points → correct → duration_ms.
export interface GlobalLeaderboardRow {
  puesto: number;
  player_id: string;
  nickname: string;
  discriminator: number;
  points: number;
  zones: number;
  correct: number;
  duration_ms: number;
  achieved_at: string;
}

export interface GlobalPlayerRank {
  puesto: number;
  total_jugadores: number;
  points: number;
  zones: number;
  correct: number;
  duration_ms: number;
}

// Mejor marca propia (tabla records) para la zona/modo seleccionados: alimenta
// la fila "tú" cuando el jugador no está en el top visible.
export interface OwnRecordRow {
  points: number;
  correct: number;
  total: number;
  max_streak: number;
  duration_ms: number;
  achieved_at: string;
}

// Perfil público del jugador (tabla players). El discriminator solo se muestra
// en el perfil propio (oculto en listas del ranking).
export interface PlayerProfile {
  id: string;
  nickname: string;
  discriminator: number;
}

// Resultado de un intento de submit desde el cliente (clasificado para la UI).
export type SubmitOutcome =
  | { kind: 'disabled' } // online apagado (sin env vars)
  | { kind: 'skipped' } // la ronda no era competitiva (nada que enviar)
  | { kind: 'ok'; data: SubmitResponse }
  | { kind: 'needs-profile' } // 412: falta el apodo → onboarding y reintento
  | { kind: 'queued' } // red/5xx/401: encolado, se reintenta luego
  | { kind: 'discarded' }; // 422: payload inválido, no se reintenta
