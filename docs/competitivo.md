# Modalidad competitiva — Banderas del Mundo

> Autor: **product-architect**. Documento de diseño (no implementación). Ancla en `CLAUDE.md`,
> `docs/plan.md` (§5, costuras de gamificación) y el motor existente
> (`src/features/game/{types,engine,gameReducer}.ts`). Conteos calculados sobre
> `src/data/countries.json` (194 países) el 2026-07-06.
>
> Marcas de acuerdo: las decisiones de formato, catálogo, puntuación y ranking se cerraron con el
> usuario el **2026-07-06** (resumen en §7). Solo quedan abiertos el stack y la identidad de la
> Fase 2 online (§5).

---

## 1. Concepto y principios

El juego tendrá **dos modalidades** que comparten el mismo motor puro y el mismo catálogo de datos:

| | **Casual** (en implementación) | **Competitivo** (este documento) |
|---|---|---|
| Selección de categorías | **Múltiple** (mix & match libre) | **Simple** (una sola de un catálogo cerrado) |
| Composición del pool | Unión de las categorías elegidas | Los países de la categoría elegida |
| Longitud de la ronda | Configurable (presets del casual) | **Fija: `min(20, tamaño del pool)` [DECIDIDO]** |
| Ranking | No (puntaje informativo) | **Sí, por (categoría, modo de ronda)** |
| Curaduría | Abierta | Catálogo cerrado y curado |

**Principios de diseño:**

1. **El casual hereda todo.** No existen "categorías competitivas" como concepto aparte: son
   **entradas adicionales del mismo array** `GAME_CATEGORIES` (`src/features/game/categories.ts`).
   Toda categoría competitiva queda disponible automáticamente en el casual como una opción más del
   mix & match. No hay que sincronizar dos listas.
2. **Catálogo cerrado = comparabilidad.** El competitivo solo expone un subconjunto curado del
   catálogo (las categorías con tamaño y coherencia suficientes para un ranking justo). El casual
   puede exponerlas todas.
3. **Motor intacto.** `buildQuiz`, `pickDistractors`, `checkChoice`, `checkTypedAnswer` y el
   `gameReducer` no cambian su lógica. El competitivo añade *composición* alrededor de ellos.
4. **Regla de tamaño mínimo: ≥ 8 países por categoría.** Garantiza 4 opciones distintas de opción
   múltiple (1 correcta + 3 distractores del propio pool) en cualquier pregunta. Toda agrupación
   natural que quede por debajo de 8 se **fusiona** con una vecina (ver §2).

---

## 2. Catálogo propuesto de categorías competitivas

Todas usan `continent` y/o `region` reales del dataset. Los `id` son estables en kebab-case. Todas
cumplen **≥ 8 países**. La columna "Origen" indica si ya existe en la v1 del catálogo compartido
(6 continentes + `América` completa) o si es una **entrada nueva** que el competitivo aporta y el
casual hereda.

> **Nota de taxonomía:** el continente `'América del Norte y Centro'` (renombrado desde
> `'América del Norte'` en esta misma iteración) ya está en el dataset; los matchers de abajo
> usan los valores reales.

### 2.1 Nivel continente (heredadas de v1)

| id | label | matcher (definición) | países |
|---|---|---|---:|
| `mundo` | Mundo | `() => true` (todos) | **194** |
| `africa` | África | `continent === 'África'` | **54** |
| `asia` | Asia | `continent === 'Asia'` | **46** |
| `europa` | Europa | `continent === 'Europa'` | **45** |
| `america` | América | `continent === 'América del Norte y Centro' \|\| continent === 'América del Sur'` | **35** |
| `america-norte-centro` | América del Norte y Centro | `continent === 'América del Norte y Centro'` | **23** |
| `america-sur` | América del Sur | `continent === 'América del Sur'` | **12** |
| `oceania` | Oceanía | `continent === 'Oceanía'` | **14** |

`mundo` no estaba en la v1 (6 continentes + `América`). **[DECIDIDO 2026-07-06: entra.]** En el
casual no se muestra como chip (el chip "Todos" ya cumple ese rol) y, si aparece en una selección,
`canonicalCategories` la colapsa a `[]` (pool completo).

