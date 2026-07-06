// Aliases aceptados en el modo "escribir el nombre", por código ISO.
// PROPIEDAD: frontend-engineer (countries.ts es autogenerado y no lleva aliases;
// ver docs/plan.md R5). Complementan al nombre y al officialName del dataset,
// que el matching ya acepta. Solo variantes correctas y de uso común en español.
export const COUNTRY_ALIASES: Record<string, string[]> = {
  us: ['EEUU', 'EE.UU.', 'EE. UU.', 'USA', 'Estados Unidos de America'],
  gb: ['Gran Bretaña', 'UK'],
  nl: ['Holanda'],
  ci: ["Côte d'Ivoire"],
  cz: ['Chequia'],
  sa: ['Arabia Saudita'],
  sz: ['Suazilandia'],
  mm: ['Birmania'],
  va: ['Vaticano', 'Santa Sede'],
  mk: ['Macedonia'],
  cd: ['RD Congo', 'RDC', 'Congo Kinshasa'],
  cg: ['Congo', 'Congo Brazzaville'],
  ae: ['EAU', 'Emiratos'],
  tl: ['Timor-Leste'],
};
