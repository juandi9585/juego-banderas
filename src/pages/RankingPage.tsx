import { useEffect, useState, type CSSProperties } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { getSupabase } from '../lib/supabase';
import { useGame } from '../features/game/useGame';
import { useOnline } from '../features/online/useOnline';
import { useRecords } from '../features/records/useRecords';
import {
  fetchGlobalLeaderboard,
  fetchGlobalPlayerRank,
  fetchLeaderboard,
  fetchOwnRecord,
  fetchPlayerRank,
} from '../features/online/api';
import { formatDiscriminator } from '../features/online/nickname';
import type { OnlineMode } from '../features/online/types';
import { SegmentedControl, type SegmentOption } from '../components/SegmentedControl';
import { Button } from '../components/Button';
import { countries, TOTAL_COUNTRIES } from '../data/dataset';
import {
  GAME_CATEGORIES,
  filterByCategories,
  type CategoryId,
} from '../features/game/categories';
import { randomSeed } from '../lib/random';
import { timeLimitFor } from '../features/game/score';
import { TrophyIcon } from '../components/TrophyIcon';
import styles from './RankingPage.module.css';

const MODE_OPTIONS: SegmentOption<OnlineMode>[] = [
  { value: 'mixto', label: 'Mixto' },
  { value: 'type-name', label: 'Escrito' },
];

// Qué se hace en cada modo; los segundos por pregunta salen de timeLimitFor
// (única fuente) para que el copy nunca se desincronice del countdown real.
const MODE_HINT: Record<OnlineMode, string> = {
  mixto: 'Toca la opción correcta.',
  'type-name': 'Escribe el nombre de cada país.',
};

// Partida competitiva: min(20, pool), récord por (categoría, modo).
const MAX_QUESTIONS = 20;

// Tamaño del pool por categoría (una vez; el dataset no cambia en runtime). Con
// él se calcula el nº de preguntas honesto del hint: q = min(20, pool).
const POOL_SIZE: Record<string, number> = Object.fromEntries(
  GAME_CATEGORIES.map((cat) => [cat.id, filterByCategories([cat.id], countries).length]),
);

const questionsFor = (id: CategoryId) => Math.min(MAX_QUESTIONS, POOL_SIZE[id]);

// Selección del selector de zona: una categoría real o la vista agregada Global.
type ZoneSel = CategoryId | 'global';

// Zona y modo viven en la URL (?zona=europa&modo=escrito): la página es
// deep-linkable desde Mis récords y el resultado de una partida. 'escrito' es
// el alias legible de 'type-name'; valores desconocidos caen al por defecto.
const ZONE_IDS = new Set<string>(GAME_CATEGORIES.map((c) => c.id));
const parseZone = (raw: string | null): ZoneSel =>
  raw != null && ZONE_IDS.has(raw) ? (raw as CategoryId) : 'global';
const parseMode = (raw: string | null): OnlineMode =>
  raw === 'escrito' ? 'type-name' : 'mixto';

// Orden de los chips: Global (insignia) · Mundo · continentes · sectores.
const CONTINENTES = GAME_CATEGORIES.filter(
  (c) => c.group === 'continente' && c.id !== 'mundo',
);
const SECTORES = GAME_CATEGORIES.filter((c) => c.group === 'sector');
const LABEL: Record<string, string> = Object.fromEntries(
  GAME_CATEGORIES.map((c) => [c.id, c.label]),
);
const zoneLabel = (z: ZoneSel) => (z === 'global' ? 'Global' : LABEL[z]);

const fmt = (n: number) => n.toLocaleString('es-ES');
const coverage = (n: number) => `${n} ${n === 1 ? 'zona' : 'zonas'}`;

/** ¿No hay red (sin cliente o navegador offline)? Se relee en cada fetch. */
function isOffline(sb: unknown): boolean {
  return !sb || (typeof navigator !== 'undefined' && navigator.onLine === false);
}

// Fila común de tabla (zona o global). `zones` solo viene en la vista Global.
interface BoardRow {
  puesto: number;
  player_id: string;
  nickname: string;
  points: number;
  zones?: number;
}
// Tu fila (fuera del top): unifica zona (rank + record) y global (una RPC).
interface PersonalRow {
  puesto: number;
  total_jugadores: number;
  points: number;
  zones?: number;
}

type BoardStatus = 'loading' | 'ok' | 'error' | 'offline';
type Records = ReturnType<typeof useRecords>;

