/** Generador de números aleatorios inyectable => tests deterministas. */
export type RNG = () => number;

/**
 * Baraja (Fisher-Yates) SIN mutar el array original. RNG inyectable.
 */
export function shuffle<T>(arr: readonly T[], rng: RNG = Math.random): T[] {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    const tmp = a[i];
    a[i] = a[j];
    a[j] = tmp;
  }
  return a;
}

/**
 * Muestra `n` elementos SIN reemplazo (baraja y corta). Si `n` excede el
 * tamaño, devuelve todos los elementos barajados.
 */
export function sample<T>(arr: readonly T[], n: number, rng: RNG = Math.random): T[] {
  return shuffle(arr, rng).slice(0, Math.max(0, n));
}
