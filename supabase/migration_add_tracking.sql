-- Migration: Add Bus Tracking System
-- Run this file in Supabase SQL Editor to add tracking features
-- This adds new tables/columns to existing database without recreating existing tables

-- ============================================
-- 1. Create bus_tracking table
-- ============================================
CREATE TABLE IF NOT EXISTS public.bus_tracking (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  schedule_id UUID REFERENCES public.bus_schedules(id) ON DELETE CASCADE NOT NULL,
  travel_date DATE NOT NULL,
  current_location TEXT NOT NULL,
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  speed DECIMAL(5, 2), -- km/h
  heading DECIMAL(5, 2), -- degrees (0-360)
  status TEXT DEFAULT 'on_time' CHECK (status IN ('on_time', 'delayed', 'stopped', 'completed', 'cancelled')),
  delay_minutes INTEGER DEFAULT 0,
  next_stop TEXT,
  completed_stops TEXT[] DEFAULT '{}',
  upcoming_stops TEXT[] DEFAULT '{}',
  driver_contact TEXT,
  last_updated TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  UNIQUE(schedule_id, travel_date)
);

-- Enable RLS
ALTER TABLE public.bus_tracking ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Anyone can view bus tracking" ON public.bus_tracking;
DROP POLICY IF EXISTS "Only admins can manage bus tracking" ON public.bus_tracking;

-- Create policies
CREATE POLICY "Anyone can view bus tracking" ON public.bus_tracking
  FOR SELECT USING (true);

CREATE POLICY "Only admins can manage bus tracking" ON public.bus_tracking
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = true)
  );

-- ============================================
-- 2. Add booking_reference column to bookings
-- ============================================
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS booking_reference TEXT;

-- Make it unique (only if column was just added or doesn't have constraint)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'bookings_booking_reference_key'
  ) THEN
    ALTER TABLE public.bookings ADD CONSTRAINT bookings_booking_reference_key UNIQUE (booking_reference);
  END IF;
END $$;

-- ============================================
-- 3. Create function to generate booking reference
-- ============================================
CREATE OR REPLACE FUNCTION generate_booking_reference()
RETURNS TEXT AS $$
DECLARE
  ref TEXT;
  exists_check INTEGER;
BEGIN
  LOOP
    ref := 'BK' || LPAD(floor(random() * 1000000)::TEXT, 6, '0');
    SELECT COUNT(*) INTO exists_check FROM public.bookings WHERE booking_reference = ref;
    EXIT WHEN exists_check = 0;
  END LOOP;
  RETURN ref;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- 4. Create trigger function for booking reference
-- ============================================
CREATE OR REPLACE FUNCTION set_booking_reference()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.booking_reference IS NULL THEN
    NEW.booking_reference := generate_booking_reference();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop existing trigger if exists
DROP TRIGGER IF EXISTS set_booking_reference_trigger ON public.bookings;

-- Create trigger
CREATE TRIGGER set_booking_reference_trigger
  BEFORE INSERT ON public.bookings
  FOR EACH ROW
  EXECUTE FUNCTION set_booking_reference();

-- ============================================
-- 5. Generate booking references for existing bookings
-- ============================================
UPDATE public.bookings
SET booking_reference = generate_booking_reference()
WHERE booking_reference IS NULL;

-- ============================================
-- 6. Create view for tracking with booking info
-- ============================================
DROP VIEW IF EXISTS public.booking_tracking;

CREATE VIEW public.booking_tracking AS
SELECT 
  b.id as booking_id,
  b.booking_reference,
  b.user_id,
  b.booking_date,
  b.booking_status,
  b.seats,
  bs.id as schedule_id,
  bus.bus_number,
  bus.operator_name,
  bus.bus_type,
  r.from_city,
  r.to_city,
  r.distance_km,
  bs.departure_time,
  bs.arrival_time,
  bt.current_location,
  bt.latitude,
  bt.longitude,
  bt.speed,
  bt.heading,
  bt.status as tracking_status,
  bt.delay_minutes,
  bt.next_stop,
  bt.completed_stops,
  bt.upcoming_stops,
  bt.driver_contact,
  bt.last_updated
FROM public.bookings b
JOIN public.bus_schedules bs ON b.schedule_id = bs.id
JOIN public.buses bus ON bs.bus_id = bus.id
JOIN public.routes r ON bs.route_id = r.id
LEFT JOIN public.bus_tracking bt ON bt.schedule_id = bs.id AND bt.travel_date = b.booking_date
WHERE b.booking_status IN ('confirmed', 'completed');

-- Grant access to view
GRANT SELECT ON public.booking_tracking TO authenticated, anon;

-- ============================================
-- 7. Create indexes for performance
-- ============================================
CREATE INDEX IF NOT EXISTS idx_bus_tracking_schedule_date ON public.bus_tracking(schedule_id, travel_date);
CREATE INDEX IF NOT EXISTS idx_bus_tracking_updated ON public.bus_tracking(last_updated DESC);
CREATE INDEX IF NOT EXISTS idx_bookings_reference ON public.bookings(booking_reference);

-- ============================================
-- Success Message
-- ============================================
DO $$
BEGIN
  RAISE NOTICE '✅ Bus tracking system migration completed successfully!';
  RAISE NOTICE '📋 Next step: Run seed.sql to add sample tracking data';
END $$;
