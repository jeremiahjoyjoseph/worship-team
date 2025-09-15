-- Create rosters table
CREATE TABLE rosters (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255),
  month VARCHAR(50) UNIQUE NOT NULL,
  required_dates TEXT[] NOT NULL,
  notes TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for month lookup
CREATE INDEX idx_rosters_month ON rosters(month);

-- Create updated_at trigger for rosters
CREATE TRIGGER update_rosters_updated_at BEFORE UPDATE ON rosters
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
