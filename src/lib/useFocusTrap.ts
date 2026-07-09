import { useEffect, type RefObject } from 'react';

// Selector de elementos enfocables dentro de un modal.
const FOCUSABLE_SELECTOR =
  'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

/**
 * Atrapa el foco dentro de `containerRef` (Tab / Shift+Tab ciclan sin salir) y,
 * si se pasa `onEscape`, lo ejecuta al pulsar Esc. Patrón compartido por los
 * modales del sistema (FieldNoteSheet, NicknameSheet) para no duplicar la lógica.
 *
 * El contenedor debe recibir el foco por su cuenta al abrir; este hook solo
 * gobierna el teclado mientras está montado. Ignora elementos deshabilitados.
 */
export function useFocusTrap(
  containerRef: RefObject<HTMLElement | null>,
  onEscape?: () => void,
): void {
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        if (onEscape) {
          e.preventDefault();
          onEscape();
        }
        return;
      }
      if (e.key !== 'Tab') return;

      const container = containerRef.current;
      if (!container) return;
      const focusables = Array.from(
        container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR),
      ).filter((el) => !el.hasAttribute('disabled'));
      if (focusables.length === 0) {
        e.preventDefault();
        return;
      }
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      const active = document.activeElement;

      if (e.shiftKey) {
        if (active === first || !container.contains(active)) {
          e.preventDefault();
          last.focus();
        }
      } else if (active === last) {
        e.preventDefault();
        first.focus();
      }
    }
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [containerRef, onEscape]);
}
