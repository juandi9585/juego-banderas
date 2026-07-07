import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, within, act, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../../../App';
import { countries, findCountry } from '../../../data/dataset';
import {
  GAME_CATEGORIES,
  filterByCategories,
  type CategoryId,
} from '../categories';

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

    // Panel de puntaje (informativo en casual): etiqueta "Puntaje" + cifra > 0.
    // Con ≥ 1 acierto el puntaje es positivo (formato es-ES, p. ej. "1.350").
    const puntajeTag = screen.getByText('Puntaje');
    const puntos = Number(
      (puntajeTag.nextElementSibling?.textContent ?? '').replace(/\D/g, ''),
    );
    expect(puntos).toBeGreaterThan(0);

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

describe('Selector de categorías (Home)', () => {
  it('secuencia de aria-pressed y hints: Todos → Europa → +Oceanía → quitar → todas colapsa', async () => {
    const user = userEvent.setup();
    render(<App />);

    const group = screen.getByRole('group', { name: 'Categorías' });
    const chip = (name: string | RegExp) => within(group).getByRole('button', { name });
    // Hint calculado desde el dataset importado (NO hardcodeado).
    const hint = (ids: CategoryId[]) =>
      `${filterByCategories(ids, countries).length} países disponibles`;

    // Inicial: "Todos" encendido y el pool completo.
    expect(chip('Todos')).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByText(hint([]))).toBeInTheDocument();

    // Click "Europa": Europa on, Todos off, hint solo de Europa.
    await user.click(chip(/^Europa$/));
    expect(chip(/^Europa$/)).toHaveAttribute('aria-pressed', 'true');
    expect(chip('Todos')).toHaveAttribute('aria-pressed', 'false');
    expect(screen.getByText(hint(['europa']))).toBeInTheDocument();

    // + "Oceanía": ambas on, hint = unión.
    await user.click(chip(/^Oceanía$/));
    expect(chip(/^Oceanía$/)).toHaveAttribute('aria-pressed', 'true');
    expect(chip(/^Europa$/)).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByText(hint(['europa', 'oceania']))).toBeInTheDocument();

    // Des-clickear ambas: "Todos" se reenciende y vuelve el pool completo.
    await user.click(chip(/^Europa$/));
    await user.click(chip(/^Oceanía$/));
    expect(chip('Todos')).toHaveAttribute('aria-pressed', 'true');
    expect(chip(/^Europa$/)).toHaveAttribute('aria-pressed', 'false');
    expect(chip(/^Oceanía$/)).toHaveAttribute('aria-pressed', 'false');
    expect(screen.getByText(hint([]))).toBeInTheDocument();

    // Seleccionar TODAS las categorías visibles (las 17 menos 'mundo', que se
    // oculta porque el chip "Todos" cumple su rol) colapsa a "Todos".
    const visibles = GAME_CATEGORIES.filter((c) => c.id !== 'mundo');
    for (const cat of visibles) {
      await user.click(within(group).getByRole('button', { name: cat.label }));
    }
    expect(chip('Todos')).toHaveAttribute('aria-pressed', 'true');
    for (const cat of visibles) {
      expect(within(group).getByRole('button', { name: cat.label })).toHaveAttribute(
        'aria-pressed',
        'false',
      );
    }
    // 'mundo' NO se muestra como chip en el casual.
    expect(within(group).queryByRole('button', { name: 'Mundo' })).toBeNull();
  });

  it('ronda con la unión de dos categorías: cada país cae en Oceanía ∪ América del Sur hasta /resultado', async () => {
    const user = userEvent.setup();
    render(<App />);

    const group = screen.getByRole('group', { name: 'Categorías' });
    await user.click(within(group).getByRole('button', { name: 'Oceanía' }));
    await user.click(within(group).getByRole('button', { name: 'América del Sur' }));

    await user.click(screen.getByRole('button', { name: 'Empezar' }));

    const union = new Set(['Oceanía', 'América del Sur']);
    const total = 10;
    for (let i = 0; i < total; i++) {
      expect(screen.getByRole('progressbar')).toHaveAttribute(
        'aria-valuenow',
        String(i + 1),
      );

      const heroImg = screen.getByRole('img', { name: 'Bandera a identificar' });
      const country = findCountry(codeFromImg(heroImg))!;
      // El país preguntado pertenece a la unión seleccionada.
      expect(union.has(country.continent)).toBe(true);

      const main = screen.getByRole('main');
      const options = within(main)
        .getAllByRole('button')
        .filter((b) => b.getAttribute('aria-label') !== 'Salir del juego');
      expect(options).toHaveLength(4);
      const correct = options.find((b) => b.textContent === country.name)!;
      await user.click(correct);

      const nextLabel = i === total - 1 ? 'Ver resultado' : 'Siguiente';
      await user.click(screen.getByRole('button', { name: nextLabel }));
    }

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      `${total} de ${total}`,
    );
    expect(
      screen.getByRole('button', { name: 'Jugar otra vez' }),
    ).toBeInTheDocument();
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

// ─────────────────────────────────────────────────────────────────────────────
// Flujo COMPETITIVO completo con timers falsos: elegir categoría → jugar →
// dejar agotar una pregunta (timeout) → terminar → récord guardado → una segunda
// partida peor NO lo pisa. localStorage limpio por test (récords aislados).
// Se usa fireEvent (síncrono): userEvent no se combina bien con timers falsos.
// ─────────────────────────────────────────────────────────────────────────────
describe('Modo competitivo (récords locales)', () => {
  beforeEach(() => {
    localStorage.clear();
    // Reloj de pared falso: controla Date.now() y el intervalo del countdown.
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
  });

  const RECORD_KEY = 'asia-meridional:mixto';

  /** Los 4 botones de opción de la pregunta (excluye "Salir del juego"). */
  function optionButtons() {
    const main = screen.getByRole('main');
    return within(main)
      .getAllByRole('button')
      .filter((b) => b.getAttribute('aria-label') !== 'Salir del juego');
  }

  /** Modo de la pregunta actual, detectado por su prompt (mixto alterna ambos). */
  function currentQuestionMode(): 'flag' | 'name' {
    return screen.queryByText('¿De qué país es esta bandera?') ? 'flag' : 'name';
  }

  /** Nombre del país correcto de la pregunta actual (sin revelarlo por el alt). */
  function correctNameNow(): string {
    if (currentQuestionMode() === 'flag') {
      const hero = screen.getByRole('img', { name: 'Bandera a identificar' });
      return findCountry(codeFromImg(hero))!.name;
    }
    const prompt = screen.getByText('¿Cuál es la bandera de…');
    return prompt.nextElementSibling?.textContent ?? '';
  }

  /** ¿El botón `b` corresponde al país `name` en el modo actual? */
  function labelMatches(b: HTMLElement, name: string): boolean {
    return currentQuestionMode() === 'flag'
      ? b.textContent === name
      : b.getAttribute('aria-label') === name;
  }

  function answerCurrent(opts: { correct: boolean }) {
    const name = correctNameNow();
    const buttons = optionButtons();
    const target = opts.correct
      ? buttons.find((b) => labelMatches(b, name))
      : buttons.find((b) => !labelMatches(b, name));
    fireEvent.click(target!);
  }

  /** Deja agotar los 10 s de la pregunta actual (fallo automático). */
  function letTimeout() {
    act(() => {
      vi.advanceTimersByTime(10_200);
    });
  }

  function advance(isLast: boolean) {
    fireEvent.click(
      screen.getByRole('button', { name: isLast ? 'Ver resultado' : 'Siguiente' }),
    );
  }

  it('elegir categoría → timeout de una pregunta → récord; una partida peor no lo pisa', () => {
    window.history.pushState({}, '', '/competitivo');
    render(<App />);

    // Página del competitivo: hero de marca + radiogroup de zonas.
    expect(screen.getByRole('heading', { name: 'Contrarreloj' })).toBeInTheDocument();
    expect(
      screen.getByRole('radiogroup', { name: 'Elige dónde competir' }),
    ).toBeInTheDocument();

    // CTA deshabilitada hasta elegir.
    const comenzar = screen.getByRole('button', { name: 'Comenzar' });
    expect(comenzar).toBeDisabled();
    expect(screen.getByText('Primero elige dónde competir.')).toBeInTheDocument();

    // Elegir "Asia Meridional" (pool 9 → 9 preguntas; partida corta pero justa).
    fireEvent.click(screen.getByRole('radio', { name: /Asia Meridional/ }));
    expect(comenzar).toBeEnabled();
    fireEvent.click(comenzar);

    // En /jugar: 9 preguntas (min(20, 9)).
    const total = 9;
    expect(screen.getByRole('progressbar')).toHaveAttribute(
      'aria-valuemax',
      String(total),
    );

    // Q0: dejar agotar el tiempo → hoja variante timeout con el país correcto.
    const timedOutName = correctNameNow();
    letTimeout();
    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveAttribute('aria-label', 'Se acabó el tiempo');
    expect(within(dialog).getByText(/Se acabó el tiempo/)).toBeInTheDocument();
    const aside = within(dialog).getByText('Nota de campo').closest('aside')!;
    expect(within(aside).getByText(timedOutName)).toBeInTheDocument();
    advance(false);

    // Q1..Q8: responder correctamente (puntúa > 0).
    for (let i = 1; i < total; i++) {
      answerCurrent({ correct: true });
      advance(i === total - 1);
    }

    // /resultado: nuevo récord (el primero) y récord persistido en localStorage.
    expect(screen.getByText('¡Nuevo récord!')).toBeInTheDocument();
    expect(screen.getByText('Tu primer récord')).toBeInTheDocument();

    const stored = JSON.parse(localStorage.getItem('banderas:records:v1')!);
    expect(stored[RECORD_KEY]).toBeDefined();
    const firstPoints: number = stored[RECORD_KEY].points;
    expect(firstPoints).toBeGreaterThan(0);
    expect(stored[RECORD_KEY].correct).toBe(8); // 8 aciertos de 9

    // Segunda partida (misma categoría, semilla nueva) fallando todo → 0 puntos.
    fireEvent.click(screen.getByRole('button', { name: 'Jugar otra vez' }));
    for (let i = 0; i < total; i++) {
      answerCurrent({ correct: false });
      advance(i === total - 1);
    }

    // No es récord: se muestra la marca a batir y el récord guardado no cambia.
    expect(screen.queryByText('¡Nuevo récord!')).not.toBeInTheDocument();
    expect(
      screen.getByText(`Récord ${firstPoints.toLocaleString('es-ES')} pts`),
    ).toBeInTheDocument();

    const after = JSON.parse(localStorage.getItem('banderas:records:v1')!);
    expect(after[RECORD_KEY].points).toBe(firstPoints); // intacto
    expect(after[RECORD_KEY].correct).toBe(8);
  });

  it('el récord persiste tras "recargar" (remontar la app relee localStorage)', () => {
    window.history.pushState({}, '', '/competitivo');
    const first = render(<App />);

    // Partida en Asia Meridional acertando las 9 → primer récord.
    fireEvent.click(screen.getByRole('radio', { name: /Asia Meridional/ }));
    fireEvent.click(screen.getByRole('button', { name: 'Comenzar' }));
    const total = 9;
    for (let i = 0; i < total; i++) {
      answerCurrent({ correct: true });
      advance(i === total - 1);
    }
    expect(screen.getByText('¡Nuevo récord!')).toBeInTheDocument();
    const points: number = JSON.parse(
      localStorage.getItem('banderas:records:v1')!,
    )[RECORD_KEY].points;
    expect(points).toBeGreaterThan(0);

    // "Recargar": desmontar TODA la app y montarla de cero. El nuevo
    // RecordsProvider relee localStorage al montar (useState(loadRecords)).
    first.unmount();
    window.history.pushState({}, '', '/competitivo');
    render(<App />);

    // La fila de Asia Meridional muestra el récord persistido (no "Aún sin récord").
    expect(
      screen.getByText(`Récord ${points.toLocaleString('es-ES')} pts`),
    ).toBeInTheDocument();
    const row = screen
      .getByRole('radio', { name: /Asia Meridional/ })
      .closest('label')!;
    expect(within(row).queryByText('Aún sin récord')).toBeNull();
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// AISLAMIENTO casual ↔ competitivo. El casual queda INTACTO: sin countdown de
// 10 s, sin timeout y sin récords, aunque se haya visitado antes /competitivo.
// ─────────────────────────────────────────────────────────────────────────────
describe('Casual: aislamiento del competitivo (sin countdown ni récords)', () => {
  it('el casual NO monta el countdown de 10 s (sin glifo ◷ ni aviso)', async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByRole('button', { name: 'Empezar' }));

    // Pregunta activa sin responder: en competitivo aquí estaría la lectura ◷ y,
    // al cruzar el umbral, el aviso one-shot. En casual no existe ninguno.
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '1');
    expect(screen.queryByText('◷')).toBeNull();
    expect(screen.queryByText('Quedan 3 segundos.')).toBeNull();
  });

  it('visitar /competitivo y volver a jugar casual no arrastra la config competitiva', async () => {
    const user = userEvent.setup();
    render(<App />);

    // Visitar Competir (sin empezar) y volver a Jugar (Home).
    await user.click(screen.getByRole('link', { name: 'Competir' }));
    expect(
      screen.getByRole('heading', { name: 'Contrarreloj' }),
    ).toBeInTheDocument();
    await user.click(screen.getByRole('link', { name: 'Jugar' }));

    // Arrancar casual y completar la ronda por defecto (10). Nunca hay countdown.
    await user.click(screen.getByRole('button', { name: 'Empezar' }));
    const total = 10;
    for (let i = 0; i < total; i++) {
      expect(screen.queryByText('◷')).toBeNull();
      const main = screen.getByRole('main');
      const options = within(main)
        .getAllByRole('button')
        .filter((b) => b.getAttribute('aria-label') !== 'Salir del juego');
      await user.click(options[0]);
      await user.click(
        screen.getByRole('button', {
          name: i === total - 1 ? 'Ver resultado' : 'Siguiente',
        }),
      );
    }

    // Resultado casual: panel informativo "Puntaje", nunca banner de récord.
    expect(screen.getByText('Puntaje')).toBeInTheDocument();
    expect(screen.queryByText('¡Nuevo récord!')).toBeNull();
    expect(screen.queryByText(/^Récord .* pts$/)).toBeNull();
  });
});
