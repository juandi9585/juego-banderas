import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import type { Session } from '@supabase/supabase-js';
import { getSupabase } from '../../lib/supabase';
import { OnlineContext, type OnlineContextValue } from './OnlineContext';
import { NicknameSheet } from './NicknameSheet';
import {
  fetchOwnProfile,
  insertProfile,
  invokeSubmit,
  updateNickname,
} from './api';
import {
  classifySubmit,
  enqueue,
  loadQueue,
  pruneExpired,
  removeFromQueue,
  saveQueue,
  submitId,
  type QueuedSubmit,
} from './queue';
import { resultToPayload } from './payload';
import { validateNickname } from './nickname';
import type { GameResult } from '../game/types';
import type { PlayerProfile, SubmitOutcome, SubmitResponse } from './types';

/** URL de vuelta tras el OAuth de Google (ambos orígenes están en el dashboard). */
function redirectTo(): string | undefined {
  if (typeof window === 'undefined') return undefined;
  return `${window.location.origin}/ranking`;
}

// Centinela de inicialización perezosa del queueRef: se reemplaza en el primer
// render (nunca se muta), evitando llamar a loadQueue() en cada render.
const QUEUE_UNSET: QueuedSubmit[] = [];

/**
 * Provider de la capa online (Fase C). Envuelve la app y coordina: sesión
 * (anónima → Google), perfil (apodo), submit de rondas competitivas al ranking y
 * la cola de reintentos. Es INDEPENDIENTE del motor de juego y de los récords
 * locales: la ResultPage le entrega el GameResult ya hecho y él lo publica aparte.
 *
 * Apagado con gracia: sin env vars, `getSupabase()` es null → `enabled=false` y
 * todo es no-op (la app funciona igual que offline).
 */