### 2.2 Nivel sub-regional (entradas nuevas; el casual las hereda)

Divisiones de los continentes grandes en sectores reconocibles, cada uno **≥ 8**. Donde una
subregión del dataset queda corta, se fusiona con la vecina y se indica.

**Europa** (45 → 2 sectores):

| id | label | matcher (`region ∈ …`) | países |
|---|---|---|---:|
| `europa-oeste` | Europa del Oeste | `Europa Occidental (8) · Europa del Norte (10) · Europa Meridional (9)` | **27** |
| `europa-este` | Europa del Este | `Europa Oriental (4) · Europa Central (6) · Europa Sudoriental (8)` | **18** |

> La asignación de **Europa Central** al "Este" y de **Europa del Norte** (incluye los bálticos) al
> "Oeste" es un juicio editorial; el reparto por región es transparente para poder ajustarlo.
> **[DECIDIDO 2026-07-06: reparto aprobado tal cual.]**

**Asia** (46 → 4 sectores):

| id | label | matcher (`region ∈ …`) | países |
|---|---|---|---:|
| `asia-occidental` | Asia Occidental (Medio Oriente) | `Asia Occidental (16)` | **16** |
| `sudeste-asiatico` | Sudeste Asiático | `Sudeste Asiático (11)` | **11** |
| `asia-meridional` | Asia Meridional | `Asia Meridional (9)` | **9** |
| `asia-oriental-central` | Asia Oriental y Central | `Asia Oriental (5) · Asia Central (5)` | **10** |

> `Asia Oriental` (5) y `Asia Central` (5) están por debajo de 8; se **fusionan** en un sector (la
> franja norte de Asia, el eje de la Ruta de la Seda). Alternativa posible: repartir Central en
> Meridional/Occidental — menos limpio; se descarta. **[DECIDIDO 2026-07-06: fusión aprobada.]**

**África** (54 → 3 sectores):

| id | label | matcher (`region ∈ …`) | países |
|---|---|---|---:|
| `africa-norte-occidental` | África del Norte y Occidental | `África del Norte (6) · África Occidental (16)` | **22** |
| `africa-oriental` | África Oriental | `África Oriental (17)` | **17** |
| `africa-central-austral` | África Central y Austral | `África Central (10) · África Austral (5)` | **15** |

> `África del Norte` (6) y `África Austral` (5) quedan cortas; se fusionan con su vecina (Norte con
> Occidental por el Sáhara/Sahel; Austral con Central). Quedan 3 sectores equilibrados.
> **[DECIDIDO 2026-07-06: fusiones aprobadas.]**

**América** (además de las de §2.1):

| id | label | matcher | países |
|---|---|---|---:|
| `caribe` | Caribe | `region === 'Caribe'` | **13** |

> `América Central` (7) no llega a 8 y ya está contenida en `america-norte-centro`; no se ofrece
> suelta. `Caribe` (13, todo estados-isla) sí es una categoría competitiva excelente por sí sola.
> **[DECIDIDO 2026-07-06: `caribe` entra.]**

**Oceanía:** sus cuatro subregiones (Australia y NZ 2, Melanesia 4, Micronesia 5, Polinesia 3) están
**todas** por debajo de 8. No admite subdivisión competitiva: `oceania` (14) es la única categoría de
Oceanía. Se documenta y no se fuerza.

### 2.3 Resumen del catálogo competitivo

18 categorías, todas ≥ 8. Verificación de sumas: Europa 27+18 = 45 ✓ · Asia 16+11+9+10 = 46 ✓ ·
África 22+17+15 = 54 ✓ · América 23+12 = 35 ✓. La más pequeña es `asia-meridional` (9).

---

## 3. Formato de partida — **[DECIDIDO 2026-07-06 con el usuario]**

**Longitud: `min(20, tamaño del pool)` preguntas**, con muestreo **sin reemplazo** siempre: ningún
país se repite dentro de una partida. Las categorías con menos de 20 países juegan partidas más
cortas (Caribe → 13, Asia Meridional → 9) y sigue siendo justo: el ranking está segmentado por
categoría, así que dentro de cada tabla todos juegan la misma longitud. Se descartaron las 25
fijas con rebarajado en bloques que proponía la versión anterior de este documento.

