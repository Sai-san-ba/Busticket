import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  try {
    const supabase = await createClient()

    // Get all routes
    const { data: routes, error: routesError } = await supabase
      .from('routes')
      .select('*')
      .eq('is_active', true)

    // Get all buses
    const { data: buses, error: busesError } = await supabase
      .from('buses')
      .select('id, bus_number, operator_name, bus_type, total_seats')
      .eq('is_active', true)

    // Get all schedules
    const { data: schedules, error: schedulesError } = await supabase
      .from('bus_schedules')
      .select('*, bus:buses(operator_name), route:routes(from_city, to_city)')
      .eq('is_active', true)

    return NextResponse.json({
      routes: routes || [],
      buses: buses || [],
      schedules: schedules || [],
      errors: {
        routesError,
        busesError,
        schedulesError
      }
    })
  } catch (error) {
    console.error('Error fetching debug data:', error)
    return NextResponse.json(
      { error: 'Failed to fetch debug data' },
      { status: 500 }
    )
  }
}
