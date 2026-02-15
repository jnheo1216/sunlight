-- Manual care model
-- - watering: record only
-- - fertilizing: record only + fertilizer_name required
-- - repotting: elapsed days from latest REPOT log on UI

alter table public.care_logs
  add column if not exists fertilizer_name text;

-- legacy data cleanup
update public.care_logs
set fertilizer_name = '미기록 비료'
where event_type = 'FERTILIZE'
  and (fertilizer_name is null or btrim(fertilizer_name) = '');

update public.care_logs
set fertilizer_name = null
where event_type <> 'FERTILIZE';

alter table public.care_logs
  drop constraint if exists care_logs_fertilizer_name_chk;

alter table public.care_logs
  add constraint care_logs_fertilizer_name_chk check (
    (
      event_type = 'FERTILIZE'
      and fertilizer_name is not null
      and btrim(fertilizer_name) <> ''
    )
    or (
      event_type <> 'FERTILIZE'
      and fertilizer_name is null
    )
  );
