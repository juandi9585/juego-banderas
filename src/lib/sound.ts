// Motor de audio del juego (docs/design.md §22). Sin librerías: WebAudio con un
// único AudioContext, un GainNode maestro (mute = gain 0/1) y 6 AudioBuffer que
// se cargan perezosamente en el PRIMER gesto del usuario (desbloqueo iOS/Safari).
//
// Contrato duro: `play(id)` NUNCA lanza. Sin AudioContext (jsdom), buffer aún no
// cargado o contexto suspendido → no-op silencioso. El mute es la única fuente de
// verdad, persistida en localStorage `banderas:sound` (ON por defecto).

export type SoundId = 'acierto' | 'racha' | 'fallo' | 'timeout' | 'tick' | 'record';

const SOUND_IDS: readonly SoundId[] = ['acierto', 'racha', 'fallo', 'timeout', 'tick', 'record'];
const STORAGE_KEY = 'banderas:sound';

// ── Estado del módulo ─────────────────────────────────────────────────────────
let muted = loadMuted();
let ctx: AudioContext | null = null;
let masterGain: GainNode | null = null;
let loadStarted = false;
const buffers = new Map<SoundId, AudioBuffer>();
const listeners = new Set<(muted: boolean) => void>();

/** Lee la preferencia persistida. Ausente/ilegible ⇒ ON por defecto (muted=false). */
function loadMuted(): boolean {
  try {
    return localStorage.getItem(STORAGE_KEY) === 'off';
  } catch {
    return false;
  }
}

/** Constructor de AudioContext (con fallback webkit). `undefined` en jsdom/SSR. */
function audioCtor(): typeof AudioContext | undefined {
  if (typeof window === 'undefined') return undefined;
  const w = window as unknown as {
    AudioContext?: typeof AudioContext;
    webkitAudioContext?: typeof AudioContext;
  };
  return w.AudioContext ?? w.webkitAudioContext;
}

/** Crea (una vez) el AudioContext + gain maestro. Devuelve null si no se puede. */
function ensureContext(): AudioContext | null {
  if (ctx) return ctx;
  const Ctor = audioCtor();
  if (!Ctor) return null;
  try {
    ctx = new Ctor();
    masterGain = ctx.createGain();
    masterGain.gain.value = muted ? 0 : 1;
    masterGain.connect(ctx.destination);
  } catch {
    ctx = null;
    masterGain = null;
    return null;
  }
  return ctx;
}

/** Descarga + decodifica los 6 WAV una sola vez. Cada fallo deja ese id sin buffer. */
function loadBuffers(): void {
  const context = ensureContext();
  if (!context || loadStarted) return;
  loadStarted = true;
  for (const id of SOUND_IDS) {
    void (async () => {
      try {
        const res = await fetch(`/sounds/${id}.wav`);
        if (!res.ok) return;
        const bytes = await res.arrayBuffer();
        const buf = await context.decodeAudioData(bytes);
        buffers.set(id, buf);
      } catch {
        // asset ausente o no decodificable: ese sonido queda como no-op.
      }
    })();
  }
}

/** Reproduce un efecto. No-op si mute, sin contexto, sin buffer o si algo falla. */
export function play(id: SoundId): void {
  if (muted) return;
  const context = ctx;
  const gain = masterGain;
  if (!context || !gain) return; // sin AudioContext (jsdom / pre-gesto) → no-op
  if (context.state === 'suspended') void context.resume().catch(() => {});
  const buf = buffers.get(id);
  if (!buf) return; // aún no cargado → no-op
  try {
    const src = context.createBufferSource();
    src.buffer = buf;
    src.connect(gain);
    src.start();
  } catch {
    // WebAudio nunca debe tumbar la UI.
  }
}

/** ¿Está silenciado el sonido? */
export function isMuted(): boolean {
  return muted;
}

/** Fija el mute, lo persiste, aplica al gain y notifica a los suscriptores. */
export function setMuted(next: boolean): void {
  muted = next;
  try {
    localStorage.setItem(STORAGE_KEY, next ? 'off' : 'on');
  } catch {
    // localStorage no disponible: el estado en memoria sigue siendo válido.
  }
  if (masterGain) masterGain.gain.value = next ? 0 : 1;
  // Al ENCENDER el sonido, carga perezosa de los WAV que se saltó el desbloqueo
  // si arrancó muteado (idempotente por loadStarted). El toggle es un gesto de
  // usuario ⇒ el AudioContext puede crearse/reanudarse.
  if (!next) loadBuffers();
  listeners.forEach((l) => l(muted));
}

/** Alterna el mute (para el toggle de la UI). */
export function toggleMuted(): void {
  setMuted(!muted);
}

/** Suscripción para que la UI refleje el estado (usada por `useSoundMuted`). */
export function subscribeMuted(listener: (muted: boolean) => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

// ── Desbloqueo iOS/Safari: crear/resume el contexto en el primer gesto ─────────
function unlock(): void {
  const context = ensureContext();
  if (context && context.state === 'suspended') void context.resume().catch(() => {});
  // Muteado al arrancar ⇒ no gastar los ~55 KB de WAV. Se cargarán en cuanto el
  // usuario encienda el sonido (setMuted(false)).
  if (!muted) loadBuffers();
}

function installUnlock(): void {
  if (typeof document === 'undefined') return;
  const events: (keyof DocumentEventMap)[] = ['pointerdown', 'keydown'];
  const handler = () => {
    try {
      unlock();
    } catch {
      // el desbloqueo es best-effort; nunca debe romper el primer gesto.
    }
    events.forEach((e) => document.removeEventListener(e, handler));
  };
  events.forEach((e) => document.addEventListener(e, handler));
}

installUnlock();
