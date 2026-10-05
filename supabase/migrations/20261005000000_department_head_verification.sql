-- Add department head verification columns to feedback_cases table
alter table public.feedback_cases
  add column if not exists department_head_checked boolean not null default false,
  add column if not exists department_head_checked_at timestamptz;

-- Update the track_case_by_reference function to include new columns
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
  responded_at timestamptz,
  department_head_checked boolean,
  department_head_checked_at timestamptz
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
    cases.responded_at,
    cases.department_head_checked,
    cases.department_head_checked_at
  from public.feedback_cases as cases
  where cases.reference = upper(trim(lookup_reference))
  limit 1
$$;
