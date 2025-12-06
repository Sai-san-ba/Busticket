-- Sample data for testing the bus booking system

-- Insert sample routes
INSERT INTO public.routes (from_city, to_city, distance_km, duration_hours, is_active) VALUES
('Colombo', 'Kandy', 115, 3.0, true),
('Colombo', 'Galle', 120, 2.5, true),
('Colombo', 'Jaffna', 395, 8.0, true),
('Kandy', 'Nuwara Eliya', 77, 2.5, true),
('Galle', 'Matara', 45, 1.5, true),
('Colombo', 'Anuradhapura', 205, 4.5, true),
('Kandy', 'Trincomalee', 180, 4.0, true),
('Colombo', 'Batticaloa', 315, 7.0, true);

-- Insert sample buses
INSERT INTO public.buses (
  bus_number, 
  operator_name, 
  bus_type, 
  total_seats, 
  seat_layout, 
  facilities,
  is_active
) VALUES
(
  'WP-CAB-1234',
  'SLTB Express',
  'AC Sleeper',
  40,
  '{
    "rows": 10,
    "seatsPerRow": 4,
    "layout": [
      [{"id": "1A", "type": "sleeper", "position": "left"}, {"id": "1B", "type": "sleeper", "position": "left"}, {"id": "1C", "type": "sleeper", "position": "right"}, {"id": "1D", "type": "sleeper", "position": "right"}],
      [{"id": "2A", "type": "sleeper", "position": "left"}, {"id": "2B", "type": "sleeper", "position": "left"}, {"id": "2C", "type": "sleeper", "position": "right"}, {"id": "2D", "type": "sleeper", "position": "right"}],
      [{"id": "3A", "type": "sleeper", "position": "left"}, {"id": "3B", "type": "sleeper", "position": "left"}, {"id": "3C", "type": "sleeper", "position": "right"}, {"id": "3D", "type": "sleeper", "position": "right"}],
      [{"id": "4A", "type": "sleeper", "position": "left"}, {"id": "4B", "type": "sleeper", "position": "left"}, {"id": "4C", "type": "sleeper", "position": "right"}, {"id": "4D", "type": "sleeper", "position": "right"}],
      [{"id": "5A", "type": "sleeper", "position": "left"}, {"id": "5B", "type": "sleeper", "position": "left"}, {"id": "5C", "type": "sleeper", "position": "right"}, {"id": "5D", "type": "sleeper", "position": "right"}],
      [{"id": "6A", "type": "sleeper", "position": "left"}, {"id": "6B", "type": "sleeper", "position": "left"}, {"id": "6C", "type": "sleeper", "position": "right"}, {"id": "6D", "type": "sleeper", "position": "right"}],
      [{"id": "7A", "type": "sleeper", "position": "left"}, {"id": "7B", "type": "sleeper", "position": "left"}, {"id": "7C", "type": "sleeper", "position": "right"}, {"id": "7D", "type": "sleeper", "position": "right"}],
      [{"id": "8A", "type": "sleeper", "position": "left"}, {"id": "8B", "type": "sleeper", "position": "left"}, {"id": "8C", "type": "sleeper", "position": "right"}, {"id": "8D", "type": "sleeper", "position": "right"}],
      [{"id": "9A", "type": "sleeper", "position": "left"}, {"id": "9B", "type": "sleeper", "position": "left"}, {"id": "9C", "type": "sleeper", "position": "right"}, {"id": "9D", "type": "sleeper", "position": "right"}],
      [{"id": "10A", "type": "sleeper", "position": "left"}, {"id": "10B", "type": "sleeper", "position": "left"}, {"id": "10C", "type": "sleeper", "position": "right"}, {"id": "10D", "type": "sleeper", "position": "right"}]
    ]
  }',
  ARRAY['AC', 'WiFi', 'Charging Port', 'Blanket', 'Water Bottle'],
  true
),
(
  'CP-GAQ-5678',
  'NTC Luxury',
  'AC Semi-Sleeper',
  35,
  '{
    "rows": 9,
    "seatsPerRow": 4,
    "layout": [
      [{"id": "1A", "type": "seat", "position": "left"}, {"id": "1B", "type": "seat", "position": "left"}, {"id": "1C", "type": "seat", "position": "right"}, {"id": "1D", "type": "seat", "position": "right"}],
      [{"id": "2A", "type": "seat", "position": "left"}, {"id": "2B", "type": "seat", "position": "left"}, {"id": "2C", "type": "seat", "position": "right"}, {"id": "2D", "type": "seat", "position": "right"}],
      [{"id": "3A", "type": "seat", "position": "left"}, {"id": "3B", "type": "seat", "position": "left"}, {"id": "3C", "type": "seat", "position": "right"}, {"id": "3D", "type": "seat", "position": "right"}],
      [{"id": "4A", "type": "seat", "position": "left"}, {"id": "4B", "type": "seat", "position": "left"}, {"id": "4C", "type": "seat", "position": "right"}, {"id": "4D", "type": "seat", "position": "right"}],
      [{"id": "5A", "type": "seat", "position": "left"}, {"id": "5B", "type": "seat", "position": "left"}, {"id": "5C", "type": "seat", "position": "right"}, {"id": "5D", "type": "seat", "position": "right"}],
      [{"id": "6A", "type": "seat", "position": "left"}, {"id": "6B", "type": "seat", "position": "left"}, {"id": "6C", "type": "seat", "position": "right"}, {"id": "6D", "type": "seat", "position": "right"}],
      [{"id": "7A", "type": "seat", "position": "left"}, {"id": "7B", "type": "seat", "position": "left"}, {"id": "7C", "type": "seat", "position": "right"}, {"id": "7D", "type": "seat", "position": "right"}],
      [{"id": "8A", "type": "seat", "position": "left"}, {"id": "8B", "type": "seat", "position": "left"}, {"id": "8C", "type": "seat", "position": "right"}, {"id": "8D", "type": "seat", "position": "right"}],
      [{"id": "9A", "type": "seat", "position": "left"}, {"id": "9B", "type": "seat", "position": "left"}, {"id": "empty", "type": "empty", "position": "right"}, {"id": "9C", "type": "seat", "position": "right"}]
    ]
  }',
  ARRAY['AC', 'Charging Port', 'Water Bottle'],
  true
),
(
  'SG-CAE-9012',
  'Ceylon Luxury Line',
  'Volvo Multi-Axle',
  45,
  '{
    "rows": 12,
    "seatsPerRow": 4,
    "layout": [
      [{"id": "1A", "type": "sleeper", "position": "left"}, {"id": "1B", "type": "sleeper", "position": "left"}, {"id": "1C", "type": "sleeper", "position": "right"}, {"id": "1D", "type": "sleeper", "position": "right"}],
      [{"id": "2A", "type": "sleeper", "position": "left"}, {"id": "2B", "type": "sleeper", "position": "left"}, {"id": "2C", "type": "sleeper", "position": "right"}, {"id": "2D", "type": "sleeper", "position": "right"}],
      [{"id": "3A", "type": "sleeper", "position": "left"}, {"id": "3B", "type": "sleeper", "position": "left"}, {"id": "3C", "type": "sleeper", "position": "right"}, {"id": "3D", "type": "sleeper", "position": "right"}],
      [{"id": "4A", "type": "sleeper", "position": "left"}, {"id": "4B", "type": "sleeper", "position": "left"}, {"id": "4C", "type": "sleeper", "position": "right"}, {"id": "4D", "type": "sleeper", "position": "right"}],
      [{"id": "5A", "type": "sleeper", "position": "left"}, {"id": "5B", "type": "sleeper", "position": "left"}, {"id": "5C", "type": "sleeper", "position": "right"}, {"id": "5D", "type": "sleeper", "position": "right"}],
      [{"id": "6A", "type": "sleeper", "position": "left"}, {"id": "6B", "type": "sleeper", "position": "left"}, {"id": "6C", "type": "sleeper", "position": "right"}, {"id": "6D", "type": "sleeper", "position": "right"}],
      [{"id": "7A", "type": "sleeper", "position": "left"}, {"id": "7B", "type": "sleeper", "position": "left"}, {"id": "7C", "type": "sleeper", "position": "right"}, {"id": "7D", "type": "sleeper", "position": "right"}],
      [{"id": "8A", "type": "sleeper", "position": "left"}, {"id": "8B", "type": "sleeper", "position": "left"}, {"id": "8C", "type": "sleeper", "position": "right"}, {"id": "8D", "type": "sleeper", "position": "right"}],
      [{"id": "9A", "type": "sleeper", "position": "left"}, {"id": "9B", "type": "sleeper", "position": "left"}, {"id": "9C", "type": "sleeper", "position": "right"}, {"id": "9D", "type": "sleeper", "position": "right"}],
      [{"id": "10A", "type": "sleeper", "position": "left"}, {"id": "10B", "type": "sleeper", "position": "left"}, {"id": "10C", "type": "sleeper", "position": "right"}, {"id": "10D", "type": "sleeper", "position": "right"}],
      [{"id": "11A", "type": "sleeper", "position": "left"}, {"id": "11B", "type": "sleeper", "position": "left"}, {"id": "11C", "type": "sleeper", "position": "right"}, {"id": "11D", "type": "sleeper", "position": "right"}],
      [{"id": "12A", "type": "seat", "position": "left"}, {"id": "12B", "type": "seat", "position": "left"}, {"id": "12C", "type": "seat", "position": "right"}, {"id": "12D", "type": "seat", "position": "right"}]
    ]
  }',
  ARRAY['AC', 'WiFi', 'Entertainment', 'Meals', 'Blanket', 'Pillow'],
  true
);

