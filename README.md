# Bus Booking System - Setup Guide

This is a full-stack bus booking system built with Next.js and Supabase.

## Features

- 🔐 **Authentication**: User signup/login with Supabase Auth
- 🚌 **Bus Search**: Search buses by route and date
- 💺 **Seat Selection**: Interactive seat selection interface
- 💳 **Booking Management**: Create and manage bookings
- 👨‍💼 **Admin Dashboard**: Manage buses, routes, and view analytics
- 📱 **Responsive Design**: Works on all devices

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Auth, Row Level Security)
- **UI Components**: shadcn/ui, Radix UI
- **Deployment**: Vercel (frontend), Supabase (backend)

## Prerequisites

- Node.js 18+ installed
- A Supabase account (free tier works great)
- npm or pnpm installed

## Setup Instructions

### 1. Create a Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Create a new account or sign in
3. Create a new project
4. Wait for the project to be provisioned (takes ~2 minutes)

### 2. Set up the Database

1. In your Supabase project, go to the **SQL Editor**
2. Copy the contents of `supabase/schema.sql`
3. Paste it into the SQL Editor and click **Run**
4. This will create all necessary tables, policies, and functions

### 3. Configure Environment Variables

1. Copy `.env.local.example` to `.env.local`:
   ```bash
   cp .env.local.example .env.local
   ```

2. In your Supabase project dashboard:
   - Go to **Settings** > **API**
   - Copy the **Project URL** and paste it as `NEXT_PUBLIC_SUPABASE_URL`
   - Copy the **anon/public key** and paste it as `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - Copy the **service_role key** (optional) and paste it as `SUPABASE_SERVICE_ROLE_KEY`

Your `.env.local` should look like:
```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 4. Seed Sample Data (Optional)

Run the seed script to populate your database with sample data:

```bash
npm run seed
```

This will create:
- Sample routes (Mumbai to Pune, Delhi to Jaipur, etc.)
- Sample buses with different types
- Bus schedules
- An admin user (email: admin@busbooker.com, password: admin123)

### 5. Install Dependencies and Run

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 6. Create Admin User

To create an admin user:

1. Sign up for a new account through the UI
2. Go to Supabase Dashboard > **Table Editor** > **profiles**
3. Find your user and set `is_admin` to `true`

OR use SQL:
```sql
UPDATE profiles 
SET is_admin = true 
WHERE id = 'your-user-id';
```

## Project Structure

```
├── app/
│   ├── api/              # API routes
│   │   ├── buses/       # Bus search and seat availability
│   │   ├── bookings/    # Booking management
│   │   └── admin/       # Admin endpoints
│   ├── auth/            # Authentication pages
│   ├── admin/           # Admin dashboard
│   ├── booking/         # Booking flow pages
│   └── page.tsx         # Home page
├── components/          # React components
│   ├── ui/             # shadcn/ui components
│   └── ...             # Custom components
├── lib/
│   ├── supabase/       # Supabase client setup
│   ├── database.types.ts # TypeScript types
│   └── utils.ts        # Utility functions
├── supabase/
│   └── schema.sql      # Database schema
└── middleware.ts       # Auth middleware
```

## Database Schema

### Tables

- **profiles**: User profiles (extends auth.users)
- **routes**: Bus routes between cities
- **buses**: Bus information and seat layouts
- **bus_schedules**: Schedules for buses on routes
- **bookings**: Booking records
- **seat_availability**: Track booked seats per schedule/date

### Row Level Security

All tables have RLS enabled with policies for:
- Public read access for active routes and buses
- User-specific access for bookings
- Admin-only access for management operations

## Key Features Implementation

### Authentication Flow
- Users sign up with email/password
- Email verification required (can be disabled in Supabase settings)
- Session management via Supabase Auth cookies
- Middleware refreshes sessions automatically

### Bus Search
1. User selects from/to cities and date
2. API finds matching routes
3. Gets schedules that operate on the selected day
4. Calculates available seats from bookings
5. Returns sorted results

### Booking Flow
1. Select bus from search results
2. Choose seats from interactive seat map
3. Enter passenger details
4. Select payment method
5. Confirm booking (seats are locked)

### Admin Dashboard
- View statistics (bookings, revenue, etc.)
- Manage routes and buses
- View all bookings
- Create new schedules

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import project to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

### Supabase Configuration

Make sure to configure:
- **Auth providers** (email/password enabled)
- **Email templates** for verification
- **RLS policies** are enabled
- **API rate limiting** as needed

## Troubleshooting

### "Invalid API key" error
- Check that your `.env.local` file exists and has correct values
- Restart the dev server after changing env variables

### Can't create bookings
- Make sure you're logged in
- Check RLS policies in Supabase
- Verify the user has a profile record

### Seats not showing as booked
- Check `seat_availability` table has correct data
- Verify the date format is YYYY-MM-DD

## Sample Data

After seeding, you can:
- Search for buses from Mumbai to Pune
- Book seats on available buses
- Login as admin to manage the system

## Future Enhancements

- Payment gateway integration (Stripe, Razorpay)
- Email notifications for bookings
- SMS notifications
- Booking cancellation and refunds
- Multi-language support
- Mobile app (React Native)
- Real-time seat availability (Supabase Realtime)
- Reviews and ratings
- Loyalty program
- Promotional codes and discounts

## Support

For issues or questions:
- Check Supabase documentation: https://supabase.com/docs
- Check Next.js documentation: https://nextjs.org/docs
- Open an issue on GitHub

## License

MIT
