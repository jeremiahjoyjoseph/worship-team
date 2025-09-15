-- Create roster_locations table
CREATE TABLE roster_locations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  roster_id UUID NOT NULL REFERENCES rosters(id) ON DELETE CASCADE,
  location VARCHAR(20) NOT NULL CHECK (location IN ('central', 'north', 'south', 'east', 'west')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(roster_id, location)
);

-- Create indexes
CREATE INDEX idx_roster_locations_roster_id ON roster_locations(roster_id);
CREATE INDEX idx_roster_locations_location ON roster_locations(location);

-- Create updated_at trigger
CREATE TRIGGER update_roster_locations_updated_at BEFORE UPDATE ON roster_locations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
