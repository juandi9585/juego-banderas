import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../../../App';
import { findCountry } from '../../../data/dataset';

// ─────────────────────────────────────────────────────────────────────────────
// Tests de INTEGRACIÓN sobre la App real (dataset completo, router, provider).
// Estrategia para deterministas sin inyectar RNG: la ronda es aleatoria, pero el
// país correcto es observable en el DOM (el <img> de la bandera lleva el src
// "/flags/{code}.svg"). Así se puede elegir a propósito la opción correcta o una
// incorrecta y verificar aciertos, fallos y el marcador final.
// ─────────────────────────────────────────────────────────────────────────────

/** Extrae el código ISO del país a partir del src de una bandera. */
function codeFromImg(img: Element): string {
  const src = img.getAttribute('src') ?? '';
  const m = src.match(/\/flags\/([a-z0-9]+)\.svg/i);
  if (!m) throw new Error(`sin código de bandera en src: ${src}`);
  return m[1].toLowerCase();
}

/** Quita tildes/diacríticos (para tipear variantes normalizadas en el modo escribir). */
function stripAccents(s: string): string {
  return s.normalize('NFD').replace(/[̀-ͯ]/g, '');
}

function startAtHome() {
  window.history.pushState({}, '', '/');
}

async function chooseMode(user: ReturnType<typeof userEvent.setup>, label: string) {
  await user.click(screen.getByRole('button', { name: label }));
}

beforeEach(() => {
  startAtHome();
});

describe('Modo bandera → nombre (ronda completa)', () => {
  it('acierta y falla a propósito; llega a /resultado con el marcador y las falladas', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole('button', { name: 'Empezar' }));

    const total = 10;
    let correctCount = 0;
    const failedNames: string[] = [];

    for (let i = 0; i < total; i++) {
      // Progreso i+1 de 10.
      expect(screen.getByRole('progressbar')).toHaveAttribute(
        'aria-valuenow',
        String(i + 1),
      );

      // La bandera-pregunta revela el país correcto por su src (el alt NO lo revela).
      const heroImg = screen.getByRole('img', { name: 'Bandera a identificar' });
      const correctName = findCountry(codeFromImg(heroImg))!.name;

      const main = screen.getByRole('main');
      const options = within(main)
        .getAllByRole('button')
        .filter((b) => b.getAttribute('aria-label') !== 'Salir del juego');
      expect(options).toHaveLength(4);
      // La opción correcta SIEMPRE está entre las 4.
      expect(options.some((b) => b.textContent === correctName)).toBe(true);

      // Fallamos a propósito la pregunta índice 1; el resto se aciertan.
      let target: HTMLElement | undefined;
      if (i === 1) {
        target = options.find((b) => b.textContent !== correctName);
        failedNames.push(correctName);
      } else {
        target = options.find((b) => b.textContent === correctName);
        correctCount++;
      }
      await user.click(target!);

      // Feedback: banda de estado + nota de campo.
      expect(screen.getByText('Nota de campo')).toBeInTheDocument();
      if (i === 1) {
        expect(screen.getByText(/^Era/)).toBeInTheDocument();
      } else {
        expect(screen.getByText('¡Correcto!')).toBeInTheDocument();
      }

      const nextLabel = i === total - 1 ? 'Ver resultado' : 'Siguiente';
      await user.click(screen.getByRole('button', { name: nextLabel }));
    }

    // En /resultado: marcador correcto y país fallado listado.
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      `${correctCount} de ${total}`,
    );
    expect(screen.getByText('Para repasar')).toBeInTheDocument();
    for (const name of failedNames) {
      expect(screen.getByText(name)).toBeInTheDocument();
    }
    expect(
      screen.getByRole('button', { name: 'Jugar otra vez' }),
    ).toBeInTheDocument();
  });
});

