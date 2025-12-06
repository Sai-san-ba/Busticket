-- Create tables for the bus booking system

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (extends Supabase auth.users)
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT,
  phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  is_admin BOOLEAN DEFAULT FALSE
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Policies for profiles
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can insert their own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- Routes table
CREATE TABLE public.routes (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  from_city TEXT NOT NULL,
  to_city TEXT NOT NULL,
  distance_km INTEGER NOT NULL,
  duration_hours DECIMAL(4,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  is_active BOOLEAN DEFAULT TRUE
);

ALTER TABLE public.routes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Routes are viewable by everyone" ON public.routes
  FOR SELECT USING (is_active = true);

CREATE POLICY "Only admins can insert routes" ON public.routes
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = true)
  );

CREATE POLICY "Only admins can update routes" ON public.routes
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = true)
  );

-- Buses table
CREATE TABLE public.buses (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  bus_number TEXT UNIQUE NOT NULL,
  operator_name TEXT NOT NULL,
  bus_type TEXT NOT NULL, -- 'AC Sleeper', 'AC Semi-Sleeper', 'Non-AC Seater', etc.
  total_seats INTEGER NOT NULL,
  seat_layout JSONB NOT NULL, -- Store seat configuration
  facilities TEXT[] DEFAULT '{}', -- Array of facilities
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  is_active BOOLEAN DEFAULT TRUE
);

ALTER TABLE public.buses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Buses are viewable by everyone" ON public.buses
  FOR SELECT USING (is_active = true);

CREATE POLICY "Only admins can manage buses" ON public.buses
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = true)
  );

-- Bus schedules table
CREATE TABLE public.bus_schedules (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  bus_id UUID REFERENCES public.buses(id) ON DELETE CASCADE NOT NULL,
  route_id UUID REFERENCES public.routes(id) ON DELETE CASCADE NOT NULL,
  departure_time TIME NOT NULL,
  arrival_time TIME NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  days_of_week INTEGER[] NOT NULL, -- 0=Sunday, 1=Monday, etc.
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  is_active BOOLEAN DEFAULT TRUE
);

ALTER TABLE public.bus_schedules ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Schedules are viewable by everyone" ON public.bus_schedules
  FOR SELECT USING (is_active = true);

CREATE POLICY "Only admins can manage schedules" ON public.bus_schedules
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = true)
  );

-- Bookings table
CREATE TABLE public.bookings (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  schedule_id UUID REFERENCES public.bus_schedules(id) ON DELETE CASCADE NOT NULL,
  booking_date DATE NOT NULL,
  passenger_details JSONB NOT NULL, -- Array of passenger info
  seats JSONB NOT NULL, -- Array of booked seat numbers
  total_amount DECIMAL(10,2) NOT NULL,
  booking_status TEXT DEFAULT 'pending' CHECK (booking_status IN ('pending', 'confirmed', 'cancelled', 'completed')),
  payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'completed', 'failed', 'refunded')),
  payment_method TEXT,
  payment_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own bookings" ON public.bookings
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own bookings" ON public.bookings
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own bookings" ON public.bookings
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all bookings" ON public.bookings
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = true)
  );

-- Seat availability tracking
CREATE TABLE public.seat_availability (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  schedule_id UUID REFERENCES public.bus_schedules(id) ON DELETE CASCADE NOT NULL,
  travel_date DATE NOT NULL,
  booked_seats JSONB DEFAULT '[]'::jsonb, -- Array of booked seat numbers
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  UNIQUE(schedule_id, travel_date)
);

ALTER TABLE public.seat_availability ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Seat availability is viewable by everyone" ON public.seat_availability
  FOR SELECT USING (true);

CREATE POLICY "Only authenticated users can update seat availability" ON public.seat_availability
  FOR ALL USING (auth.uid() IS NOT NULL);

-- Create indexes for better performance
CREATE INDEX idx_routes_cities ON public.routes(from_city, to_city);
CREATE INDEX idx_bus_schedules_route ON public.bus_schedules(route_id);
CREATE INDEX idx_bus_schedules_bus ON public.bus_schedules(bus_id);
CREATE INDEX idx_bookings_user ON public.bookings(user_id);
CREATE INDEX idx_bookings_schedule ON public.bookings(schedule_id);
CREATE INDEX idx_bookings_date ON public.bookings(booking_date);
CREATE INDEX idx_seat_availability_schedule_date ON public.seat_availability(schedule_id, travel_date);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc'::text, NOW());
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_routes_updated_at BEFORE UPDATE ON public.routes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_buses_updated_at BEFORE UPDATE ON public.buses
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_bus_schedules_updated_at BEFORE UPDATE ON public.bus_schedules
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON public.bookings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_seat_availability_updated_at BEFORE UPDATE ON public.seat_availability
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Bus tracking table for live location tracking
CREATE TABLE public.bus_tracking (
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

ALTER TABLE public.bus_tracking ENABLE ROW LEVEL SECURITY;

-- Anyone can view bus tracking (public feature)
CREATE POLICY "Anyone can view bus tracking" ON public.bus_tracking
  FOR SELECT USING (true);

-- Only admins can manage bus tracking
CREATE POLICY "Only admins can manage bus tracking" ON public.bus_tracking
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = true)
  );

-- Add booking_reference to bookings table for easy tracking
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS booking_reference TEXT UNIQUE;

-- Create function to generate booking reference
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

-- Add trigger to auto-generate booking reference
CREATE OR REPLACE FUNCTION set_booking_reference()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.booking_reference IS NULL THEN
    NEW.booking_reference := generate_booking_reference();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_booking_reference_trigger
  BEFORE INSERT ON public.bookings
  FOR EACH ROW
  EXECUTE FUNCTION set_booking_reference();

-- Create view for tracking with booking info
CREATE OR REPLACE VIEW public.booking_tracking AS
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

-- Create index for tracking performance
CREATE INDEX idx_bus_tracking_schedule_date ON public.bus_tracking(schedule_id, travel_date);
CREATE INDEX idx_bus_tracking_updated ON public.bus_tracking(last_updated DESC);
CREATE INDEX idx_bookings_reference ON public.bookings(booking_reference);

