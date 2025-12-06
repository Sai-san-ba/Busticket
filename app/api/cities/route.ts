import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  try {
    const supabase = await createClient()

    // Get all unique cities from routes
    const { data: routes, error } = await supabase
      .from('routes')
      .select('from_city, to_city')
      .eq('is_active', true)

    if (error) throw error

    // Extract unique cities
    const citiesSet = new Set<string>()
    routes?.forEach(route => {
      citiesSet.add(route.from_city)
      citiesSet.add(route.to_city)
    })

    const cities = Array.from(citiesSet).sort()

    return NextResponse.json({ cities })
  } catch (error) {
    console.error('Error fetching cities:', error)
    return NextResponse.json(
      { error: 'Failed to fetch cities' },
      { status: 500 }
    )
  }
}
