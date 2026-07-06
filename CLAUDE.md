# Banderas del Mundo — Juego educativo

Aplicación web **mobile-first** (PWA) para aprender las banderas de los países del mundo,
con **datos culturales curiosos** de cada país. Interfaz **en español**.

## Stack
- **React 18 + Vite + TypeScript**. Despliegue en **Vercel** (Vite se detecta solo).
- **PWA** instalable y offline con `vite-plugin-pwa` (banderas y datos empaquetados localmente).
- **Estilos**: CSS con custom properties para tokens + **CSS Modules** por componente.
  Sin framework de utilidades, para preservar identidad propia (ver skill `frontend-design`).
- **Estado**: React state + Context. Sin librería de estado global salvo que se justifique.
- **Rutas**: `react-router-dom` para las vistas.
- **Datos base**: sembrar desde `restcountries.com` v3.1; nombres traducidos a español.
  Banderas SVG locales (`flagcdn.com` o paquete `flag-icons`) por código ISO, para offline.

> TypeScript es la decisión por defecto; avísame si prefieres JS puro.

## Alcance del MVP
Modos de juego (todos incluidos):
1. **Bandera → nombre** — elige el país correcto entre 4 opciones.
2. **Nombre → bandera** — elige la bandera correcta entre 4.
3. **Escribir el nombre** — input con tolerancia a tildes/mayúsculas/espacios.
4. **Filtro por continente/región** — acota las rondas por zona.

Datos culturales: **ficha tras responder** (durante el juego) **+ modo Explorar** (enciclopedia navegable).

**Fuera del MVP por ahora**: gamificación (puntos, rachas, vidas, récords, logros).
Diseñar el código para poder añadirla luego **sin reescribir**.

## Modelo de datos (país)
```ts
type Country = {
  code: string;         // ISO 3166-1 alpha-2, minúsculas (ej. "fr")
  name: string;         // nombre en español (ej. "Francia")
  officialName?: string;
  continent: string;    // ej. "Europa"
  region?: string;      // subregión (ej. "Europa Occidental")
  capital: string;
  population?: number;
  flag: string;         // ruta/asset del SVG local
  facts: string[];      // 2–4 datos culturales curiosos en español
};
```

## Estructura sugerida
```
src/
  data/countries.ts        # dataset
  components/               # UI reutilizable
  features/game/            # motor de quiz + los 4 modos
  features/explore/         # enciclopedia
  styles/tokens.css         # design tokens (custom properties)
  App.tsx, main.tsx
public/flags/               # SVGs de banderas para offline
```

## Convenciones
- **Trabajar siempre en la rama `dev`** (main queda para lo desplegado/estable).
- Mobile-first siempre; probar a **360–414px** de ancho.
- Minimizar el scroll vertical en el juego: la pregunta completa debe caber en ~360×640
  y el feedback tras responder es un **pop-up/bottom sheet**, no contenido inline.
- Accesibilidad: foco visible, `prefers-reduced-motion`, contraste AA.
- Copys en español, voz activa, sentence case (ver skill `frontend-design`).
- Al construir o rediseñar UI, **cargar y seguir la skill `frontend-design`**.

## Equipo de subagentes (`.claude/agents/`)
- **product-architect** — planifica y define contratos/estructura (solo planifica).
- **data-curator** — dataset de países + hechos culturales en español + banderas.
- **ui-designer** — dirección visual, tokens y look de componentes (usa `frontend-design`).
- **frontend-engineer** — implementa la app React (componentes, motor de juego, PWA).
- **qa-tester** — verifica flujos reales, responsive y tests.
- **code-reviewer** — revisa diffs (correctitud, simplicidad, rendimiento).