export function OnlineProvider({ children }: { children: ReactNode }) {
  // Cliente singleton (o null si no hay config). Estable durante la vida de la app.
  const sb = useMemo(() => getSupabase(), []);
  const enabled = sb != null;

  const [loading, setLoading] = useState(enabled);
  const [profile, setProfile] = useState<PlayerProfile | null>(null);
  const [isAnonymous, setIsAnonymous] = useState(false);
  // Sesión sin perfil = vuelta del OAuth sin apodo elegido (ver OnlineContext).
  const [hasSession, setHasSession] = useState(false);
  const [sessionEmail, setSessionEmail] = useState<string | null>(null);
  const [onboardingOpen, setOnboardingOpen] = useState(false);

  // Cola de reintentos en memoria (espejo de localStorage) + suscriptores a
  // resultados por ronda + guarda anti-flush concurrente. Init perezoso: loadQueue
  // (lee localStorage) corre una sola vez, no en cada render.
  const queueRef = useRef<QueuedSubmit[]>(QUEUE_UNSET);
  if (queueRef.current === QUEUE_UNSET) queueRef.current = loadQueue();
  const outcomeListeners = useRef<Map<string, Set<(res: SubmitResponse) => void>>>(
    new Map(),
  );
  const flushingRef = useRef(false);
  // Coalescing: si se pide un flush mientras otro corre, se marca y el que está
  // en curso vuelve a recorrer la cola al terminar (no se pierde el disparo).
  const flushPendingRef = useRef(false);

  const subscribeOutcome = useCallback(
    (id: string, cb: (res: SubmitResponse) => void) => {
      let set = outcomeListeners.current.get(id);
      if (!set) {
        set = new Set();
        outcomeListeners.current.set(id, set);
      }
      set.add(cb);
      return () => {
        const s = outcomeListeners.current.get(id);
        if (!s) return;
        s.delete(cb);
        if (s.size === 0) outcomeListeners.current.delete(id);
      };
    },
    [],
  );

  const emitOutcome = useCallback((id: string, res: SubmitResponse) => {
    outcomeListeners.current.get(id)?.forEach((cb) => cb(res));
  }, []);

  const persistQueue = useCallback((next: QueuedSubmit[]) => {
    queueRef.current = next;
    saveQueue(next);
  }, []);

  /** Relee sesión + perfil y actualiza el estado. Devuelve el perfil (o null). */
  const refreshProfile = useCallback(async (): Promise<PlayerProfile | null> => {
    if (!sb) return null;
    const {
      data: { session },
    } = await sb.auth.getSession();
    if (!session) {
      setProfile(null);
      setIsAnonymous(false);
      setHasSession(false);
      setSessionEmail(null);
      return null;
    }
    setIsAnonymous(session.user.is_anonymous === true);
    setHasSession(true);
    setSessionEmail(session.user.email ?? null);
    const p = await fetchOwnProfile(sb, session.user.id);
    setProfile(p);
    return p;
  }, [sb]);

  /**
   * Reintenta los submits encolados. Requiere sesión (si no, no hay a quién
   * atribuirlos). Se detiene ante el primer 'retry'/'needs-session'/'needs-
   * profile' (esperar a mejores condiciones); descarta 422; publica 200.
   */
  const flushQueue = useCallback(async () => {
    if (!sb) return;
    if (typeof navigator !== 'undefined' && navigator.onLine === false) return;
    // El flag se pone SÍNCRONO, antes de cualquier await: si no, dos flushes que
    // entren a la vez (montaje + INITIAL_SESSION de onAuthStateChange, o el flush
    // post-onboarding + el de signInAnonymously) recorrerían la cola en paralelo
    // y duplicarían submits. El que llega mientras hay uno en curso lo re-agenda.
    if (flushingRef.current) {
      flushPendingRef.current = true;
      return;
    }
    flushingRef.current = true;
    try {
      do {
        flushPendingRef.current = false;
        // Purga por antigüedad antes de decidir si hay algo que enviar.
        const fresh = pruneExpired(queueRef.current);
        if (fresh.length !== queueRef.current.length) persistQueue(fresh);
        if (queueRef.current.length === 0) break;
        const {
          data: { session },
        } = await sb.auth.getSession();
        if (!session) break;

        for (const item of [...queueRef.current]) {
          const res = await invokeSubmit(sb, item.payload, session.access_token);
          const cls = classifySubmit(res.status);
          if (cls === 'ok') {
            persistQueue(removeFromQueue(queueRef.current, item.id));
            if (res.data) emitOutcome(item.id, res.data);
          } else if (cls === 'discard') {
            persistQueue(removeFromQueue(queueRef.current, item.id));
          } else {
            // needs-profile / needs-session / retry: dejar en cola y esperar.
            break;
          }
        }
        // Si llegó otra petición de flush mientras recorríamos (p. ej. el perfil
        // se acaba de crear), volvemos a intentar antes de soltar el lock.
      } while (flushPendingRef.current);
    } finally {
      flushingRef.current = false;
    }
  }, [sb, persistQueue, emitOutcome]);

  /** Garantiza una sesión (crea una anónima si no hay). Null si no se pudo. */
  const ensureSession = useCallback(async (): Promise<Session | null> => {
    if (!sb) return null;
    const {
      data: { session },
    } = await sb.auth.getSession();
    if (session) return session;
    const { data, error } = await sb.auth.signInAnonymously();
    if (error) return null;
    return data.session;
  }, [sb]);

  const createProfile = useCallback(
    async (rawNickname: string): Promise<{ ok: boolean; error?: string }> => {
      if (!sb) return { ok: false, error: 'El ranking necesita conexión.' };
      const check = validateNickname(rawNickname);
      if (!check.ok) return { ok: false, error: check.reason };
      const session = await ensureSession();
      if (!session) {
        return { ok: false, error: 'No se pudo iniciar sesión. Revisa tu conexión.' };
      }
      const created = await insertProfile(sb, session.user.id, check.value);
      if (!created) {
        return { ok: false, error: 'No se pudo guardar el apodo. Inténtalo de nuevo.' };
      }
      setProfile(created);
      setIsAnonymous(session.user.is_anonymous === true);
      // Ahora que hay fila en players, reintenta lo encolado (incluido lo que
      // quedó en 412 esperando apodo).
      void flushQueue();
      return { ok: true };
    },
    [sb, ensureSession, flushQueue],
  );

  // Cambia el apodo del perfil YA existente (el sheet decide crear vs editar
  // según haya perfil). Apodo distinto ⇒ el trigger asigna un #número nuevo.
  const updateProfile = useCallback(
    async (rawNickname: string): Promise<{ ok: boolean; error?: string }> => {
      if (!sb) return { ok: false, error: 'El ranking necesita conexión.' };
      if (!profile) return { ok: false, error: 'Aún no tienes apodo que cambiar.' };
      const check = validateNickname(rawNickname);
      if (!check.ok) return { ok: false, error: check.reason };
      // Sin cambios: no gastar el viaje (y conservar el discriminador).
      if (check.value === profile.nickname) return { ok: true };
      const updated = await updateNickname(sb, profile.id, check.value);
      if (!updated) {
        return { ok: false, error: 'No se pudo guardar el apodo. Inténtalo de nuevo.' };
      }
      setProfile(updated);
      return { ok: true };
    },
    [sb, profile],
  );

  const submitResult = useCallback(
    async (result: GameResult): Promise<SubmitOutcome> => {
      if (!sb) return { kind: 'disabled' };
      const payload = resultToPayload(result);
      if (!payload) return { kind: 'skipped' };
      const id = submitId(payload);
      const enqueueThis = () =>
        persistQueue(enqueue(queueRef.current, { id, payload, enqueuedAt: Date.now() }));

      const {
        data: { session },
      } = await sb.auth.getSession();
      if (!session) {
        // NO creamos sesión anónima sin opt-in (evita cuentas para quien nunca
        // quiso publicar). Encolamos y pedimos apodo: la sesión nace en
        // createProfile y el flush post-onboarding publica lo encolado.
        enqueueThis();
        return { kind: 'needs-profile' };
      }

      const res = await invokeSubmit(sb, payload, session.access_token);
      const cls = classifySubmit(res.status);
      if (cls === 'ok' && res.data) return { kind: 'ok', data: res.data };
      if (cls === 'discard') return { kind: 'discarded' };

      // needs-profile / needs-session / retry: encolar (no se pierde) y avisar.
      enqueueThis();
      return cls === 'needs-profile' ? { kind: 'needs-profile' } : { kind: 'queued' };
    },
    [sb, persistQueue],
  );

  const linkGoogle = useCallback(async (): Promise<{ ok: boolean; error?: string }> => {
    if (!sb) return { ok: false, error: 'El ranking necesita conexión.' };
    const { error } = await sb.auth.linkIdentity({
      provider: 'google',
      options: { redirectTo: redirectTo() },
    });
    // En éxito el navegador redirige a Google (la promesa puede no resolver); si
    // hay error inmediato (provider mal configurado, red), lo propagamos.
    if (error) return { ok: false, error: 'No se pudo conectar con Google.' };
    return { ok: true };
  }, [sb]);

  const signInGoogle = useCallback(async (): Promise<{ ok: boolean; error?: string }> => {
    if (!sb) return { ok: false, error: 'El ranking necesita conexión.' };
    const { error } = await sb.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: redirectTo() },
    });
    if (error) return { ok: false, error: 'No se pudo conectar con Google.' };
    return { ok: true };
  }, [sb]);

  const openOnboarding = useCallback(() => setOnboardingOpen(true), []);
  const closeOnboarding = useCallback(() => setOnboardingOpen(false), []);

  // Montaje: resolver sesión/perfil, reintentar cola, escuchar cambios de auth y
  // el evento 'online'. Sin sesión ni cola no hay red (seguro en tests).
  useEffect(() => {
    if (!sb) {
      setLoading(false);
      return;
    }
    let active = true;
    void (async () => {
      try {
        await refreshProfile();
      } catch {
        // getSession falló (raro): seguimos sin perfil, sin colgar el loading.
      }
      if (!active) return;
      setLoading(false);
      void flushQueue();
    })();

    const {
      data: { subscription },
    } = sb.auth.onAuthStateChange(() => {
      // signIn (anónimo o Google), refresh de token o vuelta del redirect OAuth:
      // resincroniza el perfil y aprovecha para reintentar la cola.
      void (async () => {
        await refreshProfile();
        void flushQueue();
      })();
    });

    const onOnline = () => void flushQueue();
    window.addEventListener('online', onOnline);
    return () => {
      active = false;
      subscription.unsubscribe();
      window.removeEventListener('online', onOnline);
    };
  }, [sb, refreshProfile, flushQueue]);

  const value = useMemo<OnlineContextValue>(
    () => ({
      enabled,
      loading,
      profile,
      isAnonymous,
      hasSession,
      sessionEmail,
      submitResult,
      createProfile,
      updateProfile,
      linkGoogle,
      signInGoogle,
      onboardingOpen,
      openOnboarding,
      closeOnboarding,
      subscribeOutcome,
    }),
    [
      enabled,
      loading,
      profile,
      isAnonymous,
      hasSession,
      sessionEmail,
      submitResult,
      createProfile,
      updateProfile,
      linkGoogle,
      signInGoogle,
      onboardingOpen,
      openOnboarding,
      closeOnboarding,
      subscribeOutcome,
    ],
  );

  return (
    <OnlineContext.Provider value={value}>
      {children}
      {onboardingOpen && <NicknameSheet />}
    </OnlineContext.Provider>
  );
}
