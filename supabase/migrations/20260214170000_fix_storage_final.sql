-- Storage 403 canonical patch
-- 이 파일을 단일 진실 원천으로 사용하고, 기존 61000/62000는 deprecated(no-op) 상태로 둡니다.

-- 1) 기존 storage 정책 전부 제거
do $$
declare
  p record;
begin
  for p in
    select policyname
    from pg_policies
    where schemaname = 'storage'
      and tablename = 'objects'
  loop
    execute format('drop policy if exists %I on storage.objects', p.policyname);
  end loop;

  for p in
    select policyname
    from pg_policies
    where schemaname = 'storage'
      and tablename = 'buckets'
  loop
    execute format('drop policy if exists %I on storage.buckets', p.policyname);
  end loop;
end $$;

-- 2) 권한 보장
grant usage on schema storage to anon, authenticated;
grant select on storage.buckets to anon, authenticated;
grant select, insert, update, delete on storage.objects to anon, authenticated;

-- 3) 버킷 생성/업데이트 (public=true, mime/size 제한 해제)
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('plant-images', 'plant-images', true, null, null)
on conflict (id) do update 
set 
  public = true,
  file_size_limit = null,
  allowed_mime_types = null;

-- 4) buckets 조회 정책
create policy "storage_buckets_plant_images_select" on storage.buckets
for select to public
using (id = 'plant-images');

-- 5) objects 정책 (PUBLIC=모든 role 포함)
create policy "storage_objects_plant_images_select" on storage.objects
for select to public
using (bucket_id = 'plant-images');

create policy "storage_objects_plant_images_insert" on storage.objects
for insert to public
with check (bucket_id = 'plant-images');

create policy "storage_objects_plant_images_update" on storage.objects
for update to public
using (bucket_id = 'plant-images')
with check (bucket_id = 'plant-images');

create policy "storage_objects_plant_images_delete" on storage.objects
for delete to public
using (bucket_id = 'plant-images');
