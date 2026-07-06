import type { ReactNode } from 'react';
import styles from './OptionButton.module.css';

export type OptionState = 'idle' | 'correct' | 'incorrect' | 'dimmed';

interface OptionButtonProps {
  state: OptionState;
  disabled: boolean;
  onClick: () => void;
  /** Nombre del país cuando el contenido es una bandera (accesibilidad). */
  ariaLabel?: string;
  /** true cuando el contenido es una mini tarjeta de bandera (name-to-flag). */
  flagContent?: boolean;
  children: ReactNode;
}

/** Botón de opción con los 4 estados de docs/design.md §5.2. */
export function OptionButton({
  state,
  disabled,
  onClick,
  ariaLabel,
  flagContent = false,
  children,
}: OptionButtonProps) {
  const classes = [
    styles.option,
    flagContent ? styles.flagOption : '',
    state === 'correct' ? styles.correct : '',
    state === 'incorrect' ? styles.incorrect : '',
    state === 'dimmed' ? styles.dimmed : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button
      type="button"
      className={classes}
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
    >
      <span className={styles.content}>{children}</span>
      {state === 'correct' && (
        <span className={styles.icon} aria-hidden="true">
          ✓
        </span>
      )}
      {state === 'incorrect' && (
        <span className={styles.icon} aria-hidden="true">
          ✕
        </span>
      )}
    </button>
  );
}
