import { useEffect, useState, type CSSProperties } from 'react';
import { getSupabase } from '../lib/supabase';
import { useOnline } from '../features/online/useOnline';
import { useRecords } from '../features/records/useRecords';
import {
  fetchLeaderboard,
  fetchOwnRecord,
  fetchPlayerRank,
} from '../features/online/api';
import { formatDiscriminator } from '../features/online/nickname';
import type {
  LeaderboardRow,
  OnlineMode,
  OwnRecordRow,
  PlayerRank,
} from '../features/online/types';
import { SegmentedControl, type SegmentOption } from '../components/SegmentedControl';
import { Button } from '../components/Button';
import { TOTAL_COUNTRIES } from '../data/dataset';
import { GAME_CATEGORIES, type CategoryId } from '../features/game/categories';
import styles from './RankingPage.module.css';

const MODE_OPTIONS: SegmentOption<OnlineMode>[] = [
  { value: 'mixto', label: 'Mixto' },
  { value: 'type-name', label: 'Escrito' },
];

// Mismo reparto de zonas que el panel competitivo (docs/design.md §19.4): Mundo
// destacado, luego Continentes y Sectores.
const CONTINENTES = GAME_CATEGORIES.filter(
  (c) => c.group === 'continente' && c.id !== 'mundo',
);
const SECTORES = GAME_CATEGORIES.filter((c) => c.group === 'sector');
const WORLD = GAME_CATEGORIES.find((c) => c.id === 'mundo')!;
const LABEL: Record<string, string> = Object.fromEntries(
  GAME_CATEGORIES.map((c) => [c.id, c.label]),
);

const fmt = (n: number) => n.toLocaleString('es-ES');

/** ¿No hay red (sin cliente o navegador offline)? Se relee en cada fetch. */
function isOffline(sb: unknown): boolean {
  return !sb || (typeof navigator !== 'undefined' && navigator.onLine === false);
}

type BoardStatus = 'loading' | 'ok' | 'error' | 'offline';

/**
 * Módulo Ranking (docs/roadmap.md §C, design.md §19.1): tercer enlace del nav.
 * Selector de zona (lenguaje del ledger competitivo) + switch Mixto | Escrito,
 * top 50 por (zona, modo) y tu puesto aunque no estés en el top. Estados: sin
 * conexión / sin config → aviso + récords LOCALES como fallback; vacío; error.
 * Consultar no es jugar: esta ruta no arranca partidas.
 */
