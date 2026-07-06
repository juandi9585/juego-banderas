import type { Country } from '../features/game/types';
import styles from './FlagImage.module.css';

interface FlagImageProps {
  country: Country;
  /** sm: mini (opciones, tarjetas de Explorar) · md: juego · lg: detalle/hero */
  size?: 'sm' | 'md' | 'lg';
  /** Marca de hoist en latón (espécimen activo: pregunta en curso, hero). */
  active?: boolean;
  /** La bandera del juego se precarga; en grids conviene lazy. */
  lazy?: boolean;
  /**
   * Bandera héroe elástica: la altura la marca el contenedor (p. ej.
   * `--flag-hero-max-h`) y el ancho sigue por `aspect-ratio`. Ver design §11.
   */
  fill?: boolean;
  /**
   * Texto alternativo. Por defecto "Bandera de {país}"; en el juego debe
   * sobrescribirse para no revelar la respuesta ("" si el contenedor ya tiene
   * etiqueta, o un alt neutro como "Bandera a identificar").
   */
  alt?: string;
}

/**
 * Tarjeta de bandera ("espécimen"): interior blanco para color fiel, marco +
 * sombra obligatorios (banderas con blanco, ej. Japón) y marca de hoist a la
 * izquierda — el elemento signature del sistema. Ver docs/design.md §5.1.
 */
export function FlagImage({
  country,
  size = 'md',
  active = false,
  lazy = false,
  fill = false,
  alt,
}: FlagImageProps) {
  const classes = [
    styles.card,
    styles[size],
    active ? styles.active : '',
    fill ? styles.fill : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <span className={classes}>
      <img
        className={styles.img}
        src={country.flag}
        alt={alt ?? `Bandera de ${country.name}`}
        loading={lazy ? 'lazy' : undefined}
        draggable={false}
      />
    </span>
  );
}
