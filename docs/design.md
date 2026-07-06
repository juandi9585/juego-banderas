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
