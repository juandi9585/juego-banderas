import { describe, it, expect } from 'vitest';
import { useState } from 'react';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CategoryMultiPicker } from '../CategoryMultiPicker';
import { GAME_CATEGORIES, type CategoryId } from '../../features/game/categories';

function Harness({ initial = [] }: { initial?: CategoryId[] }) {
  const [value, setValue] = useState<CategoryId[]>(initial);
  return <CategoryMultiPicker value={value} onChange={setValue} />;
}

// Las 17 categorías visibles del casual (todas menos 'mundo', cuyo rol lo cumple
// la fila "Todos").
const VISIBLES = GAME_CATEGORIES.filter((c) => c.id !== 'mundo');

describe('CategoryMultiPicker (ledger multi-select, §26.4)', () => {
  it('togglear filas emite selección canónica; marcar las 17 colapsa a "Todos" ([])', async () => {
    const user = userEvent.setup();
    render(<Harness />);
    const group = screen.getByRole('group', { name: 'Categorías' });
    const box = (name: string | RegExp) =>
      within(group).getByRole('checkbox', { name });

    // Inicial isAll = [] → "Todos" encendido.
    expect(box('Todos')).toBeChecked();

    // Marcar una fila apaga "Todos".
    await user.click(box(/^Europa$/));
    expect(box(/^Europa$/)).toBeChecked();
    expect(box('Todos')).not.toBeChecked();

    // Abrir Sectores y marcar TODAS las visibles (17): canonicalCategories las
    // colapsa a [] → "Todos" se reenciende y las individuales se apagan.
    await user.click(within(group).getByRole('button', { name: /Sectores/ }));
    for (const cat of VISIBLES) {
      const checkbox = within(group).getByRole('checkbox', { name: cat.label });
      if (!(checkbox as HTMLInputElement).checked) await user.click(checkbox);
    }
    expect(box('Todos')).toBeChecked();
    for (const cat of VISIBLES) {
      expect(
        within(group).getByRole('checkbox', { name: cat.label }),
      ).not.toBeChecked();
    }
  });

  it('la fila "Todos" enciende con [] y un clic con selección la resetea a []', async () => {
    const user = userEvent.setup();
    render(<Harness initial={['europa']} />);
    const group = screen.getByRole('group', { name: 'Categorías' });
    const todos = within(group).getByRole('checkbox', { name: 'Todos' });

    // Con selección: "Todos" apagado, Europa encendida.
    expect(todos).not.toBeChecked();
    expect(within(group).getByRole('checkbox', { name: /^Europa$/ })).toBeChecked();

    // Clic en "Todos" → onChange([]) → "Todos" on, Europa off.
    await user.click(todos);
    expect(todos).toBeChecked();
    expect(
      within(group).getByRole('checkbox', { name: /^Europa$/ }),
    ).not.toBeChecked();

    // Clic en "Todos" cuando ya isAll → no-op (sigue encendido).
    await user.click(todos);
    expect(todos).toBeChecked();
  });

  it('el disclosure de Sectores abre/cierra con aria-expanded e inert', async () => {
    const user = userEvent.setup();
    render(<Harness />);
    const toggle = screen.getByRole('button', { name: /Sectores/ });
    const panel = document.getElementById('sectores-panel')!;

    // Plegado por defecto; el panel inert saca sus casillas del orden de
    // tabulación y del árbol de accesibilidad (promesa de aria-expanded=false).
    expect(toggle).toHaveAttribute('aria-expanded', 'false');
    expect(panel).toHaveAttribute('inert');
    await user.click(toggle);
    expect(toggle).toHaveAttribute('aria-expanded', 'true');
    expect(panel).not.toHaveAttribute('inert');
    await user.click(toggle);
    expect(toggle).toHaveAttribute('aria-expanded', 'false');
    expect(panel).toHaveAttribute('inert');
  });

  it('auto-abre Sectores al montar si hay un sector activo', () => {
    render(<Harness initial={['caribe']} />);
    expect(screen.getByRole('button', { name: /Sectores/ })).toHaveAttribute(
      'aria-expanded',
      'true',
    );
  });
});
