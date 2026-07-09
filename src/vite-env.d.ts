/// <reference types="vite/client" />
/// <reference types="vite-plugin-pwa/react" />

// Tipado de las variables de entorno online (Fase C). Son OPCIONALES a propósito:
// sin ellas la app funciona igual que antes (offline-first) y todo lo online se
// apaga con gracia (getSupabase() → null). Ver src/lib/supabase.ts.
interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL?: string;
  readonly VITE_SUPABASE_ANON_KEY?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
