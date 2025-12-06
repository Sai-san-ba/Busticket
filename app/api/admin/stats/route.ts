import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

async function isAdmin(supabase: any, userId: string) {
  const { data, error } = await supabase
    .from('profiles')
    .select('is_admin')
    .eq('id', userId)
    .single()

  return !error && data?.is_admin === true
}

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (!(await isAdmin(supabase, user.id))) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Get total bookings
    const { count: totalBookings } = await supabase
      .from('bookings')
      .select('*', { count: 'exact', head: true })

    // Get total revenue
    const { data: revenueData } = await supabase
      .from('bookings')
      .select('total_amount')
      .eq('payment_status', 'completed')

    const totalRevenue = revenueData?.reduce((sum, booking) => 
      sum + parseFloat(booking.total_amount), 0
    ) || 0

    // Get active routes
    const { count: activeRoutes } = await supabase
      .from('routes')
      .select('*', { count: 'exact', head: true })
      .eq('is_active', true)

    // Get active buses
    const { count: activeBuses } = await supabase
      .from('buses')
      .select('*', { count: 'exact', head: true })
      .eq('is_active', true)

    // Get recent bookings
    const { data: recentBookings } = await supabase
      .from('bookings')
      .select(`
        *,
        schedule:bus_schedules(
          *,
          bus:buses(*),
          route:routes(*)
        ),
        user:profiles(full_name)
      `)
      .order('created_at', { ascending: false })
      .limit(10)

    return NextResponse.json({
      stats: {
        totalBookings: totalBookings || 0,
        totalRevenue,
        activeRoutes: activeRoutes || 0,
        activeBuses: activeBuses || 0,
      },
      recentBookings,
    })
  } catch (error) {
    console.error('Error fetching stats:', error)
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    )
  }
}
