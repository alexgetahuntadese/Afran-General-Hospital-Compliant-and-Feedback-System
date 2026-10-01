create table if not exists public.feedback_cases (
  id text primary key,
  reference text not null unique check (reference ~ '^AGH-[A-Z0-9]{6}$'),
  kind text not null check (kind in ('complaint', 'feedback', 'compliment')),
  department text not null,
  subject text not null,
  message text not null,
  rating integer not null default 0 check (rating between 0 and 5),
  anonymous boolean not null default false,
  name text,
  email text,
  phone text,
  status text not null default 'received' check (status in ('received', 'in_review', 'resolved')),
  escalated boolean not null default false,
  submitted_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  response text,
  responded_at timestamptz
);

alter table public.feedback_cases
  add column if not exists escalated boolean not null default false,
  add column if not exists response text,
  add column if not exists responded_at timestamptz;

create index if not exists feedback_cases_submitted_at_idx on public.feedback_cases (submitted_at desc);
create index if not exists feedback_cases_department_idx on public.feedback_cases (department);
create index if not exists feedback_cases_escalated_idx on public.feedback_cases (escalated) where escalated;

create table if not exists public.staff_profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null unique,
  full_name text not null,
  role text not null check (role in ('customer_service_manager', 'department_head', 'ceo', 'staff')),
  department text,
  created_at timestamptz not null default now(),
  constraint department_head_requires_department
    check ((role = 'department_head' and department is not null) or (role <> 'department_head' and department is null))
);

create or replace function public.current_staff_role()
returns text
language sql
stable
security definer
set search_path = ''
as $$
  select profile.role
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
  select profile.department
  from public.staff_profiles as profile
  where profile.id = (select auth.uid())
$$;

alter table public.feedback_cases
  drop constraint if exists feedback_cases_kind_check,
  add constraint feedback_cases_kind_check check (kind in ('complaint', 'feedback', 'compliment')),
  drop constraint if exists feedback_cases_status_check,
  add constraint feedback_cases_status_check check (status in ('received', 'in_review', 'resolved')),
  drop constraint if exists feedback_cases_rating_check,
  add constraint feedback_cases_rating_check check (rating between 0 and 5);

alter table public.feedback_cases enable row level security;
alter table public.staff_profiles enable row level security;

revoke all on public.feedback_cases from anon, authenticated;
grant insert on public.feedback_cases to anon, authenticated;
grant select, update on public.feedback_cases to authenticated;

drop policy if exists "Anyone can submit a new case" on public.feedback_cases;
drop policy if exists "Managers can read all cases" on public.feedback_cases;
drop policy if exists "Department heads can read their department" on public.feedback_cases;
drop policy if exists "CEOs can read escalated cases only" on public.feedback_cases;
drop policy if exists "Managers and department heads can update assigned cases" on public.feedback_cases;

create policy "Anyone can submit a new case"
  on public.feedback_cases for insert
  to anon, authenticated
  with check (
    status = 'received'
    and escalated = false
    and response is null
    and responded_at is null
  );

create policy "Managers can read all cases"
  on public.feedback_cases for select
  to authenticated
  using (public.current_staff_role() = 'customer_service_manager');

create policy "Department heads can read their department"
  on public.feedback_cases for select
  to authenticated
  using (
    public.current_staff_role() = 'department_head'
    and department = public.current_staff_department()
  );

create policy "CEOs can read escalated cases only"
  on public.feedback_cases for select
  to authenticated
  using (public.current_staff_role() = 'ceo' and escalated);

create policy "Managers and department heads can update assigned cases"
  on public.feedback_cases for update
  to authenticated
  using (
    public.current_staff_role() = 'customer_service_manager'
    or (
      public.current_staff_role() = 'department_head'
      and department = public.current_staff_department()
    )
  )
  with check (
    public.current_staff_role() = 'customer_service_manager'
    or (
      public.current_staff_role() = 'department_head'
      and department = public.current_staff_department()
    )
  );

revoke all on public.staff_profiles from anon, authenticated;
grant select on public.staff_profiles to authenticated;

drop policy if exists "Staff can read their own profile" on public.staff_profiles;
drop policy if exists "Managers can read the staff directory" on public.staff_profiles;

create policy "Staff can read their own profile"
  on public.staff_profiles for select
  to authenticated
  using (id = (select auth.uid()));

create policy "Managers can read the staff directory"
  on public.staff_profiles for select
  to authenticated
  using (public.current_staff_role() = 'customer_service_manager');

create or replace function public.track_case_by_reference(lookup_reference text)
returns table (
  id text,
  reference text,
  kind text,
  department text,
  subject text,
  message text,
  rating integer,
  anonymous boolean,
  status text,
  submitted_at timestamptz,
  updated_at timestamptz,
  response text,
  responded_at timestamptz
)
language sql
stable
security definer
set search_path = ''
as $$
  select
    cases.id,
    cases.reference,
    cases.kind,
    cases.department,
    cases.subject,
    cases.message,
    cases.rating,
    cases.anonymous,
    cases.status,
    cases.submitted_at,
    cases.updated_at,
    cases.response,
    cases.responded_at
  from public.feedback_cases as cases
  where cases.reference = upper(trim(lookup_reference))
  limit 1
$$;

revoke all on function public.current_staff_role() from public, anon;
revoke all on function public.current_staff_department() from public, anon;
grant execute on function public.current_staff_role() to authenticated;
grant execute on function public.current_staff_department() to authenticated;
revoke all on function public.track_case_by_reference(text) from public;
grant execute on function public.track_case_by_reference(text) to anon, authenticated;
