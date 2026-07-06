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

/** Taxonomía de continentes en español (6 valores; América dividida). */
export type Continent =
  | 'África'
  | 'América del Norte'
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

export type ContinentFilter = Continent | 'all';

export interface QuizConfig {
  mode: GameMode;
  continent: ContinentFilter; // 'all' = todos los continentes
  questionCount: number; // preset o total del pool filtrado ("todas")
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
}

export interface GameResult {
  config: QuizConfig;
  total: number;
  correctCount: number;
  answers: AnswerRecord[];
  // derivado en UI: accuracy = correctCount / total
}

// Valor expuesto por el contexto de juego (GameProvider) y consumido con useGame().
export interface GameContextValue {
  state: GameState;
  // Acciones
  startGame: (config: QuizConfig) => void;
  answerCurrent: (value: string) => void; // code (MC) o texto (escribir)
  next: () => void;
  restart: () => void; // nueva ronda con el mismo config
  reset: () => void; // vuelve a idle
  // Selectores derivados
  currentQuestion: QuizQuestion | null;
  currentAnswer: AnswerRecord | null;
  progress: { current: number; total: number };
  result: GameResult | null;
}
