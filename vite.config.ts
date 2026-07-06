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
      includeAssets: ['icons/icon.svg'],
      // Precachear el shell, los datos y TODAS las banderas (SVG diminutos) => offline garantizado.
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,woff2}'],
      },
      manifest: {
        name: 'Banderas del Mundo',
        short_name: 'Banderas',
        description: 'Aprende las banderas y la cultura de los países del mundo.',
        lang: 'es',
        theme_color: '#12293F', // Tinta (token de ui-designer)
        background_color: '#F2F5F7', // Papel (token de ui-designer)
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
