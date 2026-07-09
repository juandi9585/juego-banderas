// Apodo del jugador — validación y formato PUROS (sin React, sin red).
// PROPIEDAD: frontend-engineer. Espeja el CHECK de la tabla players
// (docs/roadmap.md §C): 2–20 caracteres, sin '#', sin espacios en los bordes.
//
// El discriminador estilo Discord clásico va OCULTO en el ranking; solo se
// muestra (con padding a 4) en el perfil propio, donde el jugador ve/edita su
// apodo. Los duplicados de apodo visible en el top son aceptables.

export const NICK_MIN = 2;
export const NICK_MAX = 20;

export type NicknameCheck =
  | { ok: true; value: string } // apodo ya recortado, listo para insertar
  | { ok: false; reason: string };

/**
 * Valida y normaliza un apodo crudo del input. Recorta bordes (el CHECK exige
 * `nickname = btrim(nickname)`) y mide por PUNTOS DE CÓDIGO (como char_length de
 * Postgres, no unidades UTF-16) para que un emoji cuente como 1.
 */
export function validateNickname(raw: string): NicknameCheck {
  const value = raw.trim();
  const length = [...value].length;
  if (length < NICK_MIN) {
    return { ok: false, reason: 'Usa al menos 2 caracteres.' };
  }
  if (length > NICK_MAX) {
    return { ok: false, reason: 'Máximo 20 caracteres.' };
  }
  if (value.includes('#')) {
    return { ok: false, reason: 'No puede contener el signo “#”.' };
  }
  return { ok: true, value };
}

/** Formatea el discriminador con padding a 4 dígitos: 42 → "#0042". */
export function formatDiscriminator(discriminator: number): string {
  const n = Math.max(0, Math.trunc(discriminator));
  return `#${String(n).padStart(4, '0')}`;
}

/** Handle completo del perfil propio: "Apodo#0042". */
export function formatHandle(nickname: string, discriminator: number): string {
  return `${nickname}${formatDiscriminator(discriminator)}`;
}