/** Suma local de tus mejores marcas por zona (fallback offline de Global). */
function localGlobal(records: Records, mode: OnlineMode): { points: number; zones: number } | null {
  let points = 0;
  let zones = 0;
  for (const cat of GAME_CATEGORIES) {
    const best = records.getBest(cat.id, mode);
    if (best) {
      points += best.points;
      zones += 1;
    }
  }
  return zones > 0 ? { points, zones } : null;
}

/**
 * Módulo Competitivo (antes "Ranking"; docs/design.md §19.4): el hub donde se
 * compite Y se consulta. Selector de zona en fila de chips (Global · Mundo ·
 * continentes · sectores) + switch Mixto | Escrito; el board muestra el top de
 * la zona con tu puesto (o tu récord local si no publicas), y el CTA sticky
 * "Comenzar" arranca una partida de esa misma (zona, modo) — la vista de
 * selección duplicada de Jugar>Competitivo se retiró a favor de esta página.
 * Global agrega tus mejores marcas por zona (mecánica de completar el álbum) y
 * no es jugable. Estados: cargando / vacío / error / sin conexión (aviso +
 * récords LOCALES) / recarga al volver la red.
 */
export function RankingPage() {
  const online = useOnline();
  const records = useRecords();
  const navigate = useNavigate();
  const { startGame } = useGame();

  // Zona y modo canónicos en la URL; /ranking a secas = Global + Mixto.
  const [searchParams, setSearchParams] = useSearchParams();
  const zone = parseZone(searchParams.get('zona'));
  const mode = parseMode(searchParams.get('modo'));
  const [reloadKey, setReloadKey] = useState(0);

  // replace: cambiar de chip/modo no apila historial (atrás sale de la página).
  function updateParams(z: ZoneSel, m: OnlineMode) {
    const params = new URLSearchParams();
    if (z !== 'global') params.set('zona', z);
    if (m === 'type-name') params.set('modo', 'escrito');
    setSearchParams(params, { replace: true });
  }
  const setZone = (z: ZoneSel) => updateParams(z, mode);
  const setMode = (m: OnlineMode) => updateParams(zone, m);

  function handleStart() {
    if (zone === 'global') return; // Global es agregado, no zona jugable
    startGame({
      mode,
      categories: [zone], // exactamente una (invariante): clave del récord
      questionCount: MAX_QUESTIONS, // el motor recorta al pool → min(20, pool)
      competitive: { seed: randomSeed() },
    });
    // Cross-fade al arrancar la partida (§23.5); corte seco si no hay soporte
    // o reduced-motion (el CSS salta la animación).
    navigate('/jugar', { viewTransition: true });
  }

  // Board público (top): su estado NO depende del fetch personal.
  const [boardStatus, setBoardStatus] = useState<BoardStatus>('loading');
  const [rows, setRows] = useState<BoardRow[]>([]);
  // Tu fila (puesto/marca), aislada del board — si falla, el top se muestra igual.
  const [personal, setPersonal] = useState<PersonalRow | null>(null);

  const playerId = online.profile?.id ?? null;
  const reload = () => setReloadKey((k) => k + 1);

  // Vuelta del OAuth (redirectTo = /ranking): sesión conectada pero sin apodo →
  // abrir el sheet solo. Es la continuación del flujo que el usuario inició en
  // Google; sin esto tenía que descubrir el botón por su cuenta. Cerrarlo con
  // "Ahora no" no lo reabre (las deps no cambian hasta la próxima visita).
  const { enabled, loading, hasSession, profile, openOnboarding } = online;
  useEffect(() => {
    if (enabled && !loading && hasSession && profile == null) openOnboarding();
  }, [enabled, loading, hasSession, profile, openOnboarding]);

  // Efecto BOARD: top público de la zona o de Global. No depende de playerId.
  useEffect(() => {
    const sb = getSupabase();
    if (isOffline(sb)) {
      setBoardStatus('offline');
      setRows([]);
      return;
    }
    let active = true;
    setBoardStatus('loading');
    void (async () => {
      try {
        const data: BoardRow[] =
          zone === 'global'
            ? (await fetchGlobalLeaderboard(sb!, mode)).map((r) => ({
                puesto: r.puesto,
                player_id: r.player_id,
                nickname: r.nickname,
                points: r.points,
                zones: r.zones,
              }))
            : (await fetchLeaderboard(sb!, zone, mode)).map((r) => ({
                puesto: r.puesto,
                player_id: r.player_id,
                nickname: r.nickname,
                points: r.points,
              }));
        if (!active) return;
        setRows(data);
        setBoardStatus('ok');
      } catch {
        if (!active) return;
        setBoardStatus('error');
      }
    })();
    return () => {
      active = false;
    };
  }, [zone, mode, reloadKey]);

  // Efecto PERSONAL: tu puesto + tu marca. Su fallo no toca el board.
  useEffect(() => {
    const sb = getSupabase();
    if (isOffline(sb) || !playerId) {
      setPersonal(null);
      return;
    }
    let active = true;
    void (async () => {
      try {
        if (zone === 'global') {
          const r = await fetchGlobalPlayerRank(sb!, mode, playerId);
          if (!active) return;
          setPersonal(
            r
              ? { puesto: r.puesto, total_jugadores: r.total_jugadores, points: r.points, zones: r.zones }
              : null,
          );
        } else {
          const [rank, record] = await Promise.all([
            fetchPlayerRank(sb!, zone, mode, playerId),
            fetchOwnRecord(sb!, playerId, zone, mode),
          ]);
          if (!active) return;
          setPersonal(
            rank && record
              ? { puesto: rank.puesto, total_jugadores: rank.total_jugadores, points: record.points }
              : null,
          );
        }
      } catch {
        // Degrada solo "tu fila"; el board público sigue en pie.
        if (!active) return;
        setPersonal(null);
      }
    })();
    return () => {
      active = false;
    };
  }, [zone, mode, reloadKey, playerId]);

  // Al recuperar la red, recarga sola (sin quedar atascado en "necesita conexión").
  useEffect(() => {
    const onOnline = () => reload();
    window.addEventListener('online', onOnline);
    return () => window.removeEventListener('online', onOnline);
  }, []);

  const isGlobal = zone === 'global';
  const inTop = playerId ? rows.some((r) => r.player_id === playerId) : false;
  const showYourRow = online.profile != null && personal != null && !inTop;
  // Tu marca LOCAL de la zona: la comparación récord-vs-top funciona aunque no
  // publiques online (sin apodo o con el fetch personal caído).
  const localBest = isGlobal ? null : records.getBest(zone, mode);

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div>
          <p className={styles.eyebrow}>Contrarreloj · {TOTAL_COUNTRIES} países</p>
          <h1 className={styles.title}>Competitivo</h1>
        </div>
        {/* Emblema del módulo: trofeo como pegatina ladeada (patrón del
            masthead de Jugar). */}
        <span className={styles.emblem} aria-hidden="true">
          <TrophyIcon />
        </span>
      </header>

      {online.enabled && !online.loading && <ProfileBar />}

      <div>
        <SegmentedControl
          label="Modo de juego"
          options={MODE_OPTIONS}
          value={mode}
          onChange={setMode}
        />
        {/* aria-live: al cambiar de modo, el lector anuncia qué se juega y con
            cuánto tiempo (el hint es la única descripción del modo elegido). */}
        <p className={styles.modeHint} aria-live="polite">
          {MODE_HINT[mode]} {timeLimitFor(mode) / 1000} segundos por pregunta.
        </p>
      </div>

      {/* Selector de zona: fila de chips-pegatina deslizable, radios NATIVOS
          (flechas + un solo tab-stop). Global va primero, con el glifo de marca. */}
      <div className={styles.zones} role="radiogroup" aria-label="Zona del ranking">
        <ZoneChip value="global" label="Global" zone={zone} onSelect={setZone} />
        <ZoneChip value="mundo" label={LABEL['mundo']} zone={zone} onSelect={setZone} />
        {CONTINENTES.map((cat) => (
          <ZoneChip key={cat.id} value={cat.id} label={cat.label} zone={zone} onSelect={setZone} />
        ))}
        {SECTORES.map((cat) => (
          <ZoneChip key={cat.id} value={cat.id} label={cat.label} zone={zone} onSelect={setZone} />
        ))}
      </div>

      <section aria-label={`Clasificación de ${zoneLabel(zone)}`}>
        <div className={styles.boardHead}>
          <h2 className={styles.boardTitle}>
            {zoneLabel(zone)}{' '}
            <span className={styles.boardMode}>
              · {mode === 'mixto' ? 'Mixto' : 'Escrito'}
            </span>
          </h2>
          {/* La línea de ayuda del board: en Global explica la mecánica del
              álbum; en una zona canta el tamaño de la partida (min(20, pool)). */}
          {isGlobal ? (
            <p className={styles.boardHint}>
              Tu mejor marca en cada zona, sumada. Cubre más zonas para subir.
            </p>
          ) : (
            <p className={styles.boardHint}>
              Partida de {questionsFor(zone)} preguntas.
            </p>
          )}
        </div>

        <div aria-live="polite">
          {boardStatus === 'offline' && (
            <OfflineFallback
              local={zone === 'global' ? localGlobal(records, mode) : records.getBest(zone, mode)}
              isGlobal={isGlobal}
              onRetry={reload}
            />
          )}

          {boardStatus === 'loading' && (
            <p className={styles.stateNote}>Cargando clasificación…</p>
          )}

          {boardStatus === 'error' && (
            <div className={styles.stateBox}>
              <p className={styles.stateNote}>No se pudo cargar el ranking.</p>
              <Button variant="secondary" onClick={reload}>
                Reintentar
              </Button>
            </div>
          )}

          {boardStatus === 'ok' && rows.length === 0 && (
            <p className={styles.stateNote}>
              {isGlobal
                ? 'Nadie ha sumado marcas todavía. ¡Sé el primero!'
                : 'Nadie ha competido aún en esta zona. ¡Sé el primero!'}
            </p>
          )}

          {boardStatus === 'ok' && rows.length > 0 && (
            <ol className={styles.board}>
              {rows.map((row) => (
                <li
                  key={row.player_id}
                  className={
                    row.player_id === playerId ? `${styles.row} ${styles.isYou}` : styles.row
                  }
                >
                  <span className={styles.rank}>{row.puesto}</span>
                  <span className={styles.name}>
                    {row.nickname}
                    {row.player_id === playerId && <span className={styles.youTag}>Tú</span>}
                  </span>
                  <span className={styles.scoreCell}>
                    <span className={styles.points}>{fmt(row.points)}</span>
                    {row.zones != null && (
                      <span className={styles.cover}>{coverage(row.zones)}</span>
                    )}
                  </span>
                </li>
              ))}

              {/* Tu fila, si tienes marca pero quedaste fuera del top visible. */}
              {showYourRow && personal && (
                <li className={`${styles.row} ${styles.isYou} ${styles.yourRowApart}`}>
                  <span className={styles.rank}>{personal.puesto}</span>
                  <span className={styles.name}>
                    {online.profile?.nickname}
                    <span className={styles.youTag}>Tú</span>
                    <span className={styles.ofTotal}>de {fmt(personal.total_jugadores)}</span>
                  </span>
                  <span className={styles.scoreCell}>
                    <span className={styles.points}>{fmt(personal.points)}</span>
                    {personal.zones != null && (
                      <span className={styles.cover}>{coverage(personal.zones)}</span>
                    )}
                  </span>
                </li>
              )}
            </ol>
          )}

          {/* Sin fila personal del servidor (sin apodo, o su fetch cayó): tu
              récord local mantiene viva la comparación con el top. */}
          {boardStatus === 'ok' && !isGlobal && !inTop && personal == null && localBest && (
            <p className={styles.localRecord}>
              Tu récord local aquí: <strong>{fmt(localBest.points)} pts</strong>
            </p>
          )}
        </div>
      </section>

      <Link to="/records" className={styles.recordsLink}>
        Ver todos mis récords
      </Link>

      {/* CTA sticky (migrado de Jugar>Competitivo): arranca una partida de la
          (zona, modo) que se está consultando. Global no es jugable. */}
      <div className={styles.startBar}>
        <Button onClick={handleStart} disabled={isGlobal}>
          Comenzar
        </Button>
        <p className={styles.startHint}>
          {isGlobal
            ? 'Elige una zona para competir.'
            : `${zoneLabel(zone)} · ${questionsFor(zone)} preguntas`}
        </p>
      </div>
    </div>
  );
}

