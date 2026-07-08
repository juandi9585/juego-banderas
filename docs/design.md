# Sistema de diseño — Banderas del Mundo

> Autor: **ui-designer**. Sigue la skill `frontend-design`. Este documento fija la dirección
> visual, los tokens y el look de los componentes clave. Los tokens viven en
> `src/styles/tokens.css`; aquí está el porqué y los specs para que **frontend-engineer**
> implemente sin adivinar. Propiedad exclusiva de ui-designer: `tokens.css`, este archivo y
> `public/icons/`.

---

## 1. Concepto: "Carta náutica / guía de campo del vexilólogo"

La app no es un test genérico: es un **cuaderno de campo para identificar las banderas del
mundo**, con la sobriedad instrumental de una **carta de navegación** (tinta marina, papel
de carta, latón de instrumento) y la lógica de la **vexilología** (proporciones, hoist, campo).

Punto de vista: las banderas son ruidosas y a todo color — todo el espectro está en ellas.
Por eso **el sistema se aparta**: fondos y tinta neutros y fríos (papel de carta + tinta
marina), un único acento cálido muy medido (latón), y las banderas montadas como **especímenes**
sobre superficie blanca. El cromatismo lo ponen las banderas; el sistema solo las enmarca y las
hace brillar.

Anclas del tema que usamos de verdad (no como decorado): la **vexilología** (el *hoist* — el
borde de la bandera junto al mástil — es nuestro elemento signature), la **cartografía** (retícula
de coordenadas como atmósfera; barra de progreso como regla graduada; códigos ISO y datos en
mono, como lecturas de instrumento) y el **viaje/descubrimiento** (voz de guía de campo, la ficha
cultural como "nota de campo" en papel cálido).

