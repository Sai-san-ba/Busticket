-- Quick queries to find booking references for testing

-- ============================================
-- 1. VIEW ALL BOOKINGS WITH REFERENCES
-- ============================================
-- Run this to see all booking references in your database
SELECT 
  booking_reference as "Booking Ref",
  booking_date as "Travel Date",
  booking_status as "Status",
  from_city || ' → ' || to_city as "Route",
  bus_number as "Bus",
  departure_time as "Departure"
FROM booking_tracking
ORDER BY booking_date DESC, created_at DESC
LIMIT 20;

-- ============================================
-- 2. GET CONFIRMED BOOKINGS ONLY
-- ============================================
-- These are bookings you can track
SELECT 
  booking_reference as "📍 Use This to Track",
  from_city || ' → ' || to_city as "Route",
  booking_date as "Date",
  bus_number as "Bus Number"
FROM booking_tracking
WHERE booking_status = 'confirmed'
ORDER BY booking_date DESC;

-- ============================================
-- 3. GET BOOKINGS FOR TODAY
-- ============================================
-- See which buses are running today
SELECT 
  booking_reference as "Tracking Number",
  current_location as "Current Location",
  tracking_status as "Status",
  from_city || ' → ' || to_city as "Route"
FROM booking_tracking
WHERE booking_date = CURRENT_DATE
  AND tracking_status IS NOT NULL;

-- ============================================
-- 4. CREATE A TEST BOOKING WITH REFERENCE
-- ============================================
-- This creates a sample booking you can use for testing
DO $$
DECLARE
  v_user_id UUID;
  v_schedule_id UUID;
  v_booking_ref TEXT;
BEGIN
  -- Get first user (or you can replace with specific user email)
  SELECT id INTO v_user_id 
  FROM auth.users 
  ORDER BY created_at DESC 
  LIMIT 1;
  
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'No users found. Please sign up first.';
  END IF;
  
  -- Get a schedule
  SELECT id INTO v_schedule_id 
  FROM bus_schedules 
  WHERE is_active = true 
  LIMIT 1;
  
  IF v_schedule_id IS NULL THEN
    RAISE EXCEPTION 'No schedules found. Run seed.sql first.';
  END IF;
  
  -- Create test booking
  INSERT INTO bookings (
    user_id,
    schedule_id,
    booking_date,
    passenger_details,
    seats,
    total_amount,
    booking_status,
    payment_status,
    payment_method
  ) VALUES (
    v_user_id,
    v_schedule_id,
    CURRENT_DATE + INTERVAL '1 day', -- Tomorrow
    '[{"name": "Test User", "age": 30, "gender": "Male", "email": "test@example.com", "phone": "+94771234567"}]'::jsonb,
    '["1A"]'::jsonb,
    850.00,
    'confirmed',
    'completed',
    'card'
  )
  RETURNING booking_reference INTO v_booking_ref;
  
  RAISE NOTICE '✅ Test booking created!';
  RAISE NOTICE '================================';
  RAISE NOTICE 'Booking Reference: %', v_booking_ref;
  RAISE NOTICE '================================';
  RAISE NOTICE 'Test it here: http://localhost:3000/track-bus?booking=%', v_booking_ref;
  RAISE NOTICE 'Or visit: http://localhost:3000/track-bus';
  RAISE NOTICE 'And enter: %', v_booking_ref;
  
END $$;

-- ============================================
-- 5. GET YOUR USER'S BOOKINGS
-- ============================================
-- Replace 'your-email@example.com' with your actual email
SELECT 
  b.booking_reference as "Your Booking Reference",
  b.booking_date as "Travel Date",
  b.booking_status as "Status",
  r.from_city || ' → ' || r.to_city as "Route",
  bus.bus_number as "Bus",
  bs.departure_time as "Time"
FROM bookings b
JOIN bus_schedules bs ON b.schedule_id = bs.id
JOIN buses bus ON bs.bus_id = bus.id
JOIN routes r ON bs.route_id = r.id
JOIN auth.users u ON b.user_id = u.id
WHERE u.email = 'your-email@example.com'  -- ← CHANGE THIS
ORDER BY b.booking_date DESC;

-- ============================================
-- 6. COPY THIS FOR QUICK TRACKING LINKS
-- ============================================
-- Generates clickable tracking links
SELECT 
  booking_reference,
  'http://localhost:3000/track-bus?booking=' || booking_reference as "Tracking Link"
FROM bookings
WHERE booking_status = 'confirmed'
ORDER BY created_at DESC
LIMIT 10;

-- ============================================
-- 7. CHECK IF TRACKING DATA EXISTS
-- ============================================
-- See which bookings have live tracking available
SELECT 
  booking_reference,
  CASE 
    WHEN tracking_status IS NOT NULL THEN '✓ Tracking Available'
    ELSE '✗ No Tracking Yet'
  END as "Tracking Status",
  CASE 
    WHEN tracking_status IS NOT NULL THEN current_location
    ELSE 'Bus not started'
  END as "Location"
FROM booking_tracking
ORDER BY booking_date DESC
LIMIT 10;

-- ============================================
-- 8. GENERATE RANDOM BOOKINGS FOR TESTING
-- ============================================
-- Creates 5 test bookings with tracking data
DO $$
DECLARE
  v_user_id UUID;
  v_schedule record;
  v_booking_ref TEXT;
  counter INT := 0;
BEGIN
  SELECT id INTO v_user_id FROM auth.users ORDER BY created_at DESC LIMIT 1;
  
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'No users found. Please sign up first.';
  END IF;
  
  FOR v_schedule IN 
    SELECT id FROM bus_schedules WHERE is_active = true LIMIT 5
  LOOP
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
      v_schedule.id,
      CURRENT_DATE + (counter || ' days')::INTERVAL,
      '[{"name": "Passenger ' || counter || '", "age": 25, "gender": "Male"}]'::jsonb,
      '["' || counter || 'A"]'::jsonb,
      850.00,
      'confirmed',
      'completed'
    )
    RETURNING booking_reference INTO v_booking_ref;
    
    RAISE NOTICE 'Created booking: %', v_booking_ref;
    counter := counter + 1;
  END LOOP;
  
  RAISE NOTICE '✅ Created % test bookings', counter;
END $$;

-- View the created bookings
SELECT 
  booking_reference,
  booking_date,
  booking_status
FROM bookings
ORDER BY created_at DESC
LIMIT 5;
