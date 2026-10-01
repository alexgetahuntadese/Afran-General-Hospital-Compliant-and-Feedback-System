alter table public.staff_profiles
  add column if not exists is_active boolean not null default true;

create or replace function public.current_staff_role()
returns text
language sql
stable
security definer
set search_path = ''
as $$
  select case when profile.is_active then profile.role else null end
  from public.staff_profiles as profile
  where profile.id = (select auth.uid())
$$;

create or replace function public.current_staff_department()
returns text
language sql
stable
security definer
set search_path = ''
as $$
  select case when profile.is_active then profile.department else null end
  from public.staff_profiles as profile
  where profile.id = (select auth.uid())
$$;
