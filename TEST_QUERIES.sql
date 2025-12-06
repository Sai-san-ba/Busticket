-- Quick SQL Queries for Testing Bus Tracking System

-- ============================================
-- 1. VIEW ALL BOOKINGS WITH TRACKING INFO
-- ============================================
SELECT 
  booking_reference,
  from_city || ' → ' || to_city as route,
  booking_status,
  tracking_status,
  current_location,
  delay_minutes
FROM booking_tracking
ORDER BY last_updated DESC;

-- ============================================
-- 2. GET BOOKING REFERENCES FOR TODAY
-- ============================================
SELECT 
  booking_reference,
  bus_number,
  from_city,
  to_city,
  departure_time,
  booking_status
FROM booking_tracking
WHERE booking_date = CURRENT_DATE
ORDER BY departure_time;

-- ============================================
-- 3. CREATE A TEST BOOKING (Run after signup)
-- ============================================
DO $$
DECLARE
  v_user_id UUID;
  v_schedule_id UUID;
  v_booking_ref TEXT;
BEGIN
  -- Get the first user (or replace with specific user ID)
  SELECT id INTO v_user_id FROM auth.users ORDER BY created_at DESC LIMIT 1;
  
  -- Get a schedule for Colombo to Kandy
  SELECT id INTO v_schedule_id 
  FROM bus_schedules bs
  JOIN routes r ON bs.route_id = r.id
  WHERE r.from_city = 'Colombo' AND r.to_city = 'Kandy'
  LIMIT 1;
  
  -- Create test booking
  INSERT INTO bookings (
    user_id,
    schedule_id,
    booking_date,
    passenger_details,
    seats,
    total_amount,
    booking_status,
    payment_status
  ) VALUES (
    v_user_id,
    v_schedule_id,
    CURRENT_DATE,
    '[{"name": "Test Passenger", "age": 30, "gender": "Male"}]'::jsonb,
    '["1A"]'::jsonb,
    850.00,
    'confirmed',
    'completed'
  )
  RETURNING booking_reference INTO v_booking_ref;
  
  RAISE NOTICE 'Created booking with reference: %', v_booking_ref;
  RAISE NOTICE 'Use this to track: http://localhost:3000/track-bus?booking=%', v_booking_ref;
END $$;

-- ============================================
-- 4. VIEW ACTIVE BUS TRACKING DATA
-- ============================================
SELECT 
  bt.schedule_id,
  b.bus_number,
  b.operator_name,
  r.from_city || ' → ' || r.to_city as route,
  bt.current_location,
  bt.status,
  bt.speed || ' km/h' as speed,
  bt.delay_minutes,
  bt.last_updated
FROM bus_tracking bt
JOIN bus_schedules bs ON bt.schedule_id = bs.id
JOIN buses b ON bs.bus_id = b.id
JOIN routes r ON bs.route_id = r.id
WHERE bt.travel_date = CURRENT_DATE
ORDER BY bt.last_updated DESC;

-- ============================================
-- 5. UPDATE BUS LOCATION (Simulate GPS Update)
-- ============================================
-- Example: Update Colombo-Kandy morning bus
UPDATE bus_tracking
SET 
  current_location = 'Mawanella Junction',
  latitude = 7.2508,
  longitude = 80.4472,
  speed = 60.0,
  heading = 65.0,
  completed_stops = ARRAY['Colombo Fort', 'Kadawatha', 'Nittambuwa', 'Ambepussa', 'Kegalle'],
  upcoming_stops = ARRAY['Kandy'],
  last_updated = NOW()
WHERE schedule_id = (
  SELECT bs.id 
  FROM bus_schedules bs
  JOIN buses b ON bs.bus_id = b.id
  JOIN routes r ON bs.route_id = r.id
  WHERE b.bus_number = 'WP-CAB-1234' 
    AND r.from_city = 'Colombo' 
    AND r.to_city = 'Kandy'
    AND bs.departure_time = '06:00'
)
AND travel_date = CURRENT_DATE;

