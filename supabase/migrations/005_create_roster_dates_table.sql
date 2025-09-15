-- Create roster_dates table
CREATE TABLE roster_dates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  roster_location_id UUID NOT NULL REFERENCES roster_locations(id) ON DELETE CASCADE,
  date VARCHAR(50) NOT NULL, -- Sunday date
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(roster_location_id, date)
);

-- Create indexes
CREATE INDEX idx_roster_dates_roster_location_id ON roster_dates(roster_location_id);
CREATE INDEX idx_roster_dates_date ON roster_dates(date);

-- Create updated_at trigger
CREATE TRIGGER update_roster_dates_updated_at BEFORE UPDATE ON roster_dates
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
