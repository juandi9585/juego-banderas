# Roadmap — próximas iteraciones

> Decidido con el usuario el **2026-07-07**. Tres frentes sin orden impuesto por el usuario;
> el orden de abajo es el **recomendado** y su porqué está al final. Las decisiones marcadas
> **[DECIDIDO]** están cerradas; lo marcado **[A AFINAR]** se ajusta al implementar (playtest),
> sin volver a consultar salvo que cambie el espíritu de lo acordado.

---

## A. Modo competitivo "Escrito" — recomendado 1.º

Segunda variante del contrarreloj: **escribir a mano el nombre del país** de cada bandera.

### Decisiones
- **[DECIDIDO] 15 s por pregunta** (vs 10 s del mixto): teclear toma más que tocar una opción.
- **[DECIDIDO]** Ranking **separado** del mixto: la clave `${categoría}:${modo}` ya lo soporta.
- **No necesita `RoundMode` nuevo**: la ronda escrita es `mode: 'type-name'` (GameMode existente)
  con `competitive: { seed }`. Clave de récord resultante: `` `${cat}:type-name` `` — exactamente
  la prevista en `records.ts` desde la Fase 1. Cero migración.

### Diseño de la solución
- **Motor**: intacto. `buildQuiz` ya genera rondas `type-name`; la tolerancia de respuesta
  (tildes/mayúsculas/espacios/alias, `checkTypedAnswer`) se hereda del casual tal cual.
- **Tiempo por modo**: `SCORE_TIME_LIMIT_MS` deja de ser EL límite y pasa a ser el del mixto.
  Helper `timeLimitFor(mode)` en `score.ts`: mixto/MC → 10 000, `type-name` → 15 000. Lo consumen
  el `QuestionCountdown`, la acción TIMEOUT y `speedBonus` (el bonus decae hasta el límite del
  modo). **[A AFINAR]** ventana de gracia del escrito: propuesta 3 000 ms (vs 2 000 del mixto) —
  con 2 s nadie llega al bonus pleno tecleando. Máximo teórico se mantiene (4 275 en 20).
- **UI competitiva**: entra el `SegmentedControl` **Mixto | Escrito** en el hueco reservado del
  panel (design.md §19.1) entre cabecera y ledger; la columna Récord del ledger lee el modo
  seleccionado. El countdown y la hoja de timeout ya existen; en `/jugar` el teclado móvil convive
  con la bandera héroe elástica (§11), que ya cede altura.
- **Tests**: timeLimitFor por modo; ronda escrita con semilla determinista; récord bajo
  `cat:type-name` independiente del `cat:mixto`; timeout a los 15 s (no 10).

### Alcance
Pequeño y 100% frontend. Sin dependencias nuevas. Es la pieza que conviene cerrar **antes** del
online, para que el esquema de la base de datos y el switch del leaderboard nazcan completos.

---

## B. "Juice" de UX: animación, sonido y siluetas — recomendado 2.º

Darle sensación de juego sin romper la sobriedad de la guía de campo. Tres piezas independientes
(se pueden hacer en cualquier orden interno o en paralelo).

### B.1 Sonido — **[DECIDIDO] ON por defecto + mute persistente**
- **Assets locales pequeños** (ogg/mp3, ~2-6 KB cada uno, presupuesto total **≤ 60 KB**,
  precacheados por la PWA → offline). Paleta corta de eventos:
  acierto · fallo · timeout · tick de urgencia (últimos 3 s del countdown) · récord · hito de racha.
- **Mute**: toggle visible (GameTopBar y/o masthead), persistido en localStorage
  (`banderas:sound`). El estado se respeta en toda la app.
- **iOS/Safari**: el `AudioContext` se desbloquea con el primer gesto del usuario (el tap de
  "Empezar"/"Comenzar" sirve). Sin sonido en autoplay antes de eso — restricción de plataforma.
- Implementación: módulo `src/lib/sound.ts` (precarga + `play(id)` + mute), sin librerías.

### B.2 Animación
Momentos con jugo, siempre con salida digna en `prefers-reduced-motion` (ya hay convención):
- **Respuesta**: el "asentado" del acierto ya existe (`--ease-spring`); añadir pop del contador de
  racha y micro-flash de la fila/opción correcta.
- **Countdown**: pulso sutil de la mecha en los últimos 3 s (hoy solo cambia a rojo).
- **Récord**: barrido de **brillo de latón** one-shot sobre el banner (nada de confeti — la
  identidad es latón, no fiesta).
- **Transiciones** entre pestañas/rutas del módulo Jugar: View Transitions API como mejora
  progresiva (fallback: corte seco actual).

### B.3 Siluetas de mapa — **[DECIDIDO] en ledger competitivo, chips del casual y Explorar**
- **Generación por script** (data-curator): desde **Natural Earth 1:110m** (dominio público) se
  derivan SVGs simplificados — 18 siluetas de zona (unión de sus países) + siluetas por país para
  Explorar. Script en `scripts/`, salida en `public/shapes/`; **nunca a mano**.
