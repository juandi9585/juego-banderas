# Plan técnico del MVP — Banderas del Mundo

> Autor: **product-architect**. Estado del repo al planificar: solo `.git`, `.gitattributes`,
> `CLAUDE.md` y `.claude/` (skills + agents). Sin scaffold. Este documento es la especificación
> que ejecutan **frontend-engineer** (implementación), **data-curator** (dataset) y **ui-designer**
> (tokens). No contiene código de la app; los bloques de código son **contratos y configuración de
> referencia**, no archivos ya escritos.

---

## 0. Objetivo del MVP

PWA mobile-first, en español, para aprender banderas con datos culturales. Cuatro capacidades:

1. Modo **bandera → nombre** (4 opciones).
2. Modo **nombre → bandera** (4 opciones).
3. Modo **escribir el nombre** (input tolerante a tildes/mayúsculas/espacios/variantes).
4. **Filtro por continente** para acotar la ronda.
5. **Ficha cultural tras responder** + **modo Explorar** (enciclopedia navegable).

Fuera del MVP (pero con costuras de extensión diseñadas): puntos, rachas, vidas, récords, logros.

---

## 1. Scaffolding (Vite + React + TS en directorio NO vacío, Windows / PowerShell 5.1)

### Problema
`npm create vite` sobre una carpeta con archivos lanza un prompt interactivo. La bandera
`--overwrite` de create-vite **vacía el directorio destino** (borraría `.git`, `CLAUDE.md`,
`.claude/`) — **prohibida aquí**. PowerShell 5.1 no tiene `&&`; los comandos se separan por línea
o `;`.

### Estrategia recomendada: scaffold en subcarpeta temporal y mover
Robusta e independiente de la versión de create-vite. Se genera en una carpeta **nueva y vacía**
(sin prompt), y luego se mueven los archivos a la raíz sin tocar los existentes.

```powershell
# 1. Generar en subcarpeta nueva (vacía => sin prompt interactivo). --yes evita el prompt de npx.
npx --yes create-vite@latest vite-temp --template react-ts

# 2. Mover TODO (incluye dotfiles como .gitignore) de vite-temp a la raíz. -Force incluye ocultos.
Get-ChildItem -Path .\vite-temp -Force | Move-Item -Destination . -Force

# 3. Borrar la carpeta temporal ya vacía.
Remove-Item .\vite-temp -Recurse -Force

# 4. Instalar dependencias base.
npm install

# 5. Añadir router (runtime) y PWA + testing (dev).
npm install react-router-dom
npm install -D vite-plugin-pwa
npm install -D vitest jsdom @testing-library/react @testing-library/jest-dom @testing-library/user-event @types/node
```

Notas:
- No ejecutar `npm install` dentro de `vite-temp` (así no hay `node_modules` que mover; el paso 2 es
  instantáneo).
- El template `react-ts` no genera archivos que colisionen con `CLAUDE.md`, `.claude/`, `.git` ni
  `.gitattributes`. Sí aporta un `.gitignore` (deseado) y un `README.md` (no teníamos: se acepta).
- Si una versión futura de create-vite añadiera un prompt aun con `--template` (p. ej. la variante
  experimental *rolldown-vite* de create-vite 7), **fijar la major**: `npx create-vite@6 vite-temp
  --template react-ts`. La variante experimental solo aparece en modo interactivo.

### Estrategia de respaldo (si el scaffolder fallara): escribir los archivos base a mano
Crear manualmente `package.json`, `index.html`, `src/main.tsx`, `src/App.tsx`, `vite.config.ts`,
`tsconfig*.json`, `.gitignore` con el mismo contenido que produce el template `react-ts` y luego
`npm install`. Solo como último recurso; la estrategia de subcarpeta es la primaria.