/** Punto de entrada al perfil propio: apodo (+#disc oculto salvo aquí) y upgrade. */
function ProfileBar() {
  const { profile, isAnonymous, hasSession, sessionEmail, openOnboarding, linkGoogle, signInGoogle } =
    useOnline();
  const [googleError, setGoogleError] = useState<string | null>(null);

  async function connectGoogle(action: () => Promise<{ ok: boolean; error?: string }>) {
    setGoogleError(null);
    const res = await action();
    if (!res.ok) setGoogleError(res.error ?? 'No se pudo conectar con Google.');
  }

  if (!profile) {
    // Sesión viva sin apodo: la vuelta del OAuth de Google. Sin esta rama la
    // tarjeta era idéntica a "sin cuenta" y el login parecía no haber hecho nada.
    if (hasSession) {
      return (
        <div className={styles.profile}>
          <p className={styles.profileLead}>
            {sessionEmail ? `Cuenta conectada (${sessionEmail}). ` : 'Cuenta conectada. '}
            Solo falta tu apodo para aparecer en la clasificación.
          </p>
          <div className={styles.profileActions}>
            <Button onClick={openOnboarding}>Elegir apodo</Button>
          </div>
        </div>
      );
    }
    return (
      <div className={styles.profile}>
        <p className={styles.profileLead}>
          Crea un apodo para aparecer en la clasificación.
        </p>
        <div className={styles.profileActions}>
          <Button onClick={openOnboarding}>Crear apodo</Button>
          <button
            type="button"
            className={styles.textLink}
            onClick={() => void connectGoogle(signInGoogle)}
          >
            ¿Ya juegas en otro dispositivo? Inicia sesión con Google
          </button>
        </div>
        {googleError && (
          <p className={styles.googleError} role="alert">
            {googleError}
          </p>
        )}
      </div>
    );
  }

  return (
    <div className={styles.profile}>
      <div className={styles.profileId}>
        <span className={styles.profileNick}>{profile.nickname}</span>
        <span className={styles.profileDisc}>{formatDiscriminator(profile.discriminator)}</span>
        {/* Reabre el sheet, que con perfil existente entra en modo edición. */}
        <button
          type="button"
          className={`${styles.textLink} ${styles.profileEdit}`}
          onClick={openOnboarding}
        >
          Editar apodo
        </button>
      </div>
      {isAnonymous && (
        <div className={styles.profileActions}>
          <Button variant="secondary" onClick={() => void connectGoogle(linkGoogle)}>
            Guardar progreso con Google
          </Button>
        </div>
      )}
      {googleError && (
        <p className={styles.googleError} role="alert">
          {googleError}
        </p>
      )}
    </div>
  );
}

