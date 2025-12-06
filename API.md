# API Documentation

## Base URL
Development: `http://localhost:3000/api`
Production: `https://your-domain.com/api`

---

## Public Endpoints

### 1. Search Buses
**GET** `/api/buses/search`

Search for available buses on a specific route and date.

**Query Parameters:**
```typescript
from: string      // Origin city (required)
to: string        // Destination city (required)
date: string      // Travel date in YYYY-MM-DD format (required)
```

**Example Request:**
```bash
GET /api/buses/search?from=Mumbai&to=Pune&date=2025-10-20
```

**Success Response (200):**
```json
{
  "buses": [
    {
      "id": "uuid",
      "operator": "Express Lines",
      "busType": "AC Sleeper",
      "departureTime": "22:30",
      "arrivalTime": "06:00",
      "duration": "7.5h",
      "price": 1200,
      "availableSeats": 12,
      "totalSeats": 40,
      "facilities": ["AC", "WiFi", "Charging Port"],
      "rating": 4.2,
      "busId": "uuid",
      "scheduleId": "uuid",
      "routeId": "uuid"
    }
  ]
}
```

**Error Response (400):**
```json
{
  "error": "Missing required parameters"
}
```

---

### 2. Get Seat Availability
**GET** `/api/buses/[id]/seats`

Get seat layout and availability for a specific bus schedule.

**Path Parameters:**
```typescript
id: string    // Schedule ID (required)
```

**Query Parameters:**
```typescript
date: string  // Travel date in YYYY-MM-DD format (required)
```

**Example Request:**
```bash
GET /api/buses/abc123/seats?date=2025-10-20
```

**Success Response (200):**
```json
{
  "seatLayout": {
    "rows": 10,
    "seatsPerRow": 4,
    "layout": [
      [
        {"id": "1A", "type": "sleeper", "position": "left"},
        {"id": "1B", "type": "sleeper", "position": "left"},
        {"id": "1C", "type": "sleeper", "position": "right"},
        {"id": "1D", "type": "sleeper", "position": "right"}
      ]
    ]
  },
  "bookedSeats": ["1A", "1B", "3C"],
  "totalSeats": 40
}
```

---

### 3. Get Available Cities
**GET** `/api/cities`

Get list of all cities with available bus routes.

**Example Request:**
```bash
GET /api/cities
```

**Success Response (200):**
```json
{
  "cities": [
    "Ahmedabad",
    "Bangalore",
    "Chennai",
    "Delhi",
    "Mumbai",
    "Pune"
  ]
}
```

---

## Authenticated Endpoints

All authenticated endpoints require a valid Supabase session cookie.

### 4. Create Booking
**POST** `/api/bookings`

Create a new bus booking.

**Headers:**
```
Cookie: sb-access-token=xxx; sb-refresh-token=xxx
```

**Request Body:**
```json
{
  "scheduleId": "uuid",
  "bookingDate": "2025-10-20",
  "passengerDetails": [
    {
      "name": "John Doe",
      "age": 30,
      "gender": "male",
      "seatNumber": "1A"
    }
  ],
  "seats": ["1A", "1B"],
  "totalAmount": 2400,
  "paymentMethod": "Credit Card"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "booking": {
    "id": "uuid",
    "user_id": "uuid",
    "schedule_id": "uuid",
    "booking_date": "2025-10-20",
    "seats": ["1A", "1B"],
    "total_amount": 2400,
    "booking_status": "confirmed",
    "payment_status": "completed",
    "created_at": "2025-10-17T10:00:00Z"
  }
}
```

**Error Response (409):**
```json
{
  "error": "Some seats are no longer available"
}
```

**Error Response (401):**
```json
{
  "error": "Unauthorized"
}
```

---

### 5. Get User Bookings
**GET** `/api/bookings`

Get all bookings for the authenticated user.

**Headers:**
```
Cookie: sb-access-token=xxx; sb-refresh-token=xxx
```

**Success Response (200):**
```json
{
  "bookings": [
    {
      "id": "uuid",
      "booking_date": "2025-10-20",
      "seats": ["1A", "1B"],
      "total_amount": 2400,
      "booking_status": "confirmed",
      "payment_status": "completed",
      "schedule": {
        "departure_time": "22:30",
        "arrival_time": "06:00",
        "bus": {
          "operator_name": "Express Lines",
          "bus_type": "AC Sleeper"
        },
        "route": {
          "from_city": "Mumbai",
          "to_city": "Pune"
        }
      }
    }
  ]
}
```

---

### 6. Get User Profile
**GET** `/api/user`

Get authenticated user's profile information.

