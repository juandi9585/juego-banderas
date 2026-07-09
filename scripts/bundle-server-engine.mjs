// Bundlea el motor puro del juego (engine + score + categorías + dataset) en
// un módulo ESM autocontenido para las Edge Functions de Supabase (Deno).
//
// ¿Por qué un bundle? El código de src/ usa imports sin extensión (resolución
// de Vite/TS) que Deno no acepta. esbuild (ya presente vía Vite) los resuelve
// y deja un único .mjs sin dependencias. El artefacto NO se versiona
// (.gitignore); se regenera con `npm run engine:server` antes de cada
// `supabase functions deploy`.
import { build } from 'esbuild';

await build({
  entryPoints: ['supabase/functions/_shared/engine-entry.ts'],
  outfile: 'supabase/functions/_shared/engine.mjs',
  bundle: true,
  format: 'esm',
  platform: 'neutral',
  target: 'es2022',
  banner: {
    js: '// GENERADO por scripts/bundle-server-engine.mjs (npm run engine:server) — NO EDITAR.',
  },
});

console.log('supabase/functions/_shared/engine.mjs regenerado');
