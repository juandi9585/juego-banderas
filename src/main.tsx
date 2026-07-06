import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
// Fuentes self-hosted (una sola vez; el SW de la PWA precachea los .woff2).
import '@fontsource-variable/bricolage-grotesque/index.css';
import '@fontsource-variable/hanken-grotesk/index.css';
import '@fontsource-variable/spline-sans-mono/index.css';
import './styles/tokens.css';
import App from './App.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
