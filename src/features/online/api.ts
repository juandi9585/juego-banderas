// Envoltorios finos sobre el SDK de Supabase. PROPIEDAD: frontend-engineer.
// Aíslan las llamadas (RPC, tabla, Edge Function) del resto de la app: los
// componentes/hooks solo tocan estas funciones, y los tests mockean el cliente.
//
// Ninguna lanza al llamador salvo donde se indica: devuelven datos o null/estado
// para que la UI decida el copy. La clasificación del submit vive en queue.ts.
import type { SupabaseClient } from '@supabase/supabase-js';
import type {
  GlobalLeaderboardRow,
  GlobalPlayerRank,
  LeaderboardRow,
  OwnRecordRow,
  PlayerProfile,
  PlayerRank,
  SubmitPayload,
  SubmitResponse,
} from './types';
import type { OnlineMode } from './types';
import type { CategoryId } from '../game/categories';

// ── Submit (Edge Function) ───────────────────────────────────────────────────

export interface InvokeSubmitResult {
  status: number; // HTTP status; 0 = fallo de red (sin respuesta)
  data: SubmitResponse | null; // presente solo en 200
  errorCode: string | null; // campo `error` del cuerpo, o 'network'
}

/**
 * Invoca submit-score y NORMALIZA el resultado a { status, data, errorCode }.
 * supabase-js entrega los no-2xx como `error` con `context: Response`; de ahí se
 * lee el status y el cuerpo. Se pasa el token explícito para evitar carreras
 * justo tras signInAnonymously (aún no propagado a functions).
 */
export async function invokeSubmit(
  sb: SupabaseClient,
  payload: SubmitPayload,
  accessToken?: string,
): Promise<InvokeSubmitResult> {
  try {
    const { data, error } = await sb.functions.invoke('submit-score', {
      body: payload,
      headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : undefined,
    });
    if (error) {
      const context = (error as { context?: Response }).context;
      if (context && typeof context.status === 'number') {
        let errorCode: string | null = null;
        try {
          const body = (await context.clone().json()) as { error?: string };
          errorCode = body?.error ?? null;
        } catch {
          // cuerpo no-JSON: nos quedamos con el status.
        }
        return { status: context.status, data: null, errorCode };
      }
      // Sin context = fallo de red (FunctionsFetchError).
      return { status: 0, data: null, errorCode: 'network' };
    }
    return { status: 200, data: data as SubmitResponse, errorCode: null };
  } catch {
    return { status: 0, data: null, errorCode: 'network' };
  }
}

// ── Sesión / perfil ──────────────────────────────────────────────────────────

/** Lee la fila de `players` del uid dado, o null si no existe / error. */
export async function fetchOwnProfile(
  sb: SupabaseClient,
  userId: string,
): Promise<PlayerProfile | null> {
  const { data, error } = await sb
    .from('players')
    .select('id, nickname, discriminator')
    .eq('id', userId)
    .maybeSingle();
  if (error || !data) return null;
  return data as PlayerProfile;
}

/**
 * Crea la fila de perfil del jugador (id + nickname; el discriminador lo asigna
 * un trigger). Reintenta ante colisión de carrera (23505: el trigger eligió un
 * número ya tomado). Si la colisión es de PK (el perfil ya existía), lo devuelve.
 * Devuelve null si no se pudo tras varios intentos.
 */
export async function insertProfile(
  sb: SupabaseClient,
  userId: string,
  nickname: string,
): Promise<PlayerProfile | null> {
  for (let attempt = 0; attempt < 5; attempt++) {
    const { data, error } = await sb
      .from('players')
      // Solo id + nickname: incluir otra columna daría permission denied (grants
      // de columna). El .select() devuelve la fila con el discriminator asignado.
      .insert({ id: userId, nickname })
      .select('id, nickname, discriminator')
      .single();

    if (!error && data) return data as PlayerProfile;

    if (error?.code === '23505') {
      // Puede ser colisión de apodo#disc (reintentar: el trigger reelige) o de PK
      // (el perfil ya existe): si ya hay fila para este uid, la devolvemos.
      const existing = await fetchOwnProfile(sb, userId);
      if (existing) return existing;
      continue; // apodo#disc: reintentar el insert
    }
    return null; // otro error (permisos, red): no insistir a ciegas
  }
  return null;
}

