-- Create worship_teams table
CREATE TABLE worship_teams (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  roster_date_id UUID NOT NULL REFERENCES roster_dates(id) ON DELETE CASCADE,
  band_role VARCHAR(50) NOT NULL CHECK (band_role IN ('vocals', 'drums', 'keys', 'acoustic', 'bass', 'electric')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(roster_date_id, band_role)
);

-- Create indexes
CREATE INDEX idx_worship_teams_roster_date_id ON worship_teams(roster_date_id);
CREATE INDEX idx_worship_teams_band_role ON worship_teams(band_role);

-- Create updated_at trigger
CREATE TRIGGER update_worship_teams_updated_at BEFORE UPDATE ON worship_teams
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