> Implementación: `buildQuiz` ya recorta `questionCount` al tamaño del pool filtrado — el
> competitivo pasa `questionCount: 20` y el recorte sale gratis. No existe lógica de repetición.

### 3.1 Modo de juego: mixto

La partida competitiva es **mixta**: la mitad de las preguntas son `flag-to-name` y la otra mitad
`name-to-flag` (⌈n/2⌉ y ⌊n/2⌋), con el orden barajado. `type-name` queda fuera del competitivo v1:
la velocidad de tecleo y la cobertura de alias meterían ruido injusto en un ranking donde la
velocidad da puntos.

- En el motor: `RoundMode = GameMode | 'mixto'`. El modo por pregunta ya existe
  (`QuizQuestion.mode`, y la UI renderiza según él), así que `buildQuiz` solo asigna modos
  alternados al construir la ronda. No hace falta una función hermana.
- Los **distractores** siempre salen del **pool de la categoría** (coherencia temática). Por eso la
  regla ≥ 8: incluso en la categoría más pequeña siempre hay 3 distractores distintos del correcto.
- **Segunda variante "escrito" — [IMPLEMENTADA 2026-07-07, ver docs/roadmap.md §A]:** solo
  `type-name`, con **15 s por pregunta** (vs 10 s del mixto) y sus propias tablas de ranking.
  No necesitó `RoundMode` nuevo: la ronda es `mode: 'type-name'` + `competitive.seed` → clave de
  récord `` `${cat}:type-name` ``. UI: `SegmentedControl` **Mixto | Escrito** en el panel
  competitivo (la columna Récord lee el modo elegido); motor y puntaje: `timeLimitFor(mode)` /
  `graceFor(mode)` en `score.ts` (gracia escrita 3 s — ajustable en playtest).

### 3.2 Identidad del ranking

Por **(categoría, modo de ronda)**: la clave de récord es `` `${CategoryId}:${RoundMode}` ``.
Las tablas `*:mixto` y `*:type-name` (escrito) conviven como claves independientes, sin migración.

---

## 4. Puntuación — **[DECIDIDO 2026-07-06 con el usuario]**

Sistema estilo Kahoot: **la velocidad da puntos reales** (un jugador rápido puede superar a otro
con más aciertos), con **multiplicador de racha** y **límite duro por pregunta en competitivo**
según el modo: **10 s** en mixto/opción múltiple, **15 s** en escrito (`timeLimitFor(mode)`,
2026-07-07). El puntaje se
muestra **también en el casual** (informativo, sin ranking ni cronómetro visible).

### 4.1 Fórmula por pregunta

| Resultado | Puntos |
|---|---|
| Fallo o tiempo agotado | **0** (la racha se reinicia; nunca hay puntos negativos) |
| Acierto | `round((100 + bonusVelocidad(t)) × multRacha)` |

- **Base:** `100` puntos por acierto.
- **Bonus de velocidad `bonusVelocidad(t)`** (t = ms desde que la pregunta es visible hasta responder):
  - `t ≤ gracia` → **50** (leer 4 opciones toma ~2 s; no premia el tap ciego).
  - `gracia < t < límite` → decae lineal: `50 × (límite − t) / (límite − gracia)`.
  - `t ≥ límite` → **0**.
  - Gracia y límite por modo (`graceFor` / `timeLimitFor`, 2026-07-07): mixto/MC **2 s / 10 s**;
    escrito **3 s / 15 s** (teclear un nombre toma más que tocar una opción). El bonus máximo no
    cambia → el techo de puntaje es el mismo en ambos modos.
- **Multiplicador de racha `multRacha`:** con `racha` = aciertos consecutivos contando el actual,
  `multRacha = min(1 + 0.1 × (racha − 1), 1.5)` → ×1.0, ×1.1, ×1.2, ×1.3, ×1.4 y **×1.5 desde el
  6.º acierto seguido**. Un fallo o timeout reinicia la racha a 0.
- Redondeo con `Math.round` **por pregunta** → el total siempre es entero.
- Puntos máximos por pregunta: `(100 + 50) × 1.5 = 225`.

