CREATE EXTENSION IF NOT EXISTS postgis;
CREATE TABLE sources (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), name text NOT NULL,
  slug text NOT NULL UNIQUE, base_url text, enabled boolean NOT NULL DEFAULT false,
  approved boolean NOT NULL DEFAULT false,
  refresh_frequency text NOT NULL DEFAULT 'weekly',
  last_sync_at timestamptz, last_sync_status text,
  attribution text, notes text
);
CREATE TABLE meetings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  source_id uuid NOT NULL REFERENCES sources(id), source_meeting_id text NOT NULL,
  fellowship text NOT NULL, name text NOT NULL,
  day_of_week integer NOT NULL CHECK (day_of_week BETWEEN 0 AND 6),
  start_time time NOT NULL, end_time time, timezone text NOT NULL,
  format text NOT NULL CHECK (format IN ('in_person','online','hybrid')),
  venue_name text, address text, city text, state char(2) NOT NULL, postal_code text,
  geo_point geography(Point,4326), online_url text, online_notes text,
  characteristics text[] NOT NULL DEFAULT '{}', source_updated_at timestamptz,
  last_synced_at timestamptz NOT NULL DEFAULT now(), active boolean NOT NULL DEFAULT true,
  raw_source_data jsonb, created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(source_id,source_meeting_id)
);
CREATE INDEX meetings_geo ON meetings USING gist(geo_point);
CREATE INDEX meetings_filters ON meetings(fellowship,day_of_week,start_time) WHERE active;
CREATE TABLE meeting_reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), meeting_id uuid NOT NULL REFERENCES meetings(id),
  reason text NOT NULL CHECK (reason IN ('meeting_closed','wrong_day','wrong_time','wrong_address','broken_online_link','wrong_type','other')),
  note text, status text NOT NULL DEFAULT 'pending' CHECK(status IN ('pending','resolved')),
  created_at timestamptz NOT NULL DEFAULT now(), resolved_at timestamptz
);
