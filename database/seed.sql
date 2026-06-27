-- ============================================================
-- SwimXP Connect — Database Seed Data
-- Version: 1.0.0
-- Description: Representative seed data for development and
--   staging environments. Mirrors the frontend mock data in
--   client/src/lib/mockData.ts.
-- WARNING: Do NOT run in production.
-- ============================================================

-- ============================================================
-- USERS
-- ============================================================

INSERT INTO users (id, email, password_hash, full_name, phone, role, is_verified) VALUES
  -- Parents
  ('00000000-0000-0000-0000-000000000001', 'jennifer.lim@email.com',  crypt('password123', gen_salt('bf')), 'Jennifer Lim',   '+65 9123 4567', 'Parent',     TRUE),
  ('00000000-0000-0000-0000-000000000002', 'david.tan@email.com',     crypt('password123', gen_salt('bf')), 'David Tan',      '+65 9234 5678', 'Parent',     TRUE),
  ('00000000-0000-0000-0000-000000000003', 'priya.kumar@email.com',   crypt('password123', gen_salt('bf')), 'Priya Kumar',    '+65 9345 6789', 'Parent',     TRUE),
  -- Coaches
  ('00000000-0000-0000-0001-000000000001', 'sarah.chen@email.com',    crypt('password123', gen_salt('bf')), 'Sarah Chen',     '+65 9456 7890', 'Coach',      TRUE),
  ('00000000-0000-0000-0001-000000000002', 'marcus.tan@email.com',    crypt('password123', gen_salt('bf')), 'Marcus Tan',     '+65 9567 8901', 'Coach',      TRUE),
  ('00000000-0000-0000-0001-000000000003', 'priya.nair@email.com',    crypt('password123', gen_salt('bf')), 'Priya Nair',     '+65 9678 9012', 'Coach',      TRUE),
  ('00000000-0000-0000-0001-000000000004', 'james.lim@email.com',     crypt('password123', gen_salt('bf')), 'James Lim',      '+65 9789 0123', 'Coach',      TRUE),
  ('00000000-0000-0000-0001-000000000005', 'aisha.rahman@email.com',  crypt('password123', gen_salt('bf')), 'Aisha Rahman',   '+65 9890 1234', 'Coach',      FALSE),
  -- Pool Hosts
  ('00000000-0000-0000-0002-000000000001', 'parc.host@email.com',     crypt('password123', gen_salt('bf')), 'The Parc Host',  '+65 6123 4567', 'PoolHost',   TRUE),
  ('00000000-0000-0000-0002-000000000002', 'clementi.host@email.com', crypt('password123', gen_salt('bf')), 'Clementi Host',  '+65 6234 5678', 'PoolHost',   TRUE),
  -- Swim School
  ('00000000-0000-0000-0003-000000000001', 'admin@swimxp.sg',         crypt('adminpass!', gen_salt('bf')),  'SwimXP Admin',   '+65 6000 0000', 'Admin',      TRUE);

-- ============================================================
-- CHILDREN
-- ============================================================