### Por qué NO es un default de IA
La skill señala tres clusters genéricos; los evitamos a propósito:
- **No** crema (#F4F1EA) + serif de alto contraste + terracota → usamos **papel frío** (#F2F5F7),
  **sin serif display** (grotesca contemporánea) y el cálido es **latón**, no terracota.
- **No** casi-negro + un acento verde ácido/bermellón → base **clara** (light principal), acentos
  **desaturados y terrosos** (latón, verde tierra, rojo señal), nunca ácidos.
- **No** broadsheet (filetes, radio 0, columnas de periódico) → **radios suaves** (10–20px),
  tarjetas con sombra fría, retícula sutil en vez de filetes, layout de una columna generoso.

---

## 2. Paleta (6 nombres + semánticos)

Base fría y neutra para que las banderas sean el color. Un solo acento cálido (latón), usado con
disciplina: CTA, marca de hoist activa, relleno de progreso, foco.

| Nombre           | Rol                                   | Hex (light) |
|------------------|---------------------------------------|-------------|
| **Papel**        | Fondo (papel de carta, frío)          | `#F2F5F7`   |
| **Carta**        | Superficie / interior de bandera      | `#FFFFFF`   |
| **Nota**         | Papel cálido para la ficha cultural   | `#FBF6EE`   |
| **Tinta**        | Texto primario, titulares (navy marino)| `#12293F`  |
| **Pizarra**      | Texto secundario                      | `#4C6072`   |
| **Latón**        | Acento (brass): CTA, hoist, progreso, foco | `#B8742A` |
| **Verde tierra** | Acierto (verde de "tierra" cartográfico)| `#2E7D5B`  |
| **Rojo señal**   | Error (rojo de chincheta, desaturado) | `#C43D3D`   |

Derivados (tints/tintas y bordes) para estados y contraste AA — ver `tokens.css`:
- Latón: `--c-accent-strong #9C5F1B` (superficie de CTA, texto blanco AA), `--c-accent-tint
  #F5E9D6` (fondos suaves/activos), `--c-accent-ink #6E4310` (texto latón sobre claro, AA).
- Verde: `--c-success-tint #E3F1E9`, `--c-success-ink #1F6046`.
- Rojo: `--c-error-tint #FBE7E5`, `--c-error-ink #A32A2A`.
- Neutros: `--c-ink-3 #5E7182` (captions), `--c-border #DCE3E9`, `--c-border-strong #C4CFD8`.

Contraste: Tinta sobre Papel > 12:1; Pizarra sobre Papel ~5.3:1 (AA texto normal); blanco sobre
Latón-strong ~5:1 (AA). Los estados usan **fondo tinte + borde de color + texto tinta/tinta de
color**, nunca texto de color claro sobre color saturado.

### Dark (secundario, vía `@media (prefers-color-scheme: dark)`)
Navy profundo de carta como fondo; **el interior de la tarjeta de bandera se mantiene claro**
(`#EEF2F5`) para que los colores de las banderas sean fieles. Latón y semánticos se aclaran para
mantener contraste. Valores en `tokens.css`.

---

## 3. Tipografía

Pareja deliberada, ninguna de las que caerían "por defecto" (nada de Playfair/serif de revista ni
Inter neutro). El acento cartográfico lo aporta el **mono** en datos.

- **Display — Bricolage Grotesque** (`@fontsource-variable/bricolage-grotesque`).
  Grotesca contemporánea de terminaciones humanistas, ligeramente irregulares: la "mano segura del
  cartógrafo" en una guía de campo moderna. Titulares, nombres de país (etiqueta de espécimen),
  eyebrows. Pesos 600–800. Tracking negativo en tamaños grandes (`--tracking-tight`).
- **Texto/UI — Hanken Grotesk** (`@fontsource-variable/hanken-grotesk`).
  Grotesca humanista, calma y muy legible en móvil. Cuerpo, opciones, controles. Pesos 400/500/600.
- **Datos — Spline Sans Mono** (`@fontsource-variable/spline-sans-mono`).
  Mono para "lecturas de instrumento": códigos ISO (`FR`), progreso (`03 / 10`), capital/población,
  coordenadas. Refuerza el concepto cartográfico. Peso 400/500, en tamaños pequeños con
  `--tracking-normal`.

**Paquetes @fontsource exactos (self-host, PWA offline — sin CDN en runtime).** Los instala
frontend-engineer y los importa una vez (p. ej. en `main.tsx` o `global.css`):
```
@fontsource-variable/bricolage-grotesque   // v5.x  -> family "Bricolage Grotesque Variable"
@fontsource-variable/hanken-grotesk        // v5.x  -> family "Hanken Grotesk Variable"
@fontsource-variable/spline-sans-mono      // v5.x  -> family "Spline Sans Mono Variable"
```
Import mínimo (variables, un `.woff2` por familia; el SW de la PWA los precachea — el patrón de
Workbox ya incluye `woff2`):
```ts
import '@fontsource-variable/bricolage-grotesque';
import '@fontsource-variable/hanken-grotesk';
import '@fontsource-variable/spline-sans-mono';
```
Las font-family con fallback ya están en `--font-display / --font-body / --font-mono`.

### Escala tipográfica (base 16px, móvil)
| Token         | px  | Uso |
|---------------|-----|-----|
| `--text-2xs`  | 11  | micro-etiquetas mono (ISO) |
| `--text-xs`   | 12  | eyebrows, captions |
| `--text-sm`   | 14  | texto secundario |
| `--text-base` | 16  | cuerpo |
| `--text-lg`   | 18  | etiqueta de opción, cuerpo enfatizado |
| `--text-xl`   | 22  | nombre de país en juego, título de tarjeta |
| `--text-2xl`  | 28  | título de página |
| `--text-3xl`  | 36  | display / hero Home |
| `--text-4xl`  | 48  | hero grande (opcional) |

Line-height: `--leading-tight 1.08` (display), `--leading-snug 1.25` (títulos), `--leading-normal
1.5` (cuerpo). Eyebrows: `text-transform: uppercase; letter-spacing: var(--tracking-wide)` (0.08em),
en mono o display 600.

---

## 4. Elemento signature: la **marca de hoist**

En vexilología el *hoist* es el borde de la bandera junto al mástil. Nuestro signature es una
**barra vertical corta pegada al borde izquierdo de toda tarjeta de bandera y de país** — evoca
dónde la bandera se une al asta. Es memorable, barato, fiel al tema y **resuelve el problema de las
banderas con blanco** (Japón, Nigeria en zonas, etc.): la barra + el marco garantizan que la
bandera se lea como objeto sobre el papel.

- Estado normal: barra en `--c-border-strong` (neutra).
- Estado activo / espécimen actual (la bandera de la pregunta en curso, la tarjeta enfocada): barra
  en **Latón** (`--c-accent`).
- Ancho `--hoist-width` (4px), altura completa del lado izquierdo, pegada al borde interior; hereda
  el radio del lado izquierdo de la tarjeta.

**Refuerzos del signature (atmósfera de apoyo, con restricción):**
- **Retícula** (`--graticule`): una malla fina de coordenadas, muy tenue, como fondo del hero de
  Home y de la cabecera de Explorar. Nunca sobre contenido denso ni sobre banderas.
- **Barra de progreso = regla graduada**: la pista lleva marcas (ticks) como una regla de carta;
  el relleno es Latón. El contador `03 / 10` en mono.
- **Datos en mono**: ISO, capital, población, % de acierto — como lecturas de instrumento.

Regla de Chanel ("quita un accesorio"): el signature es **la marca de hoist**. La retícula, los
ticks y el mono son ecos discretos del mismo mundo; todo lo demás se mantiene callado. Si una
pantalla compite con las banderas, gana la bandera.

---

## 5. Specs de componentes

Medidas mobile-first (360–414px). Contenedor de contenido `--content-max` (30rem) centrado.
Objetivo táctil mínimo `--tap-min` (44px); botones de opción 56px.

### 5.1 Tarjeta de bandera (héroe del juego y detalle)
- Contenedor con `aspect-ratio: 3 / 2`; la bandera es `<img>` con `object-fit: contain` sobre
  **Carta (#FFFFFF)** (blanco real para color fiel), centrada, con `padding` interior de
  `--space-2` para que el borde de la bandera no toque el marco.
- Marco: `border: 1px solid var(--c-border)`, `border-radius: var(--radius-lg)` (14px),
  `box-shadow: var(--shadow-sm)`. **Este marco+sombra es obligatorio** para separar banderas
  claras/blancas del fondo.
- **Marca de hoist** a la izquierda (4px), Latón cuando es la pregunta activa.
- Detalle (Explorar): misma anatomía, mayor (`--radius-xl`, `--shadow-md`), con el nombre del país
  en display debajo y la fila de datos en mono.
- Accesibilidad: `alt="Bandera de {país}"`. En `name-to-flag`, cuando la bandera es un botón, el
  botón lleva `aria-label` con el nombre.

### 5.2 Botones de opción — 4 estados
Superficie base blanca, borde neutro, radio `--radius-md` (10px), min-height 56px, padding
`--space-4`, texto `--text-lg`. En `flag-to-name` la etiqueta es el nombre (alineado a la
izquierda). En `name-to-flag` el "botón" contiene una mini tarjeta de bandera (5.1 reducida).

| Estado          | Fondo               | Borde                 | Texto/Detalle |
|-----------------|---------------------|-----------------------|---------------|
| **Normal**      | `--c-surface`       | `--c-border`          | Tinta; `--shadow-sm`; hover: borde `--c-border-strong`, `translateY(-1px)` |
| **Seleccionada**| `--c-accent-tint`   | `--c-accent`          | Tinta; marca de hoist/checkbox implícita mientras se confirma (si el modo lo usa) |
| **Correcta**    | `--c-success-tint`  | `2px --c-success`     | Texto `--c-success-ink`; icono ✓ a la derecha |
| **Incorrecta**  | `--c-error-tint`    | `2px --c-error`       | Texto `--c-error-ink`; icono ✕ a la derecha; *shake* corto (ver Motion) |

Al responder: la elegida se marca correcta/incorrecta; si fue incorrecta, la **correcta** también
se resalta en verde. Las demás pasan a **deshabilitadas**: `opacity: .55`, sin sombra, `pointer-
events: none`. Toda la retícula de opciones queda `aria-disabled` tras responder.

### 5.3 Input del modo "escribir el nombre"
- Campo grande: alto 56px, `--text-lg`, padding `--space-4`, fondo `--c-surface`, borde
  `--c-border`, radio `--radius-md`. Placeholder en `--c-ink-3`: "Escribe el país…".
- Foco: `border-color: var(--c-accent)` + `box-shadow: var(--shadow-focus)`.
- Ayuda debajo, en mono `--text-xs` `--c-ink-3`: "No importan tildes ni mayúsculas".
- Botón "Comprobar" (Button primario) a ancho completo debajo, o icono de envío dentro del campo.
- Tras enviar: el campo se bloquea y se pinta el borde en Verde tierra (acierto) o Rojo señal
  (error). En error, se muestra el nombre correcto en la ficha de feedback.

### 5.4 Ficha de dato curioso (post-respuesta) — "Nota de campo"
- Material distinto del chrome frío: fondo **Nota (#FBF6EE)**, papel cálido de cuaderno.
- **Regla de hoist en Latón** a la izquierda (mismo signature, 4px), radio `--radius-lg`,
  `--shadow-sm`.
- Eyebrow en mono/uppercase `--tracking-wide`: "Dato curioso" (o "Nota de campo"). Debajo, el país
  en display `--text-xl` y 1–2 `facts` en cuerpo `--text-base`, `--leading-normal`.
- Encabezado de estado del feedback: banda superior compacta con ✓ Verde tierra "¡Correcto!" o ✕
  Rojo señal "No era…". El resultado se anuncia con `aria-live="polite"`.
- Reutilizable: `variant="full"` en el detalle de país muestra todos los `facts` en lista.

### 5.5 Tarjeta de país (Explorar)
- Grid de 2 columnas en móvil (`gap: --space-3`). Cada tarjeta: mini tarjeta de bandera (5.1) arriba
  (aspect 3/2, marco, marca de hoist neutra), luego nombre en display `--text-lg` (2 líneas máx,
  `text-wrap: balance`), y una línea mono `--text-2xs` con ISO + continente.
- Tap: toda la tarjeta es enlace a `/explorar/{code}`; `--shadow-sm`, hover/active
  `--shadow-md` + `translateY(-2px)`; radio `--radius-lg`.

### 5.6 Barra de progreso (regla graduada)
- Pista: alto 8px, fondo `--c-border`, radio `--radius-pill`, con **ticks** cada segmento (borde
  del mundo cartográfico) usando un `repeating-linear-gradient` sutil de `--c-border-strong`.
- Relleno: Latón (`--c-accent`), radio pill, transición `width var(--dur-slow) var(--ease-out)`.
- Contador a la derecha en mono `--text-sm`: `03 / 10`. `role="progressbar"` con
  `aria-valuenow/min/max`.

### 5.7 Controles de Home (SegmentedControl / ContinentPicker / Button)
- **SegmentedControl** (modo, nº de preguntas): contenedor pill `--c-surface` con borde
  `--c-border`; segmento activo con fondo `--c-accent-tint`, texto `--c-accent-ink`, peso 600.
  Táctil ≥44px.
- **ContinentPicker**: chips (pills) seleccionables; activo = `--c-accent-tint` + borde `--c-accent`.
- **Button primario** ("Empezar", "Jugar otra vez"): fondo `--c-accent-strong`, texto
  `--c-on-accent`, radio `--radius-md`, alto 52px, ancho completo en móvil, peso 600. Secundario:
  fondo `--c-surface`, borde `--c-border-strong`, texto Tinta.

### 5.8 Hero de Home (tesis de la página)
Lo más característico del mundo del sujeto abre la página: **una bandera montada como espécimen**
sobre la retícula, con el título en display y el eyebrow en mono ("Guía de campo · 195 países").
No usar el patrón plantilla (número gigante + stats + gradiente). El héroe es la bandera + el gesto
de "empezar a identificar".

---

## 6. Radios, espaciado, sombras

- **Radios**: `--radius-sm 6`, `--radius-md 10`, `--radius-lg 14`, `--radius-xl 20`,
  `--radius-pill 999`. Tarjetas de bandera 14; controles 10; hero/detalle 20. (Nunca 0 → evitamos
  el look broadsheet.)
- **Espaciado** (base 4px): escala `--space-1..--space-20` (4, 8, 12, 16, 20, 24, 32, 40, 48, 64,
  80). Ritmo vertical de secciones en `--space-6/--space-8`.
- **Sombras** (tintadas en navy, no negro puro, para vivir en el mundo de la carta): `--shadow-sm`,
  `--shadow-md`, `--shadow-lg`, y `--shadow-focus` (halo de latón) para foco/inputs.

---

## 7. Motion (sobrio; respeta `prefers-reduced-motion`)

Duraciones `--dur-fast 120ms`, `--dur 200ms`, `--dur-slow 320ms`. Easings `--ease-out`,
`--ease-standard`, `--ease-spring` (solo para el "asentado" de la respuesta).

- **Entrada de pregunta**: fade + subida de 6px, `--dur` `--ease-out`.
- **Acierto**: la opción/tarjeta hace un *settle* de escala 1.0→1.03→1.0 (`--dur` `--ease-spring`)
  al pintarse de verde; la marca de hoist "prende" a Latón.
- **Error**: *shake* horizontal corto en la opción incorrecta (2 oscilaciones, ±6px, `--dur`), luego
  queda en rojo estático.
- **Progreso**: transición de `width` `--dur-slow` `--ease-out` al avanzar.
- **Transiciones de página**: cross-fade discreto (`--dur`), sin deslizamientos largos.
- **`prefers-reduced-motion: reduce`**: sin transforms (nada de pop/shake/subidas); solo cambios de
  color/opacidad. El reset base en `tokens.css` ya neutraliza duraciones; los componentes deben
  además evitar `transform` bajo esa media query.

---

## 8. Iconos PWA (`public/icons/`)

Marca = **la bandera montada en su asta** (destila el signature del hoist). Fondo navy (**Tinta**),
asta + banda de hoist en **Latón**, campo de la bandera en **Papel**, con eco de retícula.

- `pwa-192x192.png`, `pwa-512x512.png` — propósito `any` (cuadrado con esquinas redondeadas
  suaves).
- `maskable-512x512.png` — propósito `maskable` (navy a sangre; la marca dentro de la zona segura
  central ~80%).
- Fuente vectorial versionada: `public/icons/icon.svg` (+ `icon-maskable.svg`).

**Nota para el manifest** (lo edita frontend-engineer en `vite.config.ts`; el plan tiene
placeholders `#000000`/`#ffffff`): usar `theme_color: "#12293F"` (Tinta) y
`background_color: "#F2F5F7"` (Papel) para coherencia con la identidad.

---

## 9. Autocrítica

- **Un solo lugar audaz**: la marca de hoist. Retícula, ticks de la regla y mono son ecos del mismo
  mundo náutico/cartográfico, mantenidos tenues para no robarle protagonismo a las banderas.
- **Riesgo de "guía de campo" → crema/serif**: evitado a conciencia (papel frío + grotescas, mono
  para datos). Si en construcción algo empieza a verse "editorial cálido", enfriar el papel y quitar
  la retícula antes que añadir adornos.
- **Banderas blancas**: cubiertas por marco 1px + sombra + hoist en TODA tarjeta de bandera; no es
  opcional.
- **AA y foco**: estados por tinte+borde+texto oscuro; foco con halo de latón visible siempre.

---

# Iteración 2 — Feedback en bottom sheet + juego sin scroll

> Origen: feedback tras probar el juego desplegado. El feedback inline (banda de estado +
> `FactCard` + botón "Siguiente") se renderiza **debajo** de las opciones dentro del grid de
> `GamePage`, así que empuja el contenido y obliga a hacer scroll hasta "Siguiente" en cada
> pregunta. Objetivo de esta iteración: **eliminar el scroll**. El feedback pasa a ser una **hoja
> modal que sube desde abajo** (no empuja nada) y la pantalla de pregunta se **compacta para caber
> en 360×640**. Todo se mantiene 100% coherente con el sistema (carta náutica / nota de campo,
> marca de hoist, latón, tipografías). Aquí solo se **especifica**; implementa frontend-engineer.

## 10. El "bottom sheet nota de campo" (feedback modal)

La nota de campo es un objeto físico del mundo del vexilólogo: al responder, **la ficha se desliza
hacia arriba desde el borde inferior**, como si sacaras la nota del cuaderno y la subieras sobre la
lámina. La pregunta que acabas de responder **no desaparece**: queda detrás, atenuada por un scrim,
para mantener la continuidad espacial (sigues viendo la bandera/nombre que resolviste).

Es **modal**: mientras está abierta no se puede interactuar con la pregunta (las opciones quedan
inertes). Reutiliza el material de la `FactCard` (papel **Nota** + hoist en **Latón**), de modo que
la hoja *es* la nota de campo, ahora a pantalla-ancho y anclada abajo.

### 10.1 Anatomía y medidas

```
   ┌───────────────────────────────┐  ← el resto del viewport: la PREGUNTA
   │  (pregunta atenuada por scrim)│    detrás, atenuada por --scrim (Tinta @44%)
   │        ░░ bandera ░░          │    (no interactiva; aria-hidden)
   │                               │
   ╞═══════════════════════════════╡  ← borde superior del sheet
   │▌  ✓  ¡Correcto!               │  ← §A barra de estado (chip verde/rojo)
   │▌                              │
   │▌ ┌────┐  NOTA DE CAMPO        │  ← §B specimen: mini bandera + eyebrow…
   │▌ │ 🇫🇷 │  Francia             │      …+ país en display (--text-xl)
   │▌ └────┘                       │
   │▌  · Dato curioso uno del país.│  ← §C notas de campo (1–2 facts)
   │▌  · Dato curioso dos del país.│      (área que scrollea si desborda)
   │▌                              │
   │▌ ┌───────────────────────────┐│  ← §D CTA fijo (latón), zona del pulgar
   │▌ │        Siguiente          ││
   │▌ └───────────────────────────┘│
   └───────────────────────────────┘  ← anclado al borde inferior (safe-area)
    ↑ marca de hoist en Latón, borde izquierdo, todo el alto (--hoist-width)
```

- **Contenedor / posición**: `position: fixed`, anclado a `bottom/left/right: 0`. Ancho =
  `--content-max` (30rem) centrado (`margin-inline: auto`); en 360–414px ocupa el ancho completo.
  `z-index: var(--z-sheet)` (1001). El scrim va en un hermano a `--z-overlay` (1000).
- **Material**: fondo **Nota** (`--c-note` #FBF6EE), `box-shadow: var(--shadow-lg)` (la hoja
  "flota" sobre la lámina). Es el mismo papel cálido de la `FactCard`: la hoja es la nota de campo.
- **Radios**: solo esquinas **superiores** `--sheet-radius` (`--radius-xl`, 20px); esquinas
  inferiores a 0 (pegadas al borde de pantalla).
- **Marca de hoist (signature)**: barra de `--hoist-width` (4px) en **Latón** (`--c-accent`) en el
  borde izquierdo, a todo el alto de la hoja. **Se mantiene siempre en latón** en ambos estados
  (acierto y error): el hoist es identidad, no semáforo. Por eso el `FactCard` interior **no**
  repite su propio hoist — la hoja lo aporta una sola vez ("quita un accesorio").
- **Sin manija de arrastre (drag handle)**. La hoja no se arrastra (ver 10.4); una manija sugeriría
  un gesto que no existe. En su lugar, la barra de estado es el remate superior.
- **Altura**: la hoja **abraza su contenido** (no es de alto fijo). En el caso típico (estado +
  specimen + 2 facts + CTA) mide ~**290–320px** ≈ 45–50% de 640, dejando ~340px de pregunta
  atenuada visible arriba. Techo: `max-height: var(--sheet-max-h)` (88dvh). Si los facts son muy
  largos o el usuario amplía el texto, **solo el área de facts (§C) scrollea**; el estado (§A/§B) y
  el CTA (§D) quedan fijos. Así "Siguiente" **siempre** es alcanzable sin scroll de página.
- **Padding**: `--sheet-pad` (`--space-5`, 20px) en lados y arriba;
  `padding-bottom: max(var(--space-5), env(safe-area-inset-bottom))` para librar el indicador de
  inicio (iOS). La barra de hoist (4px) suma a la izquierda; el contenido arranca tras ella.

### 10.2 Jerarquía interior (de arriba a abajo)

Layout: **flex column** con tres zonas — cabecera fija (§A+§B), medio scrollable (§C), pie fijo (§D).

- **§A — Barra de estado** (`aria-live="polite"`, se anuncia al abrir). Fila compacta (~28–32px):
  chip cuadrado con icono + texto de resultado. Es el **único** sitio con color semántico.
  - Acierto: chip `--c-success-tint` + icono `✓` `--c-success`; texto **"¡Correcto!"** en
    `--c-success-ink`, peso 600.
  - Error: chip `--c-error-tint` + icono `✕` `--c-error`; texto **"Era {País}"** en `--c-error-ink`
    (con el nombre en `<strong>`). El país correcto se enuncia aquí, no se pierde.
- **§B — Specimen** (identidad de la ficha): fila horizontal con **mini bandera** (`FlagImage`
  `size="sm"`, ~64×43px, con su marco + hoist neutro) + a la derecha el eyebrow mono/uppercase
  **"Nota de campo"** (`--c-accent-ink`, `--tracking-wide`) sobre el **país en display**
  (`--text-xl`, `--weight-bold`). Mostrar el specimen en **todos los modos** (aunque en flag→name la
  bandera también asome atenuada detrás): la nota de campo siempre lleva su espécimen, refuerza la
  asociación bandera↔nombre (el objetivo del juego) y es especialmente útil en name→flag y
  type-name. Es un eco deliberado del signature, no decoración.
- **§C — Notas de campo** (`facts`): 1–2 items, `--text-base`, `--leading-normal`, viñeta `·` en
  latón (como en `FactCard`). Es la **zona scrollable** si desborda (`overflow-y: auto`;
  `overscroll-behavior: contain` para no arrastrar el fondo). En el caso típico no hay scroll.
- **§D — CTA fijo**: `Button` primario a ancho completo (latón `--c-accent-strong`, 52px),
  **"Siguiente"** o **"Ver resultado"** en la última pregunta. Pegado abajo (thumb zone), separado
  de §C por `--space-4`. Es la acción única y el único camino para avanzar (ver 10.4).

Regla anti-semáforo: el papel Nota + hoist latón **no cambian** entre acierto y error; solo cambian
§A (chip/texto) y el icono. Evita que la hoja "parpadee" en verde o rojo pleno y compita con los
colores de la bandera. Restricción coherente con §9.

### 10.3 El fondo (la pregunta detrás) y el scrim

- **Scrim**: capa a pantalla completa (`position: fixed; inset: 0`) con `background: var(--scrim)`
  (**Tinta @44%**, `rgba(18,41,63,.44)`; en dark `rgba(2,8,14,.60)`). Atenúa la pregunta pero **la
  deja legible detrás** — el usuario sigue viendo la bandera/nombre que respondió, lo que da
  continuidad y evita la sensación de "cambio de pantalla".
- Opcional (progresivo, sobrio): `backdrop-filter: blur(1.5px) saturate(0.92)` sobre el scrim, para
  desaturar levemente el fondo y que el papel cálido de la hoja destaque. Con `@supports`; si no,
  solo el color. No imprescindible.
- **La pregunta detrás no se re-anima ni se mueve**: se queda donde está, solo atenuada. Al cerrar
  la hoja y avanzar, la **siguiente** pregunta hace su entrada `fadeUp` habitual (§7).
- **Modalidad**: mientras la hoja está abierta, la pregunta lleva `aria-hidden="true"` y
  `inert`/`pointer-events: none`; el foco queda **atrapado** dentro de la hoja. Al abrir, el foco va
  al CTA "Siguiente" (o al contenedor de la hoja) — así, en teclado, `Enter` avanza directo.

### 10.4 Cierre / avance — decisión y justificación

**Decisión: se avanza SOLO con el CTA ("Siguiente" / "Ver resultado"). Tocar el scrim NO cierra ni
avanza (scrim inerte). `Esc` equivale al CTA (avanza).**

Justificación para el loop de juego rápido:
- El **dato curioso es la carga útil educativa** de la app. Si un toque perdido en el scrim
  descartara la hoja, se saltaría el dato sin querer. El CTA está **debajo** de los facts: para
  alcanzarlo, el ojo ya pasó por la nota. Garantiza lectura sin ralentizar.
- **Un solo camino, sin estados ambiguos**: no existe "cerrada pero sin avanzar" (que dejaría al
  usuario varado en una pregunta ya respondida sin salida visible). Toda respuesta → hoja → CTA →
  siguiente. Predecible y rápido.
- **La velocidad ya está**: el CTA es un objetivo grande en la zona del pulgar; avanzar es **un
  toque**. Un scrim-para-avanzar ahorraría casi nada y arriesgaría saltarse el dato.
- Descartada la alternativa "tocar scrim = avanzar" por ese riesgo de salto accidental; y descartada
  "tocar scrim = cerrar sin avanzar" por el estado varado. (Opcional menor: si se toca el scrim, un
  micro-pulso de escala en el CTA para señalarlo; probablemente **se recorta** por sobriedad y por
  reduced-motion.)

### 10.5 Motion (entrada/salida)

- **Entrada**: la hoja `transform: translateY(100%) → translateY(0)` en `--dur-slow` (320ms)
  `--ease-out`; el scrim `opacity: 0 → 1` en `--dur` (200ms). Sin overshoot (no spring: sería
  demasiado juguetón para una nota de instrumento).
- **Salida** (al pulsar CTA): la hoja `translateY(0) → 100%` en `--dur` (200ms, más rápida que la
  entrada) `--ease-standard`; scrim desvanece a la vez. Al terminar, se desmonta y se monta la
  siguiente pregunta (que hace su `fadeUp`).
- **`prefers-reduced-motion: reduce`**: **sin translate**. La hoja y el scrim solo hacen **fade**
  (`opacity 0 → 1` en `--dur`) al entrar y fade-out al salir. Nada de deslizamiento. (El reset de
  `tokens.css` ya neutraliza duraciones; el componente además debe evitar `transform` bajo esta
  media query.)
- La barra de estado §A puede conservar el *settle* del acierto (icono ✓, escala 1→1.03→1,
  `--ease-spring`) y el *shake* corto del error en el icono ✕ — pero **solo el icono/chip**, no toda
  la hoja, y suprimidos bajo reduced-motion.

## 11. Presupuesto vertical del juego sin scroll (360×640)

Meta: la pantalla de pregunta **completa** (barra superior + progreso + bandera/nombre + opciones o
input) cabe en **360×640 sin scroll de página**. El único scroll permitido es el interno de §C del
sheet cuando los facts desbordan.

### 11.1 Estrategia de altura: la pantalla de juego ocupa el viewport

Durante la partida, la ruta `/jugar` deja de usar el `AppHeader` global y el padding de `main`
(`--space-5/--space-12`), y se convierte en una **columna flex a alto de viewport que no scrollea**:

```css
/* pantalla de juego */
min-height: 100vh;      /* fallback */
min-height: 100svh;     /* svh gana donde se soporta */
height: 100svh;
display: flex;
flex-direction: column;
overflow: hidden;       /* nada de scroll de página */
```

**svh vs vh vs dvh** (crítico en móvil por las barras del navegador):
- Se dimensiona a **`svh`** (small viewport height = viewport con la barra del navegador
  **desplegada**). Así el contenido **siempre** cabe, incluso en el peor caso de chrome visible; si
  la barra se retrae, sobra un poco de espacio abajo (inofensivo) en lugar de aparecer scroll.
- **No usar `vh`** para el alto total (incluye el área tras el chrome → generaría scroll cuando la
  barra está visible). `vh` solo como *fallback* para navegadores sin `svh`.
- **`dvh`** se usa solo para los **caps elásticos** (`--flag-hero-max-h`, `--sheet-max-h`), no para
  el alto total, y siempre con **techo en px** para que un cambio de `dvh` (al retraerse el chrome)
  no empuje el layout a desbordar.

### 11.2 Reparto del alto (flag→name, el caso más apretado)

flag→name es el más exigente (bandera héroe grande + 4 opciones de 56px). Reparto para 360×640:

| Fila | Elemento | Alto | Notas |
|------|----------|------|-------|
| 1 | **Barra superior de juego** | `--game-topbar-h` **44px** | Reemplaza al AppHeader. `[✕ Salir]  [regla de progreso flex-1]  [03 / 10 mono]`. El progreso se **integra aquí** (no fila aparte). |
| — | padding-block del área | `--game-pad-block` **12px** ×2 = 24px | Compacto (vs. 20+48 de `main`). Lados en `--space-4`. |
| 2 | **Prompt** | ~20px | "¿De qué país es esta bandera?" a `--text-sm` (14px), `--c-ink-2`, 1 línea. |
| — | gap | `--space-3` 12px | |
| 3 | **Bandera héroe** | **elástico**, cap `--flag-hero-max-h` (~192px @30dvh, techo 220px) | `flex: 1 1 auto`, `aspect-ratio: 3/2`, centrada. Es el elemento que "cede". |
| — | gap | `--space-3` 12px | |
| 4 | **4 opciones** | 4×56 + 3×12 = **260px** | `--space-3` de gap; 56px conserva tap cómodo. |

Suma dura (con la bandera en su techo de 192px, sin contar holgura):
`44 + 24 + 20 + 12 + 192 + 12 + 260 = 564px ≤ 640`. Sobran ~**76px** de holgura, que la columna
reparte (`justify-content: center` o `space-between`), respirando sin scroll. En pantallas más
altas la bandera crece hasta su techo (220px) y el resto se centra.

**Qué se compacta (palancas, en orden de aplicación):**
1. **AppHeader oculto** durante la partida → −48px. Sustituido por la barra de juego de 44px con el
   **progreso integrado** (antes el progreso era una fila propia). Neto: se recupera ~1 fila entera.
2. **Padding vertical** de `main` (20+48) → `--game-pad-block` 12+12. −44px.
3. **Bandera con alto relativo al viewport** (`--flag-hero-max-h`) en vez de `max-width: 20rem`
   fijo (que daba ~213px sin control). Es la variable de ajuste.
4. **Prompt a `--text-sm`** (14 en vez de 16) y 1 línea.
5. Reserva: opciones a **52px** (min-height) si algún dispositivo muy corto lo pidiera → −16px.
   Con 640 **no hace falta**; mantener 56px.

### 11.3 name→flag y type-name (verificación)

- **name→flag** (grid 2×2 — debe caber): barra 44 + pad 24 + prompt 20 + gap 12 +
  **nombre de país** (bajar a `--text-xl` 22px en juego, 1–2 líneas ≈ 30–56px) + gap 12 + **grid**.
  Celda del grid a 360px: ancho `(360 − 2·16 − 12)/2 = 158px`; alto (aspect 3/2) `≈ 105px`; dos
  filas + gap = `2·105 + 12 = 222px`. Total ≈ `44+24+20+12+40+12+222 = 374px` ≪ 640. **Cabe con
  holgura**; el grid puede incluso ganar aire. El tamaño de bandera del 2×2 **se mantiene** (mini
  tarjeta `size="sm"`, marco + hoist); no se toca la escala definida en §5.1/§5.2.
- **type-name**: barra 44 + pad 24 + prompt 20 + bandera héroe (mismo `--flag-hero-max-h`, elástica)
  + input 56 + ayuda mono ~18 + botón "Comprobar" 52. Suma sin bandera ≈ `44+24+20+56+18+52 +
  gaps(~36) = 250px`; con la bandera a 192 → **~442px** ≪ 640. Cabe holgado; la bandera puede usar
  todo su techo.

## 12. Ajustes derivados y tokens nuevos

- **Tokens añadidos a `tokens.css`** (§ Iteración 2):
  - `--z-sheet: 1001` (hoja sobre el scrim `--z-overlay` 1000).
  - `--game-topbar-h: 44px` (barra superior de juego, conserva tap-min).
  - `--game-pad-block: var(--space-3)` (12px, padding vertical compacto del área de juego).
  - `--flag-hero-max-h: clamp(150px, 30dvh, 220px)` (cap elástico de la bandera héroe).
  - `--scrim: rgba(18,41,63,.44)` (Tinta @44%; dark `rgba(2,8,14,.60)`).
  - `--sheet-max-h: 88dvh` (techo de la hoja; §C scrollea si desborda).
  - `--sheet-radius: var(--radius-xl)` (esquinas superiores de la hoja, 20px).
  - `--sheet-pad: var(--space-5)` (padding interior de la hoja).
- **Componentes afectados (no los toco; para frontend-engineer)**:
  - `GamePage`: deja de renderizar `AnswerFeedback` inline dentro del grid; ahora monta un
    **`FieldNoteSheet`** (scrim + hoja) cuando `currentAnswer != null`. La pantalla de juego pasa a
    columna flex a `100svh` sin scroll (§11.1). Ocultar `AppHeader` en `/jugar` (o variante de
    layout sin el padding de `main`).
  - Nueva barra superior de juego con el **progreso integrado** (`ProgressBar` embebido) + salir.
  - `AnswerFeedback` se reencarna como contenido de la hoja: barra de estado §A + `FactCard`
    (sin su hoist propio, que ahora lo pone la hoja) + specimen §B + CTA §D. `FactCard` gana la
    opción de **no** pintar su `::before` de hoist cuando vive dentro de la hoja.
  - La `FlagImage` héroe usa `--flag-hero-max-h` (contenedor con `aspect-ratio` + `max-height`).
- **Sin cambios** en la paleta, la tipografía, el signature ni el resto de componentes: esta
  iteración es puramente de **layout + un patrón modal**, dentro del sistema ya definido.

---

# Iteración 3 — Modo competitivo (Fase 1: récords locales)

> Origen: `docs/competitivo.md` (§3–§5), decisiones **cerradas con el usuario el 2026-07-06**.
> Se añade una modalidad "seria" y de marca: partidas de `min(20, pool)` preguntas en modo
> **mixto** (mitad bandera→nombre, mitad nombre→bandera, barajadas), **límite duro de 10 s** por
> pregunta con cuenta regresiva visible, **récord local por (categoría, modo)** y un **catálogo de
> 18 categorías** (7 continentes + 10 sectores + "Mundo"). Aquí solo se **especifica**; implementa
> frontend-engineer. Todo se mantiene dentro del sistema ya fijado (carta náutica / guía de campo,
> marca de hoist, latón con disciplina, mono para lecturas de instrumento). **No se toca la paleta
> ni la tipografía**; se declara **un solo token nuevo** (`--countdown-track-h`) y una variable de
> estado en runtime (`--countdown-fill`). Regla de Chanel: el competitivo **no** añade un mundo
> visual nuevo — reutiliza el signature (hoist que "prende" a latón) para la selección y el récord,
> y el mono para el tiempo. La única concesión de color semántico nueva es la **variante timeout**,
> y se resuelve **sin** inventar un tercer color (icono + copy sobre el rojo ya existente).

## 13. `QuestionCountdown` — cuenta regresiva de 10 s (solo competitivo)

**Problema.** `/jugar` no scrollea y todo cabe en 360×640 (§11). El countdown **no puede robar
altura ni provocar layout shift**, y debe transmitir urgencia **creciente** sin ansiedad constante
(nada de dígitos parpadeando los 10 s). En el mundo del sujeto, el tiempo es una **lectura de
instrumento**: una **mecha que se consume** en el borde del panel + un cronómetro en mono. Se
integra **dentro del `GameTopBar`**, no como fila nueva.

**Anatomía (variante competitiva del `GameTopBar`, 44px, sin altura extra):**

```
┌──────────────────────────────────────────────────────┐ 44px  (--game-topbar-h)
│ [✕]   ══════ regla de progreso ══════  03/10    ◷    │  ← fila normal + slot mono reservado
│▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂│  ← §13.1 mecha (fuse) a ras del borde inferior
└──────────────────────────────────────────────────────┘        drena de 100%→0% en 10 s, lineal
```

Dos instrumentos, dos hechos distintos (structure = information, skill §"Structure is information"):
- **Regla de progreso** (§5.6): *posición en la ronda*. **Crece** izq→der, **latón**, con ticks,
  inline en la fila.
- **Mecha del countdown**: *tiempo de la pregunta*. **Se consume** (der→izq), **fría** (Pizarra) y
  solo **roja** al final, a ras del borde inferior del panel. Distinta en grosor, posición, color y
  sentido de movimiento → nunca se confunde con la regla ni compite con la bandera.

### 13.1 La mecha (fuse) — representación ambiente, por defecto

- **Posición**: hija del `.topbar` (que pasa a `position: relative`), a sangre en el borde inferior
  (`left/right/bottom: 0`), alto `--countdown-track-h` (**3px**). Es **absolute** → **cero altura
  añadida, cero layout shift**. Se pinta *dentro* de los 44px de la barra.
- **Comportamiento**: el relleno drena de `width: 100%` a `0%` en los ms restantes, **lineal**
  (el tiempo no acelera). El ancho lo conduce el runtime con la variable de estado `--countdown-fill`
  (o una `transition: width linear` cuya duración = ms restantes, fijada al montar la pregunta).
- **Color (urgencia creciente, sin ansiedad constante):**
  - Lane (fondo): `--c-border` (tenue).
  - Relleno **calmo** (t > 3 s): `--c-ink-2` (Pizarra, frío; instrumento, no alarma). AA como
    elemento de UI.
  - Relleno **urgente** (t ≤ 3 s): `--c-error` (Rojo señal). El cambio de color **es** la señal de
    urgencia, y llega **solo al final** → no hay rojo ni parpadeo durante los 7 s tranquilos.
- **Sin pulso por defecto** ("quita un accesorio"): el cambio de color basta. Un latido opcional del
  relleno rojo se **descarta** por sobriedad y por reduced-motion.

### 13.2 Lectura numérica (escalada, no reloj permanente)

Slot mono **reservado** al final de la fila (`min-width: 2.5ch`, `tabular-nums`) → aparecer/desaparecer
dígitos **no reflota** nada.
- **Con motion** (por defecto): en fase calma muestra un **glifo de cronómetro** `◷` en `--c-ink-3`
  (señala "esto va contra reloj" sin dígitos que inviten a mirar el reloj). En los **últimos 3 s**
  muestra el entero de segundos (`3` → `2` → `1`) en `--c-error`, `--weight-semibold`. La aparición
  del dígito rojo **es** el golpe de urgencia buscado.
- El slot es `aria-hidden` (no se locuta cada segundo).

### 13.3 `prefers-reduced-motion: reduce`

- **Sin drenado animado**: la mecha no transiciona su `width` (queda estática a `--c-ink-2`, o se
  oculta).
- **La lectura numérica pasa a primaria**: el slot muestra los segundos **todo el rato** (10 → 0),
  estáticos por segundo (cambio de contenido, no animación CSS), en `--c-ink-2` y **rojo** desde ≤ 3 s.
  Así el usuario con reduced-motion conserva una cuenta regresiva **numérica/estática** clara y AA
  (exactamente lo pedido).

### 13.4 Accesibilidad — sin spam de `aria-live`

- Todo el instrumento visual va `aria-hidden="true"`: **no** se anuncia cada segundo.
- Una **única** región visualmente oculta (`aria-live="assertive"`, one-shot) anuncia al cruzar el
  umbral: **"Quedan 3 segundos."** — una sola vez por pregunta, se limpia al avanzar. (Assertive
  porque es urgente y sensible al tiempo; un solo mensaje no es spam.)
- La **expiración** la anuncia la hoja (§17, `aria-live="polite"` de la barra de estado: "Se acabó
  el tiempo — era X"). El countdown no duplica ese anuncio.
- El foco no vive en el countdown (no es interactivo). Al agotarse el tiempo se registra fallo
  automático (`timedOut: true`) y **se abre `FieldNoteSheet`** en variante timeout (§17), que atrapa
  el foco como cualquier respuesta.

### 13.5 Ciclo de vida y no-conflictos

- Solo se monta en rondas competitivas (`RoundMode === 'mixto'` / flag `timed`); **el casual no lo
  renderiza** (sin countdown ni timeout, §competitivo 4.3). El `GameTopBar` casual queda intacto.
- El reloj arranca cuando la pregunta queda activa (mismo `elapsedMs` de §competitivo 4.3) y **se
  detiene** al responder o al expirar (cuando se abre la hoja; el fondo queda `inert` tras el scrim).
  Reloj de pared, sin pausas.
- Umbral de aviso = **3 s** (constante de lógica, p. ej. `SCORE_TIME_WARN_MS = 3000` en `score.ts`;
  **no** es un token CSS).

**CSS de referencia** (frontend-engineer lo lleva a CSS Modules del `GameTopBar`):
```css
.topbar { position: relative; }              /* ancla de la mecha */

.countdownFuse {                              /* lane a ras del borde inferior */
  position: absolute; left: 0; right: 0; bottom: 0;
  height: var(--countdown-track-h);           /* 3px */
  background: var(--c-border);
}
.countdownFuse > i {                          /* relleno que drena */
  display: block; height: 100%;
  width: var(--countdown-fill, 100%);         /* 100%→0% en los ms restantes, lineal */
  background: var(--c-ink-2);
}
.countdownFuse.isWarn > i { background: var(--c-error); }   /* últimos 3 s */

.countdownReadout {                           /* slot mono reservado (sin shift) */
  flex: none; min-width: 2.5ch; text-align: right;
  font-family: var(--font-mono); font-size: var(--text-sm);
  font-variant-numeric: tabular-nums; color: var(--c-ink-3);
}
.countdownReadout.isWarn { color: var(--c-error); font-weight: var(--weight-semibold); }

@media (prefers-reduced-motion: reduce) {
  .countdownFuse > i { transition: none; }    /* sin drenado suave; manda el número */
}
```

## 14. `CompetitivePage` (`/competitivo`) — selección de zona

**Tesis de la página (hero = lo más característico).** No es el formulario relajado del Home
(segmented + chips + espécimen). El competitivo es una **contrarreloj**: eliges **dónde** competir y
vas a por tu **récord**. El hero es esa promesa dicha con voz de instrumento, no un "número gigante
+ stats + gradiente" (patrón plantilla que la skill marca como default: evitado).

**Cómo se distingue del casual (a propósito):**
- Casual = **multi-select** de chips-pill (mezcla libre, lúdico).
- Competitivo = **single-select** de **filas-dossier** (una decisión seria), agrupadas, con **lectura
  de récord** en latón. Filas grandes y escaneables, no pills.
- Framing temporal propio ("Contrarreloj", "10 segundos por bandera") ausente en el casual.

### 14.1 Layout (móvil 360, la lista scrollea — esto **no** es `/jugar`)

```
┌───────────────────────────────────┐
│ Modo competitivo        (eyebrow)  │  mono, uppercase, --c-accent-ink
│ Contrarreloj             (h1)      │  display --text-2xl
│ 10 segundos por bandera. Elige     │  --c-ink-2, --text-sm
│ dónde competir y bate tu récord.   │
│                                    │
│ ┌───────────────────────────────┐ │  ← "Mundo" destacada (primera)
│ │▌ Mundo             194 países  │ │     hoist SIEMPRE latón
│ │  Los 194 países · 20 preguntas │ │     récord a la derecha
│ └───────────────────────────────┘ │
│                                    │
│ Continentes           (subhead)    │  mono, --text-xs, --c-ink-3
│ ┌───────────────────────────────┐ │
│ │▌ África        54 países · 20  │ │  fila-dossier (radio oculto)
│ │                Récord 3.200 pts│ │  récord en latón (--c-accent-ink)
│ └───────────────────────────────┘ │
│ … Asia, Europa, América, A. N. y   │
│   Centro, A. del Sur, Oceanía      │
│                                    │
│ Sectores              (subhead)    │
│ ┌───────────────────────────────┐ │
│ │▌ Europa del Oeste 27 países·20 │ │
│ │                   Aún sin récord│ │  sin récord → --c-ink-3
│ └───────────────────────────────┘ │
│ … 10 sectores                      │
│                                    │
│┌─────────────────────────────────┐│  ← §14.4 barra CTA sticky (bottom)
││          Comenzar               ││
│└─────────────────────────────────┘│
└───────────────────────────────────┘
```

### 14.2 La fila-dossier (item de selección)

Anatomía (reutiliza superficie, borde, radio y **el signature**):
- **Marca de hoist** a la izquierda (`--hoist-width`, radio del lado izquierdo): **neutra**
  (`--c-border-strong`) sin seleccionar, **latón** (`--c-accent`) al seleccionar. El hoist **es** el
  indicador de radio: "esta es la carta que has sacado". Uso on-brand del signature para el
  radiogroup (no un check genérico).
- **Nombre** en display `--text-lg`, `--weight-semibold`, sentence case.
- **Meta** en mono `--text-2xs`, `--c-ink-3`: `"{n} países · {q} preguntas"` con `q = min(20, pool)`
  (honesto por fila: Caribe → "13 países · 13 preguntas"; África → "54 países · 20 preguntas").
- **Récord** a la derecha, mono `--text-xs`:
  - Con récord: `"Récord {pts} pts"` en `--c-accent-ink` (latón, la única cifra premiada — coherente
    con `.streak` de ResultPage). `{pts}` con formato `toLocaleString('es-ES')` → "3.200".
  - Sin récord: `"Aún sin récord"` en `--c-ink-3`.
- **Estados**: normal (superficie + borde neutro + `--shadow-sm`); **seleccionada**
  (`--c-accent-tint` + borde `--c-accent` + hoist latón); **foco** (`--shadow-focus` de latón). Alto
  ≥ 64px (tap cómodo).

**Mundo** (destacada, primera, sobre los dos grupos): misma anatomía con más presencia — hoist
**siempre latón**, radio `--radius-xl`, y un descriptor en la meta ("Los 194 países · 20 preguntas").
Es la carta insignia.

### 14.3 Agrupación y jerarquía (18 items, escaneable)

- Orden: **Mundo** (destacada) → grupo **"Continentes"** (7: África, Asia, Europa, América, América
  del Norte y Centro, América del Sur, Oceanía) → grupo **"Sectores"** (10: Europa del Oeste, Europa
  del Este, Asia Occidental, Sudeste Asiático, Asia Meridional, Asia Oriental y Central, África del
  Norte y Occidental, África Oriental, África Central y Austral, Caribe).
- **Subheads** de grupo: mono `--text-xs`, `--weight-medium`, uppercase, `--tracking-wide`,
  `--c-ink-3`, con `margin: --space-4 0 --space-2`. Discretos (son ecos del mono, no titulares).
- Filas separadas por `--space-2` dentro del grupo.

### 14.4 CTA, selección y navegación

- **Radiogroup** único: `<input type="radio" name="zona">` visualmente oculto dentro del `<label>`
  de cada fila (navegación con flechas, foco nativo). Contenedor `role="radiogroup"`
  `aria-label="Elige dónde competir"`. Los subheads son `<h2>` visuales dentro del grupo (no rompen
  el radiogroup).
- **Sin selección por defecto**: la CTA **"Comenzar"** (Button primario, 52px) está **deshabilitada**
  (`aria-disabled`) hasta elegir; helper bajo la CTA: **"Primero elige dónde competir."** Al elegir,
  la CTA se activa; `Comenzar` → `startGame({ categoryId, mode: 'mixto', questionCount: 20 })` →
  `/jugar`.
- **Barra CTA sticky** al fondo (`position: sticky; bottom: 0`), a sangre
  (`margin-inline: calc(-1 * --space-4)`), con degradado de papel para que el contenido no choque, y
  `padding-bottom: max(--space-3, env(safe-area-inset-bottom))`.
- **Entrada a la vista** (hand-off, fuera de este doc): añadir **"Competir"** al `AppHeader` (pasa a
  3 enlaces: Jugar · Competir · Explorar) y/o un botón secundario "Jugar contrarreloj" en Home.

**CSS de referencia** (CSS Module nuevo `CompetitivePage.module.css`):
```css
.groupHead {                                   /* subhead Continentes/Sectores */
  margin: var(--space-4) 0 var(--space-2);
  font-family: var(--font-mono); font-size: var(--text-xs);
  font-weight: var(--weight-medium); text-transform: uppercase;
  letter-spacing: var(--tracking-wide); color: var(--c-ink-3);
}
.regions { display: grid; gap: var(--space-2); }

.region {                                      /* label envolviendo el radio oculto */
  position: relative; display: grid;
  grid-template-columns: 1fr auto; align-items: center;
  gap: var(--space-1) var(--space-3);
  min-height: 64px;
  padding: var(--space-3) var(--space-4);
  padding-left: calc(var(--space-4) + var(--hoist-width));
  background: var(--c-surface);
  border: var(--border-thin) solid var(--c-border);
  border-radius: var(--radius-lg); box-shadow: var(--shadow-sm);
  cursor: pointer;
  transition: border-color var(--dur-fast) var(--ease-standard),
              background-color var(--dur-fast) var(--ease-standard);
}
.region::before {                              /* marca de hoist (signature) */
  content: ''; position: absolute; inset: 0 auto 0 0;
  width: var(--hoist-width); background: var(--c-border-strong);
  border-radius: var(--radius-lg) 0 0 var(--radius-lg);
}
.region:has(:checked) { background: var(--c-accent-tint); border-color: var(--c-accent); }
.region:has(:checked)::before { background: var(--c-accent); }        /* hoist prende */
.region:has(:focus-visible) { box-shadow: var(--shadow-focus); }

.regionName { font-family: var(--font-display); font-size: var(--text-lg); font-weight: var(--weight-semibold); }
.regionMeta { grid-column: 1; font-family: var(--font-mono); font-size: var(--text-2xs); color: var(--c-ink-3); }
.regionRecord {
  grid-column: 2; grid-row: 1 / span 2; align-self: center; text-align: right;
  font-family: var(--font-mono); font-size: var(--text-xs); color: var(--c-accent-ink);
  white-space: nowrap;
}
.regionRecord.isEmpty { color: var(--c-ink-3); }

.world { border-radius: var(--radius-xl); }    /* Mundo destacada */
.world::before { background: var(--c-accent); border-radius: var(--radius-xl) 0 0 var(--radius-xl); }

.startBar {
  position: sticky; bottom: 0;
  margin-inline: calc(-1 * var(--space-4));
  padding: var(--space-3) var(--space-4);
  padding-bottom: max(var(--space-3), env(safe-area-inset-bottom));
  background: linear-gradient(to top, var(--c-bg) 72%, transparent);
}
.startHint { margin-top: var(--space-2); font-family: var(--font-mono); font-size: var(--text-xs); color: var(--c-ink-3); text-align: center; }
```

## 15. Banner de récord en `ResultPage` (solo competitivo)

Se integra en el `.scorePanel` ya existente (§ResultPage): mismo bloque, dos estados. El casual **no
cambia** (panel informativo tal cual). La celebración es **sobria y de marca**: no confeti — el
panel **"prende" a latón** (eco literal del acierto, §7: "la marca de hoist prende a Latón").

**Estado A — ¡Nuevo récord!** (puntaje actual > mejor previo, o primer récord):
```
┌▌────────────────────────────┐   ▌ hoist de logro (latón), izquierda
│ ¡Nuevo récord!               │   eyebrow mono uppercase, --c-accent-ink
│ 3.480                        │   cifra en LATÓN (--c-accent)
│ Mejor racha: 9 seguidas      │   (línea existente)
│ Superaste tu récord de 3.200 │   mono --c-ink-2 (qué batiste)
└──────────────────────────────┘
```
- El panel gana `border-color: --c-accent`, un **hoist** latón a la izquierda (`--hoist-width`,
  radio `--radius-md`), la cifra `.scorePoints` en `--c-accent`, y un **settle** al montar
  (escala 1→1.03→1, `--ease-spring`, `--dur`) — el mismo asentado del acierto. Bajo reduced-motion,
  sin settle (solo el color/hoist).
- Copys: eyebrow **"¡Nuevo récord!"**; línea inferior **"Superaste tu récord de {previo} pts"**; si
  era el primero, **"Tu primer récord"**.

**Estado B — normal** (no superó el récord): el panel se queda como hoy y añade **una línea inferior**
con la marca a batir, mono `--text-sm`, `--c-ink-2`: **"Récord {mejor} pts"**. Sin latón de logro
(el latón se reserva para el logro real).

**Accesibilidad**: el resultado del récord se anuncia una vez al aterrizar en ResultPage. El foco ya
va al titular (`headingRef`); el nuevo récord puede exponerse con `aria-live="polite"` en el panel (o
integrarse en el `aria-label` del panel: `"Puntaje de la ronda. Nuevo récord."`). Sin animación
intrusiva. `{pts}` siempre con `toLocaleString('es-ES')`.

**CSS de referencia** (se añade a `ResultPage.module.css`, junto a `.scorePanel`):
```css
.scorePanel.isRecord {
  position: relative; border-color: var(--c-accent);
  padding-left: calc(var(--space-4) + var(--hoist-width));
  animation: recordSettle var(--dur) var(--ease-spring);
}
.scorePanel.isRecord::before {
  content: ''; position: absolute; inset: 0 auto 0 0;
  width: var(--hoist-width); background: var(--c-accent);
  border-radius: var(--radius-md) 0 0 var(--radius-md);
}
.scorePanel.isRecord .scorePoints { color: var(--c-accent); }
.recordFlag {                                  /* eyebrow "¡Nuevo récord!" */
  font-family: var(--font-mono); font-size: var(--text-xs);
  font-weight: var(--weight-semibold); text-transform: uppercase;
  letter-spacing: var(--tracking-wide); color: var(--c-accent-ink);
}
.recordPrev, .recordToBeat {                   /* "Superaste…" / "Récord … pts" */
  margin-top: var(--space-1);
  font-family: var(--font-mono); font-size: var(--text-sm); color: var(--c-ink-2);
}
@keyframes recordSettle { 0% { transform: scale(1); } 40% { transform: scale(1.03); } 100% { transform: scale(1); } }
@media (prefers-reduced-motion: reduce) { .scorePanel.isRecord { animation: none; } }
```

## 16. `CategoryMultiPicker` (casual) — de 7 a 17 chips agrupados

El catálogo compartido pasa a 18 categorías; en el casual se muestran **17 chips** (todas menos
`mundo`, que ya cubre el chip **"Todos"**) + el chip "Todos". Para que 17 chips sigan escaneables se
**agrupan** bajo dos subtítulos discretos, **sin romper el flex-wrap** de los chips.

**Layout** (dentro del campo "Categorías" del Home; los subheads son **un nivel por debajo** del
`.fieldLabel` "Categorías", por eso más ligeros que él):
```
Categorías                         (.fieldLabel — display, existente)
[ Todos ]                          chip maestro, en su propia fila
Continentes                        (.groupHead — mono, --text-xs, --c-ink-3)
[África][América][A. N. y Centro][A. del Sur][Asia][Europa][Oceanía]   ← .chips flex-wrap
Sectores                           (.groupHead)
[Europa del Oeste][Europa del Este][Asia Occidental][Sudeste Asiático]
[Asia Meridional][Asia Oriental y Central][África del Norte y Occidental]
[África Oriental][África Central y Austral][Caribe]                     ← .chips flex-wrap
```

- **Chips sin cambios**: mismo `.chip`/`.selected` de `ContinentPicker.module.css` (cero CSS de chip
  nuevo; misma a11y `aria-pressed`).
- **Subheads**: reutilizan el patrón `.groupHead` de §14.3 (mono `--text-xs`, `--weight-medium`,
  uppercase, `--tracking-wide`, `--c-ink-3`). `margin-top: --space-3` entre grupos, `margin-bottom:
  --space-2`. Idénticos a los de `CompetitivePage` → un solo lenguaje de agrupación en toda la app.
- **Estructura**: un contenedor por grupo, cada uno con su subhead + su `.chips` (flex-wrap propio).
  "Todos" queda **fuera** de los grupos (es el toggle maestro).
- **Copys** de subhead: **"Continentes"**, **"Sectores"** (el chip maestro sigue siendo **"Todos"**).
- **Accesibilidad**: el `role="group" aria-label="Categorías"` exterior se mantiene; cada grupo interno
  es un `role="group"` con `aria-label="Continentes"` / `"Sectores"` (o `aria-labelledby` al subhead).
  Los botones-chip no cambian.

```css
.categoryGroups { display: grid; gap: var(--space-3); }   /* wrapper del picker */
.groupHead {                                              /* = §14.3, compartido */
  margin: var(--space-3) 0 var(--space-2);
  font-family: var(--font-mono); font-size: var(--text-xs);
  font-weight: var(--weight-medium); text-transform: uppercase;
  letter-spacing: var(--tracking-wide); color: var(--c-ink-3);
}
/* .chips y .chip: sin cambios (ContinentPicker.module.css) */
```

## 17. `FieldNoteSheet` — variante **timeout** de la barra de estado (§A)

Cuando la respuesta llega por **tiempo agotado** (`answer.timedOut === true`), la barra de estado §A
(§10.2) usa una **tercera variante**. Se mantiene la **misma barra** y el **mismo tono rojo** (sigue
siendo un fallo de 0 pts): **no se inventa un cuarto color** — sería romper la regla anti-semáforo
(§9). Lo que cambia es el **icono** y el **copy**, que aclaran "fue el tiempo, no un toque erróneo".

| Variante | Icono | Copy | Color |
|----------|-------|------|-------|
| Acierto | `✓` | "¡Correcto!" | success (existente) |
| Fallo (tap) | `✕` | "Era **{País}**" | error (existente) |
| **Timeout** | `◷` | **"Se acabó el tiempo — era {País}"** | **error** (mismo `.statusError`) |

- **Icono**: reloj `◷` en el chip `--c-error-tint` / `--c-error` (misma caja del icono §A). El glifo
  de reloj lleva la carga semántica "tiempo".
- **Copy**: **"Se acabó el tiempo — era {País}"** con `{País}` en `<strong>` (se sigue enseñando el
  país, como en el fallo por tap; em dash "—", sentence case, voz directa).
- **Motion**: la variante error del icono podía hacer *shake* (§10.5); **timeout NO hace shake** — un
  temblor connota "toque equivocado", y aquí no lo hubo. El icono aparece estático (o un fade suave),
  reforzando el matiz por el movimiento. Bajo reduced-motion, estático (igual que el resto).
- **Accesibilidad**: la barra §A ya es `aria-live="polite"` y se anuncia al abrir la hoja → locuta
  "Se acabó el tiempo — era {País}" **una sola vez** (esta es la locución de expiración que el
  countdown §13.4 delega en la hoja). El `aria-label` del `role="dialog"` pasa a **"Se acabó el
  tiempo"** en esta variante (hoy: "Respuesta correcta"/"Respuesta incorrecta").

```css
/* reutiliza .statusError (color rojo); solo cambia el glifo del icono y suprime el shake */
.statusTimeout { color: var(--c-error-ink); }
.statusTimeout .statusIcon { background: var(--c-error-tint); color: var(--c-error); }
/* .statusTimeout NO aplica la animación de shake del error */
```

## 18. Tokens y copys de la Iteración 3 (resumen)

### 18.1 Tokens nuevos a añadir a `tokens.css` (los añade el owner; aquí solo se declaran)
- `--countdown-track-h: 3px;` — grosor de la **mecha** del countdown (§13.1). Coherente con
  `--hoist-width: 4px` (tokens de trazo fino del signature). **Único token de diseño nuevo.**
- Variable de **estado en runtime** (no es token de paleta, la fija el componente por pregunta):
  `--countdown-fill` — porcentaje restante de la mecha (100% → 0%).

Todo lo demás **reutiliza** tokens existentes: colores `--c-ink-2` / `--c-error` / `--c-accent` /
`--c-accent-ink` / `--c-accent-tint` / `--c-border` / `--c-border-strong`; `--hoist-width`; radios;
`--shadow-sm` / `--shadow-focus`; `--ease-spring` / `--dur`; escala tipográfica y `--font-mono` /
`--font-display`. **Dark mode**: gratis (todos esos tokens ya tienen variante dark). **Sin tokens de
color nuevos.**

### 18.2 Constante de lógica (no CSS, para frontend-engineer)
- `SCORE_TIME_WARN_MS = 3000` (umbral de urgencia del countdown, §13.5) — vive en `score.ts` junto a
  `SCORE_TIME_LIMIT_MS`.

### 18.3 Copys nuevos (español, sentence case, voz directa)
| Lugar | Copy exacto |
|-------|-------------|
| Countdown · aviso AT (one-shot, §13.4) | **"Quedan 3 segundos."** |
| CompetitivePage · eyebrow | **"Modo competitivo"** |
| CompetitivePage · título (h1) | **"Contrarreloj"** |
| CompetitivePage · subtítulo | **"10 segundos por bandera. Elige dónde competir y bate tu récord."** |
| CompetitivePage · subheads | **"Continentes"** · **"Sectores"** |
| CompetitivePage · meta de fila | **"{n} países · {q} preguntas"** (`q = min(20, pool)`) |
| CompetitivePage · Mundo (meta) | **"Los 194 países · 20 preguntas"** |
| CompetitivePage · récord de fila | **"Récord {pts} pts"** / sin récord **"Aún sin récord"** |
| CompetitivePage · CTA | **"Comenzar"** |
| CompetitivePage · helper CTA deshab. | **"Primero elige dónde competir."** |
| CompetitivePage · aria radiogroup | **"Elige dónde competir"** |
| ResultPage · nuevo récord (eyebrow) | **"¡Nuevo récord!"** |
| ResultPage · qué batiste | **"Superaste tu récord de {previo} pts"** / primero: **"Tu primer récord"** |
| ResultPage · récord a batir (normal) | **"Récord {mejor} pts"** |
| CategoryMultiPicker · subheads | **"Continentes"** · **"Sectores"** (+ chip maestro **"Todos"**) |
| FieldNoteSheet · barra de estado timeout | **"Se acabó el tiempo — era {País}"** |
| FieldNoteSheet · aria-label diálogo (timeout) | **"Se acabó el tiempo"** |

> `{pts}` / `{previo}` / `{mejor}` siempre con `toLocaleString('es-ES')` (p. ej. "3.200"). `{País}`
> en `<strong>`.

### 18.4 Componentes afectados (hand-off; **no** se tocan aquí)
- `GameTopBar` — variante competitiva: `position: relative` + mecha (§13.1) + slot de lectura
  (§13.2). El casual, intacto.
- `GamePage` — en rondas competitivas monta el countdown y aplica el timeout (fallo automático →
  `FieldNoteSheet` variante §17). Sin cambios de layout de `/jugar` (§11 se respeta: cero altura extra).
- **`CompetitivePage`** (nueva) + su CSS Module (§14) y ruta `/competitivo`; entrada desde `AppHeader`
  ("Competir").
- `ResultPage` / `ResultPage.module.css` — panel de récord (§15) cuando la ronda es competitiva.
- `CategoryMultiPicker` — agrupación con subheads (§16), reutilizando chips de `ContinentPicker`.
- `FieldNoteSheet` / su CSS — variante `.statusTimeout` (§17).

---

## 19. Iteración 4 — Módulo Jugar unificado (masthead, pestañas de carpeta y ledger)

Reorganización pedida por el usuario (2026-07-07): **un solo módulo Jugar** dividido en Casual y
Competitivo, competitivo compacto y menos saturación general. Rutas: `/` (pestaña Casual) y
`/competitivo` (pestaña Competitivo) renderizan la misma `PlayPage`; el nav queda **"Jugar ·
Explorar"** (el enlace "Competir" desaparece: la pestaña lo reemplaza).

### 19.1 Escalabilidad prevista (huecos reservados, sin UI muerta)
- **Leaderboard online (Fase 2)**: será un **módulo propio** — tercer enlace del nav ("Ranking")
  junto a Jugar y Explorar. No es una pestaña de Jugar: consultar clasificaciones no es "jugar".
- **Variante competitiva "escrito" — OCUPADO (2026-07-07)**: el `SegmentedControl` de modo
  (**Mixto | Escrito**) vive entre la cabecera del panel competitivo y el ledger, con un hint mono
  de una línea que describe el modo elegido y sus segundos por pregunta (fuente única:
  `timeLimitFor`). La columna Récord lee el `RoundMode` elegido (clave `${categoría}:${modo}`).
  El subtítulo del panel pasó a "Elige modo y zona, y bate tu récord." (los segundos viven en el
  hint, que cambia con el modo).

### 19.2 Masthead + pestañas de carpeta (`PlayPage`)
- **Masthead compacto** (reemplaza al hero de la Home): retícula de fondo, eyebrow "Guía de campo ·
  {N} países", h1 "Banderas del mundo" y el **espécimen del día en miniatura** (FlagImage `sm`
  `active`, 5rem, meta "{ISO} · {País}" con ellipsis) a la derecha. El hero grande y la tagline se
  retiran: menos saturación, misma identidad.
- **Pestañas de carpeta** (signature de la iteración): dos enlaces ("Casual" / "Competitivo") con
  forma de pestaña de expediente — radios solo arriba, la activa **abre hacia el panel** (borde
  inferior transparente) y lleva la **marca de hoist en latón en el canto superior**, inset 12px
  por lado. Las inactivas reposan sobre la línea base capilar. Son `NavLink`s (aria-current
  automático), no botones: la pestaña ES la ruta.

### 19.3 Panel Casual (`CasualPanel`)
El formulario de la Home original tal cual (Modo / Categorías / Preguntas / "Empezar"), sin hero.
Cero cambios de lógica.

### 19.4 Panel Competitivo (`CompetitivePanel`) — el libro de registro
Las 18 zonas dejan de ser cards sueltos (72px c/u) y pasan a **un solo card-ledger** con filas de
44px separadas por línea capilar — la página entera pierde ~500px de alto:

```
┌──────────────────────────────────────┐
│ ZONA              PREGUNTAS   RÉCORD │  ← cabecera de columnas (mono 2xs, decorativa)
│ ▍Mundo                   20    1.450 │  ← fila = label con radio oculto focusable
│─ CONTINENTES ────────────────────────│  ← banda hundida (surface-2)
│ ▍África                  20        — │
│ …                                    │
│─ SECTORES ───────────────────────────│
│ ▍Caribe                  13      890 │
└──────────────────────────────────────┘
```

- **Retícula compartida** cabecera/filas: `minmax(0,1fr) 4.5rem 4.5rem`, números en mono con
  `tabular-nums` alineados a la derecha — lectura de libro de registro.
- **El tick de hoist es el indicador de radio**: 4×18px inset vertical centrado (nunca toca
  esquinas), neutro en reposo; al elegir pasa a latón, crece a 26px y la fila se tinta
  (`--c-accent-tint`). Foco teclado: anillo interior (`inset 0 0 0 2px --c-focus`).
- **Regla aprendida** (bug del card original): una barra decorativa pegada al borde de un contenedor
  redondeado debe ir **inset** o el contenedor debe recortarla (`overflow: hidden`); si no, la barra
  recta sobresale de la esquina curva. El ledger aplica ambas.
- Récord por fila: **solo la cifra** (`toLocaleString('es-ES')`) en latón; vacío = "—" (ink-3) con
  `aria-label="Aún sin récord"`. El copy largo "Récord {pts} pts" queda solo en ResultPage (§15).
- Cabecera del panel: h2 **"Contrarreloj"** + "10 segundos por pregunta. Elige tu zona y bate tu
  récord." CTA sticky "Comenzar" + helper igual que §14.

### 19.5 Copys que cambian respecto a §18.3
| Lugar | Copy |
|-------|------|
| Pestañas de Jugar | **"Casual"** · **"Competitivo"** (aria del nav de pestañas: "Tipo de partida") |
| Nav global | **"Jugar"** (activo en `/` y `/competitivo`) · **"Explorar"** |
| Ledger · cabecera de columnas | **"Zona" · "Preguntas" · "Récord"** |
| Ledger · récord de fila | **"{pts}"** (solo cifra) / vacío **"—"** (aria: "Aún sin récord") |
| Masthead · eyebrow | **"Guía de campo · {N} países"** |

Sin tokens nuevos: pestañas y ledger reutilizan hoist, radios, capilares y la escala mono existente.

---

# Iteración B — Juice de UX (sonido, animación, siluetas)

> Origen: `docs/roadmap.md §B` (decisiones **cerradas**: B.1 sonido ON + mute persistente, B.2
> animación con salida en reduced-motion, B.3 siluetas en ledger/chips/Explorar). Objetivo: darle
> **sensación de juego** sin romper la sobriedad de la guía de campo. La consigna del roadmap manda:
> **"brillo de latón, no confeti"**. Aquí se **especifica** la dirección visual/motion/sonora con
> valores concretos; implementa frontend-engineer. Propiedad de ui-designer: este doc + `tokens.css`.
> Se añaden tokens de brillo/glow/duración/silueta (§25) y **cero** cambios de paleta o tipografía.

## 20. Principios de la iteración (léelos antes de cada decisión)

1. **El sonido es de instrumento, no de arcade.** La app es un cuaderno de campo con un instrumento
   de latón: los sonidos son **latón cálido templado** (campanilla / diapasón) y **madera** (el toc
   del cuaderno), nunca ondas cuadradas chillonas. **Firma sonora: todo está afinado a La (A440)** —
   el diapasón del instrumento de campo. Los positivos giran sobre la tríada de La mayor (La–Do♯–Mi);
   los negativos caen a un La/Mi graves y sordos de madera (misma tonalidad, ánimo invertido); el tic
   es el La agudo (el escape del cronómetro). Es memorable, barato y fiel al tema.
2. **El brillo se gasta en un solo sitio: el récord.** El único momento "fanfarria" (sonora y visual)
   es *Nuevo récord*. Todo lo demás son micro-acentos discretos. Regla de Chanel aplicada al juice.
3. **Sonido y movimiento son ejes independientes.** El **mute** gobierna el audio; `prefers-reduced-
   motion` gobierna las animaciones. Un usuario con reduced-motion **sigue oyendo** los sonidos (el
   audio no es movimiento); un usuario con mute **sigue viendo** las animaciones. Cada animación de
   §23 declara su **salida digna** en reduced-motion.
4. **Nada es solo-sonido ni solo-movimiento (AA).** Todo evento con audio tiene su equivalente visual
   (chip de estado, color, cifra) y viceversa. El juice **refuerza**, nunca **porta** información.
5. **No robar altura ni protagonismo.** `/jugar` sigue sin scroll (§11); las siluetas y el chip de
   racha se integran en huecos ya reservados, con **cero layout shift**. Si algo compite con las
   banderas, gana la bandera.

## 21. Paleta sonora — 6 eventos (sintetizables)

Los 6 WAV se **generan** con un script Node propio (`scripts/gen-sounds.mjs`, sin samples ni
librerías): por muestra se suman parciales senoidales, se aplica la envolvente, se añade ruido donde
se indica, se pasa por un one-pole lowpass cuando toca, se normaliza al **pico** objetivo y se
escribe **WAV mono 22 050 Hz 16-bit** (cabecera de 44 B). Salida en `public/sounds/` (precacheados
por la PWA → offline). Todos llevan **fade-in de 2 ms** y **fade-out de 3 ms** para no chasquear al
truncar.

**Familia tímbrica (dos materiales):**
- **Latón** (positivos, tic): síntesis aditiva de parciales `f, 2f, 3f` con amplitudes `1.0, 0.5,
  0.18` (octava rica + tercer parcial que da el filo metálico). Inarmonicidad leve para brillo:
  `2f→2.01f`, `3f→3.02f`. Golpe percutido: **sin sustain**, ataque cortísimo y **decaimiento
  exponencial** `a(t)=e^(−t/τ)`.
- **Madera** (negativos): **onda triangular** grave (armónicos impares suaves) con **caída rápida de
  tono** + un **transitorio de ruido** al ataque (2–6 ms) que da el "toc" de contacto. El ruido pasa
  por un one-pole LP `y+=k·(x−y)` con `k≈0.4` (fc≈1.4 kHz) para que sea madera, no siseo.

| # | Evento | Material / onda | Notas (Hz) | Envolvente (ataque · τ decay) | Duración | Nivel (rel · pico) |
|---|--------|-----------------|------------|-------------------------------|----------|--------------------|
| 1 | **Acierto** | Latón `f,2f,3f` | **Do♯5 = 554.37** (una nota) | ataque 3 ms · τ 55 ms | **150 ms** | 1.00 · **−3 dBFS** |
| 2 | **Hito de racha** | Latón (hermano del acierto) | **Do♯5 554.37 → Sol♯5 830.61** (quinta ↑; 2ª nota entra a 55 ms, solapa) | ataque 2 ms · τ 40 ms por nota | **130 ms** | 0.85 · **−4 dBFS** |
| 3 | **Fallo (toque)** | Madera: triangular + ruido | glide **147 → 110** en 40 ms | ataque 2 ms · τ 45 ms; ruido 15 ms | **180 ms** | 0.80 · **−4 dBFS** |
| 4 | **Timeout** | Madera: **dos toques** ↓ | toc A **165**, toc B **110** (entra a 110 ms) | por toc: ataque 2 ms · τ 50 ms | **240 ms** | 0.80 · **−4 dBFS** |
| 5 | **Tic de urgencia** | Latón corto `f,2f` (2f a 0.20) | **La5 = 880** | ataque 1 ms · τ 18 ms | **55 ms** | 0.45 · **−8 dBFS** |
| 6 | **Récord nuevo** | Latón, arpegio + cola | **La4 440 · Do♯5 554.37 · Mi5 659.25 · La5 880** (onsets ~70 ms) | notas 1–3: ataque 4 ms · τ 70 ms; nota 4: ataque 8 ms · τ 180 ms + trémolo 5 Hz prof. 12% y parcial 4f a 0.10 (el "sheen") | **520 ms** | 0.90 · **−2 dBFS** |

**Carácter buscado por evento:**
- **Acierto** — un "ting" de latón limpio y cálido; suena en *cada* acierto, así que ligero y corto.
- **Hito de racha** — el acierto que **sube una quinta**: se oye literalmente "escalar". Suena **en
  lugar** del acierto cuando el multiplicador sube (§22.3), nunca a la vez (un solo sonido por
  respuesta). Un único asset "hacia arriba" por cada subida (no cinco notas distintas: coste bajo,
  lectura clara). Tras el tope (×1.5) vuelve el acierto normal.
- **Fallo** — un "toc" de madera grave y breve: decepción sin castigo. **No** es un zumbido
  electrónico (sería arcade/agresivo).
- **Timeout** — hermano del fallo (sigue siendo 0 pts, igual que el rojo compartido de §17): dos
  toques de madera **descendentes**, como el cronómetro que se detiene. Distinto del fallo por el
  segundo toque más grave — mismo material, gesto distinto.
- **Tic de urgencia** — un escape de latón muy corto y **muy bajo** (−8 dBFS): se repite en t=3,2,1
  s, no puede sobresaltar. La cuenta la lleva el dígito rojo; el tic solo la subraya.
- **Récord** — el único "fanfarria": la tríada de La mayor **ascendiendo** y la última nota que
  **florece** con trémolo (eco sonoro del barrido de latón visual, §23.4). Cálido y breve, jamás
  jingle de 8-bit.

**Presupuesto (mono 22 050 Hz 16-bit = 44 100 B/s):** 6.5 + 5.6 + 7.8 + 10.3 + 2.4 + 22.4 ≈ **55 KB**
< 60 KB. Holgura para las colas. Si el récord aprieta, recorta su cola a ~460 ms antes que tocar el
resto. **La última nota del récord es la única > 300 ms** (permitido para el récord).

**Normalización:** generar en Float32 con el nivel relativo indicado, luego **pico-normalizar** al
dBFS objetivo (headroom, sin clipping al sumar parciales). dBFS→lineal: −2=0.79, −3=0.71, −4=0.63,
−8=0.40.

## 22. Módulo de sonido + toggle de mute

### 22.1 Módulo `src/lib/sound.ts` (contrato; lo implementa frontend-engineer)
- **WebAudio** (no `<audio>`): un único `AudioContext`, un `GainNode` maestro (mute = `gain 0/1`), y
  6 `AudioBuffer` decodificados de los WAV (bajos, se `fetch`+`decodeAudioData` en el primer gesto).
  WebAudio permite **solapado** sin cortar (tic sobre acierto, hito) y latencia mínima.
- **API**: `play(id)`, `setMuted(bool)`, `isMuted()`, con
  `id ∈ 'acierto' | 'racha' | 'fallo' | 'timeout' | 'tick' | 'record'`. `play` es no-op si `muted`.
- **Desbloqueo iOS/Safari (B.1)**: `AudioContext` se crea/`resume()` en el **primer gesto** (un
  listener global one-shot en `pointerdown`/`keydown`; el tap de "Empezar"/"Comenzar" o de una
  pestaña sirve). Sin audio antes de eso — restricción de plataforma, no un bug.
- **Persistencia**: estado en `localStorage` **`banderas:sound`** (`"on"`/`"off"`), **ON por
  defecto** (ausente ⇒ ON). `setMuted` lo persiste; `sound.ts` es la única fuente de verdad del mute.

### 22.2 Dónde suena cada evento (tabla de disparo)
| Evento | Disparador | Modo |
|--------|-----------|------|
| `acierto` | respuesta correcta que **no** sube el multiplicador (racha 1, o racha ≥ 7 con ×1.5 topado) | casual + competitivo |
| `racha` | respuesta correcta que **sube** el multiplicador (racha 2→6, ×1.1→×1.5) — **sustituye** al acierto | casual + competitivo |
| `fallo` | respuesta incorrecta por toque/texto (`correct === false && !timedOut`) | casual + competitivo |
| `timeout` | fallo automático por tiempo (`timedOut === true`) | solo competitivo |
| `tick` | cada vez que el entero de segundos baja dentro de la ventana warn (t=3, 2, 1) | solo competitivo |
| `record` | al aterrizar en `ResultPage` con **nuevo récord** (una vez) | solo competitivo |

- **Acierto/hito/fallo/timeout**: el efecto vive donde ya se conoce el resultado — un `useEffect` en
  `GamePage` sobre la **aparición** de `currentAnswer` (nueva respuesta). Regla de decisión exacta en
  §22.3.
- **Tick**: lo dispara `QuestionCountdown` cuando `seconds` decrece dentro de `isWarn` (ya calcula
  ambos). Tres tics por pregunta como máximo.
- **Record**: `ResultPage`, en el mismo punto donde decide el estado A del banner (§15).

### 22.3 Racha en vivo y regla acierto-vs-hito (para frontend-engineer)
El reducer **no** lleva la racha en vivo (comentario "costura gamificación" en `gameReducer.ts`); se
**deriva** de `state.answers` sin tocar el motor:
- `rachaActual` = aciertos consecutivos **hasta e incluyendo** la pregunta recién respondida.
- `mult(r) = min(1 + 0.1·(r − 1), 1.5)` (idéntica a `computeScore`).
- Al registrar una respuesta correcta: `subió = mult(rachaActual) > mult(rachaActual − 1)` (verdadero
  para racha 2..6; falso en racha 1 y racha ≥ 7). `subió` ⇒ `play('racha')` **y** pop del chip
  (§23.1); si no ⇒ `play('acierto')`. Así el sonido y el pop van **en lockstep** con el multiplicador.

### 22.4 Toggle de mute — ubicación, icono, copy
**Ubicación (decisión): en dos sitios, un solo estado.**
1. **`AppHeader`** (chrome global, presente en Jugar y Explorar): hogar de la preferencia global. Icono
   a la derecha del `nav`, tras "Explorar".
2. **`GameTopBar`** durante la partida: el `AppHeader` está oculto en `/jugar` (§11) y es justo cuando
   el sonido importa. Va en el **canto derecho** de la barra, en **ambos** modos (en casual es el único
   control de la derecha; en competitivo va tras la lectura del countdown). Ancla la esquina derecha de
   forma consistente.
   - **No** se duplica en el masthead de `PlayPage` (el `AppHeader` está justo encima).

**Orden en `GameTopBar`** (44px): `[✕ Salir] · [regla de progreso · flex] · [×1.3 racha] · [◷ 3
countdown] · [🔊 sonido]`. El icono de sonido es 28px visual con toque de 44px (margen negativo, como
`✕`). Cabe en 360px: fijos ≈ exit 44 + racha ~30 + countdown ~22 + mute ~32 + gaps; la regla flexiona.

**Icono (SVG inline, `currentColor`, monocromo — es chrome, no semántico):**
- **Sonido ON**: altavoz con dos ondas. Color `--c-ink-2` (hover `--c-ink`).
- **Silenciado**: altavoz con barra diagonal (slash). Color `--c-ink-3` (atenuado = inactivo).

**Accesibilidad / copy (español, sentence case):**
- `<button>` con **nombre estable** `aria-label="Sonido"` + **`aria-pressed`** que refleja el estado
  (`true` = sonido activado). El icono aporta el estado visual.
- `title` para puntero: **"Silenciar sonido"** cuando está ON, **"Activar sonido"** cuando está
  silenciado.
- Toque mínimo 44px, foco visible (halo de latón heredado de `:focus-visible`).

## 23. Animaciones (cada una con su salida en `prefers-reduced-motion`)

Todas usan tokens de duración/easing existentes salvo los nuevos de §25. El reset de `tokens.css` ya
neutraliza `animation-duration`/`transition-duration` bajo reduced-motion; **además** cada componente
evita `transform`/opacidad-animada allí y adopta la salida estática que se indica.

### 23.1 Pop del contador de racha (nuevo chip en `GameTopBar`)
El chip de racha es un **texto mono** (no una pastilla boxy: se mantiene sobrio, como la lectura del
countdown): `×1.3` en `--font-mono`, `--text-sm`, `tabular-nums`, color `--c-accent-ink` (latón). Se
muestra **solo cuando el multiplicador > 1.0** (racha ≥ 2); a ×1.0 el slot queda vacío (reservado,
`min-width: 3.2ch`, sin layout shift). Se muestra en **ambos** modos (la calma del casual se conserva:
el chip solo aparece cuando ya vas en racha).

- **Motion**: al subir el multiplicador, `streakPop` con el **`--ease-spring` existente** (el mismo
  "asentado" del acierto): `scale(1) → 1.18 → 1` en `--dur` (200 ms), `transform-origin: center`. El
  dígito se actualiza en el pico. Sin brillo extra (el latón del color ya lo dice).
- **Reduced-motion**: **sin scale**. La cifra simplemente **cambia** de valor (p. ej. `×1.2`→`×1.3`) en
  latón — el cambio de número + el latón **son** la señal. Dignísimo y AA.

```css
.streak {                                   /* GameTopBar.module.css */
  flex: none; min-width: 3.2ch; text-align: right;
  font-family: var(--font-mono); font-size: var(--text-sm);
  font-variant-numeric: tabular-nums; color: var(--c-accent-ink);
}
.streak.isBump { animation: streakPop var(--dur) var(--ease-spring); }
@keyframes streakPop { 0%,100% { transform: scale(1); } 45% { transform: scale(1.18); } }
@media (prefers-reduced-motion: reduce) { .streak.isBump { animation: none; } }
```
> Implementación: aplicar `isBump` al re-render cuando el valor sube (efecto sobre el multiplicador, o
> `key`={mult} para remontar y relanzar la animación). Quitar la clase al terminar.

### 23.2 Micro-flash de la opción correcta / confirmación del escrito
Suma al *settle* de escala que ya existe (§7) un **anillo verde que florece y se apaga** en el instante
en que se revela el acierto — un "bloom" de confirmación.

- **Opciones (flag→name / name→flag)**: sobre la opción `.correct`, `correctFlash` una vez, `--dur`
  `--ease-out`: `box-shadow` de `0 0 0 0 var(--glow-correct)` → `0 0 0 6px transparent`. Va **junto** al
  settle `1→1.03→1` ya definido. Es un pulso de luz hacia afuera, no un parpadeo de fondo.
- **Escrito (`type-name`)**: al acertar, el borde del input pasa a Verde tierra (§5.3) **y** el mismo
  anillo `correctFlash` alrededor del campo + el ✓ que aparece con fade. Al fallar: borde Rojo señal,
  **sin shake** (un error de tecleo no merece temblor; el nombre correcto se ve en la hoja).
- **Reduced-motion**: sin anillo ni scale. El estado verde **estático** (borde 2px `--c-success` + ✓,
  ya especificado en §5.2/§5.3) **es** la confirmación.

```css
.option.correct { animation: correctFlash var(--dur) var(--ease-out); }
@keyframes correctFlash {
  from { box-shadow: 0 0 0 0 var(--glow-correct); }
  to   { box-shadow: 0 0 0 6px transparent; }
}
@media (prefers-reduced-motion: reduce) { .option.correct { animation: none; } }
```

### 23.3 Pulso de la mecha en los últimos 3 s
Esta iteración **reintroduce a propósito** el pulso que §13.1 había recortado ("sin pulso por
defecto"): el roadmap B.2 lo pide explícito. Se mantiene mínimo.

- Cuando `.countdownFuse.isWarn`, el relleno `> i` late en **opacidad** `1 → 0.5 → 1` a ~1 Hz
  (`fusePulse var(--dur-pulse) var(--ease-standard) infinite`) — un latido por segundo restante,
  **sincronizado** con el tic sonoro y con el dígito rojo. Solo el relleno late (3px); nada de glow que
  se derrame por el borde. El color rojo (§13.1) sigue siendo la señal principal; el pulso es el matiz.
- **Reduced-motion**: **sin pulso**. Queda la salida ya definida en §13.3 — mecha roja estática + la
  **lectura numérica permanente** (10→0). El rojo basta como urgencia.

```css
.countdownFuse.isWarn > i { animation: fusePulse var(--dur-pulse) var(--ease-standard) infinite; }
@keyframes fusePulse { 0%,100% { opacity: 1; } 50% { opacity: 0.5; } }
@media (prefers-reduced-motion: reduce) { .countdownFuse.isWarn > i { animation: none; } }
```

### 23.4 Barrido de brillo de latón sobre el banner "¡Nuevo récord!"
El único gesto "fanfarria" visual. Sobre el `.scorePanel.isRecord` (§15, que ya *prende* a latón: borde
+ hoist + cifra + settle), un **destello de latón** cruza el panel **una sola vez**, como luz que
resbala sobre metal pulido. **No confeti.**

- Mecanismo: pseudo-elemento `::after` con el gradiente **`--brass-sweep`** (§25: banda cálida con
  núcleo casi-blanco, definida en tokens) que **traslada** de izquierda a derecha y sale de cuadro.
- Timing: `brassSweep var(--dur-sheen) var(--ease-standard) 160ms 1 both` — arranca **tras** el settle
  del panel (delay 160 ms), dura 900 ms, `both` lo deja fuera de cuadro al final (invisible, sin
  limpieza). El panel gana `overflow: hidden` en el estado récord para recortar el destello a sus
  esquinas (`--radius-md`); el hoist va por dentro, no le afecta.
- **Reduced-motion**: **sin barrido**. La celebración queda en el estado estático del §15 (borde/hoist/
  cifra en latón) — que ya es "de marca". El **sonido de récord sí suena** (audio ≠ motion, §20.3).

```css
.scorePanel.isRecord { overflow: hidden; }              /* recorta el destello a las esquinas */
.scorePanel.isRecord::after {
  content: ''; position: absolute; inset: 0; pointer-events: none;
  background: var(--brass-sweep);
  transform: translateX(-120%);
  animation: brassSweep var(--dur-sheen) var(--ease-standard) 160ms 1 both;
}
@keyframes brassSweep { to { transform: translateX(120%); } }
@media (prefers-reduced-motion: reduce) { .scorePanel.isRecord::after { animation: none; content: none; } }
```
> `::after` va **sobre** el contenido (inset 0). Con el gradiente semitransparente el texto sigue
> legible durante los 900 ms; si molestara, bajar la opacidad del núcleo del token `--c-brass-glint`.

### 23.5 View Transitions entre pestañas Casual/Competitivo y rutas de Jugar
Mejora progresiva: un **cross-fade corto** (nada de deslizamientos). react-router 6.30 no integra la
View Transitions API, así que se envuelve la navegación en `document.startViewTransition`.

- **Qué transiciona**: solo el **panel** (el contenido bajo las pestañas), no el masthead ni las
  pestañas — así se siente un "cambio de carpeta", con la solapa fija y la hoja detrás cambiando. Se
  nombra el contenedor del panel `view-transition-name: play-panel`; el resto queda en el grupo `root`
  (sin animar, o con la misma duración corta). También aplica al salto `/` ⇄ `/competitivo` ⇄ `/jugar`
  (arranque y salida de partida): mismo cross-fade de `--dur-vt`.
- **Cómo**: envolver las navegaciones en un helper —
  `if (!reduceMotion && document.startViewTransition) document.startViewTransition(() => navigate(...))
  else navigate(...)`. Para las pestañas (`NavLink`), interceptar el click con ese helper o un pequeño
  wrapper; para `handleStart`/`handleExit` (imperativos), envolver el `navigate`.
- **Fallback**: navegadores sin la API (Firefox, Safari viejo) → `navigate` normal = **corte seco
  actual**. Sin dependencia de layout, cero regresión.
- **Reduced-motion**: **saltar la transición** (comprobar `matchMedia('(prefers-reduced-motion:
  reduce)')` y navegar directo). Además, defensa en CSS por si el navegador anima el `root` por defecto.

```css
::view-transition-old(play-panel), ::view-transition-new(play-panel) {
  animation-duration: var(--dur-vt); animation-timing-function: var(--ease-standard);
}
@media (prefers-reduced-motion: reduce) {
  ::view-transition-group(*), ::view-transition-old(*), ::view-transition-new(*) { animation: none; }
}
```

## 24. Siluetas de mapa

SVGs normalizados (viewBox cuadrado, un path, `fill="currentColor"`; §B.3: zonas precacheadas ≤60 KB,
países perezosos). **Técnica de teñido — `mask`, no `<img>`:** cargar la silueta como **máscara** de un
`<span>` cuyo `background` es `currentColor`; así se tiñe con `color` (tinta o latón) usando el mismo
asset, y el `fill` del archivo es irrelevante (la máscara usa el alfa del path). Patrón único en toda
la app:
```css
.shape {
  display: inline-block; flex: none;
  width: var(--shape-md); height: var(--shape-md);
  background: currentColor;
  -webkit-mask: var(--src) center / contain no-repeat;
          mask: var(--src) center / contain no-repeat;
}
/* --src lo fija el componente: style={{ '--src': `url(/shapes/zones/${id}.svg)` }} */
```

### 24.1 Filas del ledger competitivo (`CompetitivePanel`) — **sí**
18 siluetas de zona, **precacheadas**. Es el mejor sitio: filas grandes (44px), single-select,
enmarcado "libro de registro".

- **Colocación**: dentro de la celda `.zone`, **antes** del label (tras el hoist tick). `.zone` pasa a
  `display: inline-flex; align-items: center; gap: var(--space-2)`.
- **Tamaño**: `--shape-md` (**20px**) — casa con la altura de x del label (`--text-base`) y no aprieta
  los 44px de fila.
- **Tinta**: reposo `--c-ink-3` (la "tinta al 60-70%" del roadmap); **fila seleccionada** `--c-accent`
  (latón) — hereda el lenguaje del hoist que "prende". `Mundo` (insignia): silueta en `--c-ink-2` en
  reposo (un punto más presente), latón al seleccionar.
- **Alineación**: la silueta y el nombre comparten baseline óptico vía `align-items: center`; la columna
  numérica (`Preguntas`/`Récord`) no se toca. La cabecera de columnas y `min-height` no cambian.

```css
.zone { display: inline-flex; align-items: center; gap: var(--space-2); }
.zoneShape { width: var(--shape-md); height: var(--shape-md); background: currentColor;
  -webkit-mask: var(--src) center/contain no-repeat; mask: var(--src) center/contain no-repeat;
  color: var(--c-ink-3); }
.row.isWorld .zoneShape { color: var(--c-ink-2); }
.row:has(:checked) .zoneShape { color: var(--c-accent); }
```

### 24.2 Chips del casual (`CategoryMultiPicker`, 17 chips) — **NO por defecto** (tratamiento mínimo documentado)
El usuario avisó que aquí puede saturar. **Decisión: se recortan — chips solo-texto (como hoy).**

- **Criterio (concreto y verificable):** mantener siluetas en los chips **solo si** a 360px se cumplen
  las dos cosas: (a) al añadir ~18px por chip el `flex-wrap` **no** gana filas frente al actual, y (b)
  las siluetas se **reconocen** a 14–16px. Con 17 chips y 10 de ellos **sectores** (uniones parciales
  que a 16px son manchas indistintas), **ninguna** de las dos se cumple: más ancho, peor wrap y blobs
  sin valor de reconocimiento. → **Cortar.** El valor de la silueta se cobra donde sí luce: ledger
  (grande, dossier) y ficha de Explorar (grande).
- **Tratamiento mínimo (solo si se reactivan tras un playtest):** siluetas **solo en los 7 chips de
  continente** (formas reconocibles, pocas), **ninguna en los 10 de sector**, a `--shape-sm` (16px),
  `--c-ink-2` (selección hereda `--c-accent-ink` vía `currentColor`), `margin-right: var(--space-1)`
  dentro del chip. Los 10 sectores quedan solo-texto **siempre**. Es el techo; por defecto, ni eso.

### 24.3 Explorar — ficha (`CountryDetailPage`) **sí**; lista (`CountryCard`) **no** (presupuesto)
Las siluetas **de país** (194) son perezosas y **no van al precache** (B.3, prioridad del usuario:
solo se descargan las visitadas).

- **Ficha del país — sí.** Al abrir `/explorar/{code}` se carga **una** silueta (respeta el presupuesto:
  lazy, cache-first). Va en la **cabecera**, a la izquierda del nombre: el `<header>` pasa a
  `display: flex; align-items: center; gap: var(--space-3)`; silueta a `--shape-lg` (**32px**),
  `--c-ink-2`. Lee como "contorno del espécimen + su nombre" — muy guía de campo, sin competir con la
  bandera `lg` (que aporta el color). Alineada al centro óptico del bloque nombre/oficial.
- **Lista — no.** 194 tarjetas usando siluetas de país **descargarían casi todo el set de una** al
  abrir Explorar, **rompiendo** el presupuesto B.3 (que es "solo las visitadas"). Por eso la lista se
  queda como hoy (bandera + nombre + `ISO · continente`). **Reconciliación con "ficha/lista" del
  roadmap:** el nivel-lista de Explorar puede llevar siluetas **de continente** (7, ya precacheadas,
  reconocibles) en el `ContinentPicker` — **opcional**, mismo tratamiento mínimo que §24.2 (16px,
  `--c-ink-2`, solo los 7). Así hay silueta en el "nivel lista" sin descargar 194 assets. Es un ajuste
  deliberado del roadmap por el presupuesto que el propio roadmap fijó.

```css
/* CountryDetailPage.module.css */
.header { display: flex; align-items: center; gap: var(--space-3); }
.headerShape { width: var(--shape-lg); height: var(--shape-lg); background: currentColor;
  -webkit-mask: var(--src) center/contain no-repeat; mask: var(--src) center/contain no-repeat;
  color: var(--c-ink-2); }
```
> La silueta de la ficha es **decorativa** (`aria-hidden="true"`): el nombre ya está en el `<h1>`. Los
> países (perezosos) quedan en la caché de runtime del SW (cache-first); las zonas (24.1) en el
> precache.

## 25. Tokens, copys y componentes afectados (resumen)

### 25.1 Tokens añadidos a `tokens.css` (§ Iteración B)
| Token | Valor (light) | Uso |
|-------|---------------|-----|
| `--c-brass-glint` | `rgba(255,240,214,0.85)` | núcleo del destello de récord (§23.4) |
| `--c-brass-sheen` | `rgba(214,164,96,0.50)` | banda de latón del destello (§23.4) |
| `--brass-sweep` | `linear-gradient(105deg, …)` | gradiente del barrido (usa los dos anteriores) |
| `--glow-correct` | `rgba(46,125,91,0.45)` | anillo de confirmación del acierto (§23.2) |
| `--dur-pulse` | `900ms` | latido de la mecha en warn (§23.3) |
| `--dur-sheen` | `900ms` | barrido de latón del récord (§23.4) |
| `--dur-vt` | `180ms` | cross-fade de View Transitions (§23.5) |
| `--shape-sm` | `16px` | silueta chip/meta (reservado; chips OFF por defecto, §24.2) |
| `--shape-md` | `20px` | silueta de fila del ledger (§24.1) |
| `--shape-lg` | `32px` | silueta de la ficha de Explorar (§24.3) |

Dark: `--c-brass-glint`/`--c-brass-sheen`/`--glow-correct` tienen override (latón/verde claros del
dark). El resto es neutro al tema. **El sonido no añade tokens CSS** (WAVs + `sound.ts`). Todo lo demás
reutiliza tokens existentes (`--c-accent`, `--c-accent-ink`, `--c-ink-2/3`, `--c-error`, `--ease-spring`,
`--dur`, escala mono).

### 25.2 Constantes / assets no-CSS (para frontend-engineer)
- `public/sounds/{acierto,racha,fallo,timeout,tick,record}.wav` — generados por `scripts/gen-sounds.mjs`
  (§21). Precacheados por la PWA (añadir `wav` al glob de Workbox si no está).
- `src/lib/sound.ts` — módulo de audio (§22.1). Clave localStorage **`banderas:sound`** (ON por defecto).
- Racha en vivo: derivada de `state.answers` (§22.3), sin tocar el reducer.

### 25.3 Copys nuevos (español, sentence case)
| Lugar | Copy |
|-------|------|
| Toggle de sonido · `aria-label` | **"Sonido"** (+ `aria-pressed`) |
| Toggle de sonido · `title` (ON) | **"Silenciar sonido"** |
| Toggle de sonido · `title` (silenciado) | **"Activar sonido"** |
| Chip de racha (`GameTopBar`) | **"×{mult}"** (p. ej. "×1.3"; visible con mult > 1.0) |

### 25.4 Componentes afectados (hand-off; se especifican aquí, no se tocan)
- `src/lib/sound.ts` (**nuevo**) + `scripts/gen-sounds.mjs` (**nuevo**) + `public/sounds/*.wav`.
- `AppHeader` — toggle de mute global (§22.4).
- `GameTopBar` — toggle de mute en el canto derecho + **chip de racha** con `streakPop` (§22.4, §23.1).
- `QuestionCountdown` — dispara `tick` (§22.2) + `fusePulse` en warn (§23.3).
- `GamePage` — efecto que dispara `acierto`/`racha`/`fallo`/`timeout` y calcula la racha en vivo
  (§22.2–22.3); envuelve `handleStart`/`handleExit` en la View Transition (§23.5).
- Componentes de opción (`FlagToNameQuestion`/`NameToFlagQuestion`) y `TypeNameQuestion` — `correctFlash`
  (§23.2).
- `ResultPage` / `.module.css` — barrido de latón `brassSweep` + `record` sonoro (§23.4, §22.2).
- `CompetitivePanel` / `.module.css` — silueta de zona por fila (§24.1).
- `CategoryMultiPicker` — **sin cambios** (chips solo-texto, §24.2).
- `CountryDetailPage` / `.module.css` — silueta del país en la cabecera (§24.3); `ContinentPicker`
  opcional con siluetas de continente.
- `PlayPage` / `PlayPage.module.css` — `view-transition-name: play-panel` en el contenedor del panel
  + intercepción de las pestañas para la View Transition (§23.5).

---

# Iteración C — El módulo Jugar que se SIENTE (sliders, ledger de especímenes)

> Origen: feedback directo del usuario sobre la Iteración B — *"no aplicó casi animaciones ni cambios
> visuales"* en la pantalla de configuración. B fue tímido en el chrome de Jugar. C tiene que **sentirse**
> sin romper la sobriedad de la guía de campo (**latón, no confeti**, la regla no cambia). Propiedad de
> ui-designer: este doc + `tokens.css`. Implementa frontend-engineer con esta spec; **cero** cambios de
> paleta o tipografía, un solo bloque de tokens nuevos (§26.7, "Iteración C"). Numeración continúa tras §25.

## 26. Módulo Jugar: dirección de la iteración

Tres cambios duros, un solo hilo conductor: **el papel se vuelve mecanismo.** Donde B dejó controles que
sólo cambiaban de color, C introduce **un latón que se desliza** — un thumb físico que viaja entre
opciones. El mismo gesto une las tres piezas: el `SegmentedControl` gana un thumb slider (§26.2), las
pestañas de carpeta dejan que el hoist de latón **resbale** de una a otra (§26.3), y el casual abandona
el formulario plano para convertirse en un **índice de especímenes** — un ledger multi-select con las
siluetas de zona a 20px, hermano del libro de registro competitivo (§26.4). La consigna de Chanel se
respeta: **todo el movimiento nuevo es el mismo latón tenue deslizándose**, ningún color ni efecto extra;
el "brillo" fuerte sigue reservado al récord (§23.4). El casual pasa de "3 campos apilados sin alma" a
"rellenar una hoja de expedición en el cuaderno de campo".

**Por qué NO es un default de IA:** ningún slider material-design con thumb blanco elevado ni pastillas
de colores; el thumb es **latón tenue sobre carta**, se mide por índice con `calc` (no una librería), y el
selector de categorías es un **ledger de especímenes con siluetas de contorno** — un artefacto del tema
(guía de campo), no un multiselect genérico de chips.

### 26.1 Principios de C (léelos antes de tocar nada)
1. **Un solo gesto nuevo: deslizar.** Thumb del segmented, hoist de pestaña y "prender" del tick son
   variaciones del **mismo latón que se mueve**. No se inventa un segundo lenguaje de motion.
2. **Semántica intacta, forma nueva.** El multi-select casual conserva TODO (§26.4.4): unión de
   categorías, `[]` = todas, `canonicalCategories`, "Todos" = 'mundo' oculto, marcar todas colapsa a `[]`.
   Cambia el **cuerpo** (chips → filas de ledger), nunca las reglas.
3. **Compactar donde se pueda.** El casual crece por las filas grandes que el usuario pidió; se compensa
   con **Sectores plegado por defecto** (§26.4.3) y **CTA sticky** (§26.4.5), de modo que "Empezar"
   siempre está a mano y el alto por defecto queda cerca del actual.
4. **Salida digna en `prefers-reduced-motion` para CADA animación** (§26.6). Sin excepción: el reset de
   `tokens.css` ya neutraliza duraciones; además cada pieza degrada a **cambio de estado instantáneo**
   (el color/tinte/latón porta la señal, no el movimiento).
5. **Móvil 360–414 primero, AA, foco visible, targets 44px.** El thumb va *detrás* del texto; el foco
   sigue siendo el `outline` del botón/casilla.

## 26.2 `SegmentedControl` → slider con thumb deslizante (fila **y** columna)

El usuario lo describió literal: *"inputs que son sliders"*. Hoy el segmento activo hace un cambio seco de
`background`. C sustituye ese background por **una sola pieza `.thumb`** que se **desliza** hasta la opción
elegida. Un único componente compartido cubre `direction="row"` (Preguntas casual, Mixto|Escrito
competitivo) y `direction="column"` (Modo casual).

**Técnica — thumb medido por índice con `calc`, sin JS de medición** (elección deliberada frente al
thumb medido por `ResizeObserver`: los segmentos son **todos del mismo tamaño** —`flex: 1 1 0`—, así que
el índice basta y evitamos un observer). React fija dos custom properties en el contenedor; el CSS calcula
tamaño y desplazamiento:

- En el `<div class="group">`: `style={{ '--seg-count': options.length, '--seg-index': activeIndex }}`,
  con `activeIndex = options.findIndex(o => o.value === value)`.
- El `.thumb` se dimensiona a **un segmento** y se **traslada** por `índice × (tamaño propio + gap)`.
  Como `translateX/Y` en `%` se resuelve contra el **tamaño propio del thumb** (= un segmento), la
  zancada exacta es `100% + gap`. El `%` de `width`/`height` se resuelve contra la **caja de padding**
  del contenedor (bloque contenedor de un absoluto), de ahí el `− (N+1)·gap` (2 de padding + (N−1) huecos,
  todos `--space-1`).

```css
/* SegmentedControl.module.css */
.group {
  position: relative;               /* bloque contenedor del thumb */
  isolation: isolate;               /* thumb bajo el texto sin z-index global */
  display: flex;
  gap: var(--space-1);
  background: var(--c-surface);
  border: var(--border-thin) solid var(--c-border);
  border-radius: var(--radius-pill);
  padding: var(--space-1);
}
.column { flex-direction: column; border-radius: var(--radius-lg); }

/* El carril del slider: una sola pieza de latón tenue, tamaño de UN segmento. */
.thumb {
  position: absolute;
  z-index: 0;                        /* detrás de los botones */
  pointer-events: none;
  top: var(--space-1);
  bottom: var(--space-1);            /* alto = fila menos padding (fila) */
  left: var(--space-1);
  width: calc((100% - (var(--seg-count) + 1) * var(--space-1)) / var(--seg-count));
  transform: translateX(calc(var(--seg-index) * (100% + var(--space-1))));
  background: var(--c-accent-tint);
  border-radius: var(--radius-pill);
  box-shadow: var(--shadow-thumb);
  transition: transform var(--dur-slide) var(--ease-out);
}
/* Columna: mismo truco, eje Y. */
.column .thumb {
  right: var(--space-1);
  bottom: auto;
  width: auto;
  height: calc((100% - (var(--seg-count) + 1) * var(--space-1)) / var(--seg-count));
  transform: translateY(calc(var(--seg-index) * (100% + var(--space-1))));
  border-radius: var(--radius-md);
}

/* Segmentos: SIN background propio (lo pone el thumb); sólo color/peso + su
   transición corta. Van sobre el thumb. */
.segment {
  position: relative;
  z-index: 1;
  flex: 1 1 0;
  min-width: 0;
  display: flex; align-items: center; justify-content: center;
  min-height: var(--tap-min);
  padding: var(--space-2) var(--space-3);
  border-radius: var(--radius-pill);
  font-size: var(--text-sm);
  font-weight: var(--weight-medium);
  color: var(--c-ink-2);
  background: none;                  /* ← antes lo tenía .selected */
  transition: color var(--dur-fast) var(--ease-standard);
}
.column .segment {
  border-radius: var(--radius-md);
  justify-content: flex-start;
  padding-inline: var(--space-4);
  font-size: var(--text-base);
  white-space: nowrap;               /* columna asume 1 línea (los labels caben) */
}
.segment:hover { color: var(--c-ink); }
.selected { color: var(--c-accent-ink); font-weight: var(--weight-semibold); }
```

**Markup** (un solo `.thumb` como primer hijo, `aria-hidden`):
```tsx
<div role="group" aria-label={label}
     className={direction === 'column' ? `${styles.group} ${styles.column}` : styles.group}
     style={{ '--seg-count': options.length, '--seg-index': activeIndex } as CSSProperties}>
  <span className={styles.thumb} aria-hidden="true" />
  {options.map(opt => (
    <button key={opt.value} type="button" aria-pressed={opt.value === value}
            className={opt.value === value ? `${styles.segment} ${styles.selected}` : styles.segment}
            onClick={() => onChange(opt.value)}>
      {opt.label}
    </button>
  ))}
</div>
```

**Decisiones y notas:**
- **Easing `--ease-out`, NO `--ease-spring`.** El thumb llena un segmento; un spring con rebote se saldría
  visiblemente del carril y leería como roto. `--ease-out` (decelera) es el "slider confiado". Duración
  `--dur-slide` (220 ms): suficiente para LEER el trayecto, no lento.
- **Sin salto en el montaje.** Una transición CSS no anima en el primer render (no hay valor previo): el
  thumb aparece ya en su índice inicial y sólo se desliza al **cambiar** el valor. No hace falta flag de
  "montado".
- **`aria-pressed` intacto** (accesibilidad idéntica a hoy). El thumb es decorativo (`aria-hidden`).
- **Supuesto:** segmentos uniformes (`flex: 1 1 0`, columna a 1 línea). Todos los usos actuales lo
  cumplen (Modo: 3 labels ≤18 car.; Preguntas: `10 · 20 · Todas`; Mixto|Escrito: 2 cortos).
- **`prefers-reduced-motion`:** el reset global pone `transition-duration: 0` → el thumb **salta** al
  segmento elegido. El thumb sigue mostrando la selección (fondo + `--c-accent-ink` en el texto). Digno.

## 26.3 Pestañas de carpeta: el hoist de latón **se desliza** (`PlayPage`)

Hoy sólo transiciona el color de la pestaña; el hoist de latón es un `::before` estático de la activa. C lo
convierte en **una sola barra de latón que resbala** de la pestaña Casual a la Competitivo (y viceversa),
como una lengüeta de expediente que se corre. Mismo gesto que el thumb del §26.2 → coherencia total.

**Técnica — barra única deslizada por índice + morph de View Transition:**
- `PlayPage` fija `style={{ '--tab-index': tab === 'casual' ? 0 : 1 }}` en el contenedor `.tabs`.
- Se renderiza **una** `.tabHoist` (span `aria-hidden`) dentro de `.tabs`; se dimensiona a **una pestaña
  menos el inset de 12px por lado** y se posiciona con `left` calculado por índice (el `%` de `left` se
  resuelve contra el ancho de `.tabs`, su bloque contenedor).
- **Dos caminos de animación que no chocan** (uno por navegador):
  - **Con View Transitions API** (Chromium): la barra lleva `view-transition-name: play-tab-hoist`; el VT
    que ya envuelve la navegación de pestañas (§23.5, `NavLink viewTransition`) **morphea** su caja
    old→new = un **deslizamiento** independiente del cross-fade del panel. Se le da su propia duración.
  - **Sin VT** (Firefox / Safari viejo): `navigate` normal, **la instancia de `PlayPage` persiste**
    (ambas rutas `/` y `/competitivo` renderizan `<PlayPage>` en la misma posición del árbol → React
    reconcilia y reutiliza; sólo cambia `--tab-index`), así que la **transición CSS de `left`** anima el
    deslizamiento. ⚠️ **No añadir `key={tab}` a `PlayPage`**: forzaría remount y mataría este fallback.

```css
/* PlayPage.module.css */
.tabs {
  position: relative;                /* bloque contenedor del hoist */
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-2);
}
.tabHoist {
  position: absolute;
  top: 0;                            /* sobre la línea superior de la tira */
  height: 3px;
  border-radius: 0 0 2px 2px;
  background: var(--c-accent);
  pointer-events: none;
  /* ancho = una pestaña − 24px (inset 12px/lado); left = 12 + i·(pestaña + gap). */
  width: calc((100% - var(--space-2)) / 2 - 24px);
  left: calc(12px + var(--tab-index) * ((100% - var(--space-2)) / 2 + var(--space-2)));
  view-transition-name: play-tab-hoist;
  transition: left var(--dur-slide) var(--ease-out);   /* fallback sin VT */
}
/* Duración del morph del hoist en navegadores con VT (independiente del panel). */
:global(::view-transition-group(play-tab-hoist)) {
  animation-duration: var(--dur-slide);
  animation-timing-function: var(--ease-out);
}
```

**Se elimina** `.tabActive::before` (el hoist estático). El resto del estado de la pestaña activa se
queda: color `--c-ink`, peso semibold, y el borde inferior transparente que "abre hacia el panel" (una
transición de color, no de forma). El nombre de las pestañas ("Casual"/"Competitivo") sigue capturándose
en el grupo `root` del VT (cambio de color imperceptible durante el cross-fade); no necesita nombre propio.

**`prefers-reduced-motion`:** el guard global de §23.5 (`::view-transition-group(*) { animation: none }`)
anula el morph; el reset global anula la transición de `left`. El hoist **salta** a la pestaña activa. La
posición del latón sigue marcando la pestaña. Digno.

## 26.4 Casual → "Índice de especímenes" (`CasualPanel` + `CategoryMultiPicker`)

El casual deja de ser un formulario plano y adopta el **mundo del ledger**: mismo chasis de card con
hairlines que el competitivo (§19.4), pero **multi-select** y con las **siluetas de zona a 20px** que el
usuario pidió. Es el cambio grande de C.

### 26.4.1 Reordenar el panel (compactar sin perder nada)
Orden nuevo del `CasualPanel`, calcado del competitivo (control corto arriba, artefacto largo abajo, CTA
sticky): **Modo → Preguntas → Categorías (el índice) → barra sticky "Empezar"**. Motivo: los dos controles
cortos (segmented) quedan siempre visibles arriba; el índice largo de zonas es lo que se recorre; y
"Empezar" no queda enterrado tras la lista — va en una **barra sticky** (misma que `CompetitivePanel`
`.startBar`). El hint del pool (`N países`) se muda a esa barra como resumen vivo de la unión.

```
Modo de juego          ┌─ [ Bandera → nombre ]────────┐   ← SegmentedControl COLUMNA (slider)
                       │   Nombre → bandera            │
                       └───────────────────────────────┘
Preguntas              [ 10 ][ 20 ][ Todas ]               ← SegmentedControl FILA (slider)
Categorías             ┌──────────────────────────────┐
                       │ ▍◐ Todos                      │   ← "Todos" = 'mundo' (insignia), silueta mundo
                       │─ CONTINENTES ─────────────────│
                       │ ▍◔ África                      │   ← fila multi-select · silueta 20px · tick "prende"
                       │ ▍◔ América                     │
                       │ …                              │
                       │─ SECTORES ·  2 activas    ▸ ───│   ← disclosure (plegado por defecto; badge si hay activas)
                       └──────────────────────────────┘
[ ══════════ Empezar ══════════ ]  195 países en juego     ← barra sticky (gradiente de papel + safe-area)
```

### 26.4.2 La fila de especímen (multi-select)
`CategoryMultiPicker` abandona los chips (deja de importar `ContinentPicker.module.css`) y renderiza el
**mismo ledger** del competitivo, con dos diferencias: (a) **casilla, no radio** (multi-select), (b) **sin
columnas numéricas** — la fila casual es más ligera que el libro de registro: sólo `tick · silueta · label`.
Esto además la diferencia del competitivo (que sí lleva `Preguntas`/`Récord`): mismo mundo, documento
distinto.

- **Chasis**: card `--radius-lg`, `border --c-border`, `shadow-sm`, `overflow: hidden`, hairline entre
  todos los hijos (`.ledger > * + *`). Idéntico a §19.4.
- **Fila** (`<label>` que envuelve un `<input type="checkbox">` oculto pero focusable):
  `position: relative; display: flex; align-items: center; min-height: 44px; padding: var(--space-2)
  var(--space-4)`. La `.zone` (silueta + label) es un `inline-flex; gap: var(--space-2)`.
- **Tick de hoist = indicador de casilla**: `::before` idéntico al competitivo (4×18px, inset, neutro en
  reposo). Al marcar: latón + crece a 26px + la fila se tinta `--c-accent-tint` — pero con **micro-tacto
  de "prender"** (§26.5). Varias filas pueden estar encendidas a la vez (multi-select).
- **Silueta de zona** (§24.1, misma técnica `mask` + `--shape-src`): `--shape-md` (**20px**), reposo
  `--c-ink-3`; fila marcada → `--c-accent` (latón, hereda el "prende" del tick). Assets ya precacheados
  (18 zonas, 24 KB) → **coste de datos 0**. Decorativa (`aria-hidden`): el nombre va en el label.
- **"Todos"** = primera fila del card, tratamiento insignia (como el `Mundo` competitivo): silueta
  `mundo.svg` en `--c-ink-2` en reposo, latón cuando `isAll`. Su casilla refleja `isAll`
  (`value.length === 0`). Sin badge ni número.
- **Bandas de grupo** `Continentes` / `Sectores`: `--c-surface-2`, mono 2xs (idénticas a §19.4).

```css
/* CategoryMultiPicker.module.css (nuevo cuerpo; espeja CompetitivePanel.module.css) */
.ledger { background: var(--c-surface); border: var(--border-thin) solid var(--c-border);
  border-radius: var(--radius-lg); box-shadow: var(--shadow-sm); overflow: hidden; }
.ledger > * + * { border-top: var(--border-thin) solid var(--c-border); }

.row { position: relative; display: flex; align-items: center; min-height: var(--tap-min);
  padding: var(--space-2) var(--space-4); cursor: pointer;
  transition: background-color var(--dur-fast) var(--ease-out); }
.check { position: absolute; width: 1px; height: 1px; opacity: 0; }  /* input type=checkbox, focusable */

.row::before {                                   /* tick = indicador de casilla */
  content: ''; position: absolute; left: 0; top: 50%; translate: 0 -50%;
  width: var(--hoist-width); height: 18px; border-radius: 0 2px 2px 0;
  background: var(--c-border-strong);
  transition: background-color var(--dur-fast) var(--ease-spring),
              height var(--dur-fast) var(--ease-spring); }        /* "prende" con tacto */
.row:has(:checked) { background: var(--c-accent-tint); }
.row:has(:checked)::before { background: var(--c-accent); height: 26px; }
.row:has(:focus-visible) { box-shadow: inset 0 0 0 2px var(--c-focus); }

.zone { display: inline-flex; align-items: center; gap: var(--space-2);
  font-family: var(--font-display); font-size: var(--text-base);
  font-weight: var(--weight-medium); line-height: var(--leading-snug); }
.row:has(:checked) .zone { font-weight: var(--weight-semibold); }

.zoneShape { flex: none; width: var(--shape-md); height: var(--shape-md);
  background: currentColor; color: var(--c-ink-3);
  -webkit-mask: var(--shape-src) center/contain no-repeat;
          mask: var(--shape-src) center/contain no-repeat;
  transition: color var(--dur-fast) var(--ease-out); }
.row.isWorld .zoneShape { color: var(--c-ink-2); }
.row:has(:checked) .zoneShape { color: var(--c-accent); }
```

### 26.4.3 Sectores plegable (la compactación)
Los **10 sectores** viven bajo un disclosure **plegado por defecto**; los 7 continentes + "Todos" quedan
siempre visibles. Así el alto por defecto del índice vuelve cerca del actual (≈ hoy) en vez de disparar a
~880px con las 20 filas abiertas. Es, además, otro momento con motion deliberado (el usuario pidió sentir).

- La cabecera "Sectores" es un `<button aria-expanded aria-controls="sectores-panel">` dentro del card
  (misma piel que `.groupHead`), con un **chevron** a la derecha que rota 90° al abrir.
- **Auto-abrir si hay sectores activos al montar**: `useState(() => value.some(id => esSector(id)))` — una
  selección nunca nace oculta.
- **Badge de activos** cuando está plegado y hay ≥1 sector marcado: `· {n} activa(s)` en la cabecera
  (singular con n=1), mono `--c-accent-ink`. Superficie la selección escondida sin abrir.
- **Contenido plegado `inert`** (hallazgo del review): el panel colapsado lleva `inert` — sus casillas
  salen del orden de tabulación y del árbol de accesibilidad, cumpliendo la promesa de
  `aria-expanded=false` sin sacar el contenido del DOM (la transición 0fr↔1fr lo necesita).
- **Colapso animable con `grid-template-rows` 1fr↔0fr** (transicionable, sin medir alturas):

```css
.collapsible { display: grid; grid-template-rows: 1fr;
  transition: grid-template-rows var(--dur-slow) var(--ease-standard); }
.collapsible.isCollapsed { grid-template-rows: 0fr; }
.collapsibleInner { overflow: hidden; }
.collapsibleInner > * + * { border-top: var(--border-thin) solid var(--c-border); }
.chevron { transition: transform var(--dur-fast) var(--ease-out); }
[aria-expanded='true'] .chevron { transform: rotate(90deg); }
```
> El card padre da el hairline superior al `.collapsible` (vía `.ledger > * + *`); las filas internas se
> separan con `.collapsibleInner > * + *`. `overflow: hidden` recorta durante el colapso.

### 26.4.4 Semántica multi-select — **intacta** (verificación obligatoria)
La FORMA cambió (chips → filas); las reglas NO. `CategoryMultiPicker` conserva su contrato exacto:
| Regla | Cómo se cumple en el ledger |
|-------|------------------------------|
| Unión de categorías activas | `value` sigue siendo `CategoryId[]`; el motor filtra por unión (sin cambios) |
| `[]` = todas | `isAll = value.length === 0`; enciende la fila "Todos" |
| Emisión canónica | cada toggle → `onChange(canonicalCategories(next))` (idéntico a hoy) |
| "Todos" = 'mundo' (oculto) | fila "Todos" al principio; clic con `!isAll` → `onChange([])`; 'mundo' no aparece como fila propia |
| Marcar todas colapsa a `[]` | al marcar las 17, `canonicalCategories` devuelve `[]` → filas individuales se apagan y "Todos" se enciende (comportamiento actual; documentado, no es bug) |
| a11y ≥ actual | `<input type="checkbox">` reales dentro de `<label>` (mejor que `aria-pressed`): grupo con `role="group" aria-label="Categorías"`, foco visible (anillo interior), target 44px (la fila entera) |

### 26.4.5 Barra sticky "Empezar" (`CasualPanel`)
Idéntica a `CompetitivePanel.startBar`: `position: sticky; bottom: 0`, a sangre
(`margin-inline: calc(-1 * var(--space-4))`), gradiente de papel (`linear-gradient(to top, var(--c-bg)
72%, transparent)`), `padding-bottom: max(var(--space-3), env(safe-area-inset-bottom))`. Contiene el
`Button` "Empezar" + el helper vivo del pool: `{poolSize} países en juego` (mono `--text-xs`,
`--c-ink-3`; el `poolSize` ya se calcula). Copys en sentence case.

## 26.5 Micro-interacción de selección — el tick "prende"
Ask 3c. Al marcar una fila (casual), el encendido debe SENTIRSE, no ser un cambio seco:
- **El tick** pasa de neutro a latón y **crece 18→26px con `--ease-spring`** (§26.4.2): un pequeño "snap"
  de encendido, no un fundido. El spring aquí es seguro (una barra de 4px que crece; no hay carril que
  desbordar).
- **La silueta** cruza de `--c-ink-3` a `--c-accent` con `--ease-out` (transición de `color`): el
  contorno del espécimen "se enciende" en latón a la vez.
- **La fila** tinta a `--c-accent-tint` con `--ease-out`. Los tres tiempos son ~`--dur-fast` (120 ms):
  encendido nítido y simultáneo.
- **Apagar** es la misma transición inversa (todo por `transition`, no `@keyframes`).
- **`prefers-reduced-motion`:** el reset global pone las transiciones a 0 → el estado marcado (tinte +
  tick latón 26px + silueta latón) aparece **instantáneo**. El latón **es** la señal.

## 26.6 Tabla de disparo de animaciones (C) + salida en `prefers-reduced-motion`
| # | Animación | Dónde | Disparador | Propiedad · token | Salida reduced-motion |
|---|-----------|-------|-----------|-------------------|------------------------|
| C1 | **Thumb slider** | `SegmentedControl` (fila y col.) | cambia `value` → `--seg-index` | `transform` · `--dur-slide` `--ease-out` | thumb **salta** al segmento (sigue mostrando selección) |
| C2 | **Hoist de pestaña desliza** | `PlayPage .tabHoist` | cambia ruta `/`⇄`/competitivo` → `--tab-index` | VT morph `play-tab-hoist` **o** `left` · `--dur-slide` `--ease-out` | guard §23.5 + reset → **salta** a la pestaña |
| C3 | **Tick "prende"** | fila del ledger casual | `:has(:checked)` | `height`+`background` · `--dur-fast` `--ease-spring` | estado marcado **instantáneo** (latón 26px) |
| C4 | **Silueta se enciende** | `.zoneShape` casual | `:has(:checked)` | `color` · `--dur-fast` `--ease-out` | color latón **instantáneo** |
| C5 | **Fila tinta** | `.row` casual | `:has(:checked)` | `background-color` · `--dur-fast` `--ease-out` | tinte **instantáneo** |
| C6 | **Sectores despliega** | `.collapsible` | `aria-expanded` | `grid-template-rows` 0fr↔1fr · `--dur-slow` `--ease-standard` (+ chevron `--dur-fast`) | muestra/oculta **instantáneo** |

Ejes independientes (§20.3): `prefers-reduced-motion` gobierna estas 6; el mute (audio) es ortogonal y no
cambia en C. Ninguna anima `opacity`/`transform` bajo reduced-motion (usan `transition` que el reset pone
a 0). Sin layout shift: el thumb y el hoist son absolutos; el índice de especímenes reserva su hueco.

## 26.7 Tokens nuevos (bloque "Iteración C" en `tokens.css`)
| Token | Valor (light) | Dark | Uso |
|-------|---------------|------|-----|
| `--dur-slide` | `220ms` | (neutro) | deslizamiento del thumb (§26.2) y del hoist de pestaña (§26.3) |
| `--shadow-thumb` | `0 1px 1px rgba(18,41,63,.10), 0 2px 5px rgba(18,41,63,.08)` | `0 1px 2px rgba(0,0,0,.35), 0 2px 6px rgba(0,0,0,.30)` | eleva el thumb del carril como pieza física (§26.2) |

Todo lo demás reutiliza tokens existentes: `--c-accent`/`--c-accent-tint`/`--c-accent-ink`/`--c-ink-2/3`,
`--shape-md` (20px), `--ease-out`/`--ease-standard`/`--ease-spring`, `--dur-fast`/`--dur-slow`,
`--radius-*`, `--hoist-width`, `--space-*`. **Cero** cambios de paleta o tipografía.

## 26.8 Hand-off — componente por componente (markup + CSS + técnica; **no** se toca aquí)
- **`SegmentedControl.tsx`** — añadir `<span class="thumb" aria-hidden>` como primer hijo; fijar
  `--seg-count`/`--seg-index` (índice = `findIndex(value)`) en el `.group` vía `style`. `aria-pressed` y
  API sin cambios. (§26.2)
- **`SegmentedControl.module.css`** — `.group` a `position: relative; isolation: isolate`; añadir `.thumb`
  (fila y `.column .thumb`) con los `calc` de tamaño/desplazamiento; quitar el `background` de `.selected`
  (lo aporta el thumb), dejar color/peso; `.segment` a `position: relative; z-index: 1; flex: 1 1 0`.
  (§26.2)
- **`PlayPage.tsx`** — fijar `--tab-index` (0/1 según `tab`) en `.tabs`; renderizar `<span class="tabHoist"
  aria-hidden>`. **No** poner `key={tab}` en `PlayPage` (rompería el fallback CSS). (§26.3)
- **`PlayPage.module.css`** — `.tabs` a `position: relative`; añadir `.tabHoist` (width/left por índice,
  `view-transition-name: play-tab-hoist`, transición de `left`); regla
  `::view-transition-group(play-tab-hoist)`; **eliminar** `.tabActive::before`. (§26.3)
- **`CasualPanel.tsx`** — reordenar a Modo → Preguntas → Categorías → barra sticky; mover el hint del pool
  a la barra sticky (`{poolSize} países en juego`). Lógica de `startGame`/estado **sin cambios**. (§26.4.1,
  §26.4.5)
- **`CasualPanel.module.css`** — añadir `.startBar` (copiar de `CompetitivePanel.module.css`) + `.startHint`;
  el `.panel` mantiene `display:grid; gap`. (§26.4.5)
- **`CategoryMultiPicker.tsx`** — **reescribir el cuerpo** de chips a ledger: dejar de importar
  `ContinentPicker.module.css`; fila = `<label>` con `<input type="checkbox">` oculto + `.zone`
  (silueta `--shape-src=url(/shapes/zones/${id}.svg)` + label); fila "Todos" insignia (`isAll`); disclosure
  de Sectores (`aria-expanded`, auto-abrir si hay sector activo, badge de activos). **Semántica intacta**
  (§26.4.4): sigue emitiendo `canonicalCategories`. (§26.4)
- **`CategoryMultiPicker.module.css`** — nuevo cuerpo tipo ledger (espeja `CompetitivePanel.module.css`:
  `.ledger`, hairlines, `.row`, `.check`, `.row::before` tick con `--ease-spring`, `.zone`, `.zoneShape`,
  `.groupHead`, `.isWorld`) + disclosure (`.collapsible`/`.collapsibleInner`/`.chevron`). Puede
  extraerse un `ledger.module.css` compartido con el competitivo (opcional; si no, se duplica el chasis —
  aceptable). (§26.4)
- **`ContinentPicker` (Explorar)** — **sin cambios** (sigue con chips; ya no lo consume el casual). Anotar
  que el acople `CategoryMultiPicker → ContinentPicker.module.css` desaparece.
- **`CompetitivePanel`** — **sin cambios de C**; su `SegmentedControl` (Mixto|Escrito) hereda el thumb
  slider automáticamente (mismo componente). Su ledger es la referencia que el casual espeja.
- **`tokens.css`** — bloque "Iteración C": `--dur-slide`, `--shadow-thumb` (+ override dark). (§26.7)

---

# 27 · Aviso de instalación de la PWA — "Edición de bolsillo"

Tarjeta descartable en el módulo Jugar (entre el masthead y las pestañas) que ofrece instalar
la app. Solo aparece cuando hay algo real que ofrecer; nunca corre instalada (standalone).

## 27.1 Estados (`usePwaInstall`, src/features/pwa/)
- **`installable`** — Chromium (Android/escritorio) disparó `beforeinstallprompt`: el CTA
  "Instalar la app" lanza el **diálogo nativo** (el evento se captura con `preventDefault`
  para suprimir el mini-infobar y es de un solo uso).
- **`ios`** — iPhone/iPad en navegador (UA + `maxTouchPoints` para iPadOS-como-Mac): no hay
  API de instalación, así que el CTA es un **disclosure** "Cómo instalarla" con los 3 pasos de
  Compartir → Añadir a pantalla de inicio (mismo patrón plegable 0fr↔1fr + `inert` que
  Sectores, §26.4.3; icono Compartir inline en `currentColor`).
- **`hidden`** — standalone (`display-mode` o `navigator.standalone`), descartada hace
  <14 días (`banderas:install-dismissed:v1`), o navegador sin señal (Firefox escritorio).
  Rechazar el diálogo nativo también cuenta como descarte.

## 27.2 Anatomía visual
Tarjeta de superficie normal con **hoist de latón** en el canto izquierdo (4px, inset 12px de
las esquinas — signature del sistema): la "edición de bolsillo" de la guía. Eyebrow mono
EDICIÓN DE BOLSILLO en `--c-accent-ink`, título display "Lleva la guía contigo", cuerpo sm en
`--c-ink-2`, CTA compacto de latón (`--c-accent-strong`, 44px, NO el Button de 52px: es un
aviso, no la acción principal de la página). Cierre × con caja táctil de 44px (margen
negativo). Cero tokens nuevos. Reduced-motion: hereda el reset global (disclosure y chevron
instantáneos).
