import { describe, it, expect } from 'vitest';
import { useState } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SegmentedControl } from '../SegmentedControl';

// Wrapper controlado (el componente es controlado; el índice del thumb depende
// del `value` que le pasa el padre).
function Harness() {
  const [value, setValue] = useState('a');
  return (
    <SegmentedControl
      label="Prueba"
      options={[
        { value: 'a', label: 'A' },
        { value: 'b', label: 'B' },
        { value: 'c', label: 'C' },
      ]}
      value={value}
      onChange={setValue}
    />
  );
}

describe('SegmentedControl (thumb slider, §26.2)', () => {
  it('fija --seg-count/--seg-index en el grupo y los actualiza al cambiar de opción', async () => {
    const user = userEvent.setup();
    render(<Harness />);

    const group = screen.getByRole('group', { name: 'Prueba' });
    // Estado inicial: 3 segmentos, índice 0 ('a').
    expect(group.style.getPropertyValue('--seg-count')).toBe('3');
    expect(group.style.getPropertyValue('--seg-index')).toBe('0');

    // Al elegir 'C' el índice salta a 2 (el thumb se desliza a ese segmento).
    await user.click(screen.getByRole('button', { name: 'C' }));
    expect(group.style.getPropertyValue('--seg-index')).toBe('2');
    expect(screen.getByRole('button', { name: 'C' })).toHaveAttribute(
      'aria-pressed',
      'true',
    );

    // Y a 1 al elegir 'B'.
    await user.click(screen.getByRole('button', { name: 'B' }));
    expect(group.style.getPropertyValue('--seg-index')).toBe('1');
  });
});