describe('Modo nombre → bandera', () => {
  it('renderiza 4 banderas sin revelar la respuesta en el alt; marca correcta/incorrecta', async () => {
    const user = userEvent.setup();
    render(<App />);

    await chooseMode(user, 'Nombre → bandera');
    await user.click(screen.getByRole('button', { name: 'Empezar' }));

    // País pedido (texto bajo el prompt).
    const prompt = screen.getByText('¿Cuál es la bandera de…');
    const correctName = prompt.nextElementSibling?.textContent ?? '';
    expect(correctName.length).toBeGreaterThan(0);

    const main = screen.getByRole('main');

    // Las banderas-opción no exponen alt (alt="") => 0 imágenes en el árbol a11y.
    expect(within(main).queryAllByRole('img')).toHaveLength(0);
    // Pero sí hay 4 <img> con alt vacío (no revelan).
    const imgs = main.querySelectorAll('img');
    expect(imgs).toHaveLength(4);
    imgs.forEach((img) => expect(img.getAttribute('alt')).toBe(''));

    // Los 4 botones llevan aria-label con el nombre del país (accesibilidad).
    // Se excluye el botón "Salir del juego" de la barra superior.
    const optionButtons = within(main)
      .getAllByRole('button')
      .filter((b) => {
        const label = b.getAttribute('aria-label');
        return label && label !== 'Salir del juego';
      });
    expect(optionButtons).toHaveLength(4);

    // Respondemos MAL a propósito: verifica marca incorrecta + resalte de la correcta.
    const wrong = optionButtons.find(
      (b) => b.getAttribute('aria-label') !== correctName,
    )!;
    const correct = optionButtons.find(
      (b) => b.getAttribute('aria-label') === correctName,
    )!;
    await user.click(wrong);

    expect(screen.getByText(/^Era/)).toHaveTextContent(correctName);
    expect(wrong.textContent).toContain('✕'); // elegida marcada incorrecta
    expect(correct.textContent).toContain('✓'); // la correcta se resalta
  });

  it('marca la selección correcta como acierto', async () => {
    const user = userEvent.setup();
    render(<App />);

    await chooseMode(user, 'Nombre → bandera');
    await user.click(screen.getByRole('button', { name: 'Empezar' }));

    const prompt = screen.getByText('¿Cuál es la bandera de…');
    const correctName = prompt.nextElementSibling?.textContent ?? '';
    const main = screen.getByRole('main');
    const correct = within(main)
      .getAllByRole('button')
      .find((b) => b.getAttribute('aria-label') === correctName)!;

    await user.click(correct);
    expect(screen.getByText('¡Correcto!')).toBeInTheDocument();
    expect(correct.textContent).toContain('✓');
  });
});

describe('Modo escribir el nombre', () => {
  it('acepta el nombre correcto (con mayúsculas/tildes/espacios) y muestra acierto', async () => {
    const user = userEvent.setup();
    render(<App />);

    await chooseMode(user, 'Escribir el nombre');
    await user.click(screen.getByRole('button', { name: 'Empezar' }));

    const heroImg = screen.getByRole('img', { name: 'Bandera a identificar' });
    const correctName = findCountry(codeFromImg(heroImg))!.name;

    const input = screen.getByRole('textbox', { name: 'Nombre del país' });
    // Variante normalizada: sin tildes, en mayúsculas y con espacios de sobra.
    await user.type(input, `  ${stripAccents(correctName).toUpperCase()}  `);
    await user.click(screen.getByRole('button', { name: 'Comprobar' }));

    expect(screen.getByText('¡Correcto!')).toBeInTheDocument();
    expect(input).toBeDisabled();
  });

  it('respuesta vacía no crashea ni avanza; respuesta mal escrita marca error y muestra el nombre correcto', async () => {
    const user = userEvent.setup();
    render(<App />);

    await chooseMode(user, 'Escribir el nombre');
    await user.click(screen.getByRole('button', { name: 'Empezar' }));

    const heroImg = screen.getByRole('img', { name: 'Bandera a identificar' });
    const correctName = findCountry(codeFromImg(heroImg))!.name;

    const input = screen.getByRole('textbox', { name: 'Nombre del país' });

    // Enviar vacío: "Comprobar" está deshabilitado y Enter no hace nada => sin feedback.
    expect(screen.getByRole('button', { name: 'Comprobar' })).toBeDisabled();
    await user.type(input, '{Enter}');
    expect(screen.queryByText('Nota de campo')).not.toBeInTheDocument();

    // Respuesta claramente incorrecta.
    await user.type(input, 'paisinexistentexyz');
    await user.click(screen.getByRole('button', { name: 'Comprobar' }));

    expect(screen.getByText(/^Era/)).toHaveTextContent(correctName);
    // La nota de campo muestra el país correcto.
    expect(within(screen.getByText('Nota de campo').closest('aside')!).getByText(correctName)).toBeInTheDocument();
    expect(input).toBeDisabled();
  });
});