**Success Response (200):**
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "full_name": "John Doe",
    "phone": "+1234567890",
    "is_admin": false,
    "created_at": "2025-10-01T10:00:00Z"
  }
}
```

---

### 7. Update User Profile
**PUT** `/api/user`

Update authenticated user's profile.

**Request Body:**
```json
{
  "full_name": "John Doe",
  "phone": "+1234567890"
}
```

**Success Response (200):**
```json
{
  "profile": {
    "id": "uuid",
    "full_name": "John Doe",
    "phone": "+1234567890",
    "updated_at": "2025-10-17T10:00:00Z"
  }
}
```

---

## Admin Endpoints

All admin endpoints require authentication AND `is_admin = true` in the profiles table.

### 8. Get All Routes
**GET** `/api/admin/routes`

**Success Response (200):**
```json
{
  "routes": [
    {
      "id": "uuid",
      "from_city": "Mumbai",
      "to_city": "Pune",
      "distance_km": 150,
      "duration_hours": 3.5,
      "is_active": true,
      "created_at": "2025-10-01T10:00:00Z"
    }
  ]
}
```

**Error Response (403):**
```json
{
  "error": "Forbidden"
}
```

---

### 9. Create Route
**POST** `/api/admin/routes`

**Request Body:**
```json
{
  "from_city": "Mumbai",
  "to_city": "Pune",
  "distance_km": 150,
  "duration_hours": 3.5
}
```

**Success Response (200):**
```json
{
  "route": {
    "id": "uuid",
    "from_city": "Mumbai",
    "to_city": "Pune",
    "distance_km": 150,
    "duration_hours": 3.5,
    "is_active": true,
    "created_at": "2025-10-17T10:00:00Z"
  }
}
```

---

### 10. Get All Buses
**GET** `/api/admin/buses`

**Success Response (200):**
```json
{
  "buses": [
    {
      "id": "uuid",
      "bus_number": "MH12AB1234",
      "operator_name": "Express Lines",
      "bus_type": "AC Sleeper",
      "total_seats": 40,
      "facilities": ["AC", "WiFi"],
      "is_active": true
    }
  ]
}
```

---

### 11. Create Bus
**POST** `/api/admin/buses`

**Request Body:**
```json
{
  "bus_number": "MH12AB1234",
  "operator_name": "Express Lines",
  "bus_type": "AC Sleeper",
  "total_seats": 40,
  "seat_layout": {
    "rows": 10,
    "seatsPerRow": 4,
    "layout": [[...]]
  },
  "facilities": ["AC", "WiFi", "Charging Port"]
}
```

**Success Response (200):**
```json
{
  "bus": {
    "id": "uuid",
    "bus_number": "MH12AB1234",
    "operator_name": "Express Lines",
    "created_at": "2025-10-17T10:00:00Z"
  }
}
```

---

### 12. Get All Bookings (Admin)
**GET** `/api/admin/bookings`

**Success Response (200):**
```json
{
  "bookings": [
    {
      "id": "uuid",
      "booking_date": "2025-10-20",
      "total_amount": 2400,
      "booking_status": "confirmed",
      "user": {
        "full_name": "John Doe",
        "phone": "+1234567890"
      },
      "schedule": {
        "bus": {
          "operator_name": "Express Lines"
        },
        "route": {
          "from_city": "Mumbai",
          "to_city": "Pune"
        }
      }
    }
  ]
}
```

---

### 13. Get Dashboard Statistics
**GET** `/api/admin/stats`

**Success Response (200):**
```json
{
  "stats": {
    "totalBookings": 150,
    "totalRevenue": 180000,
    "activeRoutes": 8,
    "activeBuses": 12
  },
  "recentBookings": [
    {
      "id": "uuid",
      "booking_date": "2025-10-20",
      "total_amount": 2400,
      "user": {
        "full_name": "John Doe"
      }
    }
  ]
}
```

---

## Error Codes

| Code | Description |
|------|-------------|
| 200  | Success |
| 400  | Bad Request - Missing or invalid parameters |
| 401  | Unauthorized - Not authenticated |
| 403  | Forbidden - Not authorized (not admin) |
| 404  | Not Found - Resource doesn't exist |
| 409  | Conflict - Seat booking conflict |
| 500  | Internal Server Error |

---

## Rate Limiting

Currently not implemented. For production, consider:
- Supabase built-in rate limiting
- Vercel Edge Config
- Custom middleware with Redis

---

## Authentication

### How to Authenticate

1. **Sign up:**
```javascript
const { data, error } = await supabase.auth.signUp({
  email: 'user@example.com',
  password: 'password123'
})
```

2. **Sign in:**
```javascript
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'password123'
})
```

3. **Make authenticated requests:**
```javascript
// In browser - automatic via cookies
const response = await fetch('/api/bookings')

// In server components
const supabase = await createClient()
const { data } = await supabase.auth.getUser()
```

---

## Webhook Support

To add webhook support (for payment gateways, etc.):

```typescript
// app/api/webhooks/payment/route.ts
export async function POST(request: NextRequest) {
  const signature = request.headers.get('stripe-signature')
  // Verify webhook signature
  // Process payment
  // Update booking status
}
```

---

## Best Practices

1. **Always validate input** on the server side
2. **Use transactions** for critical operations (bookings)
3. **Log errors** for debugging
4. **Return appropriate HTTP status codes**
5. **Don't expose sensitive data** in error messages
6. **Use TypeScript** for type safety
7. **Test with real data** before production

---

## Testing

### Example using fetch:

```javascript
// Search buses
const buses = await fetch(
  '/api/buses/search?from=Mumbai&to=Pune&date=2025-10-20'
).then(r => r.json())

// Create booking (authenticated)
const booking = await fetch('/api/bookings', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    scheduleId: 'uuid',
    bookingDate: '2025-10-20',
    seats: ['1A'],
    totalAmount: 1200,
    passengerDetails: [...]
  })
}).then(r => r.json())
```

---

## Need Help?

- Check the [README.md](./README.md) for setup
- Review [QUICKSTART.md](./QUICKSTART.md) for quick start
- See [IMPLEMENTATION.md](./IMPLEMENTATION.md) for architecture
