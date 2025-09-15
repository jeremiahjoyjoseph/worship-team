-- Create worship_team_members table
CREATE TABLE worship_team_members (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  worship_team_id UUID NOT NULL REFERENCES worship_teams(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  is_md BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(worship_team_id, user_id)
);

-- Create indexes
CREATE INDEX idx_worship_team_members_worship_team_id ON worship_team_members(worship_team_id);
CREATE INDEX idx_worship_team_members_user_id ON worship_team_members(user_id);

-- Create updated_at trigger
CREATE TRIGGER update_worship_team_members_updated_at BEFORE UPDATE ON worship_team_members
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
