/// <reference types="vitest/config" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      // Precachear el shell, los datos, las banderas, las siluetas de ZONA y los
      // sonidos (wav) => offline garantizado. Las 194 siluetas de PAÍS quedan
      // FUERA del precache (decisión dura del usuario, roadmap §B.3): se sirven
      // perezosas con runtimeCaching CacheFirst — el usuario solo descarga las que
      // visita en Explorar, una vez.
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,woff2,wav}'],
        globIgnores: ['**/shapes/countries/**'],
        runtimeCaching: [
          {
            urlPattern: ({ url }) => url.pathname.startsWith('/shapes/countries/'),
            handler: 'CacheFirst',
            options: {
              cacheName: 'shapes-countries',
              expiration: {
                maxEntries: 210, // 194 países + holgura
                maxAgeSeconds: 60 * 60 * 24 * 180, // 180 días
              },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
        ],
      },
      manifest: {
        name: 'Banderas del Mundo',
        short_name: 'Banderas',
        description: 'Aprende las banderas y la cultura de los países del mundo.',
        lang: 'es',
        theme_color: '#FAF1E2', // Crema (rediseño neobrutalista cálido)
        background_color: '#FAF1E2', // splash a juego con el fondo de app
        display: 'standalone',
        start_url: '/',
        icons: [
          { src: '/icons/pwa-192x192.png', sizes: '192x192', type: 'image/png' },
          { src: '/icons/pwa-512x512.png', sizes: '512x512', type: 'image/png' },
          {
            src: '/icons/maskable-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
      devOptions: { enabled: false }, // activar solo si se quiere probar el SW en dev
    }),
  ],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts', // importa @testing-library/jest-dom
  },
});
