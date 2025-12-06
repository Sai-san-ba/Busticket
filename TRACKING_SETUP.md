# Bus Tracking System - Setup Guide

## Overview
The bus tracking system has been updated to use real data from Supabase instead of mock/demo data. This document explains the complete implementation and how to use it.

## What Has Been Changed

### 1. Database Schema Updates (`supabase/schema.sql`)
Added the following new features:

#### New Table: `bus_tracking`
Stores live GPS location and status of buses:
- `schedule_id` - Links to bus schedule
- `travel_date` - Date of travel
- `current_location` - Human-readable location name
- `latitude` / `longitude` - GPS coordinates
- `speed` - Current speed in km/h
- `heading` - Direction (0-360 degrees)
- `status` - on_time, delayed, stopped, completed, cancelled
- `delay_minutes` - Minutes of delay
- `next_stop` - Next stop name
- `completed_stops` - Array of passed stops
- `upcoming_stops` - Array of future stops
- `driver_contact` - Driver's phone number

#### New Column: `booking_reference` in `bookings` table
- Auto-generated unique reference (e.g., BK123456)
- Used for easy tracking by customers

#### New View: `booking_tracking`
Combines booking, schedule, bus, route, and tracking data in one query.

### 2. Seed Data Updates (`supabase/seed.sql`)
Added 5 sample tracking records with Sri Lankan locations:

| Bus Route | Current Location | Status | Delay | 
|-----------|-----------------|---------|-------|
| Colombo → Kandy (Morning) | Kegalle Town | On Time | 0 min |
| Colombo → Galle (Morning) | Kalutara South | On Time | 0 min |
| Colombo → Jaffna (Night) | Vavuniya Town | On Time | 0 min |
| Colombo → Kandy (Afternoon) | Colombo Fort | Stopped | 0 min |
| Colombo → Galle (Afternoon) | Moratuwa | Delayed | 10 min |

### 3. API Endpoint (`app/api/track/route.ts`)
New API endpoint: `GET /api/track?reference=BK123456`

**Features:**
- Fetches booking and tracking data from database
- Returns formatted JSON with all tracking information
- Handles errors gracefully
- Public access (no authentication required)

### 4. Frontend Updates (`app/track-bus/page.tsx`)
**Removed:**
- Mock/demo data
- Hardcoded booking IDs

**Added:**
- Real-time API integration
- Better error handling
- Auto-refresh every 30 seconds
- Enhanced UI with:
  - Booking information display
  - Bus details
  - Live tracking status
  - GPS coordinates with Google Maps link
  - Route progress
  - Driver contact information
  - Helpful instructions

## How to Setup

### Step 1: Run Schema Updates
```sql
-- In Supabase SQL Editor, run the updated schema.sql file
-- This will create the bus_tracking table and related functions
```

### Step 2: Run Seed Data
```sql
-- In Supabase SQL Editor, run the updated seed.sql file
-- This will insert sample tracking data
```

### Step 3: Test the System
1. Your app should already be running with `npm run dev`
2. Visit: `http://localhost:3000/track-bus`
3. The demo booking IDs have been removed

## How to Get Booking References for Testing

### Option 1: Create a Test Booking
1. Sign up / Login to your app
2. Search for a bus
3. Book a ticket
4. Your booking confirmation will show the booking reference (e.g., BK123456)

### Option 2: Query Existing Bookings
```sql
-- In Supabase SQL Editor
SELECT booking_reference, booking_date, booking_status 
FROM bookings 
WHERE booking_status = 'confirmed'
LIMIT 10;
```

### Option 3: Create Sample Bookings
```sql
-- Create a test user first through the app, then run:
DO $$
DECLARE
  test_user_id UUID;
  test_schedule_id UUID;
BEGIN
  -- Get a user ID (replace with your test user)
  SELECT id INTO test_user_id FROM auth.users LIMIT 1;
  
  -- Get a schedule ID
  SELECT id INTO test_schedule_id FROM bus_schedules LIMIT 1;
  
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
    test_user_id,
    test_schedule_id,
    CURRENT_DATE,
    '[{"name": "Test Passenger", "age": 30, "gender": "male"}]'::jsonb,
    '["1A", "1B"]'::jsonb,
    1700.00,
    'confirmed',
    'completed'
  );
  
  -- Show the generated booking reference
  RAISE NOTICE 'Booking Reference: %', 
    (SELECT booking_reference FROM bookings ORDER BY created_at DESC LIMIT 1);
END $$;
```

## How to Update Bus Location (For Admin/Driver)