- **Presupuesto de datos [DECIDIDO: prioridad del usuario]** — evitar consumo en móviles:
  - Son **iconos** (24–48 px): simplificación agresiva (Douglas-Peucker, sin islas menores).
    Objetivo: **≤ 1,5 KB por SVG**.
  - **Zonas (18 + 7 continentes ≈ 25 SVGs, ~40 KB)**: al precache de la PWA (ledger y chips los
    usan siempre). Presupuesto: **≤ 60 KB añadidos al precache**.
  - **Países (194 SVGs para Explorar)**: **NO van al precache** — carga perezosa al abrir la ficha
    y quedan en caché de runtime del service worker (patrón cache-first). El usuario solo descarga
    los países que visita, una vez.
  - Clave para usuarios recurrentes: el precache de la PWA se descarga **una vez por versión**; las
    visitas siguientes sirven todo desde el service worker, consumo ≈ 0.
- Uso visual: silueta en tinta al 60-70% (`--c-ink-2/3`) junto al nombre; en fila seleccionada del
  ledger, silueta en latón. En chips del casual **probar primero** (17 chips: si satura, se recorta
  a solo ledger + Explorar — el usuario ya avisó que ahí puede sobrar).

### Alcance
Mediano, 100% frontend + un script de datos. La dirección visual/motion la fija **ui-designer**
(skill frontend-design) al implementar; este roadmap fija alcance y presupuestos.

---

## C. Sistema competitivo online: Ranking + usuarios + DB — recomendado 3.º

El cambio grande. Convierte los récords locales en un leaderboard real.

### Decisiones
- **[DECIDIDO] Identidad: anónimo mejorable a cuenta.** Se empieza con solo un **apodo** (auth
  anónima, cero fricción); si el jugador luego inicia sesión (Google/email), su historial se
  conserva y lo sigue entre dispositivos (link de identidad).
- **[DECIDIDO] Stack: Supabase** (Postgres + auth anónima/upgradeable + RLS en free tier). Es la
  consecuencia directa de la decisión de identidad: con Vercel Postgres habría que construir el
  sistema de usuarios a mano. El front sigue en Vercel.
- **Módulo propio "Ranking"** en el nav (tercer enlace junto a Jugar y Explorar — hueco ya
  documentado en design.md §19.1). No es una pestaña de Jugar: consultar no es jugar.

### Diseño de la solución
- **UI del Ranking**: selector de zona (mismo lenguaje del ledger/pestañas por sector) + switch
  **Mixto | Escrito** (mismo control que el panel competitivo). Top N (p. ej. 50) por
  `(zona, modo)` + tu posición aunque no estés en el top. Estados: sin conexión (PWA) → "El
  ranking necesita conexión" + tus récords locales como fallback.
- **Esquema (Postgres)**:
  - `players`: `id` (= auth.uid), `nickname`, `created_at`.
  - `records`: `player_id`, `category_id`, `mode`, `points`, `correct`, `total`, `max_streak`,
    `duration_ms` (= suma de elapsedMs, §5 del doc competitivo), `seed`, `achieved_at`;
    único por `(player_id, category_id, mode)` — se guarda solo la mejor marca (upsert si
    `isBetter`, mismos criterios que local).
- **Anti-trampas (diseñado desde Fase 1)**: el cliente envía `{ seed, categoryId, mode, answers[] }`
  a una **Edge Function**; el servidor **reconstruye la ronda** con la misma `seed` y el mismo motor
  puro (TypeScript compartido) y **recomputa el puntaje** — nunca confía en el `points` del cliente.
  Complementos: RLS (cada quien escribe solo lo suyo vía la función), rate-limiting y validación de
  rangos (elapsedMs plausibles, nº de respuestas = min(20, pool)).
- **Convivencia con récords locales**: lo local sigue siendo la fuente inmediata de la UI del juego
  (offline-first); el submit online es adicional y asíncrono. Si no hay red, se encola y reintenta.
- **Apodos**: únicos con sufijo discriminador si colisionan (p. ej. "Juan#4821") o unicidad
  estricta — **[A AFINAR]** al diseñar el onboarding del apodo.

### Alcance
Grande: backend nuevo (Supabase + Edge Function), compartir el motor con el servidor, módulo de UI
nuevo, onboarding de apodo y estados offline. Prelado por A (para nacer con los dos modos) y
idealmente por B (pulir antes de "salir al público").

---

## Orden recomendado y porqué

1. **A — Escrito**: chico, sin dependencias, y deja el catálogo de modos **completo** antes de
   diseñar la DB y el switch del Ranking (evita migraciones y UIs a medias).
2. **B — Juice**: mediano y paralelizable; el juego se siente terminado y "compartible" justo
   antes de estrenar la parte social.
3. **C — Online**: el grande al final, sobre modos ya cerrados y una experiencia ya pulida.
   Todo su prerequisito técnico barato (semilla determinista, motor puro, `duration_ms` honesto)
   quedó listo en la Fase 1.
