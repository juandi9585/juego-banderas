// Edge Function submit-score — validación server-side de partidas competitivas.
// Contrato: docs/roadmap.md §C (anti-trampas) y docs/competitivo.md §5 Fase 2.
//
// El cliente envía { seed, categoryId, mode, answers[] } con su JWT. Aquí se
// RECONSTRUYE la ronda con la misma seed y el mismo motor puro (bundle
// _shared/engine.mjs generado desde src/ con `npm run engine:server`) y se
// RECOMPUTA el puntaje: nunca se confía en puntos calculados por el cliente
// (de hecho ni se envían). La corrección de cada respuesta también se decide
// aquí (checkChoice / checkTypedAnswer contra la ronda reconstruida).
//
// Escritura: SOLO esta función escribe en `records` (service_role salta RLS;
// la tabla no tiene políticas de escritura). Se guarda la mejor marca por
// (jugador, categoría, modo) con los MISMOS criterios que isBetter() local.
//
// Límite conocido (aceptado por diseño, offline-first): la seed la genera el
// cliente y elapsedMs no es verificable en servidor — un cliente hostil puede
// fabricar tiempos. La revalidación cierra el fraude burdo (puntos inventados,
// respuestas imposibles, longitudes falsas); rate-limiting fino queda para
// endurecimiento posterior.

import { createClient } from 'npm:@supabase/supabase-js@2';
// deno-lint-ignore-file no-explicit-any
// @ts-ignore — bundle generado sin tipos (npm run engine:server).
import {
  buildQuiz,
  checkChoice,
  checkTypedAnswer,
  computeScore,
  countries,
  GAME_CATEGORIES,
  isBetter,
  mulberry32,
  timeLimitFor,
} from '../_shared/engine.mjs';

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

function json(status: number, body: unknown): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...CORS, 'Content-Type': 'application/json' },
  });
}

const MODOS_VALIDOS = new Set(['mixto', 'type-name']);
// Holgura sobre el límite del modo: el timeout del cliente dispara unos ms
// tarde (tick del countdown, lag del dispositivo) y no debe invalidar la ronda.
const ELAPSED_SLACK_MS = 5_000;

