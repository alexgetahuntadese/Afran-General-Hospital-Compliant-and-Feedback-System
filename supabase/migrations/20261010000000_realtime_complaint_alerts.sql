-- Enable live INSERT events so customer service managers can hear new complaints
-- while their dashboard is open.
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_publication WHERE pubname = 'supabase_realtime')
    AND NOT EXISTS (
      SELECT 1
      FROM pg_publication_tables
      WHERE pubname = 'supabase_realtime'
        AND schemaname = 'public'
        AND tablename = 'feedback_cases'
    ) THEN
    EXECUTE 'ALTER PUBLICATION supabase_realtime ADD TABLE public.feedback_cases';
  END IF;
END
$$;

ALTER TABLE public.feedback_cases REPLICA IDENTITY FULL;
