# How Users Can Find Their Tracking Number (Booking Reference)

## 📱 Multiple Ways Users Can Get Their Booking Reference

### 1. **After Booking - Booking Success Page** ⭐ PRIMARY METHOD
When a user completes a booking, they immediately see their booking reference on the confirmation page.

**Location:** `app/booking-success/page.tsx`

The booking reference is displayed:
- ✅ Large, prominent display at top
- ✅ Copy button next to it
- ✅ Direct "Track Bus" button
- ✅ Email/SMS notification with reference

---

### 2. **Profile/My Bookings Page** ⭐ RECOMMENDED
Users can view all their bookings with tracking numbers.

**Location:** `app/profile/page.tsx`

Shows:
- ✅ List of all bookings
- ✅ Booking reference for each
- ✅ "Track Bus" button for each booking
- ✅ Filter by upcoming/past bookings

---

### 3. **Email Confirmation** 📧
After booking, users receive an email with:
- Booking reference number
- Direct tracking link
- QR code for quick access

---

### 4. **SMS Notification** 📱
Users get an SMS with:
- Booking reference
- Short tracking link

---

### 5. **Homepage Quick Track** 🏠
Users can enter their booking reference directly on the homepage.

**Location:** `app/page.tsx` (QuickTrack component)

---

### 6. **Direct Tracking Page** 🔍
Users can go directly to `/track-bus` and enter their booking reference.

---

## 🎯 Implementation Checklist

### ✅ Already Implemented:
- [x] Booking reference auto-generation in database
- [x] Track bus page with input field
- [x] Quick track component on homepage
- [x] API endpoint for tracking

### 📝 Needs Implementation:
- [ ] Update booking success page to show booking reference prominently
- [ ] Update profile page to show booking references
- [ ] Add "Track This Bus" button in booking list
- [ ] Send booking reference in confirmation email
- [ ] Send booking reference in SMS

---

## 🚀 Quick Implementation Guide

### Step 1: Update Booking Success Page
Show booking reference prominently with copy and track buttons.

### Step 2: Update Profile Page
Display booking references in the bookings list.

### Step 3: Add Track Button
Add "Track Bus" button next to each booking.

### Step 4: Email Template (Optional)
Send booking confirmation email with tracking link.

---

## 📋 Sample User Flow

### Scenario 1: Just Booked
1. User completes payment
2. Redirected to booking success page
3. **Sees booking reference: BK123456** (big, bold)
4. Clicks "Track My Bus" button
5. Taken directly to tracking page

### Scenario 2: Checking Later
1. User logs in
2. Goes to "My Bookings"
3. Sees list of bookings with references
4. Clicks "Track" button next to booking
5. Taken to tracking page

### Scenario 3: Lost Reference
1. User goes to profile
2. Sees all past bookings
3. Finds the relevant booking by date/route
4. Gets the booking reference
5. Uses it to track

### Scenario 4: From Email/SMS
1. User receives confirmation email
2. Email contains: "Your booking reference: BK123456"
3. Email has link: "Track your bus: [Click Here]"
4. Clicks link → Tracking page opens

---

## 💡 Best Practices

### Make It Obvious:
- ✅ Show booking reference in large, bold text
- ✅ Use contrasting color
- ✅ Add copy icon/button
- ✅ Highlight with border or background

### Make It Accessible:
- ✅ Multiple places to find it
- ✅ Easy to copy
- ✅ Direct tracking links
- ✅ QR code option

### Communicate Clearly:
- ✅ "Your tracking number is..."
- ✅ "Use this to track your bus"
- ✅ "Save this for reference"
- ✅ Show example: "e.g., BK123456"

---

## 🎨 UI Examples

### Booking Success Page:
```
┌─────────────────────────────────────┐
│   ✓  Booking Confirmed!             │
│                                     │
│   Your Booking Reference:           │
│   ┌──────────────────────┐         │
│   │  BK123456  [Copy]     │  ← Big │
│   └──────────────────────┘         │
│                                     │
│   [Track My Bus]  [Download Ticket]│
└─────────────────────────────────────┘
```

### My Bookings Page:
```
┌─────────────────────────────────────┐
│  Colombo → Kandy                    │
│  Bus: WP-CAB-1234                   │
│  Date: Oct 17, 2025                 │
│  Reference: BK123456  [Track] [📋] │
└─────────────────────────────────────┘
```

### Email Template:
```
Subject: Booking Confirmed - BK123456

Hi [Name],

Your bus booking is confirmed!

Booking Reference: BK123456
Route: Colombo → Kandy
Date: October 17, 2025
Time: 06:00 AM

[Track Your Bus] ← Button with link

Track your bus in real-time:
https://yourapp.com/track-bus?booking=BK123456
```

---

## 🔧 Technical Implementation

### 1. Database Query to Get Booking Reference:
```sql
SELECT booking_reference, booking_date, booking_status
FROM bookings
WHERE user_id = 'user-uuid'
ORDER BY created_at DESC;
```

### 2. API Endpoint for User Bookings:
```typescript
// app/api/user/bookings/route.ts
export async function GET(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  const { data } = await supabase
    .from('bookings')
    .select('booking_reference, booking_date, booking_status, ...')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
  
  return NextResponse.json(data)
}
```

### 3. Copy to Clipboard Function:
```typescript
const copyBookingReference = (ref: string) => {
  navigator.clipboard.writeText(ref)
  toast.success('Booking reference copied!')
}
```

### 4. Direct Track Link:
```typescript
const trackBus = (ref: string) => {
  window.location.href = `/track-bus?booking=${ref}`
}
```

---

## 📊 Analytics Tracking (Optional)

Track how users find their booking references:
- Clicked "Track" from booking success page
- Clicked "Track" from profile page
- Manually entered on track page
- Came from email link
- Came from SMS link

This helps understand user behavior and improve UX.

---

## ✅ Summary

Users can find their booking reference through:

1. **Booking Success Page** (immediately after booking) ⭐
2. **Profile/My Bookings Page** (anytime) ⭐
3. **Email Confirmation** (sent after booking)
4. **SMS** (sent after booking)
5. **Customer Support** (if lost)

The booking reference is **auto-generated** and **stored in the database**, so users can always retrieve it!
