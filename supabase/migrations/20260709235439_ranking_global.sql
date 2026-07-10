-- Ranking GLOBAL por modo (iteración 2 del Ranking, decidido 2026-07-09):
-- el total de un jugador es la SUMA de sus mejores marcas en las categorías
-- de ese modo (una fila de records por categoría) — "completar el álbum":
-- cubrir más zonas sube el total. El desempate replica al resto de tablas:
-- points → correct → duration_ms (todos agregados).

create or replace function public.get_global_leaderboard(
  p_mode text,
  p_limit int default 50
)
returns table (
  puesto bigint,
  player_id uuid,
  nickname text,
  discriminator smallint,
  points bigint,
  zones bigint,
  correct bigint,
  duration_ms bigint,
  achieved_at timestamptz
)
language sql
stable
set search_path = public
as $$
  with totals as (
    select
      r.player_id,
      sum(r.points)::bigint as points,
      count(*)::bigint as zones,
      sum(r.correct)::bigint as correct,
      sum(r.duration_ms)::bigint as duration_ms,
      max(r.achieved_at) as achieved_at
    from public.records r
    where r.mode = p_mode
    group by r.player_id
  )
  select
    rank() over (order by t.points desc, t.correct desc, t.duration_ms asc) as puesto,
    t.player_id,
    p.nickname,
    p.discriminator,
    t.points,
    t.zones,
    t.correct,
    t.duration_ms,
    t.achieved_at
  from totals t
  join public.players p on p.id = t.player_id
  order by puesto, t.achieved_at asc
  limit least(greatest(p_limit, 1), 100);
$$;

-- Tu puesto global (y tus agregados, para pintar "tu fila" fuera del top).
-- Devuelve 0 filas si el jugador no tiene ninguna marca en ese modo.
create or replace function public.get_player_global_rank(
  p_mode text,
  p_player_id uuid
)
returns table (
  puesto bigint,
  total_jugadores bigint,
  points bigint,
  zones bigint,
  correct bigint,
  duration_ms bigint
)
language sql
stable
set search_path = public
as $$
  with totals as (
    select
      r.player_id,
      sum(r.points)::bigint as points,
      count(*)::bigint as zones,
      sum(r.correct)::bigint as correct,
      sum(r.duration_ms)::bigint as duration_ms
    from public.records r
    where r.mode = p_mode
    group by r.player_id
  ),
  clasificacion as (
    select
      player_id,
      rank() over (order by points desc, correct desc, duration_ms asc) as puesto,
      count(*) over () as total_jugadores,
      points,
      zones,
      correct,
      duration_ms
    from totals
  )
  select puesto, total_jugadores, points, zones, correct, duration_ms
  from clasificacion
  where player_id = p_player_id;
$$;

grant execute on function public.get_global_leaderboard(text, int)
  to anon, authenticated, service_role;
grant execute on function public.get_player_global_rank(text, uuid)
  to anon, authenticated, service_role;