describe('Hoja nota de campo (bottom sheet)', () => {
  /** Arranca la ronda por defecto y responde la 1.ª opción; deja la hoja abierta. */
  async function openSheet(user: ReturnType<typeof userEvent.setup>) {
    render(<App />);
    await user.click(screen.getByRole('button', { name: 'Empezar' }));
    const main = screen.getByRole('main');
    const options = within(main)
      .getAllByRole('button')
      .filter((b) => b.getAttribute('aria-label') !== 'Salir del juego');
    await user.click(options[0]);
    return screen.getByRole('dialog');
  }

  it('abre un diálogo modal, el foco aterriza dentro y muestra exactamente 2 datos', async () => {
    const user = userEvent.setup();
    const dialog = await openSheet(user);

    expect(dialog).toHaveAttribute('aria-modal', 'true');
    // Foco dentro de la hoja al abrirse (arregla el hallazgo de foco del MVP).
    expect(dialog.contains(document.activeElement)).toBe(true);

    // Exactamente 2 datos curiosos en la nota de campo (el pool del país tiene más).
    const aside = within(dialog).getByText('Nota de campo').closest('aside')!;
    expect(within(aside).getAllByRole('listitem')).toHaveLength(2);
  });

  it('el scrim NO avanza; solo el CTA cierra la hoja y pasa a la siguiente', async () => {
    const user = userEvent.setup();
    const dialog = await openSheet(user);

    // El scrim es el hermano previo de la hoja; tocarlo no cierra ni avanza.
    // (El progreso queda inert/aria-hidden detrás mientras la hoja está abierta.)
    const scrim = dialog.previousElementSibling as HTMLElement;
    await user.click(scrim);
    expect(screen.getByRole('dialog')).toBeInTheDocument();

    // El CTA sí avanza: la hoja se cierra y el progreso pasa de 1 a 2.
    await user.click(screen.getByRole('button', { name: 'Siguiente' }));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '2');
  });

  it('Esc equivale al CTA: avanza a la siguiente pregunta', async () => {
    const user = userEvent.setup();
    await openSheet(user);

    await user.keyboard('{Escape}');
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '2');
  });
});

describe('Explorar', () => {
  it('busca por "marfil", filtra por continente combinado y abre el detalle', async () => {
    const user = userEvent.setup();
    window.history.pushState({}, '', '/explorar');
    render(<App />);

    expect(screen.getByRole('heading', { name: 'Explorar' })).toBeInTheDocument();

    const search = screen.getByRole('searchbox', { name: 'Buscar país' });
    await user.type(search, 'marfil');
    expect(await screen.findByText('Costa de Marfil')).toBeInTheDocument();
    expect(screen.getByText('1 país')).toBeInTheDocument();

    // El alias internacional también la encuentra ("Côte d'Ivoire", sin tildes).
    await user.clear(search);
    await user.type(search, 'cote');
    expect(await screen.findByText('Costa de Marfil')).toBeInTheDocument();

    // Búsqueda + continente combinados: Costa de Marfil es de África; con "Europa"
    // no debe aparecer y se muestra el vacío.
    const picker = screen.getByRole('group', { name: 'Continente' });
    await user.click(within(picker).getByRole('button', { name: 'Europa' }));
    expect(screen.queryByText('Costa de Marfil')).not.toBeInTheDocument();
    expect(screen.getByText(/Ningún país coincide/)).toBeInTheDocument();

    // Volver a África (donde sí está) y entrar al detalle.
    await user.click(within(picker).getByRole('button', { name: 'África' }));
    await user.click(await screen.findByText('Costa de Marfil'));

    expect(
      screen.getByRole('heading', { name: 'Costa de Marfil' }),
    ).toBeInTheDocument();
    expect(screen.getByText('Yamusukro')).toBeInTheDocument(); // capital
    expect(screen.getByText('Notas de campo')).toBeInTheDocument(); // facts
    expect(
      screen.getByText(/mayor productor mundial de cacao/),
    ).toBeInTheDocument();
  });

  it('URL de país inválida /explorar/zz da 404 controlado', () => {
    window.history.pushState({}, '', '/explorar/zz');
    render(<App />);
    expect(screen.getByText('404')).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: 'No encontramos esta página' }),
    ).toBeInTheDocument();
  });
});
