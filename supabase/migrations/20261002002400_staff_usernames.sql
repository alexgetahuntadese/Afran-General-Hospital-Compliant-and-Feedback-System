do $$
begin
  if exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'staff_profiles'
      and column_name = 'email'
  ) and not exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'staff_profiles'
      and column_name = 'username'
  ) then
    alter table public.staff_profiles rename column email to username;
  end if;
end;
$$;

comment on column public.staff_profiles.username is
  'Staff login name. Supabase Auth uses the same email-shaped value for password authentication; no email OTP is used.';
