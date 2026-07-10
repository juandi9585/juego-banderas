import { useEffect, useState, type CSSProperties } from 'react';
import { getSupabase } from '../lib/supabase';
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
import { TOTAL_COUNTRIES } from '../data/dataset';
import { GAME_CATEGORIES, type CategoryId } from '../features/game/categories';
import { TrophyIcon } from '../components/TrophyIcon';
import styles from './RankingPage.module.css';

const MODE_OPTIONS: SegmentOption<OnlineMode>[] = [
  { value: 'mixto', label: 'Mixto' },
  { value: 'type-name', label: 'Escrito' },
];

// Selección del selector de zona: una categoría real o la vista agregada Global.
type ZoneSel = CategoryId | 'global';

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
 * Módulo Ranking (docs/roadmap.md §C, design.md §19.1): tercer enlace del nav.
 * Selector de zona en fila de chips (Global · Mundo · continentes · sectores) +
 * switch Mixto | Escrito. Global agrega tus mejores marcas por zona (mecánica de
 * completar el álbum); las zonas muestran el top por (zona, modo). En ambos: tu
 * puesto aunque no estés en el top. Estados: cargando / vacío / error / sin
 * conexión (aviso + récords LOCALES) / recarga al volver la red.
 */
export function RankingPage() {
  const online = useOnline();
  const records = useRecords();

  const [mode, setMode] = useState<OnlineMode>('mixto');
  // Global es la vista por defecto al entrar (la carta insignia).
  const [zone, setZone] = useState<ZoneSel>('global');
  const [reloadKey, setReloadKey] = useState(0);

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

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div>
          <p className={styles.eyebrow}>Clasificación · {TOTAL_COUNTRIES} países</p>
          <h1 className={styles.title}>Ranking</h1>
        </div>
        {/* Emblema del módulo: el mismo trofeo de la pestaña Competitivo, como
            pegatina ladeada (patrón del masthead de Jugar). */}
        <span className={styles.emblem} aria-hidden="true">
          <TrophyIcon />
        </span>
      </header>

      {online.enabled && !online.loading && <ProfileBar />}

      <SegmentedControl
        label="Modo de juego"
        options={MODE_OPTIONS}
        value={mode}
        onChange={setMode}
      />

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
          {isGlobal && (
            <p className={styles.boardHint}>
              Tu mejor marca en cada zona, sumada. Cubre más zonas para subir.
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
        </div>
      </section>
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
