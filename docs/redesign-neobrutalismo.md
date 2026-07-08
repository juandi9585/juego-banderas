# Rediseño neobrutalista — rama `redesign/neobrutalismo`

Experimento de identidad visual alternativa (2026-07). Sustituye el concepto
"carta náutica / guía de campo" (latón + navy, ver `docs/design.md`) por un
**álbum de pegatinas** neobrutalista cálido. Es un cambio 100 % de CSS: tokens +
módulos; cero cambios de TSX o de lógica.

## Concepto

Las banderas ya son campos de color planos con bordes duros: el neobrutalismo
las trata como lo que son — **stickers coleccionables sobre papel crema**.
Referencia de paleta: neobrutalismo cálido (crema + amarillo + contornos negros,
acentos pastel), no el lima ácido de la primera iteración.

- **Crema** (`#FAF1E2`) como fondo de app; tarjetas de **papel** (`#FFFDF8`) y la
  ficha cultural en **celeste sticker** (`#CDE9EF`).
- **Amarillo** (`#FFD935`) como color **interactivo**: CTAs, pestaña activa,
  segmento y chip elegidos — siempre con tinta negra encima (`--c-marker` /
  `--c-on-marker`, fijos en ambos modos).
- **Ámbar** (`#F59E0B` / quemado `#92400E`) como acento **decorativo**: barras de
  progreso, ticks, eyebrows, récords.
- **Contornos de tinta** (`#17150F`) en tres grosores: 1px hairlines internos,
  2px tarjetas/controles, 3px CTAs y marco de página.
- **Sombras duras** sin desenfoque: `3/5/9px` de offset en tinta.
- Rojo y verde SOLO semánticos (acierto/error); trama de **puntos** en cabeceras.
- Dark mode: tinta invertida (contornos crema sobre carbón cálido `#1B1810`),
  sombras en negro puro, amarillo sigue siendo el interactivo; el interior de
  las banderas sigue claro para fidelidad.

## La física del sistema (animaciones)

Todo control es un sticker con la misma mecánica táctil:

- **Hover** lo despega: `translate(-1/-2px)` y la sombra crece un paso.
- **Active** lo aplasta: `translate(--press-shift)` y la sombra colapsa a 0
  (recorre exactamente su sombra: 3px).
- **Apariciones** con `--ease-pop` (overshoot cartoon): la pregunta hace pop,
  la hoja de feedback sube con rebote, el sello de resultado (✓/✕ girado
  −4°) cae estampándose, el acierto hace "stamp" y el récord se pega torcido
  (−1°) como pegatina puesta con prisa.
- **Pestañas Casual/Competitivo = balancín**: sin barra deslizante. La activa
  está DESPEGADA (sube 3px, amarilla, con sombra) y la inactiva PEGADA (baja
  3px, hundida, sin sombra); al cambiar, ambas morfean a la vez en sentidos
  opuestos. Cada pestaña lleva su propio `view-transition-name` (`play-tab-a` /
  `play-tab-b`) para que el sube/baja sea visible durante la navegación y no lo
  enmascare el snapshot `root` del View Transition (lección: sin nombre propio,
  la pestaña cae en `root` y solo se ve un fundido). Reemplaza a la vieja barra
  de latón deslizante (`.tabHoist`, retirada).
- `prefers-reduced-motion` neutraliza todos los transforms/animaciones
  (global en tokens + overrides locales; el balancín queda plano).

## Tokens nuevos

| Token | Valor | Uso |
| --- | --- | --- |
| `--border-mid` / `--border-bold` | 2px / 3px | contornos de tinta |
| `--c-shadow` | tinta / negro (dark) | color de las sombras duras |
| `--c-marker` / `--c-on-marker` | amarillo pleno / tinta negra, **fijos en ambos modos** | pestaña activa, thumb del segmented, chip elegido |
| `--ease-pop` | `cubic-bezier(0.25, 1.65, 0.4, 1)` | overshoot de apariciones |
| `--press-shift` | 3px | recorrido de la pulsación (= `--shadow-sm`) |

Se conservan TODOS los nombres de tokens del sistema anterior (los módulos no
tuvieron que renombrar nada); `--c-border` pasa a ser tinta pura, por lo que
ya no sirve como *relleno* (la mecha del countdown y la ProgressBar usan ahora
superficies).

## Lecciones / trampas

- `--c-marker` existe porque `--c-note` se apaga en dark (es superficie
  grande bajo `--c-ink`); las marcas de selección amarillas necesitan tinta
  negra fija encima en ambos modos.
- `.active`/`.selected` de una sola clase pierden contra `.link:hover`
  (clase + pseudo-clase): los estados marcados declaran su propio `:hover`.
- El hoist interior de `FlagImage` se retiró: con contorno + sombra dura ya
  hay marca de "espécimen"; la barra violeta parecía un artefacto.
