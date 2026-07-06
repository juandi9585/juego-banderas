# Modalidad competitiva — Banderas del Mundo

> Autor: **product-architect**. Documento de diseño (no implementación). Ancla en `CLAUDE.md`,
> `docs/plan.md` (§5, costuras de gamificación) y el motor existente
> (`src/features/game/{types,engine,gameReducer}.ts`). Conteos calculados sobre
> `src/data/countries.json` (194 países) el 2026-07-06.
>
> Marcas de acuerdo pendiente: **[A ACORDAR]** señala decisiones que necesitan el visto bueno del
> usuario antes de implementar.

---

## 1. Concepto y principios

El juego tendrá **dos modalidades** que comparten el mismo motor puro y el mismo catálogo de datos:

| | **Casual** (en implementación) | **Competitivo** (este documento) |
|---|---|---|
| Selección de categorías | **Múltiple** (mix & match libre) | **Simple** (una sola de un catálogo cerrado) |
| Composición del pool | Unión de las categorías elegidas | Los países de la categoría elegida |
| Longitud de la ronda | Configurable (presets del casual) | **Número fijo (~25) [A ACORDAR]** |
| Ranking | No | **Sí, por categoría** |
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

`mundo` no está en la v1 descrita (6 continentes + `América`); se propone añadirlo — el casual ya
tiene un equivalente "todos", así que encaja sin fricción. **[A ACORDAR]**

### 2.2 Nivel sub-regional (entradas nuevas; el casual las hereda)

Divisiones de los continentes grandes en sectores reconocibles, cada uno **≥ 8**. Donde una
subregión del dataset queda corta, se fusiona con la vecina y se indica.

**Europa** (45 → 2 sectores):

| id | label | matcher (`region ∈ …`) | países |
|---|---|---|---:|
| `europa-oeste` | Europa del Oeste | `Europa Occidental (8) · Europa del Norte (10) · Europa Meridional (9)` | **27** |
| `europa-este` | Europa del Este | `Europa Oriental (4) · Europa Central (6) · Europa Sudoriental (8)` | **18** |

> La asignación de **Europa Central** al "Este" y de **Europa del Norte** (incluye los bálticos) al
> "Oeste" es un juicio editorial; el reparto por región es transparente para poder ajustarlo. Ver
> pregunta abierta §7.

**Asia** (46 → 4 sectores):

| id | label | matcher (`region ∈ …`) | países |
|---|---|---|---:|
| `asia-occidental` | Asia Occidental (Medio Oriente) | `Asia Occidental (16)` | **16** |
| `sudeste-asiatico` | Sudeste Asiático | `Sudeste Asiático (11)` | **11** |
| `asia-meridional` | Asia Meridional | `Asia Meridional (9)` | **9** |
| `asia-oriental-central` | Asia Oriental y Central | `Asia Oriental (5) · Asia Central (5)` | **10** |

> `Asia Oriental` (5) y `Asia Central` (5) están por debajo de 8; se **fusionan** en un sector (la
> franja norte de Asia, el eje de la Ruta de la Seda). Alternativa posible: repartir Central en
> Meridional/Occidental — menos limpio; se descarta.

**África** (54 → 3 sectores):

| id | label | matcher (`region ∈ …`) | países |
|---|---|---|---:|
| `africa-norte-occidental` | África del Norte y Occidental | `África del Norte (6) · África Occidental (16)` | **22** |
| `africa-oriental` | África Oriental | `África Oriental (17)` | **17** |
| `africa-central-austral` | África Central y Austral | `África Central (10) · África Austral (5)` | **15** |

> `África del Norte` (6) y `África Austral` (5) quedan cortas; se fusionan con su vecina (Norte con
> Occidental por el Sáhara/Sahel; Austral con Central). Quedan 3 sectores equilibrados.

**América** (además de las de §2.1):

| id | label | matcher | países |
|---|---|---|---:|
| `caribe` | Caribe | `region === 'Caribe'` | **13** |

> `América Central` (7) no llega a 8 y ya está contenida en `america-norte-centro`; no se ofrece
> suelta. `Caribe` (13, todo estados-isla) sí es una categoría competitiva excelente por sí sola.

**Oceanía:** sus cuatro subregiones (Australia y NZ 2, Melanesia 4, Micronesia 5, Polinesia 3) están
**todas** por debajo de 8. No admite subdivisión competitiva: `oceania` (14) es la única categoría de
Oceanía. Se documenta y no se fuerza.

### 2.3 Resumen del catálogo competitivo

18 categorías, todas ≥ 8. Verificación de sumas: Europa 27+18 = 45 ✓ · Asia 16+11+9+10 = 46 ✓ ·
África 22+17+15 = 54 ✓ · América 23+12 = 35 ✓. La más pequeña es `asia-meridional` (9).

---