### `vite.config.ts` (referencia — incluye PWA y Vitest)
```ts
/// <reference types="vitest/config" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg'],
      // Precachear el shell, los datos y TODAS las banderas (SVG diminutos) => offline garantizado.
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,woff2}'],
      },
      manifest: {
        name: 'Banderas del Mundo',
        short_name: 'Banderas',
        description: 'Aprende las banderas y la cultura de los países del mundo.',
        lang: 'es',
        theme_color: '#000000',      // reemplazar con token de ui-designer
        background_color: '#ffffff', // reemplazar con token de ui-designer
        display: 'standalone',
        start_url: '/',
        icons: [
          { src: '/icons/pwa-192x192.png', sizes: '192x192', type: 'image/png' },
          { src: '/icons/pwa-512x512.png', sizes: '512x512', type: 'image/png' },
          { src: '/icons/maskable-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      devOptions: { enabled: false }, // activar solo si se quiere probar el SW en dev
    }),
  ],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts', // importa @testing-library/jest-dom
  },
});
```

Añadir a `src/vite-env.d.ts`: `/// <reference types="vite-plugin-pwa/react" />` (tipos del módulo
virtual `virtual:pwa-register/react`). Iconos PWA (`public/icons/*.png`): **responsabilidad de
ui-designer**; usar placeholders hasta que existan (ver Riesgo R11).

`package.json` scripts esperados: `dev`, `build`, `preview` (del template) + `test` (`vitest`) y
`test:run` (`vitest run`).

---

## 2. Estructura de archivos del MVP

Elaboración de la "Estructura sugerida" de `CLAUDE.md` (misma raíz `data/`, `components/`,
`features/game`, `features/explore`, `styles/tokens.css`; se añaden `pages/`, `lib/` y `test/`).

```
juego-banderas/
├─ index.html
├─ package.json
├─ vite.config.ts
├─ tsconfig.json  tsconfig.app.json  tsconfig.node.json
├─ public/
│  ├─ flags/                      # data-curator: {code}.svg (ISO alpha-2 minúsculas)
│  ├─ icons/                      # ui-designer: pwa-192, pwa-512, maskable-512
│  └─ favicon.svg
└─ src/
   ├─ main.tsx                    # monta <App/>
   ├─ App.tsx                     # Router + <GameProvider> + layout global
   ├─ vite-env.d.ts               # + reference a vite-plugin-pwa/react
   ├─ data/
   │  └─ countries.ts             # data-curator: type Country, type Continent, const countries
   ├─ styles/
   │  ├─ tokens.css               # ui-designer: custom properties (colores, tipografía, radios…)
   │  └─ global.css               # reset, base, importa tokens.css
   ├─ lib/
   │  ├─ text.ts                  # normalize(), matchesCountryName()
   │  ├─ text.test.ts
   │  └─ random.ts                # shuffle(), sample() con RNG inyectable
   ├─ features/
   │  ├─ game/
   │  │  ├─ types.ts              # GameMode, QuizConfig, QuizQuestion, GameState, GameResult…
   │  │  ├─ constants.ts          # OPTIONS_PER_QUESTION, presets de nº de preguntas, CONTINENTS
   │  │  ├─ engine.ts             # PURO: buildQuiz, buildQuestion, pickDistractors, checkChoice, checkTypedAnswer
   │  │  ├─ engine.test.ts
   │  │  ├─ gameReducer.ts        # reducer + acciones (START/ANSWER/NEXT/RESTART/RESET)
   │  │  ├─ GameProvider.tsx      # Context.Provider (envuelve el reducer)
   │  │  ├─ useGame.ts            # hook de consumo del contexto
   │  │  └─ components/
   │  │     ├─ ProgressBar.tsx
   │  │     ├─ OptionButton.tsx
   │  │     ├─ FlagToNameQuestion.tsx
   │  │     ├─ NameToFlagQuestion.tsx
   │  │     ├─ TypeNameQuestion.tsx
   │  │     └─ AnswerFeedback.tsx   # acierto/error + <FactCard>
   │  └─ explore/
   │     ├─ useCountries.ts       # filtrado/búsqueda/selectores del dataset
   │     ├─ CountryCard.tsx
   │     └─ (detalle se renderiza en pages/CountryDetailPage)
   ├─ components/                 # UI compartida
   │  ├─ FlagImage.tsx            # <img> desde country.flag + alt accesible
   │  ├─ Button.tsx
   │  ├─ FactCard.tsx             # ficha cultural (reusada en juego y Explorar)
   │  ├─ ContinentPicker.tsx
   │  ├─ SegmentedControl.tsx     # elegir modo / nº preguntas
   │  ├─ AppHeader.tsx            # navegación Jugar / Explorar
   │  └─ *.module.css             # CSS Modules por componente
   ├─ pages/                      # vistas a nivel de ruta
   │  ├─ HomePage.tsx
   │  ├─ GamePage.tsx
   │  ├─ ResultPage.tsx
   │  ├─ ExplorePage.tsx
   │  ├─ CountryDetailPage.tsx
   │  └─ NotFoundPage.tsx
   └─ test/
      └─ setup.ts                 # importa @testing-library/jest-dom
```

