import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient()
    const searchParams = request.nextUrl.searchParams
    const date = searchParams.get('date')

    if (!date) {
      return NextResponse.json(
        { error: 'Date parameter is required' },
        { status: 400 }
      )
    }

    // Get the schedule with bus details
    const { data: schedule, error: scheduleError } = await supabase
      .from('bus_schedules')
      .select(`
        *,
        bus:buses(*)
      `)
      .eq('id', params.id)
      .single()

    if (scheduleError) throw scheduleError

    // Get seat availability for this date
    const { data: seatAvailability, error: seatError } = await supabase
      .from('seat_availability')
      .select('booked_seats')
      .eq('schedule_id', params.id)
      .eq('travel_date', date)
      .single()

    if (seatError && seatError.code !== 'PGRST116') { // PGRST116 = no rows returned
      throw seatError
    }

    const bookedSeats = seatAvailability?.booked_seats || []

    return NextResponse.json({
      seatLayout: schedule.bus.seat_layout,
      bookedSeats,
      totalSeats: schedule.bus.total_seats,
    })
  } catch (error) {
    console.error('Error fetching seat availability:', error)
    return NextResponse.json(
      { error: 'Failed to fetch seat availability' },
      { status: 500 }
    )
  }
}
