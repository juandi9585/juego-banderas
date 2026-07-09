// Entrada del bundle del MOTOR COMPARTIDO para las Edge Functions (Deno).
//
// Este archivo NO se despliega ni lo resuelve Deno: es la ENTRADA de esbuild
// (scripts/bundle-server-engine.mjs), que resuelve los imports sin extensión
// de src/ (convención Vite/TS que Deno rechaza) y emite `engine.mjs` — un ESM
// autocontenido y sin dependencias que las funciones importan con extensión.
//
// Regenerar con `npm run engine:server` SIEMPRE antes de desplegar funciones:
// si el dataset o el motor cambian y el bundle no, el servidor reconstruiría
// rondas distintas a las del cliente y rechazaría partidas legítimas.
export { countries } from '../../../src/data/dataset';
export { GAME_CATEGORIES, filterByCategories } from '../../../src/features/game/categories';
export { buildQuiz, checkChoice, checkTypedAnswer } from '../../../src/features/game/engine';
export { computeScore, timeLimitFor } from '../../../src/features/game/score';
export { mulberry32 } from '../../../src/lib/random';
export { isBetter } from '../../../src/features/records/records';