/** Glifo de globo (círculo + meridiano + ecuador): la marca del álbum, para Global. */
function GlobeGlyph() {
  return (
    <svg
      className={styles.chipGlobe}
      viewBox="0 0 24 24"
      width="18"
      height="18"
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <circle cx="12" cy="12" r="9" />
      <ellipse cx="12" cy="12" rx="4.2" ry="9" />
      <line x1="3" y1="12" x2="21" y2="12" />
    </svg>
  );
}

/** Chip-pegatina de zona: label con radio NATIVO oculto. Global lleva el globo. */
function ZoneChip({
  value,
  label,
  zone,
  onSelect,
}: {
  value: ZoneSel;
  label: string;
  zone: ZoneSel;
  onSelect: (z: ZoneSel) => void;
}) {
  const selected = zone === value;
  return (
    <label className={styles.chip}>
      <input
        type="radio"
        name="zona-ranking"
        className={styles.radio}
        value={value}
        checked={selected}
        onChange={() => onSelect(value)}
      />
      {value === 'global' ? (
        <GlobeGlyph />
      ) : (
        <span
          className={styles.chipShape}
          style={{ '--shape-src': `url(/shapes/zones/${value}.svg)` } as CSSProperties}
          aria-hidden="true"
        />
      )}
      {label}
    </label>
  );
}

/** Sin conexión / sin config: aviso + tu marca LOCAL (récord de zona o total global) + Reintentar. */
function OfflineFallback({
  local,
  isGlobal,
  onRetry,
}: {
  local: { points: number; zones?: number } | null;
  isGlobal: boolean;
  onRetry: () => void;
}) {
  return (
    <div className={styles.stateBox}>
      <p className={styles.stateNote}>El ranking necesita conexión.</p>
      {local ? (
        <p className={styles.localRecord}>
          {isGlobal && local.zones != null ? (
            <>
              Tu total local: <strong>{fmt(local.points)} pts</strong> en {coverage(local.zones)}
            </>
          ) : (
            <>
              Tu récord local aquí: <strong>{fmt(local.points)} pts</strong>
            </>
          )}
        </p>
      ) : (
        <p className={styles.localRecord}>
          {isGlobal
            ? 'Aún no tienes marcas locales.'
            : 'Aún no tienes récord local en esta zona.'}
        </p>
      )}
      <Button variant="secondary" onClick={onRetry}>
        Reintentar
      </Button>
    </div>
  );
}
