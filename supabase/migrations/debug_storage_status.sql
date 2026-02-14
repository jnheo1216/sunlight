-- Storage 설정 상태 확인용 쿼리

-- 1. 버킷 설정 확인
select 
  id,
  name,
  public,
  file_size_limit,
  allowed_mime_types,
  created_at
from storage.buckets
where id = 'plant-images';

-- 2. storage.objects 테이블의 RLS 상태 확인
select 
  schemaname,
  tablename,
  rowsecurity
from pg_tables
where schemaname = 'storage'
  and tablename in ('objects', 'buckets');

-- 3. 현재 적용된 정책 확인 (objects)
select 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
from pg_policies
where schemaname = 'storage'
  and tablename = 'objects'
order by policyname;

-- 4. 현재 적용된 정책 확인 (buckets)
select 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd
from pg_policies
where schemaname = 'storage'
  and tablename = 'buckets'
order by policyname;

-- 5. anon 롤의 권한 확인
select 
  grantee,
  table_schema,
  table_name,
  string_agg(privilege_type, ', ') as privileges
from information_schema.table_privileges
where table_schema = 'storage'
  and table_name in ('objects', 'buckets')
  and grantee in ('anon', 'authenticated', 'public')
group by grantee, table_schema, table_name
order by grantee, table_name;