**Propiedad de archivos:** `data/countries.ts` y `public/flags/*` → data-curator.
`styles/tokens.css` e `public/icons/*` → ui-designer. El resto → frontend-engineer.

---

## 3. Contratos TypeScript

### 3.1 `Country` (refinado) y `Continent` — viven en `src/data/countries.ts` (data-curator)
Fuente única del tipo para evitar definiciones duplicadas; frontend-engineer hace
`import type { Country, Continent } from '../data/countries'`.

> **Anotación (implementación final):** `Continent` quedó con **6 valores** — América dividida en
> `'América del Norte'` y `'América del Sur'` — según lo generado por data-curator (decisión del
> orquestador sobre R3). Además, `countries.ts` es autogenerado con un tipo laxo
> (`continent: string`, sin `aliases`), así que el contrato estricto vive en
> `src/features/game/types.ts` y `src/data/dataset.ts` es la frontera que adapta el dataset e
> inyecta los aliases curados (`src/data/aliases.ts`). El matching del modo escribir acepta
> nombre, `officialName` y aliases.

```ts
// Taxonomía de continentes en español (5, América unificada). Ver Riesgo R3.
export type Continent = 'África' | 'América' | 'Asia' | 'Europa' | 'Oceanía';

export type Country = {
  code: string;          // ISO 3166-1 alpha-2, minúsculas (ej. "fr")
  name: string;          // nombre en español (ej. "Francia")
  officialName?: string; // ej. "República Francesa"
  continent: Continent;  // union, no string libre (habilita el filtro sin adivinar)
  region?: string;       // subregión (ej. "Europa Occidental")
  capital: string;
  population?: number;
  flag: string;          // ruta del SVG local: "/flags/{code}.svg"
  facts: string[];       // 2–4 datos culturales en español
  aliases?: string[];    // NUEVO: nombres alternativos aceptados en modo escribir
                         //  (ej. Estados Unidos -> ["EEUU","EE.UU.","USA","Estados Unidos de América"])
};

export const countries: Country[] = [ /* … data-curator … */ ];
```

Refinamientos respecto a `CLAUDE.md`:
- `continent: Continent` (union) en vez de `string` libre → el `ContinentPicker` enumera desde el
  tipo/constante y el motor filtra con seguridad.
- Añadido `aliases?: string[]` → necesario para la validación del modo escribir (data-curator lo
  cura junto al nombre; ver Riesgo R5).
- Convención fijada de `flag`: `"/flags/{code}.svg"` con `code` = ISO alpha-2 minúsculas
  (coincide con el nombre de archivo en `public/flags/`; ver Riesgo R8).

### 3.2 Tipos del motor de juego — `src/features/game/types.ts` (frontend-engineer)

