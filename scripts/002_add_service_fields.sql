-- Add new fields to services table for Atlassian Statuspage and DownDetector support

-- Add description field (optional)
ALTER TABLE services ADD COLUMN IF NOT EXISTS description TEXT;

-- Add status_url field (the page users visit, e.g., https://status.teamviewer.com)
ALTER TABLE services ADD COLUMN IF NOT EXISTS status_url TEXT;

-- Add api_url field (for Atlassian: must end in /api/v2/status.json)
ALTER TABLE services ADD COLUMN IF NOT EXISTS api_url TEXT;

-- Add logo_domain field (root domain used to auto-fetch the logo)
ALTER TABLE services ADD COLUMN IF NOT EXISTS logo_domain TEXT;

-- Add status_type field (atlassian or downdetector)
ALTER TABLE services ADD COLUMN IF NOT EXISTS status_type TEXT DEFAULT 'atlassian';

-- Add display_order field for drag-to-reorder
ALTER TABLE services ADD COLUMN IF NOT EXISTS display_order INTEGER DEFAULT 0;

-- Create index for ordering
CREATE INDEX IF NOT EXISTS idx_services_display_order ON services(user_id, display_order);
