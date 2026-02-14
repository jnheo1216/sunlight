-- 기존 인증 기반 스키마에서 인증 의존을 제거하기 위한 보정 마이그레이션

alter table if exists public.plants disable row level security;
alter table if exists public.plant_photos disable row level security;
alter table if exists public.care_profiles disable row level security;
alter table if exists public.care_logs disable row level security;

drop policy if exists plants_select_own on public.plants;
drop policy if exists plants_insert_own on public.plants;
drop policy if exists plants_update_own on public.plants;
drop policy if exists plants_delete_own on public.plants;

drop policy if exists plant_photos_select_own on public.plant_photos;
drop policy if exists plant_photos_insert_own on public.plant_photos;
drop policy if exists plant_photos_update_own on public.plant_photos;
drop policy if exists plant_photos_delete_own on public.plant_photos;

drop policy if exists care_profiles_select_own on public.care_profiles;
drop policy if exists care_profiles_insert_own on public.care_profiles;
drop policy if exists care_profiles_update_own on public.care_profiles;
drop policy if exists care_profiles_delete_own on public.care_profiles;

drop policy if exists care_logs_select_own on public.care_logs;
drop policy if exists care_logs_insert_own on public.care_logs;
drop policy if exists care_logs_update_own on public.care_logs;
drop policy if exists care_logs_delete_own on public.care_logs;

alter table if exists public.plants drop column if exists owner_id;
alter table if exists public.plant_photos drop column if exists owner_id;
alter table if exists public.care_profiles drop column if exists owner_id;
alter table if exists public.care_logs drop column if exists owner_id;

drop index if exists public.idx_plants_owner_id;
drop index if exists public.idx_care_logs_owner_type_occurred;

revoke all on all tables in schema public from anon, authenticated;
grant usage on schema public to anon, authenticated;
grant select, insert, update, delete on all tables in schema public to anon, authenticated;
grant usage, select on all sequences in schema public to anon, authenticated;
grant select on public.v_care_schedule to anon, authenticated;

update storage.buckets
set public = true
where id = 'plant-images';
