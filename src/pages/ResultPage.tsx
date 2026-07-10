import { useEffect, useMemo, useRef, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useGame } from '../features/game/useGame';
import { computeScore } from '../features/game/score';
import { useRecords } from '../features/records/useRecords';
import { useOnline } from '../features/online/useOnline';
import { resultToPayload } from '../features/online/payload';
import { submitId } from '../features/online/queue';
import type { SubmitOutcome } from '../features/online/types';
import { play } from '../lib/sound';
import type { RecordEntry } from '../features/records/records';
import { FlagImage } from '../components/FlagImage';
import { Button } from '../components/Button';
import styles from './ResultPage.module.css';

const pad = (n: number) => String(n).padStart(2, '0');
const fmt = (n: number) => n.toLocaleString('es-ES');

export function ResultPage() {
  const { state, result, restart, reset } = useGame();
  const records = useRecords();
  const online = useOnline();
  const navigate = useNavigate();

  // Al llegar desde el CTA "Ver resultado", el foco aterriza en el titular.
  const headingRef = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    headingRef.current?.focus();
  }, []);

  // Puntaje (§4). Función pura: informativa en casual, base del récord en
  // competitivo. Memo por `result` para que el efecto de récord tenga una
  // dependencia estable. `null` mientras no hay resultado (guarda de abajo).
  const score = useMemo(() => (result ? computeScore(result) : null), [result]);

  const isCompetitive = result?.config.competitive != null;

  // Resultado del récord: se registra UNA sola vez al aterrizar (guarda de ref
  // contra el doble efecto de StrictMode). `prev` = mejor marca ANTES de esta
  // partida (para el copy "Superaste tu récord de …").
  const submittedRef = useRef(false);
  const [recordResult, setRecordResult] = useState<{
    isNew: boolean;
    prev: RecordEntry | null;
  } | null>(null);

  useEffect(() => {
    if (!result || !isCompetitive || !score || submittedRef.current) return;
    const categoryId = result.config.categories[0]; // invariante: exactamente una
    // La UI competitiva SIEMPRE pasa una categoría; pero si por un bug llegara
    // `categories: []`, no registramos el récord bajo la clave 'undefined:mixto'.
    // Sin categoría no hay récord: se sale sin marcar `submittedRef`.
    if (categoryId == null) return;
    submittedRef.current = true;
    const mode = result.config.mode;
    const prev = records.getBest(categoryId, mode);
    const entry: RecordEntry = {
      points: score.points,
      correct: score.correct,
      total: score.total,
      maxStreak: score.maxStreak,
      // Desempate por tiempo RESPONDIENDO (suma de elapsedMs), no por reloj de
      // pared: leer la ficha de datos con calma no penaliza el récord (§5).
      durationMs: score.answeredMs,
      achievedAt: Date.now(),
    };
    const isNew = records.submit(categoryId, mode, entry);
    setRecordResult({ isNew, prev });
    // Único momento "fanfarria" sonora (§22.2): suena una vez al lograr récord.
    // Va dentro de la guarda submittedRef → no se duplica con StrictMode.
    if (isNew) play('record');
  }, [result, isCompetitive, score, records]);

  // ── Publicación online (Fase C, roadmap §C) ────────────────────────────────
  // Adicional y ASÍNCRONA: no toca el flujo local. Con env vars ausentes es
  // no-op ({kind:'disabled'}). Guarda de ref anti doble-submit de StrictMode.
  const onlinePayload = useMemo(
    () => (result ? resultToPayload(result) : null),
    [result],
  );
  const onlineId = onlinePayload ? submitId(onlinePayload) : null;
  const onlineSubmittedRef = useRef(false);
  const [onlineOutcome, setOnlineOutcome] = useState<SubmitOutcome | null>(null);

  useEffect(() => {
    if (!result || !isCompetitive || onlineSubmittedRef.current) return;
    onlineSubmittedRef.current = true;
    void online.submitResult(result).then(setOnlineOutcome);
  }, [result, isCompetitive, online]);

  // Si la cola publica esta ronda más tarde (p. ej. tras crear el apodo), refleja
  // el puesto sin re-enviar (la Edge Function es autoritativa: manda el servidor).
  useEffect(() => {
    if (!onlineId) return;
    return online.subscribeOutcome(onlineId, (res) =>
      setOnlineOutcome({ kind: 'ok', data: res }),
    );
  }, [onlineId, online]);

  if (!result || !score) {
    return <Navigate to="/" replace />;
  }

  const accuracy =
    result.total === 0 ? 0 : Math.round((result.correctCount / result.total) * 100);

  const isRecord = isCompetitive && recordResult?.isNew === true;

  // Preguntas falladas (para repasar): país correcto de cada fallo.
  const failed = state.questions.filter(
    (_question, i) => result.answers[i]?.correct === false,
  );

  return (
    <div className={styles.page}>
      <section>
        <p className={styles.eyebrow}>Ronda completada</p>
        <h1 ref={headingRef} tabIndex={-1} className={styles.score}>
          {result.correctCount} <span className={styles.scoreOf}>de</span>{' '}
          {result.total}
        </h1>
        <p className={styles.accuracy}>
          {pad(accuracy)} % de aciertos
        </p>
      </section>

      {/* Puntaje informativo (§4) + banner de récord en competitivo (§15). El
          casual queda idéntico: panel neutro, sin récords. */}
      <section
        className={`${styles.scorePanel} ${isRecord ? styles.isRecord : ''}`}
        aria-label={
          isRecord ? 'Puntaje de la ronda. Nuevo récord.' : 'Puntaje de la ronda'
        }
      >
        {isRecord ? (
          <p className={styles.recordFlag}>¡Nuevo récord!</p>
        ) : (
          <p className={styles.scoreTag}>Puntaje</p>
        )}
        <p className={styles.scorePoints}>{fmt(score.points)}</p>
        {score.maxStreak >= 2 && (
          <p className={styles.streak}>
            Mejor racha: {score.maxStreak} seguidas
          </p>
        )}
        {/* Nuevo récord: qué batiste (o "Tu primer récord"). */}
        {isRecord && (
          <p className={styles.recordPrev}>
            {recordResult?.prev
              ? `Superaste tu récord de ${fmt(recordResult.prev.points)} pts`
              : 'Tu primer récord'}
          </p>
        )}
        {/* No lo superaste: la marca a batir, sin latón de logro. */}
        {isCompetitive && recordResult && !recordResult.isNew && recordResult.prev && (
          <p className={styles.recordToBeat}>Récord {fmt(recordResult.prev.points)} pts</p>
        )}
      </section>

      {/* Resultado online, discreto. La región vive montada (isCompetitive) para
          que el anuncio a lectores dispare cuando la respuesta asíncrona llega;
          vacía cuando no hay nada que decir (offline/casual → sin caja). */}
      {isCompetitive && (
        <div className={styles.online} aria-live="polite">
          {onlineOutcome?.kind === 'ok' && (
            <>
              {onlineOutcome.data.newRecord && (
                <p className={styles.onlineRecord}>¡Récord online!</p>
              )}
              {onlineOutcome.data.puesto != null && (
                <p className={styles.onlineRank}>
                  Puesto #{onlineOutcome.data.puesto}
                  {onlineOutcome.data.totalJugadores != null
                    ? ` de ${fmt(onlineOutcome.data.totalJugadores)}`
                    : ''}
                </p>
              )}
            </>
          )}
          {onlineOutcome?.kind === 'needs-profile' && (
            <>
              <p className={styles.onlineNote}>
                Crea un apodo para publicar tu marca en el ranking.
              </p>
              <Button variant="secondary" onClick={online.openOnboarding}>
                Publicar en el ranking
              </Button>
            </>
          )}
          {onlineOutcome?.kind === 'queued' && (
            <p className={styles.onlineNote}>
              Sin conexión. Tu marca se publicará cuando vuelvas a tenerla.
            </p>
          )}
        </div>
      )}

      {failed.length > 0 && (
        <section aria-label="Países para repasar">
          <p className={styles.reviewLabel}>Para repasar</p>
          <ul className={styles.reviewList}>
            {failed.map((q) => (
              <li key={q.id} className={styles.reviewItem}>
                <span className={styles.reviewFlag}>
                  <FlagImage country={q.country} size="sm" lazy alt="" />
                </span>
                <span className={styles.reviewName}>{q.country.name}</span>
                <span className={styles.reviewMeta}>
                  {q.country.code.toUpperCase()}
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className={styles.actions}>
        <Button
          onClick={() => {
            restart();
            navigate('/jugar', { viewTransition: true });
          }}
        >
          Jugar otra vez
        </Button>
        <Button
          variant="secondary"
          onClick={() => {
            // Vuelve al módulo del que salió la partida. En competitivo, con la
            // (zona, modo) recién jugadas en la URL: aterrizas en TU board, con
            // la marca fresca contra el top.
            let destino = '/';
            if (isCompetitive) {
              const zona = result.config.categories[0];
              const modo = result.config.mode === 'type-name' ? '&modo=escrito' : '';
              destino = zona != null ? `/ranking?zona=${zona}${modo}` : '/ranking';
            }
            reset();
            navigate(destino, { viewTransition: true });
          }}
        >
          Cambiar modo
        </Button>
        <Button variant="secondary" onClick={() => navigate('/explorar')}>
          Explorar países
        </Button>
      </section>
    </div>
  );
}