interface RawAnswer {
  givenCode?: unknown;
  givenText?: unknown;
  elapsedMs?: unknown;
  timedOut?: unknown;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: CORS });
  if (req.method !== 'POST') return json(405, { ok: false, error: 'metodo-no-permitido' });

  const supabaseUrl = Deno.env.get('SUPABASE_URL')!;

  // ── 1. Identidad: el JWT del jugador (el gateway ya verificó la firma) ────
  const authHeader = req.headers.get('Authorization') ?? '';
  const userClient = createClient(supabaseUrl, Deno.env.get('SUPABASE_ANON_KEY')!, {
    global: { headers: { Authorization: authHeader } },
    auth: { persistSession: false },
  });
  const {
    data: { user },
    error: userError,
  } = await userClient.auth.getUser();
  if (userError || !user) return json(401, { ok: false, error: 'sin-sesion' });

  // ── 2. Payload ────────────────────────────────────────────────────────────
  let body: {
    seed?: unknown;
    categoryId?: unknown;
    mode?: unknown;
    answers?: unknown;
  };
  try {
    body = await req.json();
  } catch {
    return json(400, { ok: false, error: 'cuerpo-invalido' });
  }

  const { seed, categoryId, mode } = body;
  if (!Number.isInteger(seed) || (seed as number) < 0 || (seed as number) > 0xffffffff) {
    return json(422, { ok: false, error: 'seed-invalida' });
  }
  if (typeof mode !== 'string' || !MODOS_VALIDOS.has(mode)) {
    return json(422, { ok: false, error: 'modo-invalido' });
  }
  if (
    typeof categoryId !== 'string' ||
    !GAME_CATEGORIES.some((c: { id: string }) => c.id === categoryId)
  ) {
    return json(422, { ok: false, error: 'categoria-invalida' });
  }
  if (!Array.isArray(body.answers) || body.answers.length === 0 || body.answers.length > 20) {
    return json(422, { ok: false, error: 'respuestas-invalidas' });
  }
  const rawAnswers = body.answers as RawAnswer[];

  // ── 3. Reconstrucción de la ronda (misma receta que GameProvider) ─────────
  const config = {
    mode,
    categories: [categoryId],
    questionCount: 20, // invariante competitivo; buildQuiz recorta al pool
    competitive: { seed },
  };
  const questions = buildQuiz(countries, config, mulberry32(seed as number));
  if (rawAnswers.length !== questions.length) {
    // min(20, pool) no coincide → partida truncada o categoría manipulada.
    return json(422, { ok: false, error: 'longitud-no-coincide' });
  }

  const maxElapsed = timeLimitFor(mode) + ELAPSED_SLACK_MS;
  const rebuilt = [];
  for (let i = 0; i < questions.length; i++) {
    const q = questions[i];
    const a = rawAnswers[i];
    if (typeof a !== 'object' || a === null) {
      return json(422, { ok: false, error: 'respuesta-invalida', indice: i });
    }
    const elapsedMs = a.elapsedMs;
    if (
      typeof elapsedMs !== 'number' ||
      !Number.isFinite(elapsedMs) ||
      elapsedMs < 0 ||
      elapsedMs > maxElapsed
    ) {
      return json(422, { ok: false, error: 'tiempo-invalido', indice: i });
    }
    if (a.givenCode !== undefined && (typeof a.givenCode !== 'string' || a.givenCode.length > 8)) {
      return json(422, { ok: false, error: 'respuesta-invalida', indice: i });
    }
    if (a.givenText !== undefined && (typeof a.givenText !== 'string' || a.givenText.length > 200)) {
      return json(422, { ok: false, error: 'respuesta-invalida', indice: i });
    }

    // La corrección se decide AQUÍ, contra la ronda reconstruida.
    const timedOut = a.timedOut === true;
    const correct = timedOut
      ? false
      : q.kind === 'multiple-choice'
        ? typeof a.givenCode === 'string' && checkChoice(q, a.givenCode)
        : typeof a.givenText === 'string' && checkTypedAnswer(q, a.givenText);

    rebuilt.push({
      questionId: q.id,
      correct,
      correctCode: q.correctCode,
      givenCode: typeof a.givenCode === 'string' ? a.givenCode : undefined,
      givenText: typeof a.givenText === 'string' ? a.givenText : undefined,
      elapsedMs,
      timedOut,
    });
  }

  // ── 4. Recomputar el puntaje (autoritativo) ───────────────────────────────
  const score = computeScore({
    config,
    total: questions.length,
    correctCount: rebuilt.filter((r) => r.correct).length,
    answers: rebuilt,
  });

  // ── 5. Persistir la mejor marca ───────────────────────────────────────────
  const service = createClient(supabaseUrl, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!, {
    auth: { persistSession: false },
  });

  const { data: player, error: playerError } = await service
    .from('players')
    .select('id')
    .eq('id', user.id)
    .maybeSingle();
  // Un error aquí es infraestructura (p. ej. grants), no "sin perfil": que no
  // se disfrace de 412 — el cliente reaccionaría pidiendo apodo en vano.
  if (playerError) return json(500, { ok: false, error: 'error-al-leer' });
  if (!player) return json(412, { ok: false, error: 'perfil-requerido' });

  const { data: existing, error: readError } = await service
    .from('records')
    .select('points, correct, duration_ms')
    .match({ player_id: user.id, category_id: categoryId, mode })
    .maybeSingle();
  if (readError) return json(500, { ok: false, error: 'error-al-leer' });

  const candidate = {
    points: score.points,
    correct: score.correct,
    total: score.total,
    maxStreak: score.maxStreak,
    durationMs: score.answeredMs,
    achievedAt: 0,
  };
  const newRecord =
    !existing ||
    isBetter(candidate, {
      points: existing.points,
      correct: existing.correct,
      total: 0,
      maxStreak: 0,
      durationMs: existing.duration_ms,
      achievedAt: 0,
    });

  if (newRecord) {
    const { error: writeError } = await service.from('records').upsert({
      player_id: user.id,
      category_id: categoryId,
      mode,
      points: score.points,
      correct: score.correct,
      total: score.total,
      max_streak: score.maxStreak,
      duration_ms: score.answeredMs,
      seed,
      achieved_at: new Date().toISOString(),
    });
    if (writeError) return json(500, { ok: false, error: 'error-al-guardar' });
  }

  // ── 6. Puesto actual (esté o no en el top) ────────────────────────────────
  const { data: rank } = await service.rpc('get_player_rank', {
    p_category_id: categoryId,
    p_mode: mode,
    p_player_id: user.id,
  });
  const puesto = rank?.[0]?.puesto ?? null;
  const totalJugadores = rank?.[0]?.total_jugadores ?? null;

  return json(200, {
    ok: true,
    // Puntaje AUTORITATIVO del servidor (puede diferir del local si el bundle
    // y el cliente estuvieran desincronizados; manda el servidor).
    points: score.points,
    correct: score.correct,
    total: score.total,
    maxStreak: score.maxStreak,
    durationMs: score.answeredMs,
    newRecord,
    puesto,
    totalJugadores,
  });
});