-- Insert bus schedules (linking buses to routes)
-- Get IDs for the inserts
DO $$
DECLARE
  route_colombo_kandy UUID;
  route_colombo_galle UUID;
  route_colombo_jaffna UUID;
  bus_express UUID;
  bus_comfort UUID;
  bus_royal UUID;
BEGIN
  -- Get route IDs
  SELECT id INTO route_colombo_kandy FROM public.routes WHERE from_city = 'Colombo' AND to_city = 'Kandy';
  SELECT id INTO route_colombo_galle FROM public.routes WHERE from_city = 'Colombo' AND to_city = 'Galle';
  SELECT id INTO route_colombo_jaffna FROM public.routes WHERE from_city = 'Colombo' AND to_city = 'Jaffna';
  
  -- Get bus IDs
  SELECT id INTO bus_express FROM public.buses WHERE bus_number = 'WP-CAB-1234';
  SELECT id INTO bus_comfort FROM public.buses WHERE bus_number = 'CP-GAQ-5678';
  SELECT id INTO bus_royal FROM public.buses WHERE bus_number = 'SG-CAE-9012';
  
  -- Insert schedules
  INSERT INTO public.bus_schedules (bus_id, route_id, departure_time, arrival_time, price, days_of_week, is_active) VALUES
  (bus_express, route_colombo_kandy, '06:00', '09:00', 850.00, ARRAY[0,1,2,3,4,5,6], true),
  (bus_comfort, route_colombo_galle, '07:30', '10:00', 650.00, ARRAY[0,1,2,3,4,5,6], true),
  (bus_royal, route_colombo_jaffna, '20:00', '04:00', 2200.00, ARRAY[0,1,2,3,4,5,6], true),
  (bus_express, route_colombo_kandy, '14:00', '17:00', 800.00, ARRAY[1,3,5], true),
  (bus_comfort, route_colombo_galle, '15:00', '17:30', 600.00, ARRAY[0,2,4,6], true);