> **Anotación (iteración 3):** el filtro del juego pasó de `continent: ContinentFilter` a
> `categories: CategoryId[]` — ids canónicos del catálogo compartido
> `src/features/game/categories.ts` (`GAME_CATEGORIES`), con `[]` = todos. `ContinentFilter`
> sobrevive solo para Explorar. El catálogo es la costura del modo competitivo
> (ver `docs/competitivo.md`): sus categorías se añaden a ese mismo array y el casual las hereda.

```ts
import type { Country, Continent } from '../../data/countries';

export type GameMode = 'flag-to-name' | 'name-to-flag' | 'type-name';

export type ContinentFilter = Continent | 'all';

export interface QuizConfig {
  mode: GameMode;
  continent: ContinentFilter;   // 'all' = todos los continentes
  questionCount: number;        // preset o total del pool filtrado ("todas")
}

export type QuestionKind = 'multiple-choice' | 'text-input';

export interface QuizQuestion {
  id: string;                   // estable dentro de la ronda: `${index}-${country.code}`
  mode: GameMode;
  kind: QuestionKind;           // MC para flag-to-name/name-to-flag; text para type-name
  country: Country;             // país correcto (fuente de la ficha y del label correcto)
  correctCode: string;          // === country.code
  options?: Country[];          // solo en MC: 4 países ya barajados (incluye el correcto)
}

export interface AnswerRecord {
  questionId: string;
  correct: boolean;
  correctCode: string;
  givenCode?: string;           // MC: código elegido
  givenText?: string;           // texto: entrada cruda del usuario
}

export type GameStatus = 'idle' | 'playing' | 'finished';

export interface GameState {
  status: GameStatus;
  config: QuizConfig | null;
  questions: QuizQuestion[];
  currentIndex: number;
  answers: AnswerRecord[];      // answers[i] existe cuando la pregunta i fue respondida
  // --- Costuras de gamificación (declaradas, sin usar en MVP; ver §5) ---
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
```

Notas de diseño:
- `options?: Country[]` (no un `{label}` reducido): el componente decide qué representar del país —
  el `name` (flag-to-name) o `<FlagImage>` (name-to-flag) — a partir de `mode`. Menos tipos.
- El panel de feedback se muestra cuando `answers[currentIndex]` existe (derivado del estado, no un
  booleano suelto).

### 3.3 API del motor (funciones **puras**) — `src/features/game/engine.ts`
```ts
export type RNG = () => number; // por defecto Math.random; inyectable => tests deterministas

// Construye una ronda completa. Elige respuestas SIN reemplazo (no se repite país).
// Si el pool filtrado < questionCount, se limita al tamaño del pool.
export function buildQuiz(pool: Country[], config: QuizConfig, rng?: RNG): QuizQuestion[];

// Construye una sola pregunta: país correcto + distractores del pool.
export function buildQuestion(mode: GameMode, answer: Country, pool: Country[], rng?: RNG): QuizQuestion;

// Elige `count` distractores plausibles: mismo continente primero (y misma región si alcanza);
// si no hay suficientes, completa con otros continentes. Nunca incluye `answer` ni duplicados.
export function pickDistractors(answer: Country, pool: Country[], count: number, rng?: RNG): Country[];

// Valida respuesta de opción múltiple.
export function checkChoice(question: QuizQuestion, chosenCode: string): boolean;

// Valida respuesta escrita (normalización + aliases).
export function checkTypedAnswer(question: QuizQuestion, input: string): boolean;
```

### 3.4 Normalización y matching — `src/lib/text.ts`
```ts
// Minúsculas, trim, colapsa espacios, quita signos de puntuación y elimina diacríticos
// vía NFD + ̀-ͯ (á→a, ñ→n, ü→u). "EE.UU." -> "eeuu"; "España" -> "espana".
export function normalize(s: string): string;

// true si normalize(input) coincide con el nombre o con algún alias del país.
export function matchesCountryName(input: string, country: Country): boolean;
//   const t = normalize(input);
//   return t === normalize(country.name)
//       || (country.aliases ?? []).some(a => normalize(a) === t);
```