INSERT INTO children (id, parent_id, name, date_of_birth, swim_level, goals) VALUES
  ('00000000-0000-0001-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'Ethan Lim',   '2018-03-15', 'Beginner',     ARRAY['Water confidence', 'Learn freestyle']),
  ('00000000-0000-0001-0000-000000000002', '00000000-0000-0000-0000-000000000001', 'Mia Lim',     '2020-07-22', 'Beginner',     ARRAY['Overcome water fear']),
  ('00000000-0000-0001-0000-000000000003', '00000000-0000-0000-0000-000000000002', 'Sophia Tan',  '2017-11-08', 'Intermediate', ARRAY['Improve backstroke', 'Build endurance']),
  ('00000000-0000-0001-0000-000000000004', '00000000-0000-0000-0000-000000000003', 'Arjun Kumar', '2016-05-30', 'Advanced',     ARRAY['Competitive training', 'Butterfly stroke']);

-- ============================================================
-- COACHES
-- ============================================================

INSERT INTO coaches (id, user_id, bio, experience_years, hourly_rate, specialities, certifications, languages, location, latitude, longitude, rating, review_count, student_count, verification_status, verified_at) VALUES
  ('10000000-0000-0000-0000-000000000001', '00000000-0000-0000-0001-000000000001',
   'Passionate about helping children overcome water fear. I use a gentle, play-based approach that builds confidence naturally.',
   8, 85.00, ARRAY['Children','Water Confidence','Toddlers']::coach_speciality[],
   ARRAY['SwimSafer Level 3','CPR/AED Certified','AUSTSWIM Teacher'],
   ARRAY['English','Mandarin'], 'Buona Vista', 1.3069, 103.7900,
   4.9, 127, 24, 'Verified', NOW() - INTERVAL '6 months'),

  ('10000000-0000-0000-0000-000000000002', '00000000-0000-0000-0001-000000000002',
   'Former national swimmer with 12 years of coaching experience. Specialise in competitive training and stroke correction.',
   12, 95.00, ARRAY['Competitive','Stroke Correction']::coach_speciality[],
   ARRAY['ASCA Level 3','SwimSafer Level 3','First Aid Certified'],
   ARRAY['English','Malay'], 'Clementi', 1.3162, 103.7649,
   4.8, 89, 31, 'Verified', NOW() - INTERVAL '8 months'),

  ('10000000-0000-0000-0000-000000000003', '00000000-0000-0000-0001-000000000003',
   'Specialist in adult beginners and water confidence. Patient, encouraging, and results-driven.',
   6, 75.00, ARRAY['Adult Beginners','Water Confidence']::coach_speciality[],
   ARRAY['SwimSafer Level 2','CPR Certified'],
   ARRAY['English','Tamil'], 'Jurong East', 1.3329, 103.7436,
   4.9, 203, 18, 'Verified', NOW() - INTERVAL '4 months'),

  ('10000000-0000-0000-0000-000000000004', '00000000-0000-0000-0001-000000000004',
   'Fun and energetic coach who loves working with young children. Creating positive first experiences in the water.',
   4, 70.00, ARRAY['Children','Toddlers']::coach_speciality[],
   ARRAY['SwimSafer Level 2','Paediatric First Aid'],
   ARRAY['English','Mandarin'], 'Holland Village', 1.3110, 103.7960,
   4.7, 64, 15, 'Verified', NOW() - INTERVAL '3 months'),

  ('10000000-0000-0000-0000-000000000005', '00000000-0000-0000-0001-000000000005',
   'Experienced with children of all abilities including those with special needs. Gentle and adaptive teaching style.',
   9, 80.00, ARRAY['Children','Special Needs','Water Confidence']::coach_speciality[],
   ARRAY['SwimSafer Level 3','Special Needs Swimming Cert','CPR/AED'],
   ARRAY['English','Malay'], 'Queenstown', 1.2966, 103.8006,
   4.8, 156, 22, 'Pending', NULL);

-- ============================================================
-- COACH AVAILABILITY
-- ============================================================

INSERT INTO coach_availability (coach_id, day_of_week, start_time, end_time) VALUES
  -- Sarah Chen: Mon, Wed, Fri, Sat, Sun
  ('10000000-0000-0000-0000-000000000001', 1, '09:00', '17:00'),
  ('10000000-0000-0000-0000-000000000001', 3, '09:00', '17:00'),
  ('10000000-0000-0000-0000-000000000001', 5, '09:00', '17:00'),
  ('10000000-0000-0000-0000-000000000001', 6, '08:00', '18:00'),
  ('10000000-0000-0000-0000-000000000001', 0, '08:00', '16:00'),
  -- Marcus Tan: Tue, Thu, Sat, Sun
  ('10000000-0000-0000-0000-000000000002', 2, '10:00', '18:00'),
  ('10000000-0000-0000-0000-000000000002', 4, '10:00', '18:00'),
  ('10000000-0000-0000-0000-000000000002', 6, '07:00', '19:00'),
  ('10000000-0000-0000-0000-000000000002', 0, '07:00', '17:00');

-- ============================================================
-- POOLS
-- ============================================================

INSERT INTO pools (id, host_id, name, address, latitude, longitude, description, length_metres, lanes, capacity, rental_rate, features, rating) VALUES
  ('20000000-0000-0000-0000-000000000001', '00000000-0000-0000-0002-000000000001',
   'The Parc Condo Pool', '1 Rochester Park, Singapore 139212',
   1.3069, 103.7900,
   'Pristine 25m heated pool in a lush condo setting. Ideal for lessons with young children.',
   25, 4, 20, 45.00, ARRAY['Heated','25m Lane','Shallow End','Changing Rooms','Parking'], 4.8),

  ('20000000-0000-0000-0000-000000000002', '00000000-0000-0000-0002-000000000002',
   'Clementi Crest Pool', '450 Clementi Ave 3, Singapore 129908',
   1.3162, 103.7649,
   'Well-maintained 21m pool with shaded seating and easy MRT access.',
   21, 3, 15, 35.00, ARRAY['21m Pool','Shaded','Changing Rooms','MRT Access'], 4.6);

-- ============================================================
-- WALLETS
-- ============================================================

INSERT INTO wallets (user_id, balance) VALUES
  ('00000000-0000-0000-0000-000000000001', 247.50),
  ('00000000-0000-0000-0000-000000000002', 120.00),
  ('00000000-0000-0000-0001-000000000001', 1240.00),
  ('00000000-0000-0000-0001-000000000002', 950.00);

-- ============================================================
-- BOOKINGS
-- ============================================================

INSERT INTO bookings (id, parent_id, child_id, coach_id, pool_id, scheduled_at, duration_mins, status, total_amount, coach_amount, pool_amount, platform_fee) VALUES
  ('30000000-0000-0000-0000-000000000001',
   '00000000-0000-0000-0000-000000000001',
   '00000000-0000-0001-0000-000000000001',
   '10000000-0000-0000-0000-000000000001',
   '20000000-0000-0000-0000-000000000001',
   '2026-06-23 09:00:00+08', 45, 'Confirmed',
   107.50, 63.75, 22.50, 21.25),

  ('30000000-0000-0000-0000-000000000002',
   '00000000-0000-0000-0000-000000000002',
   '00000000-0000-0001-0000-000000000003',
   '10000000-0000-0000-0000-000000000002',
   '20000000-0000-0000-0000-000000000002',
   '2026-06-23 10:00:00+08', 45, 'Scheduled',
   113.75, 71.25, 26.25, 16.25);

-- ============================================================
-- LESSONS
-- ============================================================

INSERT INTO lessons (booking_id, swim_level, status) VALUES
  ('30000000-0000-0000-0000-000000000001', 'Beginner',      'Confirmed'),
  ('30000000-0000-0000-0000-000000000002', 'Intermediate',  'Scheduled');

-- ============================================================
-- WAIVERS
-- ============================================================

INSERT INTO waivers (parent_id, child_id, waiver_version, ip_address) VALUES
  ('00000000-0000-0000-0000-000000000001', '00000000-0000-0001-0000-000000000001', '1.0', '192.168.1.1'),
  ('00000000-0000-0000-0000-000000000001', '00000000-0000-0001-0000-000000000002', '1.0', '192.168.1.1'),
  ('00000000-0000-0000-0000-000000000002', '00000000-0000-0001-0000-000000000003', '1.0', '192.168.1.2');

-- ============================================================
-- WALLET TRANSACTIONS
-- ============================================================

INSERT INTO wallet_transactions (wallet_id, booking_id, type, amount, balance_after, description, status, processed_at)
SELECT w.id, '30000000-0000-0000-0000-000000000001', 'credit', 85.00, 247.50,
       'Lesson: Ethan Lim × Sarah Chen', 'completed', NOW() - INTERVAL '1 hour'
FROM wallets w JOIN users u ON w.user_id = u.id WHERE u.email = 'jennifer.lim@email.com';
