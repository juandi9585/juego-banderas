import type { Continent, GameMode } from './types';

export const OPTIONS_PER_QUESTION = 4;
export const DEFAULT_QUESTION_COUNT = 10;

// 'all' = pool filtrado completo ("todas las preguntas").
export const QUESTION_COUNT_PRESETS = [10, 20, 'all'] as const;
export type QuestionCountPreset = (typeof QUESTION_COUNT_PRESETS)[number];

// 6 continentes (América dividida). Debe coincidir con la union `Continent`.
export const CONTINENTS: Continent[] = [
  'África',
  'América del Norte',
  'América del Sur',
  'Asia',
  'Europa',
  'Oceanía',
];

export const MODE_LABELS: Record<GameMode, string> = {
  'flag-to-name': 'Bandera → nombre',
  'name-to-flag': 'Nombre → bandera',
  'type-name': 'Escribir el nombre',
};
