do $$
begin
  if not exists (
    select 1
    from auth.users
    where lower(email) = 'alexgetahuntadese@gmail.com'
  ) then
    raise exception 'Create alexgetahuntadese@gmail.com in Supabase Authentication → Users first.';
  end if;
end;
$$;

insert into public.staff_profiles (id, email, username, full_name, role, department)
select
  auth_user.id,
  lower(auth_user.email),
  lower(auth_user.email),
  'Alex Getahun Tadesse',
  'superadmin',
  null
from auth.users as auth_user
where lower(auth_user.email) = 'alexgetahuntadese@gmail.com'
on conflict (id) do update
set
  email = excluded.email,
  username = excluded.username,
  full_name = excluded.full_name,
  role = excluded.role,
  department = excluded.department;
