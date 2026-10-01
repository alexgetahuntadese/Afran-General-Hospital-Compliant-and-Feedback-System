-- Staff may update case workflow fields, but not submitted identity/content fields.
revoke update on public.feedback_cases from authenticated;

grant update (
  status,
  escalated,
  response,
  responded_at,
  updated_at
) on public.feedback_cases to authenticated;