### Real-time Location Update
```sql
-- Update or insert new tracking data
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
) VALUES (
  'your-schedule-id-here',
  CURRENT_DATE,
  'Kadawatha Junction',
  7.0008,
  79.9533,
  62.5,
  85.0,
  'on_time',
  0,
  'Nittambuwa',
  ARRAY['Colombo Fort', 'Kadawatha'],
  ARRAY['Nittambuwa', 'Ambepussa', 'Kegalle', 'Kandy'],
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
  last_updated = NOW();
```

## Features Available

### For Passengers
1. **Track by Booking Reference** - Enter booking ref to see bus location
2. **Real-time Updates** - Auto-refreshes every 30 seconds
3. **GPS Location** - View on Google Maps
4. **Status Information** - On time, delayed, stopped
5. **Route Progress** - See completed and upcoming stops
6. **Contact Driver** - Direct call button
7. **Trip Details** - Bus number, operator, route info

### For Admins/Operators
1. **Manual Location Updates** - Via Supabase SQL
2. **Status Management** - Update delay, status
3. **Stop Management** - Mark stops as completed
4. **Contact Info** - Set driver phone number

## API Documentation

### Track Bus Endpoint

**URL:** `GET /api/track?reference={booking_reference}`

**Parameters:**
- `reference` (required) - Booking reference code (e.g., BK123456)

**Response Success (200):**
```json
{
  "bookingReference": "BK123456",
  "bookingStatus": "confirmed",
  "seats": ["1A", "1B"],
  "bus": {
    "busNumber": "WP-CAB-1234",
    "operatorName": "SLTB Express",
    "busType": "AC Sleeper"
  },
  "route": {
    "from": "Colombo",
    "to": "Kandy",
    "distance": 115,
    "departureTime": "06:00",
    "arrivalTime": "09:00"
  },
  "tracking": {
    "currentLocation": "Kegalle Town",
    "latitude": 7.2520,
    "longitude": 80.3464,
    "speed": 55.5,
    "heading": 45.0,
    "status": "on_time",
    "delayMinutes": 0,
    "nextStop": "Mawanella",
    "completedStops": ["Colombo Fort", "Kadawatha", "Nittambuwa"],
    "upcomingStops": ["Mawanella", "Kandy"],
    "driverContact": "+94 77 123 4567",
    "lastUpdated": "2025-10-17T10:30:00Z"
  }
}
```

**Response Error (404):**
```json
{
  "error": "Booking not found. Please check your booking reference."
}
```

**Response Error (400):**
```json
{
  "error": "Booking reference is required"
}
```

## Next Steps / Future Enhancements

### Recommended Additions:
1. **Real Map Integration** - Add Leaflet or Google Maps
2. **GPS Device Integration** - Mobile app for drivers to auto-update location
3. **Push Notifications** - Alert passengers about delays
4. **ETA Calculation** - Dynamic arrival time based on current location
5. **Historical Tracking** - Store past locations for route analysis
6. **Geofencing** - Auto-detect when bus arrives at stops
7. **Admin Dashboard** - Visual interface to manage tracking
8. **WebSocket Updates** - Real-time updates without refresh

### For Production:
1. Add rate limiting to API endpoint
2. Implement caching for frequently accessed routes
3. Add monitoring and logging
4. Set up automated location updates via GPS devices
5. Add authentication for location update endpoints
6. Implement data retention policies

## Testing Checklist

- [ ] Schema changes applied successfully
- [ ] Seed data inserted without errors
- [ ] Can fetch booking references from database
- [ ] Track page loads without errors
- [ ] Can search for booking by reference
- [ ] Tracking data displays correctly
- [ ] Error messages show for invalid references
- [ ] Auto-refresh works (30 second interval)
- [ ] Google Maps link works
- [ ] Driver contact call button works
- [ ] Route progress shows correctly
- [ ] Status badges display properly

## Troubleshooting

### "Booking not found" Error
- Verify booking exists: `SELECT * FROM bookings WHERE booking_reference = 'BK123456'`
- Check booking status is 'confirmed' or 'completed'
- Ensure tracking data exists for that schedule and date

### No Tracking Data Displayed
- Check if bus_tracking record exists for the schedule
- Verify travel_date matches booking_date
- Run: `SELECT * FROM booking_tracking WHERE booking_reference = 'BK123456'`

### RLS Errors
- Ensure RLS policies are set correctly
- booking_tracking view should be accessible to anon/authenticated users
- Test: `SELECT * FROM booking_tracking LIMIT 1` in Supabase SQL Editor

## Support

For issues or questions:
1. Check Supabase logs for errors
2. Verify database schema matches expected structure
3. Test API endpoint directly: `/api/track?reference=BK123456`
4. Check browser console for frontend errors
