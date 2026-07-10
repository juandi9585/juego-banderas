import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { RecordsPage } from '../RecordsPage';
import { RecordsProvider } from '../../features/records/RecordsProvider';
import { GAME_CATEGORIES } from '../../features/game/categories';

// Mis récords: ledger de solo lectura con las marcas LOCALES por (zona, modo).
// Sin red ni mocks de Supabase: todo sale de localStorage vía RecordsProvider.

function renderRecords() {
  return render(
    <MemoryRouter initialEntries={['/records']}>
      <RecordsProvider>
        <RecordsPage />
      </RecordsProvider>
    </MemoryRouter>,
  );
}

beforeEach(() => {
  localStorage.clear();
});

describe('RecordsPage', () => {
  it('lista las 18 zonas como enlaces a su clasificación', () => {
    renderRecords();

    expect(screen.getByRole('heading', { name: 'Mis récords' })).toBeInTheDocument();
    const rows = screen.getAllByRole('link');
    expect(rows).toHaveLength(GAME_CATEGORIES.length); // 18: Mundo + 7 + 10
    expect(
      rows.some((r) => r.getAttribute('href') === '/ranking?zona=mundo'),
    ).toBe(true);
    expect(
      rows.some((r) => r.getAttribute('href') === '/ranking?zona=caribe'),
    ).toBe(true);
  });

  it('muestra el récord local en su columna de modo; el otro modo queda vacío', () => {
    localStorage.setItem(
      'banderas:records:v1',
      JSON.stringify({
        'europa:mixto': {
          // 5 dígitos: es-ES no pone separador de miles a los de 4 ("1234").
          points: 12345,
          correct: 18,
          total: 20,
          maxStreak: 9,
          durationMs: 60_000,
          achievedAt: 1,
        },
      }),
    );
    renderRecords();

    const europa = screen
      .getAllByRole('link')
      .find((r) => r.getAttribute('href') === '/ranking?zona=europa')!;
    // Mixto con la marca formateada; Escrito vacío (récords por modo separados).
    expect(within(europa).getByText('12.345')).toBeInTheDocument();
    expect(within(europa).getAllByText('—')).toHaveLength(1);
  });
});
