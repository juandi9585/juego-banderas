import { useEffect, useState } from 'react';

/** Evento de Chromium previo al diálogo de instalación (no existe en lib.dom). */
interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export const INSTALL_DISMISS_KEY = 'banderas:install-dismissed:v1';

/** El aviso descartado vuelve a ofrecerse pasados 14 días (no insistir antes). */
const DISMISS_TTL_MS = 14 * 24 * 60 * 60 * 1000;

/**
 * - `installable`: Chromium disparó `beforeinstallprompt` → hay diálogo nativo.
 * - `ios`: iPhone/iPad en navegador (sin API de instalación) → guía manual.
 * - `hidden`: ya instalada (standalone), descartada hace <14 días, o navegador
 *   sin señal de instalabilidad (p. ej. Firefox escritorio).
 */
export type InstallStatus = 'hidden' | 'installable' | 'ios';

function isStandalone(): boolean {
  if (
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(display-mode: standalone)').matches
  ) {
    return true;
  }
  // Safari iOS no soporta la media query display-mode en versiones viejas, pero
  // expone navigator.standalone=true al abrir desde el icono instalado.
  return (navigator as Navigator & { standalone?: boolean }).standalone === true;
}

function isIos(): boolean {
  const ua = navigator.userAgent;
  // iPadOS 13+ se anuncia como Macintosh; se distingue por la pantalla táctil.
  return (
    /iphone|ipad|ipod/i.test(ua) ||
    (/macintosh/i.test(ua) && navigator.maxTouchPoints > 1)
  );
}

function isDismissed(now: number): boolean {
  try {
    const raw = localStorage.getItem(INSTALL_DISMISS_KEY);
    if (!raw) return false;
    const at = Number((JSON.parse(raw) as { dismissedAt?: unknown }).dismissedAt);
    return Number.isFinite(at) && now - at < DISMISS_TTL_MS;
  } catch {
    return false; // JSON corrupto o storage bloqueado → tratar como no descartado
  }
}

function persistDismiss(now: number): void {
  try {
    localStorage.setItem(INSTALL_DISMISS_KEY, JSON.stringify({ dismissedAt: now }));
  } catch {
    // Storage lleno/bloqueado: el aviso simplemente reaparecerá en otra visita.
  }
}

/**
 * Instalación de la PWA: captura `beforeinstallprompt` (Android/escritorio
 * Chromium) para ofrecer el diálogo nativo con nuestro propio botón, y detecta
 * iOS —que no tiene API de instalación— para mostrar la guía manual de
 * "Añadir a pantalla de inicio". Nunca ofrece nada si la app ya corre
 * instalada (standalone) o si el usuario descartó el aviso hace poco.
 */
export function usePwaInstall(): {
  status: InstallStatus;
  promptInstall: () => Promise<void>;
  dismiss: () => void;
} {
  const [status, setStatus] = useState<InstallStatus>(() => {
    if (isStandalone() || isDismissed(Date.now())) return 'hidden';
    return isIos() ? 'ios' : 'hidden';
  });
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    function onBeforeInstallPrompt(event: Event) {
      event.preventDefault(); // suprime el mini-infobar de Chrome Android
      if (isStandalone() || isDismissed(Date.now())) return;
      setDeferred(event as BeforeInstallPromptEvent);
      setStatus('installable');
    }
    function onAppInstalled() {
      setDeferred(null);
      setStatus('hidden');
    }
    window.addEventListener('beforeinstallprompt', onBeforeInstallPrompt);
    window.addEventListener('appinstalled', onAppInstalled);
    return () => {
      window.removeEventListener('beforeinstallprompt', onBeforeInstallPrompt);
      window.removeEventListener('appinstalled', onAppInstalled);
    };
  }, []);

  async function promptInstall() {
    if (!deferred) return;
    setDeferred(null); // el evento es de un solo uso: no se puede re-prompt
    await deferred.prompt();
    const { outcome } = await deferred.userChoice;
    // Rechazo del diálogo nativo = descarte: no insistir durante el TTL.
    if (outcome === 'dismissed') persistDismiss(Date.now());
    setStatus('hidden'); // si aceptó, `appinstalled` remata igualmente
  }

  function dismiss() {
    persistDismiss(Date.now());
    setStatus('hidden');
  }

  return { status, promptInstall, dismiss };
}
