do $$
begin
  if exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'staff_profiles'
      and column_name = 'username'
  ) and not exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'staff_profiles'
      and column_name = 'email'
  ) then
    alter table public.staff_profiles rename column username to email;
  end if;
end;
$$;

alter table public.staff_profiles
  add column if not exists username text;

update public.staff_profiles
set username = lower(email)
where username is null or btrim(username) = '';

alter table public.staff_profiles
  alter column username set not null;

create unique index if not exists staff_profiles_username_idx
  on public.staff_profiles (lower(username));

comment on column public.staff_profiles.username is
  'Staff login name managed by the app. Its value is mirrored to email for Supabase password authentication; no email OTP is used.';