## 3. Formato de partida

**Longitud: 25 preguntas fijas [A ACORDAR].** Propuesta de trabajo. 25 es un buen equilibrio
(ni ronda relámpago ni maratón) y da granularidad de puntuación suficiente para un ranking.

### 3.1 Modos de juego permitidos

Existen tres modos (`flag-to-name`, `name-to-flag`, `type-name`). Para el competitivo:

| Opción | Qué incluye | Pros | Contras |
|---|---|---|---|
| **A (recom.)** | Solo opción múltiple: `flag-to-name` + `name-to-flag` | Puntuación objetiva y comparable; sin ruido de tecleo | Deja fuera "escribir el nombre" |
| B | Los 3 modos | Cubre todo el MVP | `type-name` mete ruido (velocidad de tecleo, cobertura de `aliases`) que ensucia el ranking |
| C | Un único modo fijo (`flag-to-name`) | Ranking más simple (una tabla por categoría) | Menos variedad |

**Recomendación: opción A.** El competitivo permite los **dos modos de opción múltiple** y **excluye
`type-name`** por equidad. El ranking se identifica por **`(categoryId, mode)`** (dos tablas por
categoría). Si se prefiere una sola tabla por categoría, degradar a la opción C. **[A ACORDAR]**

### 3.2 Política de repetición de países dentro de la partida

- **Categoría con ≥ 25 países:** muestreo **sin reemplazo** (ningún país se repite), igual que el
  casual. Se toman 25 de los N disponibles.
- **Categoría con < 25 países** (la mayoría de sub-regionales): se **rebaraja en bloques**. Se agota
  el pool una vez (orden aleatorio), se vuelve a barajar y se continúa, con la única restricción de
  **no repetir un país en preguntas consecutivas**. Ej.: `asia-meridional` (9) → cada país aparece
  ~2–3 veces a lo largo de las 25.
- Los **distractores** siempre salen del **pool de la categoría** (coherencia temática). Por eso la
  regla ≥ 8: incluso en la categoría más pequeña siempre hay 3 distractores distintos del correcto.

### 3.3 ¿Y si la categoría tiene menos países que preguntas?

Las 25 preguntas **se mantienen fijas** mediante la repetición en bloques de §3.2. Esto es aceptable
porque **el ranking es por categoría**: dentro de una misma tabla todos juegan la misma longitud
(25) y la misma cantidad de repetición, así que las puntuaciones son comparables. La repetición solo
afecta a categorías pequeñas y no rompe la equidad intra-categoría.

> Alternativa si la repetición molesta: `questionCount = min(25, tamañoPool)`. La rechazo para el MVP
> porque introduce longitudes distintas por categoría (25 vs 9) sin ganar comparabilidad (el ranking
> ya está segmentado por categoría). **[A ACORDAR]**

---

## 4. Puntuación — **[DECIDIDO 2026-07-06 con el usuario]**

Sistema estilo Kahoot: **la velocidad da puntos reales** (un jugador rápido puede superar a otro
con más aciertos), con **multiplicador de racha** y **límite duro de 10 s por pregunta en
competitivo**. El puntaje se
muestra **también en el casual** (informativo, sin ranking ni cronómetro visible).

### 4.1 Fórmula por pregunta

| Resultado | Puntos |
|---|---|
| Fallo o tiempo agotado | **0** (la racha se reinicia; nunca hay puntos negativos) |
| Acierto | `round((100 + bonusVelocidad(t)) × multRacha)` |

- **Base:** `100` puntos por acierto.
- **Bonus de velocidad `bonusVelocidad(t)`** (t = ms desde que la pregunta es visible hasta responder):
  - `t ≤ 2 000 ms` → **50** (ventana de gracia: leer 4 opciones toma ~2 s; no premia el tap ciego).
  - `2 000 < t < 10 000` → decae lineal: `50 × (10 000 − t) / 8 000`.
  - `t ≥ 10 000 ms` → **0**.
- **Multiplicador de racha `multRacha`:** con `racha` = aciertos consecutivos contando el actual,
  `multRacha = min(1 + 0.1 × (racha − 1), 1.5)` → ×1.0, ×1.1, ×1.2, ×1.3, ×1.4 y **×1.5 desde el
  6.º acierto seguido**. Un fallo o timeout reinicia la racha a 0.
- Redondeo con `Math.round` **por pregunta** → el total siempre es entero.
- Puntos máximos por pregunta: `(100 + 50) × 1.5 = 225`.

### 4.2 Cotas y ejemplos (25 preguntas)

| Escenario | Puntaje |
|---|---|
| Partida perfecta (25 aciertos, todos ≤ 2 s) | **5 400** (900 en la rampa de racha + 20 × 225) |
| 25 aciertos, todos lentos (sin bonus) | 3 600 |
| 20 aciertos seguidos rápidos + 5 fallos | ~4 275 |
| 13 aciertos alternados (racha nunca > 1), lentos | 1 300 |

