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
