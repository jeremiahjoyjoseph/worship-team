-- Create users table
CREATE TABLE users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  first_name VARCHAR(255) NOT NULL,
  middle_name VARCHAR(255),
  last_name VARCHAR(255),
  full_name VARCHAR(255),
  nickname VARCHAR(255),
  username VARCHAR(255) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(10) NOT NULL CHECK (length(phone) = 10),
  role VARCHAR(50) NOT NULL DEFAULT 'guest' CHECK (role IN ('admin', 'worship-pastor', 'worship-leader', 'worship-team-member', 'media-team', 'sound-team', 'guest')),
  last_login_date TIMESTAMP WITH TIME ZONE,
  wt_role_primary VARCHAR(50) CHECK (wt_role_primary IN ('vocals', 'drums', 'keys', 'acoustic', 'bass', 'electric')),
  wt_role_secondary VARCHAR(50) CHECK (wt_role_secondary IN ('vocals', 'drums', 'keys', 'acoustic', 'bass', 'electric', '')),
  wt_role_spare VARCHAR(50) CHECK (wt_role_spare IN ('vocals', 'drums', 'keys', 'acoustic', 'bass', 'electric', '')),
  all_band_roles BOOLEAN DEFAULT FALSE,
  gender VARCHAR(10) NOT NULL CHECK (gender IN ('male', 'female')),
  dob VARCHAR(255),
  md BOOLEAN DEFAULT FALSE,
  status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  location_primary VARCHAR(20) CHECK (location_primary IN ('central', 'north', 'south', 'east', 'west')),
  location_secondary VARCHAR(20) CHECK (location_secondary IN ('central', 'north', 'south', 'east', 'west', '')),
  location_spare VARCHAR(20) CHECK (location_spare IN ('central', 'north', 'south', 'east', 'west', '')),
  all_locations BOOLEAN DEFAULT FALSE,
  slug VARCHAR(255),
  reset_password_token VARCHAR(255),
  reset_password_expire TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_status ON users(status);
CREATE INDEX idx_users_location_primary ON users(location_primary);

-- Add constraints for worship team members
ALTER TABLE users ADD CONSTRAINT check_worship_team_roles 
  CHECK (
    (role IN ('worship-pastor', 'worship-leader', 'worship-team-member') AND wt_role_primary IS NOT NULL AND location_primary IS NOT NULL) OR
    (role NOT IN ('worship-pastor', 'worship-leader', 'worship-team-member'))
  );

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
