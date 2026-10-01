do $$
declare
  missing_emails text[];
begin
  select array_agg(requested.email)
  into missing_emails
  from (values
    ('alexgetahuntadese@gmail.com'),
    ('alexgetahun@afran.com'),
    ('getahun@afran.com'),
    ('tamima@afranhospital.com'),
    ('belay@afranhospital.com')
  ) as requested(email)
  where not exists (
    select 1
    from auth.users as auth_user
    where lower(auth_user.email) = requested.email
  );

  if coalesce(cardinality(missing_emails), 0) > 0 then
    raise exception 'Create these Auth users before provisioning their staff profiles: %',
      array_to_string(missing_emails, ', ');
  end if;
end;
$$;

insert into public.staff_profiles (id, email, full_name, role, department)
select
  auth_user.id,
  lower(auth_user.email),
  requested.full_name,
  requested.role,
  null
from (values
  ('alexgetahuntadese@gmail.com', 'Alex Getahun Tadesse', 'superadmin'),
  ('alexgetahun@afran.com', 'Alex Getahun', 'superadmin'),
  ('getahun@afran.com', 'Getahun', 'customer_service_manager'),
  ('tamima@afranhospital.com', 'Tamima', 'customer_service_manager'),
  ('belay@afranhospital.com', 'Ato Belay', 'ceo')
) as requested(email, full_name, role)
join auth.users as auth_user
  on lower(auth_user.email) = requested.email
on conflict (id) do update
set
  email = excluded.email,
  full_name = excluded.full_name,
  role = excluded.role,
  department = excluded.department;
