import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import type { SupabaseClient } from '@supabase/supabase-js';
import { RankingPage } from '../RankingPage';
import { OnlineProvider } from '../../features/online/OnlineProvider';
import { RecordsProvider } from '../../features/records/RecordsProvider';
import { getSupabase } from '../../lib/supabase';
import type { LeaderboardRow } from '../../features/online/types';

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

beforeEach(() => {
  localStorage.clear();
  mockGetSupabase.mockReset();
});

describe('RankingPage (smoke)', () => {
  it('sin config (getSupabase → null) muestra el aviso de conexión y el selector de zonas', () => {
    mockGetSupabase.mockReturnValue(null);
    renderRanking();

    expect(screen.getByRole('heading', { name: 'Ranking' })).toBeInTheDocument();
    expect(screen.getByText('El ranking necesita conexión.')).toBeInTheDocument();
    // El selector de zonas se renderiza igual; "Mundo" es la zona por defecto.
    // Radios NATIVOS → estado por `checked`, no aria-checked.
    expect(screen.getByRole('radio', { name: 'Mundo' })).toBeChecked();
    expect(screen.getByRole('radio', { name: 'Europa' })).toBeInTheDocument();
  });

  it('con cliente devuelve el top y pinta las filas (apodo + puntaje)', async () => {
    mockGetSupabase.mockReturnValue(
      fakeClient({
        get_leaderboard: [
          row({ puesto: 1, player_id: 'p1', nickname: 'PruebaJD', points: 2700 }),
          row({ puesto: 2, player_id: 'p2', nickname: 'Otra', points: 2400 }),
        ],
      }),
    );
    renderRanking();

    expect(await screen.findByText('PruebaJD')).toBeInTheDocument();
    expect(screen.getByText('Otra')).toBeInTheDocument();
    // Puntaje presente (el separador de miles depende del ICU del entorno:
    // "2.700" en navegador, "2700" en Node con ICU reducido).
    expect(screen.getByText(/2\.?700/)).toBeInTheDocument();
  });

  it('con cliente pero zona sin marcas muestra el estado vacío', async () => {
    mockGetSupabase.mockReturnValue(fakeClient({ get_leaderboard: [] }));
    renderRanking();

    expect(
      await screen.findByText('Nadie ha competido aún en esta zona. ¡Sé el primero!'),
    ).toBeInTheDocument();
  });
});