### 4.2 Cotas y ejemplos (partida competitiva de 20 preguntas)

| Escenario | Puntaje |
|---|---|
| Partida perfecta (20 aciertos, todos ≤ 2 s) | **4 275** (900 en la rampa de racha + 15 × 225) |
| 20 aciertos, todos lentos (sin bonus) | 2 850 |
| Techo en categorías cortas: pool 13 (Caribe) | 2 700 |
| Techo con pool 9 (Asia Meridional) | 1 800 |

Con `min(20, pool)` cada tabla de ranking tiene su propio techo (comparable dentro de la
categoría). La velocidad y la racha pueden superar a quien tiene 1–2 aciertos más — decisión
consciente del usuario (adrenalina y remontadas por encima de jerarquía estricta de conocimiento).

### 4.3 Medición del tiempo

- **`AnswerRecord.elapsedMs` (campo nuevo):** del instante en que la pregunta queda activa al tap /
  submit. La hoja de datos curiosos entre preguntas **no cuenta**. Banderas locales y precacheadas →
  el render no penaliza.
- **Reloj de pared, sin pausas:** salir de la app a mitad de pregunta no congela el tiempo
  (antitrampa básica).
- **Competitivo:** cuenta regresiva **visible** con el límite del modo (10 s mixto, 15 s escrito);
  al agotarse se registra fallo automático (`timedOut: true` en el `AnswerRecord`) y se avanza.
  Partida completa ≤ ~4–5 min.
- **Casual:** sin countdown ni timeout — se registra `elapsedMs` igual y aplica la misma fórmula
  (con t ≥ límite el bonus simplemente es 0). El casual conserva su ritmo relajado.

### 4.4 `computeScore` — función pura

```ts
// src/features/game/score.ts (nuevo). Constantes exportadas para tests y UI.
export const SCORE_BASE = 100;
export const SCORE_SPEED_BONUS_MAX = 50;
export const SCORE_GRACE_MS = 2_000;        // opción múltiple / mixto
export const SCORE_TIME_LIMIT_MS = 10_000;  // opción múltiple / mixto
export const SCORE_GRACE_TYPED_MS = 3_000;      // escrito (type-name)
export const SCORE_TIME_LIMIT_TYPED_MS = 15_000; // escrito (type-name)
export const SCORE_STREAK_STEP = 0.1;
export const SCORE_STREAK_MAX_MULT = 1.5;
// Únicas fuentes del límite/gracia por modo (countdown y speedBonus):
export function timeLimitFor(mode: RoundMode): number; // 15 s escrito, 10 s resto
export function graceFor(mode: RoundMode): number;     // 3 s escrito, 2 s resto

export interface Score {
  points: number;      // suma de §4.1 (entero)
  correct: number;     // = result.correctCount
  total: number;       // = result.total
  accuracy: number;    // correct / total
  maxStreak: number;   // mejor racha de la partida
  durationMs?: number; // finishedAt - startedAt (si está disponible)
  answeredMs: number;  // suma de elapsedMs — solo tiempo respondiendo (desempate de récords, §5)
}

export function computeScore(result: GameResult): Score;
```

Itera `result.answers` **en orden** llevando la racha. Sirve para ambos modos: el casual la usa tal
cual (sus `elapsedMs` largos dan bonus 0). Se invoca en la `ResultPage` (hueco `TODO` del plan §5.5).
El puntaje casual es **solo informativo**: no alimenta ranking ni récords (categorías mezcladas y
`questionCount` variable lo hacen incomparable por diseño).

> Requisito de datos: `elapsedMs` **ya está implementado** (commit `d5e8853`: la acción `ANSWER`
> lo calcula desde `questionStartedAt`, marcado en `START`/`NEXT`). `timedOut` lo escribe la nueva
> acción `TIMEOUT` del competitivo (§6).

---

## 5. Ranking

### Fase 1 — Récords locales (MVP del competitivo)

Persistencia en **`localStorage`** vía un **`RecordsProvider` independiente del `GameProvider`**
(la costura §5.4 del plan: un provider que envuelve la app y **no acopla** al motor de juego).

