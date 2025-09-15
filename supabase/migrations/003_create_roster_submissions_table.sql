-- Create roster_submissions table
CREATE TABLE roster_submissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  roster_id UUID NOT NULL REFERENCES rosters(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  submitted_dates TEXT[] NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(roster_id, user_id)
);

-- Create indexes
CREATE INDEX idx_roster_submissions_roster_id ON roster_submissions(roster_id);
CREATE INDEX idx_roster_submissions_user_id ON roster_submissions(user_id);

-- Create updated_at trigger
CREATE TRIGGER update_roster_submissions_updated_at BEFORE UPDATE ON roster_submissions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
