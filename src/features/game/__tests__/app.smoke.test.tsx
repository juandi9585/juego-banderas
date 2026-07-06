import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../../../App';

// Smoke test de integración: monta la app REAL (dataset completo incluido),
// arranca una ronda y responde la primera pregunta. Detecta errores de
// cableado (provider, rutas, dataset) que los tests unitarios no ven.
describe('App (smoke)', () => {
  beforeEach(() => {
    window.history.pushState({}, '', '/');
  });

  it('renderiza la Home con el hero y el formulario', () => {
    render(<App />);
    expect(
      screen.getByRole('heading', { name: 'Banderas del mundo' }),
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Empezar' })).toBeInTheDocument();
    expect(screen.getByRole('group', { name: 'Continente' })).toBeInTheDocument();
  });

  it('arranca una ronda, responde y muestra la nota de campo', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole('button', { name: 'Empezar' }));

    // En /jugar: progreso 1 de 10 y 4 opciones (modo por defecto: bandera → nombre).
    const progress = screen.getByRole('progressbar');
    expect(progress).toHaveAttribute('aria-valuenow', '1');
    expect(progress).toHaveAttribute('aria-valuemax', '10');
    expect(
      screen.getByText('¿De qué país es esta bandera?'),
    ).toBeInTheDocument();

    const main = screen.getByRole('main');
    const options = within(main)
      .getAllByRole('button')
      .filter((b) => !b.textContent?.includes('Siguiente'));
    expect(options).toHaveLength(4);

    // Responder la primera opción: aparece feedback + nota de campo + siguiente.
    await user.click(options[0]);
    expect(screen.getByText('Nota de campo')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Siguiente' }),
    ).toBeInTheDocument();

    // Avanzar: el progreso pasa a 2.
    await user.click(screen.getByRole('button', { name: 'Siguiente' }));
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '2');
  });

  it('Explorar lista países y filtra por búsqueda', async () => {
    const user = userEvent.setup();
    window.history.pushState({}, '', '/explorar');
    render(<App />);

    expect(
      screen.getByRole('heading', { name: 'Explorar' }),
    ).toBeInTheDocument();

    const search = screen.getByRole('searchbox', { name: 'Buscar país' });
    await user.type(search, 'peru'); // sin tilde: la normalización debe encontrarlo
    expect(await screen.findByText('Perú')).toBeInTheDocument();
    expect(screen.getByText('1 país')).toBeInTheDocument();
  });
});