Decisión de alcance: matching **exacto tras normalizar + aliases** (sin distancia de edición) para
el MVP. La tolerancia a variantes ("EEUU" / "Estados Unidos") se resuelve con `aliases`, no con
fuzzy matching. Distancia de edición ≤1 queda como extensión futura (Riesgo R5).

### 3.5 Constantes — `src/features/game/constants.ts`
```ts
export const OPTIONS_PER_QUESTION = 4;
export const DEFAULT_QUESTION_COUNT = 10;
export const QUESTION_COUNT_PRESETS = [10, 20, 'all'] as const; // 'all' = pool filtrado completo
export const CONTINENTS: Continent[] = ['África', 'América', 'Asia', 'Europa', 'Oceanía'];
export const MODE_LABELS: Record<GameMode, string> = {
  'flag-to-name': 'Bandera → nombre',
  'name-to-flag': 'Nombre → bandera',
  'type-name': 'Escribir el nombre',
};
```

---

## 4. Rutas y árbol de componentes

### 4.1 Mapa de rutas (react-router-dom v6; ver Riesgo R2)
| Ruta                | Vista                | Propósito |
|---------------------|----------------------|-----------|
| `/`                 | `HomePage`           | Elegir modo + continente + nº de preguntas y empezar |
| `/jugar`            | `GamePage`           | Ronda activa (una ruta; el índice vive en estado) |
| `/resultado`        | `ResultPage`         | Resumen final de la ronda |
| `/explorar`         | `ExplorePage`        | Lista + búsqueda + filtro por continente |
| `/explorar/:code`   | `CountryDetailPage`  | Ficha completa de un país |
| `*`                 | `NotFoundPage`       | 404 |

Guardas: `/jugar` redirige a `/` si `status !== 'playing'`; `/resultado` redirige a `/` si no hay
resultado. Rutas en español (coherente con la UI; ver Riesgo R6). El juego es **una sola ruta** con
`currentIndex` en estado (no una ruta por pregunta): más simple para el MVP.

### 4.2 Árbol de componentes y props clave
```
App (GameProvider + Router + AppHeader)
├─ HomePage
│   ├─ SegmentedControl  (value: GameMode, onChange)               # elegir modo
│   ├─ ContinentPicker   (value: ContinentFilter, onChange, options=CONTINENTS+'all')
│   ├─ SegmentedControl  (value: nº preguntas, onChange)           # presets
│   └─ Button "Empezar"  -> useGame().startGame(config); navigate('/jugar')
│
├─ GamePage   (lee useGame: currentQuestion, currentIndex, total, currentAnswer)
│   ├─ ProgressBar        (current: number, total: number)
│   ├─ [según mode]:
│   │   ├─ FlagToNameQuestion (question, onAnswer(code), answered: AnswerRecord|undefined)
│   │   ├─ NameToFlagQuestion (question, onAnswer(code), answered)
│   │   └─ TypeNameQuestion   (question, onAnswer(text), answered)
│   │       └─ OptionButton   (label?, code, state: 'idle'|'correct'|'incorrect'|'disabled', onClick)
│   └─ AnswerFeedback    (question, answer: AnswerRecord, isLast: boolean, onNext)
│       └─ FactCard      (country: Country)                        # dato curioso
│
├─ ResultPage (lee useGame: result)
│   ├─ (resumen: correctCount/total, accuracy %)
│   ├─ (lista de países fallados — opcional)
│   ├─ Button "Jugar otra vez" -> startGame(mismo config)
│   ├─ Button "Cambiar modo"    -> navigate('/')
│   └─ Button "Explorar"        -> navigate('/explorar')
│       // hueco reservado para panel de puntos/récord (no implementado, ver §5)
│
├─ ExplorePage (useCountries: filtrado local)
│   ├─ SearchInput        (value, onChange)
│   ├─ ContinentPicker    (value, onChange)
│   └─ CountryCard[]      (country, to=`/explorar/${code}`)        # grid
│       └─ FlagImage      (country, size)
│
└─ CountryDetailPage (param :code -> country del dataset; si no existe -> NotFound)
    ├─ FlagImage         (country, size='lg')
    ├─ (name, officialName, continent/region, capital, population)
    └─ FactCard          (country)                                 # todos los facts
```