```ts
// Identidad de un récord: categoría + modo de ronda (ver §3.2). Hoy siempre ':mixto'.
type RecordKey = `${CategoryId}:${RoundMode}`;

interface RecordEntry {
  points: number;
  correct: number;
  total: number;
  maxStreak: number;
  durationMs: number;   // = Score.answeredMs: solo tiempo respondiendo (la ficha no cuenta)
  achievedAt: number;   // Date.now()
}

interface RecordsContextValue {
  getBest(categoryId: CategoryId, mode: RoundMode): RecordEntry | null;
  submit(categoryId: CategoryId, mode: RoundMode, entry: RecordEntry): boolean; // true si es nuevo récord
}
```

- Se guarda **la mejor marca por `(categoryId, mode)`**: mejor `points`; a igualdad, más `correct`;
  a igualdad, menor `durationMs`. **[DECIDIDO 2026-07-07]** el `durationMs` del récord es la
  **suma de los `elapsedMs`** de las respuestas (`Score.answeredMs`): solo cuenta el tiempo
  respondiendo — leer la ficha de datos entre preguntas no penaliza el desempate. Opcional:
  histórico de N últimas partidas.
- Flujo: al terminar (`status === 'finished'`), la `ResultPage` llama a `computeScore`, luego a
  `submit(...)`, y muestra el resultado vs. el récord previo ("¡Nuevo récord!"). Esto **rellena el
  hueco `TODO`** de la `ResultPage`.
- El `RecordsProvider` lee de `localStorage` al montar y escribe en cada `submit`. No sabe nada del
  `GameProvider`; solo recibe datos ya calculados.

### Fase 2 — Leaderboard online — **[DECIDIDO 2026-07-06: objetivo real, pospuesto]**

El usuario confirmó que el leaderboard online **sí es un objetivo del proyecto**, pero se
implementa después; la Fase 1 deja lista la pieza barata que evita reescribir: la **semilla
determinista** (`QuizConfig.competitive.seed` + PRNG `mulberry32`), con la que cada ronda
competitiva es reproducible desde hoy. Boceto conceptual del resto:

- **Backend — [DECIDIDO 2026-07-07]: Supabase** (Postgres + auth + RLS; free tier). El submit
  pasa por una Edge Function que revalida la partida. El front sigue en Vercel. Diseño completo
  (esquema, módulo "Ranking" en el nav, offline-first): **docs/roadmap.md §C**.
- **Identidad de jugador — [DECIDIDO 2026-07-07]: anónimo mejorable a cuenta.** Se entra con solo
  un apodo (auth anónima de Supabase); si el jugador luego inicia sesión (Google/email), el
  historial se conserva y lo sigue entre dispositivos.
- **Anti-trampa (a nivel de concepto):** el motor es **determinista con RNG inyectable**. Un cliente
  puede enviar `{ seed, categoryId, mode, answers[] }`; el servidor **reconstruye la misma ronda**
  con esa `seed` y el mismo motor puro y **recomputa el score** (no confía en el `points` del
  cliente). La `seed` **ya existe desde la Fase 1** (`QuizConfig.competitive.seed`). Complementos:
  rate-limiting y validación de rangos.
- **Qué queda por afinar** (al implementar la Fase 2, ver roadmap §C): política de unicidad de
  apodos (sufijo discriminador vs. unicidad estricta) y el tamaño del top (propuesto: 50).

---

## 6. Impacto en el código existente — **[diseño final 2026-07-06]**

Con `min(20, pool)` no hay repetición → **no existe `buildCompetitiveQuiz`**: se extiende
`buildQuiz` mínimamente (el modo por pregunta ya existía en `QuizQuestion.mode`).

### Se añade (nuevo)
- `src/features/game/categories.ts` — las 11 entradas nuevas (§2.1 `mundo` + §2.2) con matchers
  por `region`, y un campo `group: 'continente' | 'sector'` para agrupar las UIs. Total: 18.
- `src/lib/random.ts` — `mulberry32(seed)` (PRNG determinista) y `randomSeed()`.
- `src/features/records/` — `records.ts` (puro, localStorage `banderas:records:v1`),
  `RecordsProvider.tsx`, `useRecords.ts`. Mejor marca por `RecordKey`: más `points` → más
  `correct` → menor `durationMs` (= suma de `elapsedMs`, §5).