END $$;

-- Insert bus tracking data for active buses
DO $$
DECLARE
  schedule_colombo_kandy_morning UUID;
  schedule_colombo_galle_morning UUID;
  schedule_colombo_jaffna_night UUID;
  schedule_colombo_kandy_afternoon UUID;
  schedule_colombo_galle_afternoon UUID;
BEGIN
  -- Get schedule IDs
  SELECT bs.id INTO schedule_colombo_kandy_morning 
  FROM public.bus_schedules bs
  JOIN public.buses b ON bs.bus_id = b.id
  JOIN public.routes r ON bs.route_id = r.id
  WHERE b.bus_number = 'WP-CAB-1234' AND r.from_city = 'Colombo' AND r.to_city = 'Kandy' AND bs.departure_time = '06:00';
  
  SELECT bs.id INTO schedule_colombo_galle_morning 
  FROM public.bus_schedules bs
  JOIN public.buses b ON bs.bus_id = b.id
  JOIN public.routes r ON bs.route_id = r.id
  WHERE b.bus_number = 'CP-GAQ-5678' AND r.from_city = 'Colombo' AND r.to_city = 'Galle' AND bs.departure_time = '07:30';
  
  SELECT bs.id INTO schedule_colombo_jaffna_night 
  FROM public.bus_schedules bs
  JOIN public.buses b ON bs.bus_id = b.id
  JOIN public.routes r ON bs.route_id = r.id
  WHERE b.bus_number = 'SG-CAE-9012' AND r.from_city = 'Colombo' AND r.to_city = 'Jaffna' AND bs.departure_time = '20:00';

  SELECT bs.id INTO schedule_colombo_kandy_afternoon 
  FROM public.bus_schedules bs
  JOIN public.buses b ON bs.bus_id = b.id
  JOIN public.routes r ON bs.route_id = r.id
  WHERE b.bus_number = 'WP-CAB-1234' AND r.from_city = 'Colombo' AND r.to_city = 'Kandy' AND bs.departure_time = '14:00';

  SELECT bs.id INTO schedule_colombo_galle_afternoon 
  FROM public.bus_schedules bs
  JOIN public.buses b ON bs.bus_id = b.id
  JOIN public.routes r ON bs.route_id = r.id
  WHERE b.bus_number = 'CP-GAQ-5678' AND r.from_city = 'Colombo' AND r.to_city = 'Galle' AND bs.departure_time = '15:00';

  -- Insert tracking data for today
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
  ) VALUES
  -- Bus 1: Colombo to Kandy (Morning) - Currently near Kegalle
  (
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
  ),
  -- Bus 2: Colombo to Galle (Morning) - Currently near Kalutara
  (
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
  ),
  -- Bus 3: Colombo to Jaffna (Night) - Currently near Vavuniya
  (
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
  ),
  -- Bus 4: Colombo to Kandy (Afternoon) - Currently starting
  (
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
  ),
  -- Bus 5: Colombo to Galle (Afternoon) - Running 10 mins late
  (
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
  );

END $$;

-- Note: Admin user needs to be created through signup and then manually set is_admin = true
-- You can do this in Supabase dashboard:
-- 1. Sign up normally through the app
-- 2. Go to Supabase Dashboard > Table Editor > profiles
-- 3. Find your user and set is_admin to true
