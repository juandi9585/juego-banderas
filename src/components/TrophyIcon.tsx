/**
 * Glifo de TROFEO — el emblema que hermana el modo competitivo con el Ranking:
 * aparece en la pestaña Competitivo (Jugar) y en la cabecera del Ranking, para
 * que "donde compites" y "donde consultas" compartan marca visual.
 *
 * Misma familia de trazo que el globo del chip Global: geometría simple,
 * stroke con currentColor (hereda tinta/ámbar del contexto) y uniones
 * redondeadas. Siempre decorativo (aria-hidden): el texto adyacente nombra.
 */
export function TrophyIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      width="1em"
      height="1em"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {/* Copa */}
      <path d="M8 4.5h8V10a4 4 0 0 1-8 0V4.5Z" />
      {/* Asas */}
      <path d="M8 6H4.5v1A3.5 3.5 0 0 0 8 10.5" />
      <path d="M16 6h3.5v1A3.5 3.5 0 0 1 16 10.5" />
      {/* Tallo y base */}
      <path d="M12 14v5" />
      <path d="M8.5 20h7" />
    </svg>
  );
}
