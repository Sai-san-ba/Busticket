# 🎯 Complete Setup & Testing Guide - Bus Tracking System

## 📋 Table of Contents
1. [Initial Setup](#initial-setup)
2. [Database Migration](#database-migration)
3. [Getting Booking References](#getting-booking-references)
4. [Testing the Tracking System](#testing-the-tracking-system)
5. [Troubleshooting](#troubleshooting)

---

## 🚀 Initial Setup

### Prerequisites:
- ✅ Supabase project set up
- ✅ Next.js app running (`npm run dev`)
- ✅ Existing routes, buses, and schedules in database

---

## 📊 Database Migration

### Step 1: Run Migration
**File:** `supabase/migration_add_tracking.sql`

1. Open **Supabase Dashboard** → **SQL Editor**
2. Copy contents of `migration_add_tracking.sql`
3. Paste and click **Run**
4. ✅ You should see: "Bus tracking system migration completed successfully!"

**What this does:**
- Creates `bus_tracking` table
- Adds `booking_reference` column to bookings
- Creates auto-generation functions
- Sets up the `booking_tracking` view

### Step 2: Add Tracking Data
**File:** `supabase/seed_tracking.sql`

1. In **Supabase SQL Editor**
2. Copy contents of `seed_tracking.sql`
3. Paste and click **Run**
4. ✅ You should see messages like "Added tracking for Colombo-Kandy morning bus"

**What this does:**
- Adds GPS tracking data for 5 sample buses
- Links tracking to existing schedules
- Sets current locations, speeds, stops

---

## 🔍 Getting Booking References

### Method 1: View All Existing Bookings ⭐ EASIEST
**File:** `GET_BOOKING_REFERENCES.sql`

Run Query #1 in Supabase SQL Editor:
```sql
SELECT 
  booking_reference as "Booking Ref",
  booking_date as "Travel Date",
  booking_status as "Status",
  from_city || ' → ' || to_city as "Route"
FROM booking_tracking
ORDER BY booking_date DESC
LIMIT 20;
```

Copy any booking reference from the results (e.g., `BK123456`)

### Method 2: Create Test Booking ⭐ RECOMMENDED
Run Query #4 from `GET_BOOKING_REFERENCES.sql`:
```sql
-- This creates a test booking and shows you the reference
```
The query will output:
```
✅ Test booking created!
================================
Booking Reference: BK123456
================================
Test it here: http://localhost:3000/track-bus?booking=BK123456
```

### Method 3: Create Booking Through the App
1. Go to `http://localhost:3000`
2. Sign up / Login
3. Search for a bus
4. Book a ticket
5. On success page, you'll see the booking reference

### Method 4: Check Your User's Bookings
Run Query #5 from `GET_BOOKING_REFERENCES.sql`:
```sql
-- Replace 'your-email@example.com' with your actual email
SELECT booking_reference
FROM bookings b
JOIN auth.users u ON b.user_id = u.id
WHERE u.email = 'your-email@example.com';
```

---

## 🧪 Testing the Tracking System

### Test 1: Basic Tracking ✅
1. Get a booking reference (use methods above)
2. Go to: `http://localhost:3000/track-bus`
3. Enter the booking reference (e.g., `BK123456`)
4. Click "Track Bus"
5. ✅ **Expected:** See booking details, bus info, and tracking data

### Test 2: Direct URL ✅
1. Use URL with booking reference:
   ```
   http://localhost:3000/track-bus?booking=BK123456
   ```
2. ✅ **Expected:** Tracking page loads automatically with data

### Test 3: View Tracking Data in Database ✅
Run in Supabase SQL Editor:
```sql
SELECT * FROM booking_tracking WHERE booking_reference = 'BK123456';
```
✅ **Expected:** See all booking and tracking details

### Test 4: Invalid Booking Reference ✅
1. Go to tracking page
2. Enter: `BK999999` (invalid)
3. Click "Track Bus"
4. ✅ **Expected:** Error message "Booking not found"

### Test 5: Auto-Refresh ✅
1. Track a valid booking
2. Wait 30 seconds
3. ✅ **Expected:** Data refreshes automatically

### Test 6: Google Maps Link ✅
1. Track a booking with tracking data
2. Click "View on Google Maps"
3. ✅ **Expected:** Opens Google Maps with bus location

---

## 📱 User Journey Testing

### Scenario A: New Booking
```
1. User books ticket → Gets BK123456
2. Clicks "Track My Bus" on success page
3. Sees live tracking immediately
✅ Success!
```

### Scenario B: Existing Booking
```
1. User logs in
2. Goes to "My Bookings"
3. Sees booking with reference BK123456
4. Clicks "Track" button
5. Sees live tracking
✅ Success!
```

### Scenario C: Manual Entry
```
1. User has booking reference from email
2. Goes to homepage
3. Enters BK123456 in Quick Track
4. Clicks search
5. Sees live tracking
✅ Success!
```

---

## 🔧 Troubleshooting

### Problem: "Booking not found"
**Cause:** Booking doesn't exist or status is not 'confirmed'

**Solution:**
```sql
-- Check booking exists
SELECT booking_reference, booking_status 
FROM bookings 
WHERE booking_reference = 'BK123456';

-- If exists but wrong status, update it
UPDATE bookings 
SET booking_status = 'confirmed' 
WHERE booking_reference = 'BK123456';
```

### Problem: "No tracking data available"
**Cause:** No tracking record for this schedule/date

**Solution:**
```sql
-- Check if tracking exists
SELECT * FROM bus_tracking 
WHERE schedule_id = (
  SELECT schedule_id FROM bookings 
  WHERE booking_reference = 'BK123456'
)
AND travel_date = (
  SELECT booking_date FROM bookings 
  WHERE booking_reference = 'BK123456'
);

-- If not, run seed_tracking.sql again
```

### Problem: "Cannot read properties of null"
**Cause:** Frontend trying to access tracking data that doesn't exist

**Solution:**
1. Verify booking has tracking data
2. Check API response: `/api/track?reference=BK123456`
3. Should return tracking object or null

### Problem: Migration fails with "already exists"
**Cause:** Tables already created

**Solution:**
- The migration file uses `IF NOT EXISTS`
- If it still fails, tables are already there
- Skip to seed_tracking.sql instead

### Problem: No buses showing in tracking
**Cause:** Schedules don't exist or wrong bus numbers

**Solution:**
```sql
-- Check what schedules exist
SELECT 
  b.bus_number,
  r.from_city || ' → ' || r.to_city as route,
  bs.departure_time
FROM bus_schedules bs
JOIN buses b ON bs.bus_id = b.id
JOIN routes r ON bs.route_id = r.id
WHERE bs.is_active = true;

-- Update seed_tracking.sql with correct bus numbers
```

---

## ✅ Quick Verification Checklist

After setup, verify these:

- [ ] Migration completed without errors
- [ ] Seed data inserted successfully
- [ ] Can query `booking_tracking` view
- [ ] At least one booking has a booking_reference
- [ ] At least one bus_tracking record exists
- [ ] Can access `/track-bus` page
- [ ] Can enter booking reference and see results
- [ ] Tracking data displays correctly
- [ ] Error handling works for invalid references
- [ ] Auto-refresh works (wait 30 seconds)

---

## 📊 Useful Queries for Testing

### See all available tracking:
```sql
SELECT 
  booking_reference,
  current_location,
  tracking_status,
  from_city || ' → ' || to_city as route
FROM booking_tracking
WHERE tracking_status IS NOT NULL;
```

### Create 5 test bookings at once:
```sql
-- Run Query #8 from GET_BOOKING_REFERENCES.sql
```

### Update bus location (simulate movement):
```sql
UPDATE bus_tracking
SET 
  current_location = 'New Location',
  latitude = 7.5000,
  longitude = 80.5000,
  speed = 65.0,
  last_updated = NOW()
WHERE travel_date = CURRENT_DATE
LIMIT 1;
```

### Check tracking for specific booking:
```sql
SELECT * FROM booking_tracking 
WHERE booking_reference = 'BK123456';
```

---

## 🎉 Success Criteria

Your tracking system is working if:

✅ Users can create bookings and get booking references  
✅ Booking references are auto-generated (format: BK######)  
✅ Users can track buses using booking references  
✅ Tracking shows: location, speed, status, stops  
✅ Invalid references show error messages  
✅ Page auto-refreshes every 30 seconds  
✅ Google Maps link works  
✅ Driver contact shows (if available)  

---

## 📚 Related Files

- `TRACKING_SETUP.md` - Detailed technical documentation
- `HOW_TO_FIND_TRACKING_NUMBER.md` - User guide
- `TEST_QUERIES.sql` - Original test queries
- `GET_BOOKING_REFERENCES.sql` - Quick reference queries
- `migration_add_tracking.sql` - Database migration
- `seed_tracking.sql` - Sample tracking data

---

## 🆘 Need Help?

1. Check the browser console for errors
2. Check Supabase logs in Dashboard
3. Verify database schema matches expected structure
4. Test API endpoint directly: `/api/track?reference=BK123456`
5. Check that RLS policies allow access to `booking_tracking` view

---

## 🚀 Next Steps

Once basic tracking works:

1. Add real-time location updates (WebSocket/Supabase Realtime)
2. Integrate actual maps (Leaflet/Google Maps)
3. Add push notifications for delays
4. Create admin dashboard for managing tracking
5. Add driver mobile app for GPS updates
6. Implement ETA calculation
7. Add historical route visualization

---

**Happy Tracking! 🚌📍**
