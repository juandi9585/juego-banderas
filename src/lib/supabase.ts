// Cliente Supabase — singleton perezoso. PROPIEDAD: frontend-engineer.
// Contrato de la fase online: docs/roadmap.md §C.
//
// REGLA DE ORO (offline-first): sin variables de entorno la app funciona EXACTO
// como antes. `getSupabase()` devuelve null si faltan `VITE_SUPABASE_URL` o
// `VITE_SUPABASE_ANON_KEY`, y toda feature online (submit, ranking, perfil) hace
// no-op / queda en estado "apagado". Nunca se crashea por falta de config.
import { createClient, type SupabaseClient } from '@supabase/supabase-js';

// `undefined` = aún no resuelto; `null` = resuelto pero sin config (apagado).
let cached: SupabaseClient | null | undefined;

/**
 * Cliente Supabase compartido, o `null` si no hay config (features online off).
 * Se crea una sola vez (perezoso): construir el cliente no dispara red — el
 * cliente de auth solo toca localStorage al arrancar y hace red al primer
 * signIn/refresh, así que montarlo en tests sin sesión es inofensivo.
 */
export function getSupabase(): SupabaseClient | null {
  if (cached !== undefined) return cached;

  const url = import.meta.env.VITE_SUPABASE_URL;
  const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
  if (!url || !anonKey) {
    cached = null;
    return null;
  }

  cached = createClient(url, anonKey, {
    auth: {
      // La identidad ES el uid anónimo persistido: debe sobrevivir recargas para
      // no perder el historial antes del upgrade a Google.
      persistSession: true,
      autoRefreshToken: true,
      // Necesario para completar el redirect de signInWithOAuth/linkIdentity
      // (Google) al volver a /ranking.
      detectSessionInUrl: true,
    },
  });
  return cached;
}
