import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, act, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { InstallPrompt } from '../InstallPrompt';
import { INSTALL_DISMISS_KEY } from '../../features/pwa/usePwaInstall';

/** Simula el evento de Chromium con prompt/userChoice controlables. */
function fireBeforeInstallPrompt(outcome: 'accepted' | 'dismissed' = 'accepted') {
  const event = new Event('beforeinstallprompt', {
    cancelable: true,
  }) as Event & {
    prompt: ReturnType<typeof vi.fn>;
    userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
  };
  event.prompt = vi.fn().mockResolvedValue(undefined);
  event.userChoice = Promise.resolve({ outcome });
  act(() => {
    window.dispatchEvent(event);
  });
  return event;
}

const CARD_NAME = 'Instalar la aplicación';

describe('InstallPrompt (aviso de instalación de la PWA, §27)', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('no renderiza nada sin señal de instalabilidad (jsdom no es iOS ni Chromium)', () => {
    render(<InstallPrompt />);
    expect(screen.queryByRole('region', { name: CARD_NAME })).toBeNull();
  });

  it('aparece con beforeinstallprompt y "Instalar la app" lanza el diálogo nativo', async () => {
    const user = userEvent.setup();
    render(<InstallPrompt />);
    const event = fireBeforeInstallPrompt('accepted');

    expect(screen.getByRole('region', { name: CARD_NAME })).toBeInTheDocument();
    expect(event.defaultPrevented).toBe(true); // suprime el mini-infobar

    await user.click(screen.getByRole('button', { name: 'Instalar la app' }));
    expect(event.prompt).toHaveBeenCalledOnce();
    // Aceptado → la tarjeta se oculta sin marcar descarte (no hay que reinsistir:
    // la próxima visita corre standalone).
    await waitFor(() =>
      expect(screen.queryByRole('region', { name: CARD_NAME })).toBeNull(),
    );
    expect(localStorage.getItem(INSTALL_DISMISS_KEY)).toBeNull();
  });

  it('rechazar el diálogo nativo persiste el descarte de 14 días', async () => {
    const user = userEvent.setup();
    render(<InstallPrompt />);
    fireBeforeInstallPrompt('dismissed');

    await user.click(screen.getByRole('button', { name: 'Instalar la app' }));
    await waitFor(() =>
      expect(screen.queryByRole('region', { name: CARD_NAME })).toBeNull(),
    );
    expect(localStorage.getItem(INSTALL_DISMISS_KEY)).toContain('dismissedAt');
  });

  it('el botón de cerrar oculta la tarjeta y el descarte sobrevive a un remontaje', async () => {
    const user = userEvent.setup();
    const first = render(<InstallPrompt />);
    fireBeforeInstallPrompt();

    await user.click(
      screen.getByRole('button', { name: 'Ocultar aviso de instalación' }),
    );
    expect(screen.queryByRole('region', { name: CARD_NAME })).toBeNull();
    expect(localStorage.getItem(INSTALL_DISMISS_KEY)).toContain('dismissedAt');

    // Nueva visita (remontaje + nuevo beforeinstallprompt): sigue oculta.
    first.unmount();
    render(<InstallPrompt />);
    fireBeforeInstallPrompt();
    expect(screen.queryByRole('region', { name: CARD_NAME })).toBeNull();
  });

  describe('en iOS (sin API de instalación)', () => {
    beforeEach(() => {
      vi.spyOn(navigator, 'userAgent', 'get').mockReturnValue(
        'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1',
      );
    });

    it('muestra la guía y el disclosure de pasos abre/cierra con aria-expanded e inert', async () => {
      const user = userEvent.setup();
      render(<InstallPrompt />);

      expect(screen.getByRole('region', { name: CARD_NAME })).toBeInTheDocument();
      const toggle = screen.getByRole('button', { name: /Cómo instalarla/ });
      const panel = document.getElementById('install-steps')!;

      // Plegado por defecto: los pasos existen en el DOM pero inert los saca
      // del árbol de accesibilidad (promesa de aria-expanded=false).
      expect(toggle).toHaveAttribute('aria-expanded', 'false');
      expect(panel).toHaveAttribute('inert');

      await user.click(toggle);
      expect(toggle).toHaveAttribute('aria-expanded', 'true');
      expect(panel).not.toHaveAttribute('inert');
      expect(
        screen.getByText(/Añadir a pantalla de inicio/),
      ).toBeInTheDocument();

      await user.click(toggle);
      expect(toggle).toHaveAttribute('aria-expanded', 'false');
      expect(panel).toHaveAttribute('inert');
    });

    it('no aparece si la app ya corre instalada (standalone de Safari)', () => {
      (navigator as Navigator & { standalone?: boolean }).standalone = true;
      try {
        render(<InstallPrompt />);
        expect(screen.queryByRole('region', { name: CARD_NAME })).toBeNull();
      } finally {
        delete (navigator as Navigator & { standalone?: boolean }).standalone;
      }
    });

    it('no aparece si se descartó hace menos de 14 días', () => {
      localStorage.setItem(
        INSTALL_DISMISS_KEY,
        JSON.stringify({ dismissedAt: Date.now() - 1000 }),
      );
      render(<InstallPrompt />);
      expect(screen.queryByRole('region', { name: CARD_NAME })).toBeNull();
    });

    it('reaparece cuando el descarte ya venció (>14 días)', () => {
      localStorage.setItem(
        INSTALL_DISMISS_KEY,
        JSON.stringify({ dismissedAt: Date.now() - 15 * 24 * 60 * 60 * 1000 }),
      );
      render(<InstallPrompt />);
      expect(screen.getByRole('region', { name: CARD_NAME })).toBeInTheDocument();
    });
  });
});
