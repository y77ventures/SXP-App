-- ============================================================
-- SwimXP Connect — PostgreSQL Database Schema
-- Version: 1.0.0
-- Description: Full schema for the SwimXP Connect platform
--   covering users, coaches, pools, lessons, bookings,
--   reviews, wallet transactions, and compliance records.
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================
-- ENUMS
-- ============================================================

CREATE TYPE user_role AS ENUM ('Parent', 'Coach', 'SwimSchool', 'PoolHost', 'Admin');
CREATE TYPE swim_level AS ENUM ('Beginner', 'Intermediate', 'Advanced', 'Competitive');
CREATE TYPE lesson_status AS ENUM ('Scheduled', 'Confirmed', 'Completed', 'Cancelled', 'Makeup Requested');
CREATE TYPE booking_status AS ENUM ('Pending', 'Confirmed', 'Cancelled', 'Refunded');
CREATE TYPE transaction_type AS ENUM ('credit', 'debit', 'payout', 'refund', 'platform_fee');
CREATE TYPE transaction_status AS ENUM ('pending', 'completed', 'failed', 'reversed');
CREATE TYPE verification_status AS ENUM ('Pending', 'Verified', 'Rejected', 'Expired');
CREATE TYPE coach_speciality AS ENUM (
  'Toddlers', 'Children', 'Adult Beginners', 'Competitive',
  'Water Confidence', 'Special Needs', 'Stroke Correction'
);

-- ============================================================
-- USERS
-- ============================================================

CREATE TABLE users (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email         TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  full_name     TEXT NOT NULL,
  phone         TEXT,
  photo_url     TEXT,
  role          user_role NOT NULL DEFAULT 'Parent',
  is_verified   BOOLEAN NOT NULL DEFAULT FALSE,
  is_active     BOOLEAN NOT NULL DEFAULT TRUE,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);

-- ============================================================
-- CHILDREN (linked to Parent users)
-- ============================================================

