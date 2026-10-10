-- Store device tokens for push notifications
CREATE TABLE IF NOT EXISTS device_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  case_reference TEXT REFERENCES feedback_cases(reference) ON DELETE CASCADE,
  token TEXT NOT NULL,
  platform TEXT NOT NULL, -- 'web', 'ios', 'android'
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(token, case_reference)
);

-- Enable RLS
ALTER TABLE device_tokens ENABLE ROW LEVEL SECURITY;

-- Allow users to manage their own device tokens
CREATE POLICY "Users can insert their own device tokens"
  ON device_tokens FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Allow users to view their own device tokens
CREATE POLICY "Users can view their own device tokens"
  ON device_tokens FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Allow users to delete their own device tokens
CREATE POLICY "Users can delete their own device tokens"
  ON device_tokens FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Allow service role to manage all device tokens (for sending notifications)
CREATE POLICY "Service role can manage device tokens"
  ON device_tokens FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Index for faster lookups
CREATE INDEX idx_device_tokens_case_reference ON device_tokens(case_reference);
CREATE INDEX idx_device_tokens_user_id ON device_tokens(user_id);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_device_tokens_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update updated_at
CREATE TRIGGER device_tokens_updated_at
  BEFORE UPDATE ON device_tokens
  FOR EACH ROW
  EXECUTE FUNCTION update_device_tokens_updated_at();
