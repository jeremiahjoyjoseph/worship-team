-- Create event_dates table
CREATE TABLE event_dates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  roster_id UUID NOT NULL REFERENCES rosters(id) ON DELETE CASCADE,
  start_date VARCHAR(50) NOT NULL,
  end_date VARCHAR(50) NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_event_dates_roster_id ON event_dates(roster_id);

-- Create updated_at trigger
CREATE TRIGGER update_event_dates_updated_at BEFORE UPDATE ON event_dates
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
