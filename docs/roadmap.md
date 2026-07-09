# Roadmap — trabajo pendiente

> Este documento rastrea **solo lo que falta**. Lo ya entregado no se registra
> aquí como "hecho": su spec viva está en `design.md` + `docs/competitivo.md` y
> su implementación, en el código. Piezas anteriores del roadmap (modo **Escrito**
> y **Juice** de UX — sonido, animación y siluetas) ya están en producción.

---

## C. Sistema competitivo online: Ranking + usuarios + DB

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
nuevo, onboarding de apodo y estados offline. Todo su prerequisito técnico barato (semilla
determinista, motor puro, `duration_ms` honesto) ya quedó listo en la Fase 1.
