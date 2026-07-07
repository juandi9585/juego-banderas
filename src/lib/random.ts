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

/**
 * PRNG determinista (mulberry32): la MISMA semilla produce SIEMPRE la misma
 * secuencia. Base de las rondas competitivas reproducibles
 * (`QuizConfig.competitive.seed`) y de la validación en servidor de la Fase 2
 * (el backend reconstruye la ronda con la semilla y recomputa el score). Es el
 * mismo algoritmo que usa `seededRng` en los tests del motor.
 */
export function mulberry32(seed: number): RNG {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Semilla entera sin signo de 32 bits (vía `Math.random`). Se genera una nueva
 * al arrancar CADA ronda competitiva (también al reiniciar): reutilizarla
 * dejaría memorizar los países y el orden de opciones y farmear el récord.
 */
export function randomSeed(): number {
  return (Math.random() * 0x1_0000_0000) >>> 0;
}
