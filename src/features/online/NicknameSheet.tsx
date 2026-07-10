import { useCallback, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Button } from '../../components/Button';
import { useFocusTrap } from '../../lib/useFocusTrap';
import { useOnline } from './useOnline';
import { NICK_MAX } from './nickname';
import styles from './NicknameSheet.module.css';

/**
 * Onboarding mínimo del apodo (docs/roadmap.md §C): un diálogo modal con un solo
 * input. Se abre al primer submit sin perfil (412) o al querer ver "tu puesto".
 * Es descartable ("Ahora no"): lo online es opcional y offline-first. Al guardar,
 * OnlineProvider crea el perfil (auth anónima si hace falta) y vacía la cola.
 *
 * Modal de verdad (patrón del repo): se porta a document.body, deja el #root
 * `inert` (fondo fuera del tab-order y de AT), bloquea el scroll del fondo y
 * restaura el foco al elemento que lo abrió al cerrar.
 */
export function NicknameSheet() {
  const { createProfile, updateProfile, closeOnboarding, hasSession, isAnonymous, profile } =
    useOnline();
  // Con cuenta Google el progreso viaja con la cuenta; en anónimo (o antes de
  // crear la sesión) vive en este dispositivo hasta el upgrade.
  const googleAccount = hasSession && !isAnonymous;
  // Con perfil existente el sheet es el EDITOR del apodo (mismo formulario,
  // misma validación); sin perfil, el onboarding de siempre.
  const editing = profile != null;

  const [value, setValue] = useState(profile?.nickname ?? '');
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const dialogRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const requestClose = useCallback(() => {
    if (saving) return; // no cerrar a mitad de guardado
    closeOnboarding();
  }, [saving, closeOnboarding]);

  // Modalidad: al abrir, inertiza el fondo (#root), bloquea su scroll y enfoca el
  // input; al cerrar (desmontaje), restaura todo y devuelve el foco al opener.
  useLayoutEffect(() => {
    const opener = document.activeElement as HTMLElement | null;
    const root = document.getElementById('root');
    root?.setAttribute('inert', '');
    root?.setAttribute('aria-hidden', 'true');
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    inputRef.current?.focus();
    return () => {
      root?.removeAttribute('inert');
      root?.removeAttribute('aria-hidden');
      document.body.style.overflow = prevOverflow;
      opener?.focus?.();
    };
  }, []);

  useFocusTrap(dialogRef, requestClose);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (saving) return;
      setSaving(true);
      setError(null);
      const res = await (editing ? updateProfile(value) : createProfile(value));
      if (res.ok) {
        closeOnboarding();
        return;
      }
      setError(res.error ?? 'No se pudo guardar el apodo.');
      setSaving(false);
    },
    [saving, editing, updateProfile, createProfile, value, closeOnboarding],
  );

  return createPortal(
    <>
      <div className={styles.scrim} aria-hidden="true" onClick={requestClose} />
      <div
        ref={dialogRef}
        className={styles.dialog}
        role="dialog"
        aria-modal="true"
        aria-labelledby="nickname-title"
      >
        <p className={styles.eyebrow}>Ranking</p>
        <h2 id="nickname-title" className={styles.title}>
          {editing ? 'Cambia tu apodo' : 'Elige tu apodo'}
        </h2>
        <p className={styles.lead}>
          {editing
            ? 'Es tu nombre público en la clasificación. Si eliges uno distinto, tu número # cambiará.'
            : googleAccount
              ? 'Con un apodo apareces en la clasificación global. Tu progreso queda ligado a tu cuenta de Google.'
              : 'Con un apodo apareces en la clasificación global. Tu progreso se guarda en este dispositivo.'}
        </p>

        <form className={styles.form} onSubmit={handleSubmit}>
          <label className={styles.label} htmlFor="nickname-input">
            Apodo
          </label>
          <input
            ref={inputRef}
            id="nickname-input"
            className={styles.input}
            type="text"
            value={value}
            maxLength={NICK_MAX}
            autoComplete="off"
            autoCapitalize="none"
            spellCheck={false}
            onChange={(e) => setValue(e.target.value)}
            aria-describedby="nickname-hint"
            aria-invalid={error != null}
          />
          <p id="nickname-hint" className={styles.hint}>
            2–20 caracteres, sin el signo “#”.
          </p>

          {/* El error se anuncia a lectores de pantalla al aparecer. */}
          <p className={styles.error} role="alert">
            {error}
          </p>

          <div className={styles.actions}>
            <Button type="submit" disabled={saving}>
              {saving ? 'Guardando…' : 'Guardar apodo'}
            </Button>
            <Button variant="secondary" onClick={requestClose} disabled={saving}>
              Ahora no
            </Button>
          </div>
        </form>
      </div>
    </>,
    document.body,
  );
}