`FlagImage` props: `{ country: Country; size?: 'sm'|'md'|'lg' }` → `<img src={country.flag}
alt={\`Bandera de ${country.name}\`} loading="lazy" />`. Fuente única del asset (usa `country.flag`).

`FactCard` props: `{ country: Country; variant?: 'game' | 'full' }` → en juego muestra 1–2 facts;
en detalle, todos. Reusado en juego y en Explorar.

---

## 5. Estado: local vs Context, y costuras de gamificación

### Vive en Context (`GameProvider` + `useReducer`)
La **sesión de juego activa**, porque abarca dos rutas (`/jugar`, `/resultado`) y debe sobrevivir a
la navegación entre ellas:

- `GameState` completo (config, questions, currentIndex, answers, status).
- API expuesta por `useGame()`:
  - `startGame(config)` → despacha `START` (genera `questions` con `buildQuiz`).
  - `answerCurrent(codeOrText)` → despacha `ANSWER` (valida con el motor, registra `AnswerRecord`).
  - `next()` → despacha `NEXT` (avanza índice o pasa a `finished`).
  - `restart()` → nueva ronda con el mismo `config`.
  - `reset()` → vuelve a `idle`.
  - Selectores derivados: `currentQuestion`, `currentAnswer`, `progress {current,total}`, `result`.
- Reducer con acciones `START | ANSWER | NEXT | RESTART | RESET`.

### Vive en estado local (no en Context)
- Selecciones del formulario de `HomePage` (modo/continente/nº) hasta pulsar "Empezar".
- Búsqueda y filtro de `ExplorePage` (local; opcional migrarlo a query params — no en MVP).
- Valor del input en `TypeNameQuestion`.
- El dataset (`countries`) es un **módulo estático importado**, no estado. Los tokens son CSS.

### Costuras para gamificación futura (diseñadas, NO implementadas)
Objetivo: añadir puntos, rachas y récords **sin reescribir**.
1. **Motor puro intacto**: `GameResult` es la entrada natural de un futuro
   `computeScore(result): ScoreDelta`. No se toca el motor para puntuar.
2. **`AnswerRecord` ya guarda `correct`** (y se pueden añadir tiempos con `startedAt`/`finishedAt`
   ya declarados en `GameState`): suficiente para calcular puntos/rachas a posteriori.
3. **La acción `ANSWER` del reducer** es el único punto donde luego se incrementarán racha/puntos;
   la UI leerá esos valores del contexto. Hoy `ANSWER` solo registra la respuesta.
4. **`ProgressProvider` futuro** (separado, no en este MVP) respaldado por `localStorage` para
   récords/mejores marcas por modo. Interfaz prevista (documental): `{ bestByMode, lastPlayed }`.
   El seam es un provider independiente que envuelve la app; no acopla al `GameProvider`.
5. **Hueco de UI reservado** en `ResultPage` (comentario) donde iría el panel de puntuación.

No se persiste la ronda ante recarga (refrescar reinicia): aceptable en MVP (Riesgo R12).

---

## 6. Orden de implementación (para frontend-engineer)

Dependencias externas:
- **data-curator** entrega `src/data/countries.ts` (`Country` + `Continent` + `countries`) y
  `public/flags/*.svg`. Requiere: usar la union `Continent` (§3.1), el campo `aliases` y la
  convención `flag = "/flags/{code}.svg"`.