La velocidad y la racha pueden superar a quien tiene 1–2 aciertos más — decisión consciente del
usuario (adrenalina y remontadas por encima de jerarquía estricta de conocimiento).

### 4.3 Medición del tiempo

- **`AnswerRecord.elapsedMs` (campo nuevo):** del instante en que la pregunta queda activa al tap /
  submit. La hoja de datos curiosos entre preguntas **no cuenta**. Banderas locales y precacheadas →
  el render no penaliza.
- **Reloj de pared, sin pausas:** salir de la app a mitad de pregunta no congela el tiempo
  (antitrampa básica).
- **Competitivo:** cuenta regresiva **visible** de 10 s; al agotarse se registra fallo automático
  (`timedOut: true` en el `AnswerRecord`) y se avanza. Partida completa ≤ ~4–5 min.
- **Casual:** sin countdown ni timeout — se registra `elapsedMs` igual y aplica la misma fórmula
  (con t ≥ 10 s el bonus simplemente es 0). El casual conserva su ritmo relajado.

### 4.4 `computeScore` — función pura

```ts
// src/features/game/score.ts (nuevo). Constantes exportadas para tests y UI.
export const SCORE_BASE = 100;
export const SCORE_SPEED_BONUS_MAX = 50;
export const SCORE_GRACE_MS = 2_000;
export const SCORE_TIME_LIMIT_MS = 10_000;
export const SCORE_STREAK_STEP = 0.1;
export const SCORE_STREAK_MAX_MULT = 1.5;

export interface Score {
  points: number;      // suma de §4.1 (entero)
  correct: number;     // = result.correctCount
  total: number;       // = result.total
  accuracy: number;    // correct / total
  maxStreak: number;   // mejor racha de la partida
  durationMs?: number; // finishedAt - startedAt (si está disponible)
}

export function computeScore(result: GameResult): Score;
```

Itera `result.answers` **en orden** llevando la racha. Sirve para ambos modos: el casual la usa tal
cual (sus `elapsedMs` largos dan bonus 0). Se invoca en la `ResultPage` (hueco `TODO` del plan §5.5).
El puntaje casual es **solo informativo**: no alimenta ranking ni récords (categorías mezcladas y
`questionCount` variable lo hacen incomparable por diseño).

> Requisito de datos: la acción `ANSWER` del reducer (la costura de gamificación) pasa a registrar
> `elapsedMs` y `timedOut`. El reducer marca el inicio de cada pregunta en `START`/`NEXT` y el
> provider inyecta los timestamps (mismo patrón que `startedAt` hoy).

---

## 5. Ranking

### Fase 1 — Récords locales (MVP del competitivo)

Persistencia en **`localStorage`** vía un **`RecordsProvider` independiente del `GameProvider`**
(la costura §5.4 del plan: un provider que envuelve la app y **no acopla** al motor de juego).

```ts
// Identidad de un récord: categoría + modo (ver §3.1)
type RecordKey = `${CategoryId}:${GameMode}`;

interface RecordEntry {
  points: number;
  correct: number;
  total: number;
  maxStreak: number;
  durationMs: number;
  achievedAt: number;   // Date.now()
}

interface RecordsContextValue {
  getBest(categoryId: CategoryId, mode: GameMode): RecordEntry | null;
  submit(categoryId: CategoryId, mode: GameMode, entry: RecordEntry): boolean; // true si es nuevo récord
}
```

- Se guarda **la mejor marca por `(categoryId, mode)`**: mejor `points`; a igualdad, más `correct`;
  a igualdad, menor `durationMs`. Opcional: histórico de N últimas partidas.
- Flujo: al terminar (`status === 'finished'`), la `ResultPage` llama a `computeScore`, luego a
  `submit(...)`, y muestra el resultado vs. el récord previo ("¡Nuevo récord!"). Esto **rellena el
  hueco `TODO`** de la `ResultPage`.
- El `RecordsProvider` lee de `localStorage` al montar y escribe en cada `submit`. No sabe nada del
  `GameProvider`; solo recibe datos ya calculados.

### Fase 2 — Leaderboard online (esbozo, NO se decide aún)

Objetivo potencial, **fuera del alcance actual**. Boceto conceptual:

- **Backend:** Vercel Functions (serverless) + una base de datos (candidatos: Vercel Postgres,
  Vercel KV / Upstash Redis). **Sin decidir.**
- **Identidad de jugador:** apodo + `id` anónimo persistido en `localStorage` (UUID), o auth ligera
  posterior. **Sin decidir.**
