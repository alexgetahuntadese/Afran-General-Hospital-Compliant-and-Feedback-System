alter table public.feedback_cases
  add column if not exists audio_path text;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'complaint-audio',
  'complaint-audio',
  false,
  10485760,
  array['audio/webm', 'audio/ogg', 'audio/mp4', 'audio/wav']
)
on conflict (id) do update
set
  public = false,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

create schema if not exists private;
revoke all on schema private from public;
grant usage on schema private to anon, authenticated;

create or replace function private.is_unlinked_complaint_audio(object_name text)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select not exists (
    select 1
    from public.feedback_cases as cases
    where cases.audio_path = object_name
  )
$$;

revoke all on function private.is_unlinked_complaint_audio(text) from public;
grant execute on function private.is_unlinked_complaint_audio(text) to anon, authenticated;

drop policy if exists "Public can upload complaint recordings" on storage.objects;
drop policy if exists "Assigned staff can listen to complaint recordings" on storage.objects;
drop policy if exists "Public can remove unlinked complaint recordings" on storage.objects;

create policy "Public can upload complaint recordings"
  on storage.objects for insert
  to anon, authenticated
  with check (
    bucket_id = 'complaint-audio'
    and split_part(name, '/', 1) ~ '^AGH-[A-Z0-9]{6}$'
    and storage.filename(name) ~ '^complaint\.(webm|ogg|mp4|wav)$'
  );

create policy "Assigned staff can listen to complaint recordings"
  on storage.objects for select
  to authenticated
  using (
    bucket_id = 'complaint-audio'
    and exists (
      select 1
      from public.feedback_cases as cases
      where cases.reference = split_part(storage.objects.name, '/', 1)
        and cases.audio_path = storage.objects.name
        and cases.kind = 'complaint'
        and (
          public.current_staff_role() = 'customer_service_manager'
          or (
            public.current_staff_role() = 'department_head'
            and cases.department = public.current_staff_department()
          )
          or (
            public.current_staff_role() = 'ceo'
            and cases.escalated
          )
        )
    )
  );

create policy "Public can remove unlinked complaint recordings"
  on storage.objects for delete
  to anon, authenticated
  using (
    bucket_id = 'complaint-audio'
    and split_part(name, '/', 1) ~ '^AGH-[A-Z0-9]{6}$'
    and storage.filename(name) ~ '^complaint\.(webm|ogg|mp4|wav)$'
    and private.is_unlinked_complaint_audio(storage.objects.name)
  );
