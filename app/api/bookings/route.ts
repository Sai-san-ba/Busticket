import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()

    // Check if user is authenticated
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const {
      scheduleId,
      bookingDate,
      passengerDetails,
      seats,
      totalAmount,
      paymentMethod,
    } = body

    // Validate required fields
    if (!scheduleId || !bookingDate || !passengerDetails || !seats || !totalAmount) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Start a transaction-like operation
    // 1. Check if seats are still available
    const { data: seatAvailability, error: seatCheckError } = await supabase
      .from('seat_availability')
      .select('booked_seats')
      .eq('schedule_id', scheduleId)
      .eq('travel_date', bookingDate)
      .single()

    if (seatCheckError && seatCheckError.code !== 'PGRST116') {
      throw seatCheckError
    }

    const currentBookedSeats = seatAvailability?.booked_seats || []
    const requestedSeats = seats as string[]

    // Check for conflicts
    const hasConflict = requestedSeats.some(seat => 
      currentBookedSeats.includes(seat)
    )

    if (hasConflict) {
      return NextResponse.json(
        { error: 'Some seats are no longer available' },
        { status: 409 }
      )
    }

    // 2. Create the booking
    const { data: booking, error: bookingError } = await supabase
      .from('bookings')
      .insert({
        user_id: user.id,
        schedule_id: scheduleId,
        booking_date: bookingDate,
        passenger_details: passengerDetails,
        seats: seats,
        total_amount: totalAmount,
        booking_status: 'confirmed',
        payment_status: 'completed',
        payment_method: paymentMethod,
      })
      .select()
      .single()

    if (bookingError) throw bookingError

    // 3. Update seat availability
    const updatedBookedSeats = [...currentBookedSeats, ...requestedSeats]

    if (seatAvailability) {
      // Update existing record
      const { error: updateError } = await supabase
        .from('seat_availability')
        .update({ booked_seats: updatedBookedSeats })
        .eq('schedule_id', scheduleId)
        .eq('travel_date', bookingDate)

      if (updateError) throw updateError
    } else {
      // Create new record
      const { error: insertError } = await supabase
        .from('seat_availability')
        .insert({
          schedule_id: scheduleId,
          travel_date: bookingDate,
          booked_seats: updatedBookedSeats,
        })

      if (insertError) throw insertError
    }

    return NextResponse.json({
      success: true,
      booking,
    })
  } catch (error) {
    console.error('Error creating booking:', error)
    return NextResponse.json(
      { error: 'Failed to create booking' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()

    // Check if user is authenticated
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Get user's bookings
    const { data: bookings, error: bookingsError } = await supabase
      .from('bookings')
      .select(`
        *,
        schedule:bus_schedules(
          *,
          bus:buses(*),
          route:routes(*)
        )
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (bookingsError) throw bookingsError

    return NextResponse.json({ bookings })
  } catch (error) {
    console.error('Error fetching bookings:', error)
    return NextResponse.json(
      { error: 'Failed to fetch bookings' },
      { status: 500 }
    )
  }
}
