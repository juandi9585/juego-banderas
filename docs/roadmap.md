# Roadmap — trabajo pendiente

> Este documento rastrea **solo lo que falta**. Lo ya entregado no se registra
> aquí como "hecho": su spec viva está en `design.md` + `docs/competitivo.md` y
> su implementación, en el código. La **fase C (sistema online: Supabase,
> ranking global y por zona, identidad opt-in con apodo + Google)** está
> entregada: backend en `supabase/` (migraciones + Edge Function `submit-score`
> con revalidación por seed), front en `src/features/online/` + `RankingPage`,
> operación en `.github/workflows/supabase-deploy.yml` (deploy al mergear a
> main; CLI local para iterar).

---

## Backlog menor (no bloqueante)

- **Peso del arranque**: supabase-js infla el chunk principal (>500 KB, aviso
  advisory del build). Mejora: `React.lazy` de `RankingPage` + import diferido
  del cliente.
- **`linkIdentity` (anónimo → Google) sin ejercitar con cuenta real**: el flujo
  Google-first sí está verificado en producción; el upgrade desde anónimo tiene
  manejo de errores y tests unitarios, pero nadie lo ha recorrido de punta a
  punta con una cuenta de verdad.
- **Endurecimiento anti-abuso** (cuando haya tráfico real): rate-limiting fino
  del submit (hoy solo el de Supabase), limpieza periódica de cuentas anónimas
  huérfanas sin perfil, y filtro de contenido para apodos si el juego se abre a
  público amplio.
- **Riesgo aceptado por diseño (offline-first)**: la seed la genera el cliente y
  `elapsedMs` no es verificable en servidor — la revalidación cierra el fraude
  burdo (puntos inventados, respuestas imposibles), no el replay premeditado de
  una seed conocida.
