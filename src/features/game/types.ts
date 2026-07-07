// Tipos del motor de juego. PROPIEDAD: frontend-engineer.
//
// ─────────────────────────────────────────────────────────────────────────────
// NOTA de reconexión con el dataset (decisión final): `src/data/countries.ts`
// es AUTOGENERADO y exporta un `Country` laxo (`continent: string`, sin
// `aliases`); editarlo a mano se perdería al regenerar. Por eso el contrato
// ESTRICTO del plan (§3.1, con la corrección acordada de 6 continentes) vive
// aquí, y `src/data/dataset.ts` es la única frontera que adapta el dataset
// crudo a este tipo (los 6 valores de continente están garantizados por
// scripts/validate-data.mjs) e inyecta los aliases curados. Toda la app importa
// `Country`/`Continent` de este archivo y los datos de `src/data/dataset.ts`.
// ─────────────────────────────────────────────────────────────────────────────

// `import type` (solo tipos, se borra en runtime) evita un ciclo real con
// `categories.ts`, que a su vez importa `Country` de este módulo.
import type { CategoryId } from './categories';

/** Taxonomía de continentes en español (6 valores; América dividida). */
export type Continent =
  | 'África'
  | 'América del Norte y Centro'
  | 'América del Sur'
  | 'Asia'
  | 'Europa'
  | 'Oceanía';

export type Country = {
  code: string; // ISO 3166-1 alpha-2, minúsculas (ej. "fr")
  name: string; // nombre en español (ej. "Francia")
  officialName?: string; // ej. "República Francesa"
  continent: Continent; // union, no string libre (habilita el filtro sin adivinar)
  region?: string; // subregión (ej. "Europa Occidental")
  capital: string;
  population?: number;
  flag: string; // ruta del SVG local: "/flags/{code}.svg"
  facts: string[]; // 2–4 datos culturales en español
  aliases?: string[]; // nombres alternativos aceptados en modo escribir
};

// ─── Tipos propios del motor de juego ────────────────────────────────────────

export type GameMode = 'flag-to-name' | 'name-to-flag' | 'type-name';

// Modo de una RONDA. Además de los 3 modos por pregunta, el competitivo añade
// 'mixto' (alterna los 2 de opción múltiple pregunta a pregunta). La variante
// futura "escrito" (solo 'type-name') encaja aquí sin migrar (docs/competitivo
// §3.1). `QuizQuestion.mode` sigue siendo un GameMode concreto (nunca 'mixto').
export type RoundMode = GameMode | 'mixto';

// Filtro de selección SIMPLE por continente ('all' = todos). Hoy solo lo usa
// Explorar; el juego filtra por `QuizConfig.categories` (selección múltiple).
export type ContinentFilter = Continent | 'all';

export interface QuizConfig {
  mode: RoundMode; // competitivo v1: siempre 'mixto'
  // Ids canónicos del catálogo de categorías (orden del catálogo, sin
  // duplicados); [] = todas las categorías (pool completo).
  // COMPETITIVO: contiene EXACTAMENTE UNA categoría (invariante de su UI) —
  // `categories[0]` es la clave del récord (incluye 'mundo' sin canonicalizar).
  categories: CategoryId[];
  questionCount: number; // preset o total del pool filtrado ("todas")
  // Presencia = ronda COMPETITIVA (countdown de 10 s, timeout, récord). La
  // semilla hace la ronda reproducible (mulberry32) — pieza de la validación
  // en servidor de la Fase 2 (docs/competitivo.md §5).
  competitive?: { seed: number };
}

export type QuestionKind = 'multiple-choice' | 'text-input';

export interface QuizQuestion {
  id: string; // estable dentro de la ronda: `${index}-${country.code}`
  mode: GameMode;
  kind: QuestionKind; // MC para flag-to-name/name-to-flag; text para type-name
  country: Country; // país correcto (fuente de la ficha y del label correcto)
  correctCode: string; // === country.code
  options?: Country[]; // solo en MC: países ya barajados (incluye el correcto)
}

export interface AnswerRecord {
  questionId: string;
  correct: boolean;
  correctCode: string;
  givenCode?: string; // MC: código elegido
  givenText?: string; // texto: entrada cruda del usuario
  // ms desde que la pregunta quedó activa hasta responder (§4.3 competitivo).
  // La hoja de datos curiosos entre preguntas NO cuenta (el reloj se reinicia
  // en NEXT). Ausente si no había base temporal. Fuente del bonus de velocidad.
  elapsedMs?: number;
  // Competitivo (§4.3): la acción TIMEOUT del reducer lo marca cuando se agota
  // el countdown de 10 s (fallo automático). En el casual no hay timeout, así
  // que allí queda ausente y la respuesta es un fallo por toque erróneo normal.
  timedOut?: boolean;
}

export type GameStatus = 'idle' | 'playing' | 'finished';

export interface GameState {
  status: GameStatus;
  config: QuizConfig | null;
  questions: QuizQuestion[];
  currentIndex: number;
  answers: AnswerRecord[]; // answers[i] existe cuando la pregunta i fue respondida
  // --- Costuras de gamificación (declaradas, sin usar en MVP; ver plan §5) ---
  startedAt?: number;
  finishedAt?: number;
  // Timestamp de cuándo la pregunta ACTUAL quedó visible. Se marca en
  // START/RESTART y en NEXT (al avanzar). La hoja de datos curiosos NO cuenta
  // porque el reloj se reinicia en NEXT, no al abrir la hoja. Base para
  // AnswerRecord.elapsedMs (§4.3).
  questionStartedAt?: number;
}

export interface GameResult {
  config: QuizConfig;
  total: number;
  correctCount: number;
  answers: AnswerRecord[];
  // finishedAt − startedAt (si ambos existen). Insumo de Score.durationMs (§4.4).
  durationMs?: number;
  // derivado en UI: accuracy = correctCount / total
}

// Valor expuesto por el contexto de juego (GameProvider) y consumido con useGame().
export interface GameContextValue {
  state: GameState;
  // Acciones
  startGame: (config: QuizConfig) => void;
  answerCurrent: (value: string) => void; // code (MC) o texto (escribir)
  timeoutCurrent: () => void; // competitivo: fallo automático al agotar los 10 s
  next: () => void;
  restart: () => void; // nueva ronda con el mismo config
  reset: () => void; // vuelve a idle
  // Selectores derivados
  currentQuestion: QuizQuestion | null;
  currentAnswer: AnswerRecord | null;
  progress: { current: number; total: number };
  result: GameResult | null;
}
