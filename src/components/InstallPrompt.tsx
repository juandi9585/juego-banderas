import { useState } from 'react';
import { usePwaInstall } from '../features/pwa/usePwaInstall';
import styles from './InstallPrompt.module.css';

/** Icono Compartir de iOS (cuadrado con flecha arriba), decorativo. */
function ShareIcon() {
  return (
    <svg
      className={styles.shareIcon}
      viewBox="0 0 16 16"
      width="14"
      height="14"
      aria-hidden="true"
    >
      <path
        d="M8 1.5l3 3M8 1.5l-3 3M8 1.5V9.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M5.5 6H3.5v8.5h9V6h-2"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/**
 * Aviso de instalación de la PWA — "edición de bolsillo" de la guía. Tarjeta
 * descartable (14 días) que solo aparece cuando hay algo que ofrecer:
 * - Chromium (`installable`): botón que lanza el diálogo nativo de instalación.
 * - iOS (`ios`): Safari no tiene API de instalación → disclosure con los 3
 *   pasos de "Añadir a pantalla de inicio" (mismo patrón plegable que Sectores).
 */
export function InstallPrompt() {
  const { status, promptInstall, dismiss } = usePwaInstall();
  const [stepsOpen, setStepsOpen] = useState(false);

  if (status === 'hidden') return null;

  return (
    <section className={styles.card} aria-label="Instalar la aplicación">
      <div className={styles.head}>
        <div>
          <p className={styles.eyebrow}>Edición de bolsillo</p>
          <h2 className={styles.title}>Lleva la guía contigo</h2>
        </div>
        <button
          type="button"
          className={styles.close}
          aria-label="Ocultar aviso de instalación"
          onClick={dismiss}
        >
          ×
        </button>
      </div>

      <p className={styles.body}>
        Instálala en tu pantalla de inicio: abre a pantalla completa y funciona
        sin conexión.
      </p>

      {status === 'installable' ? (
        <button type="button" className={styles.cta} onClick={promptInstall}>
          Instalar la app
        </button>
      ) : (
        <>
          <button
            type="button"
            className={styles.cta}
            aria-expanded={stepsOpen}
            aria-controls="install-steps"
            onClick={() => setStepsOpen((open) => !open)}
          >
            Cómo instalarla
            <span
              className={stepsOpen ? `${styles.chevron} ${styles.chevronOpen}` : styles.chevron}
              aria-hidden="true"
            >
              ›
            </span>
          </button>
          {/* inert al plegar: fuera del tab-order y del árbol de accesibilidad
              sin salir del DOM (la transición 0fr↔1fr necesita el contenido). */}
          <div
            id="install-steps"
            inert={!stepsOpen}
            className={
              stepsOpen
                ? styles.collapsible
                : `${styles.collapsible} ${styles.isCollapsed}`
            }
          >
            <div className={styles.collapsibleInner}>
              <ol className={styles.steps}>
                <li>
                  Toca el botón <strong>Compartir</strong> <ShareIcon /> en la
                  barra del navegador.
                </li>
                <li>
                  Elige <strong>Añadir a pantalla de inicio</strong>.
                </li>
                <li>
                  Confirma con <strong>Añadir</strong>: la guía queda instalada
                  como una app.
                </li>
              </ol>
            </div>
          </div>
        </>
      )}
    </section>
  );
}
