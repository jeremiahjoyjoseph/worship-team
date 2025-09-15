-- Insert sample users into the database
-- Run this script in your Supabase SQL editor

INSERT INTO users (
  first_name,
  last_name,
  full_name,
  username,
  email,
  phone,
  role,
  gender,
  wt_role_primary,
  location_primary,
  status
) VALUES 
(
  'John',
  'Smith',
  'John Smith',
  'john.smith',
  'john.smith@example.com',
  '5551234567',
  'worship-leader',
  'male',
  'vocals',
  'central',
  'active'
),
(
  'Sarah',
  'Johnson',
  'Sarah Johnson',
  'sarah.johnson',
  'sarah.johnson@example.com',
  '5552345678',
  'worship-team-member',
  'female',
  'keys',
  'north',
  'active'
),
(
  'Mike',
  'Davis',
  'Mike Davis',
  'mike.davis',
  'mike.davis@example.com',
  '5553456789',
  'worship-team-member',
  'male',
  'drums',
  'south',
  'active'
),
(
  'Emily',
  'Wilson',
  'Emily Wilson',
  'emily.wilson',
  'emily.wilson@example.com',
  '5554567890',
  'worship-team-member',
  'female',
  'acoustic',
  'east',
  'active'
),
(
  'David',
  'Brown',
  'David Brown',
  'david.brown',
  'david.brown@example.com',
  '5555678901',
  'worship-team-member',
  'male',
  'bass',
  'west',
  'active'
),
(
  'Lisa',
  'Garcia',
  'Lisa Garcia',
  'lisa.garcia',
  'lisa.garcia@example.com',
  '5556789012',
  'media-team',
  'female',
  NULL,
  NULL,
  'active'
),
(
  'Tom',
  'Martinez',
  'Tom Martinez',
  'tom.martinez',
  'tom.martinez@example.com',
  '5557890123',
  'sound-team',
  'male',
  NULL,
  NULL,
  'active'
),
(
  'Pastor',
  'Anderson',
  'Pastor Anderson',
  'pastor.anderson',
  'pastor.anderson@example.com',
  '5558901234',
  'worship-pastor',
  'male',
  'vocals',
  'central',
  'active'
),
(
  'Jennifer',
  'Taylor',
  'Jennifer Taylor',
  'jennifer.taylor',
  'jennifer.taylor@example.com',
  '5559012345',
  'worship-team-member',
  'female',
  'electric',
  'north',
  'active'
),
(
  'Admin',
  'User',
  'Admin User',
  'admin.user',
  'admin@example.com',
  '5550123456',
  'admin',
  'male',
  NULL,
  NULL,
  'active'
);

-- Verify the insertions
SELECT 
  id,
  first_name,
  last_name,
  username,
  email,
  role,
  wt_role_primary,
  location_primary,
  status,
  created_at
FROM users 
ORDER BY created_at DESC;