- `CompetitivePage` (ruta `/competitivo`): selección **simple** (radio) de las 18 categorías
  agrupadas, con países / nº de preguntas / récord por opción; CTA que arranca
  `{ mode: 'mixto', categories: [id], questionCount: 20, competitive: { seed: randomSeed() } }`.
- `QuestionCountdown` en `GamePage` (solo competitivo): 10 s por pregunta contra
  `SCORE_TIME_LIMIT_MS`, calculado en cada tick desde `Date.now() − questionStartedAt` (reloj de
  pared: volver de background no regala tiempo); al agotarse llama `timeoutCurrent()`.

### Cambia (mínimo)
- `QuizConfig`: `mode` pasa a `RoundMode = GameMode | 'mixto'`; gana
  `competitive?: { seed: number }` (su presencia marca la ronda competitiva). La categoría del
  récord es `categories[0]` (el competitivo pasa exactamente una — invariante de su UI).
- `buildQuiz`: si `mode === 'mixto'`, construye el array de modos (⌈n/2⌉ `flag-to-name` +
  ⌊n/2⌋ `name-to-flag`, barajado) y se lo pasa a `buildQuestion` pregunta a pregunta.
- `gameReducer`: nueva acción `TIMEOUT` — misma guarda idempotente que `ANSWER` (resuelve la
  carrera clic-vs-timer), escribe `{ correct: false, timedOut: true, elapsedMs }`.
- `GameProvider`: con `competitive` usa `mulberry32(seed)`; `restart` genera **semilla nueva**
  (reutilizarla permitiría memorizar la ronda y farmear el récord); expone `timeoutCurrent()`.
- `FieldNoteSheet`: variante de status "Se acabó el tiempo — era X" cuando `answer.timedOut`.
- `ResultPage`: en competitivo, `submit` del récord (guarda anti doble-submit de StrictMode) +
  banner "¡Nuevo récord!" / "Récord: N pts".
- `CategoryMultiPicker` (casual): agrupa en "Continentes" / "Sectores" y oculta `mundo` (el chip
  "Todos" ya cumple ese rol). `canonicalCategories` trata `mundo` como equivalente a `[]`.
- `App.tsx` / `AppHeader`: ruta `/competitivo`, `RecordsProvider` envolviendo, enlace "Competitivo".

### NO cambia
- `pickDistractors`, `buildQuestion`, `checkChoice`, `checkTypedAnswer`, `score.ts` — intactos.
- El renderizado de preguntas de `GamePage` (ya elige componente por `currentQuestion.mode`).
- El flujo casual completo: sin countdown, sin timeout, sin récords, mismos presets.

---

## 7. Preguntas abiertas — **TODAS RESUELTAS con el usuario (2026-07-06)**

1. **Nº de preguntas:** → **20**, con `min(20, pool)` (§3).
2. **Modos permitidos:** → **mixto**: mitad `flag-to-name` + mitad `name-to-flag` en la misma
   partida. `type-name` queda como **variante competitiva futura "escrito"** (§3.1).
3. **Identidad del ranking:** → **(categoría, modo de ronda)**: `` `${CategoryId}:${RoundMode}` ``
   (§3.2).
4. **Categorías:** → entran **`mundo`** y **`caribe`**. Catálogo final: **18** (§2).
5. **Reparto Europa Este/Oeste:** → aprobado tal cual (Central → Este; Norte/bálticos → Oeste).
6. **Fusiones:** → aprobadas las 3 (Asia Oriental+Central, África Norte+Occidental, África
   Central+Austral).
7. **Categorías pequeñas:** → `min(20, pool)`; se descartó la repetición en bloques.
8. **Puntuación:** → estilo Kahoot con bonus de velocidad, racha ×1.1→×1.5, límite duro de 10 s en
   competitivo y puntaje informativo en casual (§4). Implementada en `score.ts`.
9. **Ranking online (Fase 2):** → **objetivo real, pospuesto**. La semilla determinista se
   implementa desde la Fase 1; stack de DB e identidad de jugador siguen abiertos (§5).
