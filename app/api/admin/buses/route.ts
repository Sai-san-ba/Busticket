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

    const { data: buses, error } = await supabase
      .from('buses')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error

    return NextResponse.json({ buses })
  } catch (error) {
    console.error('Error fetching buses:', error)
    return NextResponse.json(
      { error: 'Failed to fetch buses' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (!(await isAdmin(supabase, user.id))) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = await request.json()
    const {
      bus_number,
      operator_name,
      bus_type,
      total_seats,
      seat_layout,
      facilities,
    } = body

    if (!bus_number || !operator_name || !bus_type || !total_seats || !seat_layout) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const { data: bus, error } = await supabase
      .from('buses')
      .insert({
        bus_number,
        operator_name,
        bus_type,
        total_seats,
        seat_layout,
        facilities: facilities || [],
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ bus })
  } catch (error) {
    console.error('Error creating bus:', error)
    return NextResponse.json(
      { error: 'Failed to create bus' },
      { status: 500 }
    )
  }
}
