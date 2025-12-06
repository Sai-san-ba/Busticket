import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const from = searchParams.get('from')
  const to = searchParams.get('to')
  const date = searchParams.get('date')

  if (!from || !to || !date) {
    return NextResponse.json(
      { error: 'Missing required parameters' },
      { status: 400 }
    )
  }

  try {
    const supabase = await createClient()

    // Get the day of week for the search date
    const searchDate = new Date(date + 'T00:00:00')
    const dayOfWeek = searchDate.getDay()

    console.log('Search params:', { from, to, date, dayOfWeek })

    // Find routes matching the cities (case-insensitive)
    const { data: routes, error: routesError } = await supabase
      .from('routes')
      .select('id, from_city, to_city')
      .ilike('from_city', from)
      .ilike('to_city', to)
      .eq('is_active', true)

    if (routesError) {
      console.error('Routes error:', routesError)
      throw routesError
    }

    console.log('Found routes:', routes)

    if (!routes || routes.length === 0) {
      return NextResponse.json({ buses: [], message: 'No routes found for these cities' })
    }

    const routeIds = routes.map(r => r.id)

    // Get schedules for these routes that operate on the search day
    const { data: schedules, error: schedulesError } = await supabase
      .from('bus_schedules')
      .select(`
        *,
        bus:buses(*),
        route:routes(*)
      `)
      .in('route_id', routeIds)
      .eq('is_active', true)
      .contains('days_of_week', [dayOfWeek])

    if (schedulesError) {
      console.error('Schedules error:', schedulesError)
      throw schedulesError
    }

    console.log('Found schedules:', schedules?.length || 0)

    // Get seat availability for each schedule
    const schedulesWithAvailability = await Promise.all(
      (schedules || []).map(async (schedule) => {
        const { data: seatData } = await supabase
          .from('seat_availability')
          .select('booked_seats')
          .eq('schedule_id', schedule.id)
          .eq('travel_date', date)
          .single()

        const bookedSeats = seatData?.booked_seats || []
        const totalSeats = schedule.bus.total_seats
        const availableSeats = totalSeats - bookedSeats.length

        return {
          id: schedule.id,
          operator: schedule.bus.operator_name,
          busType: schedule.bus.bus_type,
          departureTime: schedule.departure_time,
          arrivalTime: schedule.arrival_time,
          duration: `${schedule.route.duration_hours}h`,
          price: parseFloat(schedule.price),
          availableSeats,
          totalSeats,
          facilities: schedule.bus.facilities,
          rating: 4.2, // You can add a ratings table later
          busId: schedule.bus.id,
          scheduleId: schedule.id,
          routeId: schedule.route.id,
        }
      })
    )

    return NextResponse.json({ buses: schedulesWithAvailability })
  } catch (error) {
    console.error('Error searching buses:', error)
    return NextResponse.json(
      { error: 'Failed to search buses' },
      { status: 500 }
    )
  }
}
