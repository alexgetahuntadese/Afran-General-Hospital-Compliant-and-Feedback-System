-- Department heads mark cases as reviewed when they open them. The original
-- restricted update grant predates these columns, so add them explicitly.
grant update (
  department_head_checked,
  department_head_checked_at
) on public.feedback_cases to authenticated;

-- The web questionnaire uses stable question IDs (for example, `respect` and
-- `communication`), not q1/q2/q3/q4. Accept those IDs while requiring at least
-- four numeric answers for every new feedback or compliment submission.
create schema if not exists private;

create or replace function private.jsonb_object_key_count(value jsonb)
returns integer
language sql
immutable
strict
set search_path = ''
as $$
  select count(*)::integer
  from pg_catalog.jsonb_object_keys(value)
$$;

alter table public.feedback_cases
  drop constraint if exists feedback_cases_questionnaire_check,
  add constraint feedback_cases_questionnaire_check
    check (
      (
        kind = 'complaint'
        and questionnaire_version is null
        and questionnaire_answers = '{}'::jsonb
      )
      or (
        kind in ('feedback', 'compliment')
        and questionnaire_version is not null
        and jsonb_typeof(questionnaire_answers) = 'object'
        and private.jsonb_object_key_count(questionnaire_answers) >= 4
      )
    ) not valid;
