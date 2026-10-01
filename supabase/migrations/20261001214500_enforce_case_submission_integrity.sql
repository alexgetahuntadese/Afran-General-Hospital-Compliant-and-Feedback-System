-- Keep public inserts consistent even when callers bypass the web client.
alter table public.feedback_cases
  drop constraint if exists feedback_cases_audio_path_check,
  add constraint feedback_cases_audio_path_check
    check (
      audio_path is null
      or (
        kind = 'complaint'
        and audio_path ~ ('^' || reference || '/complaint\.(webm|ogg|mp4|wav)$')
      )
    ) not valid,
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
        and jsonb_object_length(questionnaire_answers) >= 4
      )
    ) not valid;
