import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const bookingReference = searchParams.get('reference')

  if (!bookingReference) {
    return NextResponse.json(
      { error: 'Booking reference is required' },
      { status: 400 }
    )
  }

  try {
    const supabase = await createClient()

    // Fetch tracking data from the view
    const { data, error } = await supabase
      .from('booking_tracking')
      .select('*')
      .eq('booking_reference', bookingReference.toUpperCase())
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Booking not found. Please check your booking reference.' },
          { status: 404 }
        )
      }
      throw error
    }

    if (!data) {
      return NextResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      )
    }

    // Format the response
    const response = {
      bookingReference: data.booking_reference,
      bookingStatus: data.booking_status,
      seats: data.seats,
      bus: {
        busNumber: data.bus_number,
        operatorName: data.operator_name,
        busType: data.bus_type,
      },
      route: {
        from: data.from_city,
        to: data.to_city,
        distance: data.distance_km,
        departureTime: data.departure_time,
        arrivalTime: data.arrival_time,
      },
      tracking: data.current_location ? {
        currentLocation: data.current_location,
        latitude: parseFloat(data.latitude),
        longitude: parseFloat(data.longitude),
        speed: data.speed ? parseFloat(data.speed) : 0,
        heading: data.heading ? parseFloat(data.heading) : 0,
        status: data.tracking_status,
        delayMinutes: data.delay_minutes || 0,
        nextStop: data.next_stop,
        completedStops: data.completed_stops || [],
        upcomingStops: data.upcoming_stops || [],
        driverContact: data.driver_contact,
        lastUpdated: data.last_updated,
      } : null,
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Error fetching tracking data:', error)
    return NextResponse.json(
      { error: 'Failed to fetch tracking data' },
      { status: 500 }
    )
  }
}