export function RankingPage() {
  const online = useOnline();
  const records = useRecords();

  const [mode, setMode] = useState<OnlineMode>('mixto');
  const [zone, setZone] = useState<CategoryId>('mundo');
  const [reloadKey, setReloadKey] = useState(0);

  // Board público (top): su estado NO depende del fetch personal.
  const [boardStatus, setBoardStatus] = useState<BoardStatus>('loading');
  const [rows, setRows] = useState<LeaderboardRow[]>([]);

  // Fila personal (tu puesto/marca): aislada del board — si falla, el top se
  // muestra igual y solo se degrada "tu fila".
  const [playerRank, setPlayerRank] = useState<PlayerRank | null>(null);
  const [ownRecord, setOwnRecord] = useState<OwnRecordRow | null>(null);

  const playerId = online.profile?.id ?? null;
  const reload = () => setReloadKey((k) => k + 1);

  // Efecto BOARD: top público. No depende de playerId (así no re-fetchea el
  // board cuando el perfil resuelve async).
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
        const data = await fetchLeaderboard(sb!, zone, mode);
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
      setPlayerRank(null);
      setOwnRecord(null);
      return;
    }
    let active = true;
    void (async () => {
      try {
        const [rank, record] = await Promise.all([
          fetchPlayerRank(sb!, zone, mode, playerId),
          fetchOwnRecord(sb!, playerId, zone, mode),
        ]);
        if (!active) return;
        setPlayerRank(rank);
        setOwnRecord(record);
      } catch {
        // Degrada solo "tu fila"; el board público sigue en pie.
        if (!active) return;
        setPlayerRank(null);
        setOwnRecord(null);
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

  const inTop = playerId ? rows.some((r) => r.player_id === playerId) : false;
  const showYourRow =
    online.profile != null && playerRank != null && ownRecord != null && !inTop;

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <p className={styles.eyebrow}>Clasificación · {TOTAL_COUNTRIES} países</p>
        <h1 className={styles.title}>Ranking</h1>
      </header>

      {online.enabled && !online.loading && <ProfileBar />}

      <SegmentedControl
        label="Modo de juego"
        options={MODE_OPTIONS}
        value={mode}
        onChange={setMode}
      />

      {/* Selector de zona: radios NATIVOS (flechas + un solo tab-stop), mismo
          lenguaje visual que el ledger competitivo (§19.4). */}
      <div className={styles.ledger} role="radiogroup" aria-label="Zona del ranking">
        <ZoneRow cat={WORLD} zone={zone} onSelect={setZone} />
        <p className={styles.groupRow}>Continentes</p>
        {CONTINENTES.map((cat) => (
          <ZoneRow key={cat.id} cat={cat} zone={zone} onSelect={setZone} />
        ))}
        <p className={styles.groupRow}>Sectores</p>
        {SECTORES.map((cat) => (
          <ZoneRow key={cat.id} cat={cat} zone={zone} onSelect={setZone} />
        ))}
      </div>

      <section aria-label={`Clasificación de ${LABEL[zone]}`}>
        <h2 className={styles.boardTitle}>
          {LABEL[zone]}{' '}
          <span className={styles.boardMode}>
            · {mode === 'mixto' ? 'Mixto' : 'Escrito'}
          </span>
        </h2>

        <div aria-live="polite">
          {boardStatus === 'offline' && (
            <OfflineFallback local={records.getBest(zone, mode)} onRetry={reload} />
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
              Nadie ha competido aún en esta zona. ¡Sé el primero!
            </p>
          )}

          {boardStatus === 'ok' && rows.length > 0 && (
            <ol className={styles.board}>
              {rows.map((row) => (
                <li
                  key={row.player_id}
                  className={
                    row.player_id === playerId
                      ? `${styles.row} ${styles.isYou}`
                      : styles.row
                  }
                >
                  <span className={styles.rank}>{row.puesto}</span>
                  <span className={styles.name}>
                    {row.nickname}
                    {row.player_id === playerId && (
                      <span className={styles.youTag}>Tú</span>
                    )}
                  </span>
                  <span className={styles.points}>{fmt(row.points)}</span>
                </li>
              ))}

              {/* Tu fila, si tienes marca pero quedaste fuera del top visible. */}
              {showYourRow && playerRank && ownRecord && (
                <li className={`${styles.row} ${styles.isYou} ${styles.yourRowApart}`}>
                  <span className={styles.rank}>{playerRank.puesto}</span>
                  <span className={styles.name}>
                    {online.profile?.nickname}
                    <span className={styles.youTag}>Tú</span>
                    <span className={styles.ofTotal}>
                      de {fmt(playerRank.total_jugadores)}
                    </span>
                  </span>
                  <span className={styles.points}>{fmt(ownRecord.points)}</span>
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
  const { profile, isAnonymous, openOnboarding, linkGoogle, signInGoogle } = useOnline();
  const [googleError, setGoogleError] = useState<string | null>(null);

  async function connectGoogle(action: () => Promise<{ ok: boolean; error?: string }>) {
    setGoogleError(null);
    const res = await action();
    if (!res.ok) setGoogleError(res.error ?? 'No se pudo conectar con Google.');
  }

  if (!profile) {
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

/** Fila-zona del ledger: label con radio NATIVO oculto (tick de hoist a ámbar al elegir). */
function ZoneRow({
  cat,
  zone,
  onSelect,
}: {
  cat: (typeof GAME_CATEGORIES)[number];
  zone: CategoryId;
  onSelect: (id: CategoryId) => void;
}) {
  const rowClass = cat.id === 'mundo' ? `${styles.zoneRow} ${styles.isWorld}` : styles.zoneRow;
  return (
    <label className={rowClass}>
      <input
        type="radio"
        name="zona-ranking"
        className={styles.radio}
        value={cat.id}
        checked={zone === cat.id}
        onChange={() => onSelect(cat.id)}
      />
      <span
        className={styles.zoneShape}
        style={{ '--shape-src': `url(/shapes/zones/${cat.id}.svg)` } as CSSProperties}
        aria-hidden="true"
      />
      {cat.label}
    </label>
  );
}

/** Sin conexión / sin config: aviso + tu récord LOCAL de la zona + Reintentar. */
function OfflineFallback({
  local,
  onRetry,
}: {
  local: ReturnType<ReturnType<typeof useRecords>['getBest']>;
  onRetry: () => void;
}) {
  return (
    <div className={styles.stateBox}>
      <p className={styles.stateNote}>El ranking necesita conexión.</p>
      {local ? (
        <p className={styles.localRecord}>
          Tu récord local aquí: <strong>{fmt(local.points)} pts</strong>
        </p>
      ) : (
        <p className={styles.localRecord}>
          Aún no tienes récord local en esta zona.
        </p>
      )}
      <Button variant="secondary" onClick={onRetry}>
        Reintentar
      </Button>
    </div>
  );
}
