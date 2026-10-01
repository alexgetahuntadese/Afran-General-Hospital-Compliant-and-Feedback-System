alter table public.staff_profiles
  drop constraint if exists staff_profiles_role_check,
  add constraint staff_profiles_role_check
    check (role in ('superadmin', 'customer_service_manager', 'department_head', 'ceo', 'staff'));

update public.staff_profiles
set role = 'superadmin', department = null
where lower(email) = 'alexgetahun@afran.com';

drop policy if exists "Superadmins can read all cases" on public.feedback_cases;
create policy "Superadmins can read all cases"
  on public.feedback_cases for select
  to authenticated
  using (public.current_staff_role() = 'superadmin');

drop policy if exists "Superadmins can update all cases" on public.feedback_cases;
create policy "Superadmins can update all cases"
  on public.feedback_cases for update
  to authenticated
  using (public.current_staff_role() = 'superadmin')
  with check (public.current_staff_role() = 'superadmin');

drop policy if exists "Superadmins can read the staff directory" on public.staff_profiles;
create policy "Superadmins can read the staff directory"
  on public.staff_profiles for select
  to authenticated
  using (public.current_staff_role() = 'superadmin');

revoke update on public.staff_profiles from authenticated;
grant update (role, department) on public.staff_profiles to authenticated;

drop policy if exists "Superadmins can update staff profiles" on public.staff_profiles;
create policy "Superadmins can update staff profiles"
  on public.staff_profiles for update
  to authenticated
  using (public.current_staff_role() = 'superadmin')
  with check (public.current_staff_role() = 'superadmin');

create or replace function private.prevent_superadmin_lockout()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if old.role = 'superadmin' and new.role <> 'superadmin' then
    if old.id = (select auth.uid()) then
      raise exception 'A superadmin cannot change their own role.';
    end if;

    if not exists (
      select 1
      from public.staff_profiles as profiles
      where profiles.role = 'superadmin'
        and profiles.id <> old.id
    ) then
      raise exception 'At least one superadmin must remain assigned.';
    end if;
  end if;

  return new;
end;
$$;

revoke all on function private.prevent_superadmin_lockout() from public, anon, authenticated;
drop trigger if exists prevent_superadmin_lockout on public.staff_profiles;
create trigger prevent_superadmin_lockout
  before update of role on public.staff_profiles
  for each row
  execute function private.prevent_superadmin_lockout();

drop policy if exists "Assigned staff can listen to complaint recordings" on storage.objects;
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
          public.current_staff_role() in ('superadmin', 'customer_service_manager')
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