CREATE TABLE children (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  parent_id   UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name        TEXT NOT NULL,
  date_of_birth DATE NOT NULL,
  swim_level  swim_level NOT NULL DEFAULT 'Beginner',
  goals       TEXT[],
  notes       TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_children_parent ON children(parent_id);

-- ============================================================
-- COACHES
-- ============================================================

CREATE TABLE coaches (
  id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id             UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  bio                 TEXT,
  experience_years    INTEGER NOT NULL DEFAULT 0,
  hourly_rate         NUMERIC(10, 2) NOT NULL,
  specialities        coach_speciality[],
  certifications      TEXT[],
  languages           TEXT[],
  location            TEXT,
  latitude            DOUBLE PRECISION,
  longitude           DOUBLE PRECISION,
  intro_video_url     TEXT,
  rating              NUMERIC(3, 2) DEFAULT 0,
  review_count        INTEGER DEFAULT 0,
  student_count       INTEGER DEFAULT 0,
  verification_status verification_status NOT NULL DEFAULT 'Pending',
  verified_at         TIMESTAMPTZ,
  verified_by         UUID REFERENCES users(id),
  is_active           BOOLEAN NOT NULL DEFAULT TRUE,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_coaches_user ON coaches(user_id);
CREATE INDEX idx_coaches_location ON coaches(latitude, longitude);
CREATE INDEX idx_coaches_verification ON coaches(verification_status);

-- Coach availability slots
CREATE TABLE coach_availability (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  coach_id    UUID NOT NULL REFERENCES coaches(id) ON DELETE CASCADE,
  day_of_week SMALLINT NOT NULL CHECK (day_of_week BETWEEN 0 AND 6), -- 0=Sun, 6=Sat
  start_time  TIME NOT NULL,
  end_time    TIME NOT NULL,
  is_active   BOOLEAN NOT NULL DEFAULT TRUE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_coach_availability_coach ON coach_availability(coach_id);

-- ============================================================
-- POOLS
-- ============================================================

CREATE TABLE pools (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  host_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name            TEXT NOT NULL,
  address         TEXT NOT NULL,
  latitude        DOUBLE PRECISION,
  longitude       DOUBLE PRECISION,
  description     TEXT,
  length_metres   NUMERIC(5, 1),
  lanes           INTEGER,
  capacity        INTEGER,
  rental_rate     NUMERIC(10, 2) NOT NULL,
  features        TEXT[],
  image_urls      TEXT[],
  rating          NUMERIC(3, 2) DEFAULT 0,
  review_count    INTEGER DEFAULT 0,
  is_active       BOOLEAN NOT NULL DEFAULT TRUE,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_pools_host ON pools(host_id);
CREATE INDEX idx_pools_location ON pools(latitude, longitude);

-- Pool availability slots
CREATE TABLE pool_availability (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  pool_id     UUID NOT NULL REFERENCES pools(id) ON DELETE CASCADE,
  day_of_week SMALLINT NOT NULL CHECK (day_of_week BETWEEN 0 AND 6),
  start_time  TIME NOT NULL,
  end_time    TIME NOT NULL,
  is_active   BOOLEAN NOT NULL DEFAULT TRUE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_pool_availability_pool ON pool_availability(pool_id);

-- ============================================================
-- BOOKINGS
-- ============================================================

CREATE TABLE bookings (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  parent_id       UUID NOT NULL REFERENCES users(id),
  child_id        UUID NOT NULL REFERENCES children(id),
  coach_id        UUID NOT NULL REFERENCES coaches(id),
  pool_id         UUID NOT NULL REFERENCES pools(id),
  scheduled_at    TIMESTAMPTZ NOT NULL,
  duration_mins   INTEGER NOT NULL DEFAULT 45,
  status          booking_status NOT NULL DEFAULT 'Pending',
  total_amount    NUMERIC(10, 2) NOT NULL,
  coach_amount    NUMERIC(10, 2) NOT NULL,
  pool_amount     NUMERIC(10, 2) NOT NULL,
  platform_fee    NUMERIC(10, 2) NOT NULL,
  notes           TEXT,
  cancelled_at    TIMESTAMPTZ,
  cancel_reason   TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_bookings_parent ON bookings(parent_id);
CREATE INDEX idx_bookings_coach ON bookings(coach_id);
CREATE INDEX idx_bookings_pool ON bookings(pool_id);
CREATE INDEX idx_bookings_scheduled ON bookings(scheduled_at);
CREATE INDEX idx_bookings_status ON bookings(status);

-- ============================================================
-- LESSONS (confirmed/completed bookings with lesson details)
-- ============================================================

CREATE TABLE lessons (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_id      UUID UNIQUE NOT NULL REFERENCES bookings(id),
  swim_level      swim_level,
  status          lesson_status NOT NULL DEFAULT 'Scheduled',
  coach_notes     TEXT,
  parent_notes    TEXT,
  makeup_for      UUID REFERENCES lessons(id), -- NULL unless this is a makeup lesson
  makeup_reason   TEXT,
  completed_at    TIMESTAMPTZ,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_lessons_booking ON lessons(booking_id);
CREATE INDEX idx_lessons_status ON lessons(status);
CREATE INDEX idx_lessons_makeup ON lessons(makeup_for);

-- ============================================================
-- REVIEWS
-- ============================================================

CREATE TABLE reviews (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  lesson_id   UUID NOT NULL REFERENCES lessons(id),
  reviewer_id UUID NOT NULL REFERENCES users(id),
  target_id   UUID NOT NULL REFERENCES users(id), -- coach or pool host
  rating      SMALLINT NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment     TEXT,
  is_public   BOOLEAN NOT NULL DEFAULT TRUE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_reviews_lesson ON reviews(lesson_id);
CREATE INDEX idx_reviews_target ON reviews(target_id);

-- ============================================================
-- WALLET & TRANSACTIONS
-- ============================================================

CREATE TABLE wallets (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  balance     NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
  currency    CHAR(3) NOT NULL DEFAULT 'SGD',
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_wallets_user ON wallets(user_id);

CREATE TABLE wallet_transactions (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  wallet_id       UUID NOT NULL REFERENCES wallets(id),
  booking_id      UUID REFERENCES bookings(id),
  type            transaction_type NOT NULL,
  amount          NUMERIC(10, 2) NOT NULL,
  balance_after   NUMERIC(12, 2) NOT NULL,
  description     TEXT NOT NULL,
  reference       TEXT,           -- external payment reference (Stripe charge ID, etc.)
  status          transaction_status NOT NULL DEFAULT 'pending',
  processed_at    TIMESTAMPTZ,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_wallet_tx_wallet ON wallet_transactions(wallet_id);
CREATE INDEX idx_wallet_tx_booking ON wallet_transactions(booking_id);
CREATE INDEX idx_wallet_tx_status ON wallet_transactions(status);

-- ============================================================
-- COMPLIANCE & WAIVERS
-- ============================================================

CREATE TABLE waivers (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  parent_id       UUID NOT NULL REFERENCES users(id),
  child_id        UUID NOT NULL REFERENCES children(id),
  waiver_version  TEXT NOT NULL DEFAULT '1.0',
  signed_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  ip_address      INET,
  user_agent      TEXT
);

CREATE INDEX idx_waivers_parent ON waivers(parent_id);
CREATE INDEX idx_waivers_child ON waivers(child_id);

CREATE TABLE coach_certifications (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  coach_id        UUID NOT NULL REFERENCES coaches(id) ON DELETE CASCADE,
  name            TEXT NOT NULL,
  issuing_body    TEXT,
  issued_date     DATE,
  expiry_date     DATE,
  document_url    TEXT,
  verified        BOOLEAN NOT NULL DEFAULT FALSE,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_coach_certs_coach ON coach_certifications(coach_id);
CREATE INDEX idx_coach_certs_expiry ON coach_certifications(expiry_date);

CREATE TABLE background_checks (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  coach_id        UUID UNIQUE NOT NULL REFERENCES coaches(id) ON DELETE CASCADE,
  provider        TEXT,
  reference_id    TEXT,
  status          verification_status NOT NULL DEFAULT 'Pending',
  checked_at      TIMESTAMPTZ,
  expires_at      TIMESTAMPTZ,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- COACH–PARENT MATCHES (saved/liked from swipe flow)
-- ============================================================

CREATE TABLE coach_matches (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  parent_id   UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  coach_id    UUID NOT NULL REFERENCES coaches(id) ON DELETE CASCADE,
  match_score SMALLINT CHECK (match_score BETWEEN 0 AND 100),
  liked       BOOLEAN NOT NULL DEFAULT FALSE,
  saved       BOOLEAN NOT NULL DEFAULT FALSE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (parent_id, coach_id)
);

CREATE INDEX idx_matches_parent ON coach_matches(parent_id);
CREATE INDEX idx_matches_coach ON coach_matches(coach_id);

-- ============================================================
-- NOTIFICATIONS
-- ============================================================

CREATE TABLE notifications (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title       TEXT NOT NULL,
  body        TEXT NOT NULL,
  type        TEXT NOT NULL,  -- e.g. 'lesson_reminder', 'booking_confirmed', 'review_received'
  data        JSONB,
  is_read     BOOLEAN NOT NULL DEFAULT FALSE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_unread ON notifications(user_id, is_read) WHERE is_read = FALSE;

-- ============================================================
-- UPDATED_AT TRIGGER (auto-update timestamps)
-- ============================================================

CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_users_updated_at         BEFORE UPDATE ON users         FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER trg_children_updated_at      BEFORE UPDATE ON children      FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER trg_coaches_updated_at       BEFORE UPDATE ON coaches       FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER trg_pools_updated_at         BEFORE UPDATE ON pools         FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER trg_bookings_updated_at      BEFORE UPDATE ON bookings      FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER trg_lessons_updated_at       BEFORE UPDATE ON lessons       FOR EACH ROW EXECUTE FUNCTION set_updated_at();
