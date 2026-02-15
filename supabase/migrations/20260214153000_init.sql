create extension if not exists pgcrypto;

create table if not exists public.plants (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  species text,
  location text,
  acquired_on date,
  note text,
  next_repot_at date,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.plant_photos (
  id uuid primary key default gen_random_uuid(),
  plant_id uuid not null references public.plants(id) on delete cascade,
  storage_path text not null,
  is_cover boolean not null default false,
  captured_at date,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.care_profiles (
  plant_id uuid primary key references public.plants(id) on delete cascade,
  watering_interval_days integer not null check (watering_interval_days > 0),
  fertilizing_interval_days integer not null check (fertilizing_interval_days > 0),
  next_watering_override_at timestamptz,
  next_fertilizing_override_at timestamptz,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.care_logs (
  id uuid primary key default gen_random_uuid(),
  plant_id uuid not null references public.plants(id) on delete cascade,
  event_type text not null check (event_type in ('WATER', 'FERTILIZE', 'REPOT')),
  occurred_at timestamptz not null,
  fertilizer_name text,
  note text,
  created_at timestamptz not null default timezone('utc', now()),
  constraint care_logs_fertilizer_name_chk check (
    (
      event_type = 'FERTILIZE'
      and fertilizer_name is not null
      and btrim(fertilizer_name) <> ''
    ) or (
      event_type <> 'FERTILIZE'
      and fertilizer_name is null
    )
  )
);

create index if not exists idx_care_logs_event_type_occurred
  on public.care_logs(event_type, occurred_at desc);
create index if not exists idx_care_logs_plant_occurred
  on public.care_logs(plant_id, occurred_at desc);
create index if not exists idx_plant_photos_plant_cover
  on public.plant_photos(plant_id, is_cover);

create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_plants_updated_at on public.plants;
create trigger trg_plants_updated_at
before update on public.plants
for each row execute function public.set_updated_at();

drop trigger if exists trg_care_profiles_updated_at on public.care_profiles;
create trigger trg_care_profiles_updated_at
before update on public.care_profiles
for each row execute function public.set_updated_at();

create or replace view public.v_care_schedule as
with latest_watering as (
  select plant_id, max(occurred_at) as last_at
  from public.care_logs
  where event_type = 'WATER'
  group by plant_id
),
latest_fertilizing as (
  select plant_id, max(occurred_at) as last_at
  from public.care_logs
  where event_type = 'FERTILIZE'
  group by plant_id
)
select
  p.id as plant_id,
  p.name as plant_name,
  coalesce(
    cp.next_watering_override_at,
    (coalesce(lw.last_at, p.created_at) + make_interval(days => coalesce(cp.watering_interval_days, 7)))
  ) as next_watering_at,
  coalesce(
    cp.next_fertilizing_override_at,
    (coalesce(lf.last_at, p.created_at) + make_interval(days => coalesce(cp.fertilizing_interval_days, 30)))
  ) as next_fertilizing_at,
  p.next_repot_at::timestamptz as next_repot_at,
  case
    when coalesce(cp.next_watering_override_at, (coalesce(lw.last_at, p.created_at) + make_interval(days => coalesce(cp.watering_interval_days, 7)))) is null then 'UNSCHEDULED'
    when coalesce(cp.next_watering_override_at, (coalesce(lw.last_at, p.created_at) + make_interval(days => coalesce(cp.watering_interval_days, 7))))::date < current_date then 'OVERDUE'
    when coalesce(cp.next_watering_override_at, (coalesce(lw.last_at, p.created_at) + make_interval(days => coalesce(cp.watering_interval_days, 7))))::date = current_date then 'DUE'
    else 'UPCOMING'
  end as watering_status,
  case
    when coalesce(cp.next_fertilizing_override_at, (coalesce(lf.last_at, p.created_at) + make_interval(days => coalesce(cp.fertilizing_interval_days, 30)))) is null then 'UNSCHEDULED'
    when coalesce(cp.next_fertilizing_override_at, (coalesce(lf.last_at, p.created_at) + make_interval(days => coalesce(cp.fertilizing_interval_days, 30))))::date < current_date then 'OVERDUE'
    when coalesce(cp.next_fertilizing_override_at, (coalesce(lf.last_at, p.created_at) + make_interval(days => coalesce(cp.fertilizing_interval_days, 30))))::date = current_date then 'DUE'
    else 'UPCOMING'
  end as fertilizing_status,
  case
    when p.next_repot_at is null then 'UNSCHEDULED'
    when p.next_repot_at < current_date then 'OVERDUE'
    when p.next_repot_at = current_date then 'DUE'
    else 'UPCOMING'
  end as repot_status
from public.plants p
left join public.care_profiles cp on cp.plant_id = p.id
left join latest_watering lw on lw.plant_id = p.id
left join latest_fertilizing lf on lf.plant_id = p.id;

-- 인증 없이 단일 사용자 앱으로 동작하도록 anon/authenticated 권한을 모두 허용
revoke all on all tables in schema public from anon, authenticated;
grant usage on schema public to anon, authenticated;
grant select, insert, update, delete on all tables in schema public to anon, authenticated;
grant usage, select on all sequences in schema public to anon, authenticated;
grant select on public.v_care_schedule to anon, authenticated;

insert into storage.buckets (id, name, public)
values ('plant-images', 'plant-images', true)
on conflict (id) do update set public = true;