- **ui-designer** entrega `src/styles/tokens.css` y specs de look; además `public/icons/*` (PWA).

Los pasos 1–5 **no dependen** de los otros agentes (usan un mock de ~8 países y tokens placeholder),
así que frontend-engineer arranca ya. Solo 6–9 y 11 necesitan dataset/tokens reales.

1. **Scaffold** (§1): generar proyecto, mover a raíz, instalar deps (router, PWA, vitest).
   Configurar `vite.config.ts` (PWA + test), `vite-env.d.ts`, `src/test/setup.ts`.
2. **Contratos**: crear `features/game/types.ts` y `features/game/constants.ts`. Acordar que
   `Country`/`Continent` los define data-curator en `data/countries.ts` (importar el *type*).
3. **Motor puro + utilidades de texto**: `lib/text.ts`, `lib/random.ts`, `features/game/engine.ts`
   con `engine.test.ts` y `text.test.ts` usando un **mock de países** (no necesita el dataset real).
   Entregable verificable con `npm run test` antes de que exista el dataset.
4. **App shell**: `main.tsx`, `App.tsx` (Router + `AppHeader`), `styles/global.css` importando
   `tokens.css` (placeholder si ui-designer no terminó). Rutas y `NotFoundPage`.
5. **Estado**: `gameReducer.ts`, `GameProvider.tsx`, `useGame.ts`.
6. **HomePage**: `SegmentedControl`, `ContinentPicker`, arranque de partida. (Usa `CONTINENTS` y,
   para contar preguntas disponibles, el dataset — mockeable.)
7. **Flujo de juego**: `GamePage`, `ProgressBar`, `OptionButton`, los 3 componentes de pregunta,
   `AnswerFeedback`, `FactCard`, `FlagImage`. *(Requiere dataset real + banderas para ser útil; se
   desarrolla contra el mock y se valida con el dataset cuando llegue.)*
8. **ResultPage**: resumen, "jugar otra vez", navegación.
9. **Explorar**: `useCountries`, `ExplorePage`, `CountryCard`, `CountryDetailPage`. *(Requiere
   dataset real.)*
10. **PWA**: manifest, iconos (placeholder hasta ui-designer), verificar instalación y **offline**
    (banderas + shell precacheados). Comprobar `npm run build` + `npm run preview`.
11. **Integrar tokens reales** de ui-designer y aplicar specs de look de los componentes clave
    (tarjeta de bandera, opciones, feedback acierto/error, ficha, tarjeta Explorar). Cargar y seguir
    la skill `frontend-design`.
12. **Verificación**: `npm run build` limpio + dev server; entregar a qa-tester (Vitest cubre motor,
    normalización e integridad de datos).

Ruta crítica: pasos 2→3→5 desbloquean casi todo. El contenido real (7,9) espera a data-curator; el
pulido visual (11) espera a ui-designer, pero la **estructura** no se bloquea por ninguno.

---

## 7. Riesgos y decisiones abiertas (con recomendación)

- **R1 — Scaffold en carpeta no vacía / `--overwrite` destructivo.** `--overwrite` vacía el
  directorio y borraría `.git`/`CLAUDE.md`/`.claude`. **Recomendación:** subcarpeta temporal + mover
  (§1); **nunca** usar `--overwrite` aquí.
- **R2 — Versión de react-router.** v6 vs v7. **Recomendación:** `react-router-dom` **v6** (estable,
  coincide con el nombre de paquete de `CLAUDE.md`, API `<BrowserRouter>/<Routes>` simple). Revisar
  v7 más adelante; no aporta al MVP.
- **R3 — Taxonomía de continentes.** ¿5 unificados o América dividida (Norte/Centro/Sur)?
  **Recomendación:** **5 continentes, América unificada** (`África, América, Asia, Europa, Oceanía`)
  para simplificar el filtro; conservar `region` (subregión) para filtros más finos en el futuro.
  **Requiere alineación con data-curator** (usar la union `Continent`).