/**
 * Cambia el apodo del perfil (UPDATE de la propia fila; RLS + grant de columna
 * solo permiten escribir `nickname`). El trigger conserva el discriminador si
 * el apodo no cambió y asigna uno NUEVO si sí (estilo Discord). Reintenta ante
 * colisión de carrera 23505 (al reintentar, el trigger reelige número).
 */
export async function updateNickname(
  sb: SupabaseClient,
  userId: string,
  nickname: string,
): Promise<PlayerProfile | null> {
  for (let attempt = 0; attempt < 5; attempt++) {
    const { data, error } = await sb
      .from('players')
      .update({ nickname })
      .eq('id', userId)
      .select('id, nickname, discriminator')
      .single();

    if (!error && data) return data as PlayerProfile;
    if (error?.code === '23505') continue; // carrera apodo#disc: reintentar
    return null; // otro error (permisos, red): no insistir a ciegas
  }
  return null;
}

// ── Ranking (RPCs de lectura pública) ────────────────────────────────────────

/** Top N de una (zona, modo). Errores → array vacío no; se propaga lanzando. */
export async function fetchLeaderboard(
  sb: SupabaseClient,
  categoryId: CategoryId,
  mode: OnlineMode,
  limit = 50,
): Promise<LeaderboardRow[]> {
  const { data, error } = await sb.rpc('get_leaderboard', {
    p_category_id: categoryId,
    p_mode: mode,
    p_limit: limit,
  });
  if (error) throw error;
  return (data ?? []) as LeaderboardRow[];
}

/** Puesto del jugador en una (zona, modo), o null si no tiene marca. */
export async function fetchPlayerRank(
  sb: SupabaseClient,
  categoryId: CategoryId,
  mode: OnlineMode,
  playerId: string,
): Promise<PlayerRank | null> {
  const { data, error } = await sb.rpc('get_player_rank', {
    p_category_id: categoryId,
    p_mode: mode,
    p_player_id: playerId,
  });
  if (error) throw error;
  const rows = (data ?? []) as PlayerRank[];
  return rows[0] ?? null;
}

/** Top N GLOBAL de un modo (suma de mejores marcas por zona). Lanza en error. */
export async function fetchGlobalLeaderboard(
  sb: SupabaseClient,
  mode: OnlineMode,
  limit = 50,
): Promise<GlobalLeaderboardRow[]> {
  const { data, error } = await sb.rpc('get_global_leaderboard', {
    p_mode: mode,
    p_limit: limit,
  });
  if (error) throw error;
  return (data ?? []) as GlobalLeaderboardRow[];
}

/** Tu puesto GLOBAL de un modo (con tus agregados), o null si no tienes marcas. */
export async function fetchGlobalPlayerRank(
  sb: SupabaseClient,
  mode: OnlineMode,
  playerId: string,
): Promise<GlobalPlayerRank | null> {
  const { data, error } = await sb.rpc('get_player_global_rank', {
    p_mode: mode,
    p_player_id: playerId,
  });
  if (error) throw error;
  const rows = (data ?? []) as GlobalPlayerRank[];
  return rows[0] ?? null;
}

/** Mejor marca propia en una (zona, modo), o null. Para la fila "tú" fuera del top. */
export async function fetchOwnRecord(
  sb: SupabaseClient,
  playerId: string,
  categoryId: CategoryId,
  mode: OnlineMode,
): Promise<OwnRecordRow | null> {
  const { data, error } = await sb
    .from('records')
    .select('points, correct, total, max_streak, duration_ms, achieved_at')
    .match({ player_id: playerId, category_id: categoryId, mode })
    .maybeSingle();
  if (error || !data) return null;
  return data as OwnRecordRow;
}
