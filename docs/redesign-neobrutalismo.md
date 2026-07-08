# Rediseño neobrutalista — rama `redesign/neobrutalismo`

Experimento de identidad visual alternativa (2026-07). Sustituye el concepto
"carta náutica / guía de campo" (latón + navy, ver `docs/design.md`) por un
**álbum de pegatinas** neobrutalista. Es un cambio 100 % de CSS: tokens +
módulos; cero cambios de TSX o de lógica.

## Concepto

Las banderas ya son campos de color planos con bordes duros: el neobrutalismo
las trata como lo que son — **stickers coleccionables sobre cartulina**.

- **Cartulina lima** (`#CDEF54`) como fondo de app; tarjetas de **papel**
  (`#FFFEF6`) y la ficha cultural en **amarillo sticker** (`#FFD43D`).
- **Contornos de tinta** (`#131505`) en tres grosores: 1px hairlines internos,
  2px tarjetas/controles, 3px CTAs y marco de página.
- **Sombras duras** sin desenfoque: `3/5/9px` de offset en tinta.
- **Violeta eléctrico** (`#5B3DF5`) como único acento: CTAs, progreso,
  marcas de selección y foco.
- Dark mode: tinta invertida (contornos crema sobre oliva profundo), sombras
  en negro puro; el interior de las banderas sigue claro para fidelidad.

## La física del sistema (animaciones)

Todo control es un sticker con la misma mecánica táctil:

- **Hover** lo despega: `translate(-1/-2px)` y la sombra crece un paso.
- **Active** lo aplasta: `translate(--press-shift)` y la sombra colapsa a 0
  (recorre exactamente su sombra: 3px).
- **Apariciones** con `--ease-pop` (overshoot cartoon): la pregunta hace pop,
  la hoja de feedback sube con rebote, el sello de resultado (✓/✕ girado
  −4°) cae estampándose, el acierto hace "stamp" y el récord se pega torcido
  (−1°) como pegatina puesta con prisa.
- `prefers-reduced-motion` neutraliza todos los transforms/animaciones
  (global en tokens + overrides locales).

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
