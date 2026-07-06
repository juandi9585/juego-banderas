import { useEffect, useRef } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useGame } from '../features/game/useGame';
import { FlagImage } from '../components/FlagImage';
import { Button } from '../components/Button';
import styles from './ResultPage.module.css';

const pad = (n: number) => String(n).padStart(2, '0');

export function ResultPage() {
  const { state, result, restart, reset } = useGame();
  const navigate = useNavigate();

  // Al llegar desde el CTA "Ver resultado", el foco aterriza en el titular.
  const headingRef = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    headingRef.current?.focus();
  }, []);

  if (!result) {
    return <Navigate to="/" replace />;
  }

  const accuracy =
    result.total === 0 ? 0 : Math.round((result.correctCount / result.total) * 100);

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

      {/* TODO(gamificación): hueco reservado para el panel de puntos/récord. */}

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
            navigate('/jugar');
          }}
        >
          Jugar otra vez
        </Button>
        <Button
          variant="secondary"
          onClick={() => {
            reset();
            navigate('/');
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
