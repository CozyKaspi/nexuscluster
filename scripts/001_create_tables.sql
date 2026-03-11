-- NexusCluster Database Schema
-- This uses Clerk for auth, so user_id is the Clerk user ID (string)

-- User settings table for wallpaper and preferences
CREATE TABLE IF NOT EXISTS user_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL UNIQUE,
  wallpaper_url TEXT,
  refresh_interval INTEGER DEFAULT 30,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Services table for user-configured service monitoring
CREATE TABLE IF NOT EXISTS services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  name TEXT NOT NULL,
  url TEXT NOT NULL,
  category TEXT DEFAULT 'Other',
  icon TEXT,
  status TEXT DEFAULT 'unknown',
  latency INTEGER,
  last_checked TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for faster lookups
CREATE INDEX IF NOT EXISTS idx_services_user_id ON services(user_id);
CREATE INDEX IF NOT EXISTS idx_user_settings_user_id ON user_settings(user_id);

-- Enable Row Level Security
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_settings
-- Since we use Clerk (not Supabase Auth), we use service role for server-side operations
-- The API routes will enforce user_id checks

DROP POLICY IF EXISTS "Users can view own settings" ON user_settings;
CREATE POLICY "Users can view own settings" ON user_settings
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can insert own settings" ON user_settings;
CREATE POLICY "Users can insert own settings" ON user_settings
  FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Users can update own settings" ON user_settings;
CREATE POLICY "Users can update own settings" ON user_settings
  FOR UPDATE USING (true);

-- RLS Policies for services
DROP POLICY IF EXISTS "Users can view own services" ON services;
CREATE POLICY "Users can view own services" ON services
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can insert own services" ON services;
CREATE POLICY "Users can insert own services" ON services
  FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Users can update own services" ON services;
CREATE POLICY "Users can update own services" ON services
  FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Users can delete own services" ON services;
CREATE POLICY "Users can delete own services" ON services
  FOR DELETE USING (true);
