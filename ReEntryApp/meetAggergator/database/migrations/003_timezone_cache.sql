CREATE TABLE IF NOT EXISTS timezone_location_cache (
  cache_key text PRIMARY KEY,
  timezone text NOT NULL,
  method text NOT NULL,
  resolved_at timestamptz NOT NULL DEFAULT now()
);
