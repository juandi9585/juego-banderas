import { useSyncExternalStore } from 'react';
import { isMuted, subscribeMuted, toggleMuted } from '../lib/sound';
import styles from './SoundToggle.module.css';

/** Estado de mute reactivo (fuente única: sound.ts) para reflejarlo en la UI. */
function useSoundMuted(): boolean {
  return useSyncExternalStore(subscribeMuted, isMuted, isMuted);
}

/** Altavoz ON (dos ondas). Monocromo, hereda `currentColor` (es chrome, no semántico). */
function IconOn() {
  return (
    <svg className={styles.icon} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4 9.5v5h3.4L12 18v-12L7.4 9.5H4z" fill="currentColor" />
      <path
        d="M15.5 9a4.2 4.2 0 0 1 0 6"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
      <path
        d="M18 6.5a8 8 0 0 1 0 11"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  );
}

/** Altavoz silenciado (barra diagonal). Color atenuado desde `.muted`. */
function IconMuted() {
  return (
    <svg className={styles.icon} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4 9.5v5h3.4L12 18v-12L7.4 9.5H4z" fill="currentColor" />
      <path
        d="M15 9l6 6M21 9l-6 6"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  );
}

/**
 * Toggle de sonido (docs/design.md §22.4). Mismo estado compartido en AppHeader y
 * GameTopBar. `aria-pressed` refleja "sonido activado"; el título cambia según
 * la acción que hará el toque. Objetivo táctil 44px, foco de latón heredado.
 */
export function SoundToggle({ className }: { className?: string }) {
  const muted = useSoundMuted();
  return (
    <button
      type="button"
      className={`${styles.toggle} ${muted ? styles.muted : ''} ${className ?? ''}`}
      onClick={() => toggleMuted()}
      aria-label="Sonido"
      aria-pressed={!muted}
      title={muted ? 'Activar sonido' : 'Silenciar sonido'}
    >
      {muted ? <IconMuted /> : <IconOn />}
    </button>
  );
}
