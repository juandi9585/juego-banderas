-- Fix: privilegios para service_role (la Edge Function submit-score).
--
-- El proyecto se creó SIN "auto-expose new tables", así que NINGÚN rol recibe
-- privilegios por defecto — tampoco service_role. service_role salta RLS, pero
-- los GRANT de tabla siguen aplicando: sin esto, sus SELECT/UPSERT fallan con
-- "permission denied" (detectado en el E2E del submit: 412 perfil-requerido
-- con el perfil ya creado).
grant select, insert, update, delete on public.players to service_role;
grant select, insert, update, delete on public.records to service_role;
grant execute on function public.get_leaderboard(text, text, int) to service_role;
grant execute on function public.get_player_rank(text, text, uuid) to service_role;
