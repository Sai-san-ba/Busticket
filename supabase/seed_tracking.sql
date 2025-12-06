-- Seed data for Bus Tracking System
-- Run this AFTER running migration_add_tracking.sql
-- This adds sample tracking data for existing bus schedules

-- Insert bus tracking data for active buses
DO $$
DECLARE
  schedule_colombo_kandy_morning UUID;
  schedule_colombo_galle_morning UUID;
  schedule_colombo_jaffna_night UUID;
  schedule_colombo_kandy_afternoon UUID;
  schedule_colombo_galle_afternoon UUID;
BEGIN
  -- Get schedule IDs from existing schedules
  SELECT bs.id INTO schedule_colombo_kandy_morning 
  FROM public.bus_schedules bs
  JOIN public.buses b ON bs.bus_id = b.id
  JOIN public.routes r ON bs.route_id = r.id
  WHERE b.bus_number = 'WP-CAB-1234' 
    AND r.from_city = 'Colombo' 
    AND r.to_city = 'Kandy' 
    AND bs.departure_time = '06:00'
  LIMIT 1;
  
  SELECT bs.id INTO schedule_colombo_galle_morning 
  FROM public.bus_schedules bs
  JOIN public.buses b ON bs.bus_id = b.id
  JOIN public.routes r ON bs.route_id = r.id
  WHERE b.bus_number = 'CP-GAQ-5678' 
    AND r.from_city = 'Colombo' 
    AND r.to_city = 'Galle' 
    AND bs.departure_time = '07:30'
  LIMIT 1;
  
  SELECT bs.id INTO schedule_colombo_jaffna_night 
  FROM public.bus_schedules bs
  JOIN public.buses b ON bs.bus_id = b.id
  JOIN public.routes r ON bs.route_id = r.id
  WHERE b.bus_number = 'SG-CAE-9012' 
    AND r.from_city = 'Colombo' 
    AND r.to_city = 'Jaffna' 
    AND bs.departure_time = '20:00'
  LIMIT 1;

  SELECT bs.id INTO schedule_colombo_kandy_afternoon 
  FROM public.bus_schedules bs
  JOIN public.buses b ON bs.bus_id = b.id
  JOIN public.routes r ON bs.route_id = r.id
  WHERE b.bus_number = 'WP-CAB-1234' 
    AND r.from_city = 'Colombo' 
    AND r.to_city = 'Kandy' 
    AND bs.departure_time = '14:00'
  LIMIT 1;

  SELECT bs.id INTO schedule_colombo_galle_afternoon 
  FROM public.bus_schedules bs
  JOIN public.buses b ON bs.bus_id = b.id
  JOIN public.routes r ON bs.route_id = r.id
  WHERE b.bus_number = 'CP-GAQ-5678' 
    AND r.from_city = 'Colombo' 
    AND r.to_city = 'Galle' 
    AND bs.departure_time = '15:00'
  LIMIT 1;

  -- Check if schedules were found
  IF schedule_colombo_kandy_morning IS NULL THEN
    RAISE NOTICE 'Warning: Could not find Colombo-Kandy morning schedule. Make sure buses and routes exist.';
  END IF;

  -- Insert tracking data for today (only for schedules that exist)
  IF schedule_colombo_kandy_morning IS NOT NULL THEN
    INSERT INTO public.bus_tracking (
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
    ) VALUES (
      schedule_colombo_kandy_morning,
      CURRENT_DATE,
      'Kegalle Town',
      7.2520,
      80.3464,
      55.5,
      45.0,
      'on_time',
      0,
      'Mawanella',
      ARRAY['Colombo Fort', 'Kadawatha', 'Nittambuwa', 'Ambepussa'],
      ARRAY['Mawanella', 'Kandy'],
      '+94 77 123 4567'
    )
    ON CONFLICT (schedule_id, travel_date) 
    DO UPDATE SET
      current_location = EXCLUDED.current_location,
      latitude = EXCLUDED.latitude,
      longitude = EXCLUDED.longitude,
      speed = EXCLUDED.speed,
      heading = EXCLUDED.heading,
      status = EXCLUDED.status,
      delay_minutes = EXCLUDED.delay_minutes,
      next_stop = EXCLUDED.next_stop,
      completed_stops = EXCLUDED.completed_stops,
      upcoming_stops = EXCLUDED.upcoming_stops,
      driver_contact = EXCLUDED.driver_contact,
      last_updated = NOW();
    
    RAISE NOTICE '✅ Added tracking for Colombo-Kandy morning bus';
  END IF;

  IF schedule_colombo_galle_morning IS NOT NULL THEN
    INSERT INTO public.bus_tracking (
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
    ) VALUES (
      schedule_colombo_galle_morning,
      CURRENT_DATE,
      'Kalutara South',
      6.5854,
      79.9607,
      60.0,
      180.0,
      'on_time',
      0,
      'Aluthgama',
      ARRAY['Colombo Fort', 'Panadura', 'Kalutara North'],
      ARRAY['Aluthgama', 'Hikkaduwa', 'Galle'],
      '+94 77 234 5678'
    )
    ON CONFLICT (schedule_id, travel_date) 
    DO UPDATE SET
      current_location = EXCLUDED.current_location,
      latitude = EXCLUDED.latitude,
      longitude = EXCLUDED.longitude,
      speed = EXCLUDED.speed,
      heading = EXCLUDED.heading,
      status = EXCLUDED.status,
      delay_minutes = EXCLUDED.delay_minutes,
      next_stop = EXCLUDED.next_stop,
      completed_stops = EXCLUDED.completed_stops,
      upcoming_stops = EXCLUDED.upcoming_stops,
      driver_contact = EXCLUDED.driver_contact,
      last_updated = NOW();
    
    RAISE NOTICE '✅ Added tracking for Colombo-Galle morning bus';
  END IF;

  IF schedule_colombo_jaffna_night IS NOT NULL THEN
    INSERT INTO public.bus_tracking (
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
    ) VALUES (
      schedule_colombo_jaffna_night,
      CURRENT_DATE,
      'Vavuniya Town',
      8.7542,
      80.4982,
      65.0,
      15.0,
      'on_time',
      0,
      'Kilinochchi',
      ARRAY['Colombo Fort', 'Kurunegala', 'Anuradhapura', 'Medawachchiya'],
      ARRAY['Kilinochchi', 'Elephant Pass', 'Jaffna'],
      '+94 77 345 6789'
    )
    ON CONFLICT (schedule_id, travel_date) 
    DO UPDATE SET
      current_location = EXCLUDED.current_location,
      latitude = EXCLUDED.latitude,
      longitude = EXCLUDED.longitude,
      speed = EXCLUDED.speed,
      heading = EXCLUDED.heading,
      status = EXCLUDED.status,
      delay_minutes = EXCLUDED.delay_minutes,
      next_stop = EXCLUDED.next_stop,
      completed_stops = EXCLUDED.completed_stops,
      upcoming_stops = EXCLUDED.upcoming_stops,
      driver_contact = EXCLUDED.driver_contact,
      last_updated = NOW();
    
    RAISE NOTICE '✅ Added tracking for Colombo-Jaffna night bus';
  END IF;

  IF schedule_colombo_kandy_afternoon IS NOT NULL THEN
    INSERT INTO public.bus_tracking (
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
    ) VALUES (
      schedule_colombo_kandy_afternoon,
      CURRENT_DATE,
      'Colombo Fort Bus Stand',
      6.9271,
      79.8612,
      0.0,
      0.0,
      'stopped',
      0,
      'Kadawatha',
      ARRAY[]::TEXT[],
      ARRAY['Kadawatha', 'Nittambuwa', 'Ambepussa', 'Kegalle', 'Mawanella', 'Kandy'],
      '+94 77 456 7890'
    )
    ON CONFLICT (schedule_id, travel_date) 
    DO UPDATE SET
      current_location = EXCLUDED.current_location,
      latitude = EXCLUDED.latitude,
      longitude = EXCLUDED.longitude,
      speed = EXCLUDED.speed,
      heading = EXCLUDED.heading,
      status = EXCLUDED.status,
      delay_minutes = EXCLUDED.delay_minutes,
      next_stop = EXCLUDED.next_stop,
      completed_stops = EXCLUDED.completed_stops,
      upcoming_stops = EXCLUDED.upcoming_stops,
      driver_contact = EXCLUDED.driver_contact,
      last_updated = NOW();
    
    RAISE NOTICE '✅ Added tracking for Colombo-Kandy afternoon bus';
  END IF;

  IF schedule_colombo_galle_afternoon IS NOT NULL THEN
    INSERT INTO public.bus_tracking (
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
    ) VALUES (
      schedule_colombo_galle_afternoon,
      CURRENT_DATE,
      'Moratuwa',
      6.7730,
      79.8816,
      45.0,
      170.0,
      'delayed',
      10,
      'Panadura',
      ARRAY['Colombo Fort', 'Mount Lavinia'],
      ARRAY['Panadura', 'Kalutara', 'Aluthgama', 'Hikkaduwa', 'Galle'],
      '+94 77 567 8901'
    )
    ON CONFLICT (schedule_id, travel_date) 
    DO UPDATE SET
      current_location = EXCLUDED.current_location,
      latitude = EXCLUDED.latitude,
      longitude = EXCLUDED.longitude,
      speed = EXCLUDED.speed,
      heading = EXCLUDED.heading,
      status = EXCLUDED.status,
      delay_minutes = EXCLUDED.delay_minutes,
      next_stop = EXCLUDED.next_stop,
      completed_stops = EXCLUDED.completed_stops,
      upcoming_stops = EXCLUDED.upcoming_stops,
      driver_contact = EXCLUDED.driver_contact,
      last_updated = NOW();
    
    RAISE NOTICE '✅ Added tracking for Colombo-Galle afternoon bus (delayed)';
  END IF;

  RAISE NOTICE '====================================';
  RAISE NOTICE '✅ Tracking seed data completed!';
  RAISE NOTICE '====================================';
  RAISE NOTICE 'Next steps:';
  RAISE NOTICE '1. Create a booking to get a booking reference';
  RAISE NOTICE '2. Or run this query to see existing data:';
  RAISE NOTICE '   SELECT * FROM booking_tracking;';
  
END $$;

-- Show what was created
SELECT 
  'Tracking data inserted for ' || COUNT(*) || ' buses' as summary
FROM bus_tracking
WHERE travel_date = CURRENT_DATE;

-- Show details
SELECT 
  b.bus_number,
  b.operator_name,
  r.from_city || ' → ' || r.to_city as route,
  bt.current_location,
  bt.status,
  bt.speed || ' km/h' as speed
FROM bus_tracking bt
JOIN bus_schedules bs ON bt.schedule_id = bs.id
JOIN buses b ON bs.bus_id = b.id
JOIN routes r ON bs.route_id = r.id
WHERE bt.travel_date = CURRENT_DATE
ORDER BY bt.last_updated DESC;
