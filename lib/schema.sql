

CREATE TABLE IF NOT EXISTS bookings (
  id             TEXT PRIMARY KEY,
  service_slug   TEXT NOT NULL,
  service_name   TEXT NOT NULL,
  price          INTEGER NOT NULL,
  date           TEXT NOT NULL,
  time           TEXT NOT NULL,
name           TEXT NOT NULL,
  phone          TEXT NOT NULL,
  email          TEXT NOT NULL,
  ig_username    TEXT,
  notes          TEXT,
  inspo_image_url TEXT,
  status         TEXT NOT NULL DEFAULT 'pending',
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE bookings ADD COLUMN IF NOT EXISTS ig_username TEXT;

CREATE TABLE IF NOT EXISTS gallery_posts (
  id            TEXT PRIMARY KEY,
  title         TEXT NOT NULL,
  image_url     TEXT NOT NULL,
  description   TEXT,
  service_slug  TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS messages (
  id          TEXT PRIMARY KEY,
  name        TEXT NOT NULL,
  email       TEXT NOT NULL,
  message     TEXT NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS blocked_dates (
  id          TEXT PRIMARY KEY,
  date        TEXT NOT NULL UNIQUE,
  reason      TEXT NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_bookings_date ON bookings (date);
CREATE INDEX IF NOT EXISTS idx_gallery_created_at ON gallery_posts (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages (created_at DESC);