-- ============================================
-- 6. ADD DELAY TO A BUS
-- ============================================
UPDATE bus_tracking
SET 
  status = 'delayed',
  delay_minutes = 15,
  last_updated = NOW()
WHERE schedule_id = (
  SELECT bs.id 
  FROM bus_schedules bs
  JOIN buses b ON bs.bus_id = b.id
  WHERE b.bus_number = 'CP-GAQ-5678'
)
AND travel_date = CURRENT_DATE;

-- ============================================
-- 7. MARK BUS AS COMPLETED
-- ============================================
UPDATE bus_tracking
SET 
  status = 'completed',
  current_location = 'Kandy Bus Stand (Arrived)',
  speed = 0,
  completed_stops = ARRAY['Colombo Fort', 'Kadawatha', 'Nittambuwa', 'Ambepussa', 'Kegalle', 'Mawanella', 'Kandy'],
  upcoming_stops = ARRAY[]::TEXT[],
  last_updated = NOW()
WHERE schedule_id = (
  SELECT id FROM bus_schedules WHERE id = 'your-schedule-id'
)
AND travel_date = CURRENT_DATE;

-- ============================================
-- 8. GET ALL BOOKING REFERENCES (For Testing)
-- ============================================
SELECT 
  booking_reference as "Use this to track:",
  'http://localhost:3000/track-bus?booking=' || booking_reference as "Direct Link"
FROM bookings
WHERE booking_status = 'confirmed'
ORDER BY created_at DESC
LIMIT 10;

-- ============================================
-- 9. CHECK IF TRACKING DATA EXISTS FOR BOOKING
-- ============================================
-- Replace 'BK123456' with actual booking reference
SELECT 
  CASE 
    WHEN tracking_status IS NOT NULL THEN 'Tracking Available ✓'
    ELSE 'No Tracking Data ✗'
  END as tracking_status,
  booking_reference,
  booking_status,
  from_city || ' → ' || to_city as route
FROM booking_tracking
WHERE booking_reference = 'BK123456';

-- ============================================
-- 10. BULK CREATE TRACKING DATA FOR ALL SCHEDULES
-- ============================================
-- Useful for testing - creates tracking for all today's schedules
INSERT INTO bus_tracking (
  schedule_id,
  travel_date,
  current_location,
  latitude,
  longitude,
  speed,
  heading,
  status,
  delay_minutes,
  next_stop,
  completed_stops,
  upcoming_stops,
  driver_contact
)
SELECT 
  bs.id,
  CURRENT_DATE,
  r.from_city || ' Bus Stand',
  CASE r.from_city
    WHEN 'Colombo' THEN 6.9271
    WHEN 'Kandy' THEN 7.2906
    WHEN 'Galle' THEN 6.0535
    ELSE 7.0000
  END,
  CASE r.from_city
    WHEN 'Colombo' THEN 79.8612
    WHEN 'Kandy' THEN 80.6337
    WHEN 'Galle' THEN 80.2210
    ELSE 80.0000
  END,
  0.0,
  0.0,
  'stopped',
  0,
  r.to_city,
  ARRAY[]::TEXT[],
  ARRAY[r.to_city],
  '+94 77 ' || LPAD(floor(random() * 10000000)::TEXT, 7, '0')
FROM bus_schedules bs
JOIN routes r ON bs.route_id = r.id
WHERE bs.is_active = true
ON CONFLICT (schedule_id, travel_date) DO NOTHING;

-- ============================================
-- 11. DELETE TEST DATA
-- ============================================
-- Use carefully! This removes test bookings
DELETE FROM bookings 
WHERE passenger_details::text LIKE '%Test Passenger%'
AND booking_date >= CURRENT_DATE - INTERVAL '1 day';

-- ============================================
-- 12. RESET TRACKING DATA
-- ============================================
-- Remove all tracking data for today (use for fresh start)
DELETE FROM bus_tracking WHERE travel_date = CURRENT_DATE;
