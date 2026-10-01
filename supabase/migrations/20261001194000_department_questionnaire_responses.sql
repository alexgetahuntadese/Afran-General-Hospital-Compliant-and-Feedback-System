alter table public.feedback_cases
  add column if not exists questionnaire_version text,
  add column if not exists questionnaire_answers jsonb not null default '{}'::jsonb;