- **R4 — Escasez de distractores.** Oceanía tiene pocos países; en `name-to-flag`/`flag-to-name` con
  4 opciones puede faltar variedad del mismo continente. **Recomendación:** `pickDistractors`
  completa desde otros continentes cuando el mismo no alcanza (mantener siempre 4 opciones). Ningún
  continente tiene <4 países, así que las 4 opciones siempre son posibles.
- **R5 — Rigor del modo escribir.** Exacto-normalizado vs difuso. **Recomendación:** normalización
  (sin tildes/mayúsculas/espacios/puntuación) + `aliases` curados por data-curator (ej. "EEUU",
  "USA", "Estados Unidos de América"). Distancia de edición ≤1 como extensión futura. **Requiere que
  data-curator añada `aliases`** a los países con variantes comunes.
- **R6 — Nombres de ruta.** Español vs inglés. **Recomendación:** rutas en **español** (`/jugar`,
  `/resultado`, `/explorar`) por coherencia con la UI. Trivial de cambiar si se prefiere.
- **R7 — Nº de preguntas y repetición.** **Recomendación:** presets `[10, 20, todas]`, por defecto
  10; muestreo de respuestas **sin reemplazo** (no se repite país en una ronda); si el pool filtrado
  < preset, limitar al tamaño del pool.
- **R8 — Convención de assets de bandera.** El código y el archivo deben coincidir.
  **Recomendación:** `public/flags/{code}.svg` con `code` = ISO alpha-2 minúsculas, y
  `Country.flag = "/flags/{code}.svg"`. `FlagImage` usa `country.flag`. **Confirmar con
  data-curator** el nombrado exacto de archivos.
- **R9 — Caché offline de banderas.** ~195 SVG. **Recomendación:** precachear todo (`globPatterns`
  con `svg`): los SVG son diminutos y garantiza offline sin lógica de runtime. Vigilar el total de
  entradas de precache (~200, correcto) y `maximumFileSizeToCacheInBytes` (2 MiB por archivo, de
  sobra).
- **R10 — Doble definición del tipo `Country`.** **Recomendación:** **data-curator es dueño** de
  `Country`/`Continent` en `data/countries.ts`; todos importan el *type* desde ahí. Este plan fija la
  forma exacta para que ambos agentes coincidan.
- **R11 — Iconos PWA.** Requeridos por el manifest y aún inexistentes. **Recomendación:** asignar
  `public/icons/{192,512,maskable-512}.png` a **ui-designer**; usar placeholders para que
  `npm run build` no falle mientras tanto.
- **R12 — Persistencia de la ronda en recarga.** **Recomendación:** **no** persistir en MVP
  (refrescar reinicia la ronda; es aceptable). Futuro: `sessionStorage` en el `GameProvider`.
- **R13 — Accesibilidad de opciones de bandera.** En `name-to-flag`, los botones son banderas.
  **Recomendación:** `aria-label` con el nombre del país en cada botón; feedback con `aria-live`;
  respetar `prefers-reduced-motion`. No bloquea, pero es parte del suelo de calidad.

### Preguntas que necesitan respuesta del usuario/orquestador
1. ¿Continentes: **5 unificados** (recomendado) o América dividida en subregiones para el filtro?
2. ¿Presets de nº de preguntas `[10, 20, todas]` con **10** por defecto — OK?
3. ¿Rutas en **español** (`/jugar`, `/resultado`, `/explorar`) — OK?
4. ¿**react-router-dom v6** (recomendado) o se prefiere v7?
5. ¿Algún **temporizador por pregunta** en el MVP? (Recomendación: no.)
6. Confirmar que **data-curator** añadirá `aliases`, usará la union `Continent` y el nombrado
   `flags/{code}.svg`, y que **ui-designer** aportará los iconos PWA.
```
