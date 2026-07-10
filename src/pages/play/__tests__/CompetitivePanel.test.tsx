import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { CompetitivePanel } from '../CompetitivePanel';
import { GameProvider } from '../../../features/game/GameProvider';
import { RecordsProvider } from '../../../features/records/RecordsProvider';
import { OnlineContext, type OnlineContextValue } from '../../../features/online/OnlineContext';
import { countries } from '../../../data/dataset';

// Indicador de sesión del panel Competitivo (roadmap §C): línea discreta sobre el
// CTA. Se controla el estado online con un OnlineContext falso (sin red).
function makeOnline(over: Partial<OnlineContextValue> = {}): OnlineContextValue {
  return {
    enabled: true,
    loading: false,
    profile: null,
    isAnonymous: false,
    hasSession: false,
    sessionEmail: null,
    submitResult: vi.fn(async () => ({ kind: 'disabled' as const })),
    createProfile: vi.fn(async () => ({ ok: true })),
    updateProfile: vi.fn(async () => ({ ok: true })),
    linkGoogle: vi.fn(async () => ({ ok: true })),
    signInGoogle: vi.fn(async () => ({ ok: true })),
    onboardingOpen: false,
    openOnboarding: vi.fn(),
    closeOnboarding: vi.fn(),
    subscribeOutcome: vi.fn(() => () => {}),
    ...over,
  };
}

function renderPanel(online: OnlineContextValue) {
  return render(
    <MemoryRouter>
      <RecordsProvider>
        <GameProvider countries={countries}>
          <OnlineContext.Provider value={online}>
            <CompetitivePanel />
          </OnlineContext.Provider>
        </GameProvider>
      </RecordsProvider>
    </MemoryRouter>,
  );
}

describe('CompetitivePanel — indicador de sesión', () => {
  it('con perfil muestra "Compites como {apodo}" enlazando a /ranking', () => {
    renderPanel(
      makeOnline({ profile: { id: 'u1', nickname: 'JD', discriminator: 42 } }),
    );
    expect(screen.getByText(/Compites como/)).toBeInTheDocument();
    const link = screen.getByRole('link', { name: 'JD' });
    expect(link).toHaveAttribute('href', '/ranking');
  });

  it('sin perfil (online activo) invita a crear apodo y abre el onboarding', async () => {
    const user = userEvent.setup();
    const openOnboarding = vi.fn();
    renderPanel(makeOnline({ profile: null, openOnboarding }));

    const cta = screen.getByRole('button', {
      name: 'Crea un apodo para publicar tus marcas',
    });
    await user.click(cta);
    expect(openOnboarding).toHaveBeenCalledTimes(1);
  });

  it('con online apagado (enabled=false) no muestra ninguna línea de sesión', () => {
    renderPanel(makeOnline({ enabled: false }));
    expect(screen.queryByText(/Compites como/)).not.toBeInTheDocument();
    expect(
      screen.queryByText('Crea un apodo para publicar tus marcas'),
    ).not.toBeInTheDocument();
  });
});