- **Anti-trampa (a nivel de concepto):** el motor es **determinista con RNG inyectable**. Un cliente
  puede enviar `{ seed, categoryId, mode, answers[] }`; el servidor **reconstruye la misma ronda**
  con esa `seed` y el mismo motor puro y **recomputa el score** (no confía en el `points` del
  cliente). Requeriría exponer la `seed` como parte de `QuizConfig`/`buildQuiz` — hoy no existe, se
  añadiría solo si la Fase 2 se aprueba. Complementos: rate-limiting y validación de rangos.
- **Qué NO se decide aún:** si el leaderboard online es siquiera un objetivo, el stack de DB, el
  modelo de identidad, y si se introduce `seed` determinista. Todo esto queda **explícitamente
  abierto**.

---

## 6. Impacto en el código existente

### Se añade (nuevo)
- `src/features/game/categories.ts` — **ya lo está creando el frontend-engineer**; el competitivo
  aporta las entradas de §2.2 (y `mundo` de §2.1). El casual las hereda sin cambios.
- `src/features/game/score.ts` — `computeScore` puro (§4).
- Composición de ronda competitiva con repetición en bloques (§3.2): **preferible** como función
  hermana pura (p. ej. `buildCompetitiveQuiz(pool, config, rng)`) que reutiliza `buildQuestion` /
  `pickDistractors`, **sin tocar** `buildQuiz`. Alternativa: un flag opcional en `buildQuiz`
  (`{ cycle: true }`); se prefiere la función hermana para no arriesgar el comportamiento del casual.
- `src/features/records/` — `RecordsProvider.tsx`, `useRecords.ts`, `records.ts` (localStorage).
- UI/rutas del competitivo: pantalla de **selección simple** de categoría (radio, no checklist) y
  reutilización de `GamePage`; la `ResultPage` gana el panel de récord.

### Cambia (mínimo)
- `AnswerRecord` gana `elapsedMs` (y `timedOut?`); la acción `ANSWER` los registra y `START`/`NEXT`
  marcan el inicio de cada pregunta (timestamps inyectados por el provider, como `startedAt` hoy).
  Necesario también para mostrar el puntaje en casual (§4).
- UI de `GamePage` en competitivo: cuenta regresiva visible de 10 s con fallo automático al agotarse.
- `QuizConfig` gana la dimensión de categoría. El competitivo usa **una** categoría
  (`categoryId: CategoryId`); el casual usa **varias**. La forma exacta del tipo la fija el
  frontend-engineer al crear `categories.ts` (probable: casual `categoryIds: CategoryId[]`,
  competitivo `categoryId: CategoryId`). El **pool filtrado** se calcula aplicando el/los matcher(s)
  y se pasa a `buildQuiz` / `buildCompetitiveQuiz` **como hoy**.
- `ResultPage` — se activa el hueco reservado del plan §5.5 (score + récord).

### NO cambia
- `pickDistractors`, `buildQuestion`, `checkChoice`, `checkTypedAnswer` — intactos.
- `buildQuiz` — sigue recibiendo **pool ya filtrado + `questionCount`** y muestreando sin reemplazo;
  el casual no se altera.
- Núcleo del `gameReducer` — la acción `ANSWER` ya es la costura de puntuación; no requiere cambios
  para la Fase 1 (el score se calcula al final desde `GameResult`).
- `GameState.startedAt` / `finishedAt` — ya existen; solo pasan a **usarse**.

---

## 7. Preguntas abiertas para el usuario

1. **Nº de preguntas:** ¿**25** fijas? ¿otro valor?
2. **Modos permitidos:** ¿opción **A** (dos modos de opción múltiple, sin `type-name`) — recomendada?
   ¿o incluir `type-name` (B) / fijar un solo modo (C)?
3. **Identidad del ranking:** ¿tabla por **`(categoría, modo)`** o una sola tabla por categoría?
4. **Categorías a incluir/excluir:** ¿añadir **`mundo`** (194) y **`caribe`** (13)? ¿alguna sobra o
   falta?
5. **Reparto Europa Este/Oeste:** ¿OK que **Central → Este** y **del Norte (bálticos) → Oeste**? ¿o
   se prefiere otra granularidad (p. ej. 3 sectores)?
6. **Fusiones:** ¿OK `Asia Oriental + Central`, `África Norte + Occidental`, `África Central +
   Austral`?
7. **Categorías pequeñas:** con < 25 países, ¿mantener 25 fijas con repetición en bloques
   (recomendado) o usar `min(25, pool)`?
8. ~~**Puntuación**~~ — **RESUELTA (2026-07-06):** sistema estilo Kahoot con bonus de velocidad,
   racha ×1.1→×1.5, límite duro de 10 s en competitivo y puntaje informativo en casual. Ver §4.
9. **Ranking online (Fase 2):** ¿es un **objetivo real**? Si lo es, ¿stack de DB e identidad de
   jugador? (hoy sin decidir).
