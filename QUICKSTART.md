# Quick Start Guide

## 🚀 Getting Started in 5 Minutes

### Step 1: Set up Supabase

1. **Create Supabase Account**
   - Visit [https://supabase.com](https://supabase.com)
   - Sign up or log in
   - Click "New Project"
   - Fill in:
     - Project name: `bus-booking`
     - Database password: (save this!)
     - Region: Choose closest to you
   - Click "Create new project"
   - Wait 2-3 minutes for setup

2. **Create Database Tables**
   - In Supabase dashboard, go to "SQL Editor"
   - Copy entire content from `supabase/schema.sql`
   - Paste in SQL Editor
   - Click "Run" (bottom right)
   - ✅ You should see "Success" messages

3. **Add Sample Data** (Optional but recommended)
   - In SQL Editor, click "New query"
   - Copy content from `supabase/seed.sql`
   - Paste and click "Run"
   - ✅ Sample routes and buses are now added

### Step 2: Configure Your App

1. **Get API Keys**
   - In Supabase, go to: Settings (gear icon) > API
   - You'll see:
     - Project URL: `https://xxxxx.supabase.co`
     - `anon` `public` key: `eyJhbG...`

2. **Create Environment File**
   ```bash
   cp .env.local.example .env.local
   ```

3. **Add Your Keys to `.env.local`**
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6...
   ```

### Step 3: Install & Run

```bash
# Install dependencies (if not already done)
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) 🎉

### Step 4: Create Your Account

1. Click "Sign Up"
2. Enter your details
3. You'll receive a verification email (check spam folder)
4. Click the verification link
5. Login with your credentials

### Step 5: Make Yourself Admin (Optional)

To access the admin dashboard:

**Option 1: Via Supabase Dashboard**
1. Go to Supabase > Table Editor > `profiles`
2. Find your user row
3. Click on `is_admin` column
4. Change `false` to `true`
5. Save

**Option 2: Via SQL**
```sql
UPDATE profiles 
SET is_admin = true 
WHERE id = 'your-user-id-here';
```

Now visit `/admin` to access the dashboard!

---

## 🧪 Testing the System

### Test User Flow

1. **Search for a bus**
   - From: Mumbai
   - To: Pune
   - Date: Any future date
   - Click "Search Buses"

2. **Select a bus**
   - View available buses
   - Click "Select Seats"

3. **Book seats**
   - Choose seats on the seat map
   - Enter passenger details
   - Select payment method
   - Confirm booking

4. **View your booking**
   - Go to "My Bookings"
   - See booking details

### Test Admin Flow

1. Go to `/admin`
2. View dashboard statistics
3. Try:
   - Adding a new route
   - Adding a new bus
   - Viewing all bookings

---

## 📁 Project Structure Explained

```
├── app/
│   ├── api/                  # Backend API endpoints
│   │   ├── buses/           # Bus search & seat availability
│   │   ├── bookings/        # Create & view bookings
│   │   └── admin/           # Admin-only endpoints
│   │
│   ├── auth/                # Login & Signup pages
│   ├── admin/               # Admin dashboard
│   ├── seat-selection/      # Seat picker page
│   ├── payment/             # Payment page
│   ├── booking-success/     # Confirmation page
│   └── page.tsx             # Home page (search)
│
├── components/              # Reusable React components
│   ├── ui/                 # shadcn/ui base components
│   ├── bus-search-form.tsx
│   ├── bus-results.tsx
│   ├── seat-map.tsx
│   └── ...
│
├── lib/
│   ├── supabase/           # Supabase client configuration
│   │   ├── client.ts       # For client components
│   │   ├── server.ts       # For server components
│   │   └── middleware.ts   # For middleware
│   │
│   ├── database.types.ts   # TypeScript database types
│   └── utils.ts            # Helper functions
│
├── supabase/
│   ├── schema.sql          # Database structure
│   └── seed.sql            # Sample data
│
├── middleware.ts           # Auth middleware
└── .env.local             # Your secret keys (DON'T COMMIT!)
```

---

## 🔧 Common Issues & Solutions

### Issue: "Invalid API key"
**Solution:**
- Double-check `.env.local` has correct keys
- Restart dev server: `npm run dev`
- Keys should NOT have quotes

### Issue: "Can't create account"
**Solution:**
- Check Supabase > Authentication > Settings
- Ensure "Enable email signups" is ON
- Email confirmation can be disabled for testing

### Issue: "No buses found"
**Solution:**
- Make sure you ran `seed.sql`
- Check cities match exactly (case-sensitive)
- Try: Mumbai → Pune

### Issue: "Can't access /admin"
**Solution:**
- Make sure `is_admin = true` in profiles table
- Logout and login again

### Issue: "Booking fails"
**Solution:**
- Ensure you're logged in
- Check browser console for errors
- Verify seat_availability table exists

---

## 🎨 Customization Ideas

### Change Colors/Theme
Edit `app/globals.css` - update CSS variables

### Add More Cities
Insert into `routes` table via SQL or admin panel

### Change Seat Layout
Modify `seat_layout` JSON in buses table

### Add Email Notifications
- Use Supabase Edge Functions
- Or integrate SendGrid/Mailgun

---

## 🚀 Deployment

### Deploy to Vercel (Recommended)

1. Push code to GitHub
2. Visit [vercel.com](https://vercel.com)
3. Click "Import Project"
4. Select your repository
5. Add environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
6. Click "Deploy"

Your app will be live at `your-app.vercel.app`!

### Update Supabase Settings

After deployment:
1. Go to Supabase > Authentication > URL Configuration
2. Add your Vercel URL to:
   - Site URL: `https://your-app.vercel.app`
   - Redirect URLs: `https://your-app.vercel.app/**`

---

## 📚 Learn More

### Technologies Used

- **Next.js 14**: React framework with App Router
- **Supabase**: Backend (PostgreSQL + Auth)
- **TypeScript**: Type-safe code
- **Tailwind CSS**: Styling
- **shadcn/ui**: UI components

### Useful Resources

- [Next.js Docs](https://nextjs.org/docs)
- [Supabase Docs](https://supabase.com/docs)
- [Tailwind CSS](https://tailwindcss.com)

---

## 🆘 Need Help?

1. Check the [README.md](./README.md) for detailed docs
2. Review Supabase logs: Dashboard > Logs
3. Check browser console for errors
4. Review Network tab for API errors

---

## ✅ Checklist

- [ ] Supabase project created
- [ ] Database schema applied (`schema.sql`)
- [ ] Sample data added (`seed.sql`)
- [ ] `.env.local` file created with correct keys
- [ ] Dependencies installed (`npm install`)
- [ ] Dev server running (`npm run dev`)
- [ ] Account created and verified
- [ ] Admin access granted (if needed)
- [ ] Test booking completed successfully

**All done?** You're ready to customize and build! 🎉
