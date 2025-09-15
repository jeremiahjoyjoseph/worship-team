# Migration from MongoDB to Supabase

This document outlines the migration from MongoDB to Supabase for the worship team application.

## Changes Made

### 1. Database Schema

- Created PostgreSQL tables in Supabase to replace MongoDB collections
- Migrated from MongoDB's document structure to relational database structure
- Added proper foreign key relationships and constraints

### 2. API Routes Updated

- `/api/user/route.ts` - Updated to use Supabase user service
- `/api/user/[userId]/route.ts` - Updated to use Supabase user service
- `/api/roster/route.ts` - Updated to use Supabase roster service
- `/api/roster/[userId]/route.ts` - Updated to use Supabase for submissions

### 3. Data Models

- Updated TypeScript interfaces to match Supabase table structure
- Changed field names from camelCase to snake_case to match PostgreSQL conventions
- Removed MongoDB-specific types and dependencies

### 4. Dependencies

- Removed: `mongoose`, `@types/bcryptjs`, `bcryptjs`
- Added: `@supabase/supabase-js`

## Environment Variables Required

Add these to your `.env.local` file:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

**Note:** For build purposes, dummy values are used if these environment variables are not set. Make sure to set the actual Supabase credentials before deploying to production.

## Database Setup

1. Create a new Supabase project
2. Run the migration files in the `supabase/migrations/` directory in order:
   - `001_create_users_table.sql`
   - `002_create_rosters_table.sql`
   - `003_create_roster_submissions_table.sql`
   - `004_create_roster_locations_table.sql`
   - `005_create_roster_dates_table.sql`
   - `006_create_worship_teams_table.sql`
   - `007_create_worship_team_members_table.sql`
   - `008_create_event_dates_table.sql`

## Key Differences

### Field Naming

- MongoDB: `firstName` → Supabase: `first_name`
- MongoDB: `createdAt` → Supabase: `created_at`
- MongoDB: `wtRolePrimary` → Supabase: `wt_role_primary`

### Data Structure

- MongoDB used embedded documents for complex data
- Supabase uses separate tables with foreign key relationships
- Roster submissions are now in a separate `roster_submissions` table
- Worship team data is normalized across multiple tables

### ID Format

- MongoDB: ObjectId strings
- Supabase: UUID strings

## Migration Notes

- All existing functionality should work the same way
- The API responses maintain the same structure for backward compatibility
- Database queries are now handled through Supabase's JavaScript client
- Error handling has been updated to work with Supabase's error format
