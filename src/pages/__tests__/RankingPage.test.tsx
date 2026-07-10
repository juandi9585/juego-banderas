import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import type { SupabaseClient } from '@supabase/supabase-js';
import { RankingPage } from '../RankingPage';
import { OnlineProvider } from '../../features/online/OnlineProvider';
import { RecordsProvider } from '../../features/records/RecordsProvider';
import { getSupabase } from '../../lib/supabase';
import type { GlobalLeaderboardRow, LeaderboardRow } from '../../features/online/types';

// Smoke de la página Ranking con el cliente Supabase MOCKEADO a nivel de módulo
// (src/lib/supabase.ts). Sin red real: se controla qué devuelve getSupabase().
vi.mock('../../lib/supabase', () => ({ getSupabase: vi.fn() }));

const mockGetSupabase = vi.mocked(getSupabase);

/** Cliente falso mínimo: solo lo que tocan OnlineProvider y la página. */
function fakeClient(rpc: Record<string, unknown[]>): SupabaseClient {
  return {
    auth: {
      getSession: async () => ({ data: { session: null }, error: null }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
    },
    rpc: async (name: string) => ({ data: rpc[name] ?? [], error: null }),
  } as unknown as SupabaseClient;
}

/**
 * Cliente falso CON sesión de Google pero SIN perfil (players → null): el estado
 * en que queda quien vuelve del OAuth sin haber elegido apodo todavía.
 */
function fakeSessionClient(rpc: Record<string, unknown[]>): SupabaseClient {
  const session = { user: { id: 'u-google', email: 'jd@test.com', is_anonymous: false } };
  return {
    auth: {
      getSession: async () => ({ data: { session }, error: null }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
    },
    rpc: async (name: string) => ({ data: rpc[name] ?? [], error: null }),
    from: () => ({
      select: () => ({
        eq: () => ({ maybeSingle: async () => ({ data: null, error: null }) }),
      }),
    }),
  } as unknown as SupabaseClient;
}

function renderRanking() {
  return render(
    <MemoryRouter initialEntries={['/ranking']}>
      <RecordsProvider>
        <OnlineProvider>
          <RankingPage />
        </OnlineProvider>
      </RecordsProvider>
    </MemoryRouter>,
  );
}

const row = (over: Partial<LeaderboardRow>): LeaderboardRow => ({
  puesto: 1,
  player_id: 'p1',
  nickname: 'PruebaJD',
  discriminator: 42,
  points: 2700,
  correct: 13,
  total: 13,
  max_streak: 13,
  duration_ms: 12000,
  achieved_at: '2026-07-09T00:00:00Z',
  ...over,
});

const gRow = (over: Partial<GlobalLeaderboardRow>): GlobalLeaderboardRow => ({
  puesto: 1,
  player_id: 'p1',
  nickname: 'PruebaJD',
  discriminator: 42,
  points: 2700,
  zones: 3,
  correct: 13,
  duration_ms: 12000,
  achieved_at: '2026-07-09T00:00:00Z',
  ...over,
});

beforeEach(() => {
  localStorage.clear();
  mockGetSupabase.mockReset();
});

describe('RankingPage (smoke)', () => {
  it('sin config muestra el aviso y Global viene seleccionado por defecto', () => {
    mockGetSupabase.mockReturnValue(null);
    renderRanking();

    expect(screen.getByRole('heading', { name: 'Ranking' })).toBeInTheDocument();
    expect(screen.getByText('El ranking necesita conexión.')).toBeInTheDocument();
    // Chips = radios NATIVOS; Global es la carta insignia y la selección inicial.
    expect(screen.getByRole('radio', { name: 'Global' })).toBeChecked();
    expect(screen.getByRole('radio', { name: 'Mundo' })).not.toBeChecked();
    expect(screen.getByRole('radio', { name: 'Europa' })).toBeInTheDocument();
  });

  it('Global (por defecto): pinta filas con puntaje y cobertura "N zonas"', async () => {
    mockGetSupabase.mockReturnValue(
      fakeClient({
        get_global_leaderboard: [
          gRow({ puesto: 1, player_id: 'p1', nickname: 'PruebaJD', points: 2700, zones: 3 }),
          gRow({ puesto: 2, player_id: 'p2', nickname: 'JD.', points: 2475, zones: 1 }),
        ],
      }),
    );
    renderRanking();

    expect(await screen.findByText('PruebaJD')).toBeInTheDocument();
    expect(screen.getByText('JD.')).toBeInTheDocument();
    expect(screen.getByText(/2\.?700/)).toBeInTheDocument();
    // La cobertura del álbum es visible.
    expect(screen.getByText('3 zonas')).toBeInTheDocument();
    expect(screen.getByText('1 zona')).toBeInTheDocument();
  });

  it('elegir una zona carga su tabla (get_leaderboard) sin cobertura', async () => {
    const user = userEvent.setup();
    mockGetSupabase.mockReturnValue(
      fakeClient({
        get_global_leaderboard: [],
        get_leaderboard: [row({ nickname: 'PruebaJD', points: 2700 })],
      }),
    );
    renderRanking();

    await user.click(screen.getByRole('radio', { name: 'Mundo' }));

    expect(await screen.findByText('PruebaJD')).toBeInTheDocument();
    expect(screen.getByText(/2\.?700/)).toBeInTheDocument();
    // Las tablas de zona no muestran "N zonas" (eso es solo de Global).
    expect(screen.queryByText(/\bzonas?\b/)).not.toBeInTheDocument();
  });

  it('Global vacío muestra su propio estado vacío', async () => {
    mockGetSupabase.mockReturnValue(fakeClient({ get_global_leaderboard: [] }));
    renderRanking();

    expect(
      await screen.findByText('Nadie ha sumado marcas todavía. ¡Sé el primero!'),
    ).toBeInTheDocument();
  });

  it('con sesión de Google sin perfil reconoce la cuenta y abre el sheet del apodo solo', async () => {
    mockGetSupabase.mockReturnValue(fakeSessionClient({ get_global_leaderboard: [] }));
    renderRanking();

    // La tarjeta distingue "conectado sin apodo" de "sin cuenta" (fix post-OAuth:
    // antes eran idénticas y el login parecía no haber hecho nada).
    expect(await screen.findByText(/Cuenta conectada \(jd@test\.com\)/)).toBeInTheDocument();
    expect(screen.queryByText(/Inicia sesión con Google/)).not.toBeInTheDocument();

    // Continuación del onboarding: el sheet se abre sin buscar el botón, con el
    // copy de progreso ligado a la cuenta (no "en este dispositivo").
    expect(await screen.findByRole('dialog', { name: 'Elige tu apodo' })).toBeInTheDocument();
    expect(screen.getByText(/ligado a tu cuenta de Google/)).toBeInTheDocument();
  });
});
