-- Fase online (docs/roadmap.md §C): jugadores y récords del leaderboard.
--
-- Modelo de seguridad:
--   * Lectura PÚBLICA (el ranking es público): SELECT para anon + authenticated.
--   * `players`: cada quien escribe SOLO su fila y SOLO el apodo (grants de
--     columna); el discriminador lo asigna un trigger — el cliente no lo elige.
--   * `records`: SIN políticas de escritura — solo la Edge Function
--     submit-score (service_role, salta RLS) escribe, tras revalidar la
--     partida con la seed y recomputar el puntaje.
--   * El proyecto se creó SIN "auto-expose new tables": todos los GRANT son
--     explícitos.

-- ─── players ─────────────────────────────────────────────────────────────────

-- Perfil público 1:1 con auth.users. Apodo estilo Discord clásico:
-- `nickname` + `#discriminator`; el discriminador va oculto en casi todas las
-- vistas (solo perfil propio y desambiguación), así que puede repetirse el
-- apodo visible sin bloquear el onboarding.
create table public.players (
  id uuid primary key references auth.users (id) on delete cascade,
  nickname text not null,
  discriminator smallint not null,
  created_at timestamptz not null default now(),
  -- 2–20 caracteres, sin espacios en los bordes y sin '#' (rompería el
  -- formato apodo#numero).
  constraint players_nickname_valido check (
    char_length(nickname) between 2 and 20
    and nickname = btrim(nickname)
    and position('#' in nickname) = 0
  )
);

comment on table public.players is
  'Perfil público de jugador (1:1 con auth.users). Escribe cada quien su fila; discriminador por trigger.';

-- Colisiones case-insensitive: si existe "Juan#0042" tampoco puede nacer
-- "juan#0042" (anti-suplantación por mayúsculas).
create unique index players_nickname_disc_unico
  on public.players (lower(nickname), discriminator);

-- Asigna un discriminador aleatorio libre (1–9999) para el apodo.
-- SECURITY DEFINER + search_path fijo: necesita ver TODAS las filas para
-- detectar colisiones, más allá de lo que RLS le muestre a quien inserta.
-- Carrera posible (dos altas simultáneas del mismo apodo eligiendo el mismo
-- número): la resuelve el índice único — el perdedor recibe error y reintenta.
create or replace function public.asignar_discriminador()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  candidato smallint;
  intentos int := 0;
begin
  -- UPDATE sin cambio de apodo (case-insensitive): se conserva el número.
  -- Esto además neutraliza cualquier intento de fijar el discriminador a mano.
  if tg_op = 'UPDATE' and lower(new.nickname) = lower(old.nickname) then
    new.discriminator := old.discriminator;
    return new;
  end if;
  loop
    candidato := (floor(random() * 9999) + 1)::smallint; -- 1..9999
    exit when not exists (
      select 1 from public.players
      where lower(nickname) = lower(new.nickname)
        and discriminator = candidato
    );
    intentos := intentos + 1;
    if intentos >= 100 then
      raise exception 'Apodo agotado: no quedan discriminadores libres para %', new.nickname;
    end if;
  end loop;
  new.discriminator := candidato;
  return new;
end;
$$;

-- Trigger function: no invocable vía RPC (devuelve trigger), pero se revoca
-- igual por higiene.
revoke all on function public.asignar_discriminador() from public, anon, authenticated;

create trigger players_discriminador
  before insert or update of nickname, discriminator on public.players
  for each row execute function public.asignar_discriminador();

alter table public.players enable row level security;

create policy "players: lectura pública"
  on public.players for select
  to anon, authenticated
  using (true);

create policy "players: crea su propia fila"
  on public.players for insert
  to authenticated
  with check (id = (select auth.uid()));

create policy "players: edita su propia fila"
  on public.players for update
  to authenticated
  using (id = (select auth.uid()))
  with check (id = (select auth.uid()));

-- Sin política de DELETE: el perfil muere en cascada con auth.users.

-- Grants de COLUMNA para escribir: el cliente solo puede aportar id + nickname
-- (discriminator lo pone el trigger; created_at, su default).
grant select on public.players to anon, authenticated;
grant insert (id, nickname), update (nickname) on public.players to authenticated;

-- ─── records ─────────────────────────────────────────────────────────────────

-- Mejor marca por (jugador, categoría, modo) — espejo online de RecordEntry
-- (src/features/records/records.ts). `duration_ms` = suma de elapsedMs (solo
-- tiempo respondiendo, docs/competitivo.md §5); `seed` = uint32 de la ronda
-- validada (auditoría / re-verificación).
create table public.records (
  player_id uuid not null references public.players (id) on delete cascade,
  category_id text not null,
  mode text not null,
  points integer not null,
  correct integer not null,
  total integer not null,
  max_streak integer not null,
  duration_ms integer not null,
  seed bigint not null,
  achieved_at timestamptz not null default now(),
  primary key (player_id, category_id, mode),
  -- La validez fina (categoría existente, total = min(20, pool), puntaje
  -- alcanzable) la garantiza la Edge Function, que es la única que escribe;
  -- estos checks son la red de seguridad gruesa.
  constraint records_mode_valido check (mode in ('mixto', 'type-name')),
  constraint records_rangos_validos check (
    points >= 0
    and total > 0
    and correct between 0 and total
    and max_streak between 0 and total
    and duration_ms >= 0
    and seed between 0 and 4294967295
  )
);

comment on table public.records is
  'Mejor marca online por (jugador, categoría, modo). Escribe SOLO la Edge Function submit-score.';

-- Orden canónico del leaderboard = criterios de isBetter() local:
-- más points → más correct → menor duration_ms.
create index records_leaderboard
  on public.records (category_id, mode, points desc, correct desc, duration_ms asc);

alter table public.records enable row level security;

create policy "records: lectura pública"
  on public.records for select
  to anon, authenticated
  using (true);

-- Sin políticas de INSERT/UPDATE/DELETE: nadie escribe salvo service_role.

grant select on public.records to anon, authenticated;

-- ─── RPCs del ranking ────────────────────────────────────────────────────────

-- Top N de una tabla (categoría, modo) con el apodo ya unido. `puesto` usa
-- rank(): empates totales comparten puesto; el desempate visual es quién lo
-- logró primero.
create or replace function public.get_leaderboard(
  p_category_id text,
  p_mode text,
  p_limit int default 50
)
returns table (
  puesto bigint,
  player_id uuid,
  nickname text,
  discriminator smallint,
  points int,
  correct int,
  total int,
  max_streak int,
  duration_ms int,
  achieved_at timestamptz
)
language sql
stable
set search_path = public
as $$
  select
    rank() over (order by r.points desc, r.correct desc, r.duration_ms asc) as puesto,
    r.player_id,
    p.nickname,
    p.discriminator,
    r.points,
    r.correct,
    r.total,
    r.max_streak,
    r.duration_ms,
    r.achieved_at
  from public.records r
  join public.players p on p.id = r.player_id
  where r.category_id = p_category_id and r.mode = p_mode
  order by puesto, r.achieved_at asc
  limit least(greatest(p_limit, 1), 100);
$$;

-- Tu puesto (y el total de jugadores) en una tabla, estés o no en el top.
-- Devuelve 0 filas si el jugador no tiene marca en esa tabla.
create or replace function public.get_player_rank(
  p_category_id text,
  p_mode text,
  p_player_id uuid
)
returns table (puesto bigint, total_jugadores bigint)
language sql
stable
set search_path = public
as $$
  with clasificacion as (
    select
      player_id,
      rank() over (order by points desc, correct desc, duration_ms asc) as puesto,
      count(*) over () as total_jugadores
    from public.records
    where category_id = p_category_id and mode = p_mode
  )
  select puesto, total_jugadores
  from clasificacion
  where player_id = p_player_id;
$$;

grant execute on function public.get_leaderboard(text, text, int) to anon, authenticated;
grant execute on function public.get_player_rank(text, text, uuid) to anon, authenticated;
