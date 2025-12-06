export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          full_name: string | null
          phone: string | null
          created_at: string
          updated_at: string
          is_admin: boolean
        }
        Insert: {
          id: string
          full_name?: string | null
          phone?: string | null
          created_at?: string
          updated_at?: string
          is_admin?: boolean
        }
        Update: {
          id?: string
          full_name?: string | null
          phone?: string | null
          created_at?: string
          updated_at?: string
          is_admin?: boolean
        }
      }
      routes: {
        Row: {
          id: string
          from_city: string
          to_city: string
          distance_km: number
          duration_hours: number
          created_at: string
          updated_at: string
          is_active: boolean
        }
        Insert: {
          id?: string
          from_city: string
          to_city: string
          distance_km: number
          duration_hours: number
          created_at?: string
          updated_at?: string
          is_active?: boolean
        }
        Update: {
          id?: string
          from_city?: string
          to_city?: string
          distance_km?: number
          duration_hours?: number
          created_at?: string
          updated_at?: string
          is_active?: boolean
        }
      }
      buses: {
        Row: {
          id: string
          bus_number: string
          operator_name: string
          bus_type: string
          total_seats: number
          seat_layout: SeatLayout
          facilities: string[]
          created_at: string
          updated_at: string
          is_active: boolean
        }
        Insert: {
          id?: string
          bus_number: string
          operator_name: string
          bus_type: string
          total_seats: number
          seat_layout: SeatLayout
          facilities?: string[]
          created_at?: string
          updated_at?: string
          is_active?: boolean
        }
        Update: {
          id?: string
          bus_number?: string
          operator_name?: string
          bus_type?: string
          total_seats?: number
          seat_layout?: SeatLayout
          facilities?: string[]
          created_at?: string
          updated_at?: string
          is_active?: boolean
        }
      }
      bus_schedules: {
        Row: {
          id: string
          bus_id: string
          route_id: string
          departure_time: string
          arrival_time: string
          price: number
          days_of_week: number[]
          created_at: string
          updated_at: string
          is_active: boolean
        }
        Insert: {
          id?: string
          bus_id: string
          route_id: string
          departure_time: string
          arrival_time: string
          price: number
          days_of_week: number[]
          created_at?: string
          updated_at?: string
          is_active?: boolean
        }
        Update: {
          id?: string
          bus_id?: string
          route_id?: string
          departure_time?: string
          arrival_time?: string
          price?: number
          days_of_week?: number[]
          created_at?: string
          updated_at?: string
          is_active?: boolean
        }
      }
      bookings: {
        Row: {
          id: string
          user_id: string
          schedule_id: string
          booking_date: string
          passenger_details: PassengerDetail[]
          seats: string[]
          total_amount: number
          booking_status: 'pending' | 'confirmed' | 'cancelled' | 'completed'
          payment_status: 'pending' | 'completed' | 'failed' | 'refunded'
          payment_method: string | null
          payment_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          schedule_id: string
          booking_date: string
          passenger_details: PassengerDetail[]
          seats: string[]
          total_amount: number
          booking_status?: 'pending' | 'confirmed' | 'cancelled' | 'completed'
          payment_status?: 'pending' | 'completed' | 'failed' | 'refunded'
          payment_method?: string | null
          payment_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          schedule_id?: string
          booking_date?: string
          passenger_details?: PassengerDetail[]
          seats?: string[]
          total_amount?: number
          booking_status?: 'pending' | 'confirmed' | 'cancelled' | 'completed'
          payment_status?: 'pending' | 'completed' | 'failed' | 'refunded'
          payment_method?: string | null
          payment_id?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      seat_availability: {
        Row: {
          id: string
          schedule_id: string
          travel_date: string
          booked_seats: string[]
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          schedule_id: string
          travel_date: string
          booked_seats?: string[]
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          schedule_id?: string
          travel_date?: string
          booked_seats?: string[]
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}

// Helper types
export interface SeatLayout {
  rows: number
  seatsPerRow: number
  layout: SeatInfo[][]
}

export interface SeatInfo {
  id: string
  type: 'seat' | 'sleeper' | 'empty'
  position: 'left' | 'right' | 'middle'
}

export interface PassengerDetail {
  name: string
  age: number
  gender: 'male' | 'female' | 'other'
  seatNumber: string
}

// Extended types with relations
export type BusWithSchedule = Database['public']['Tables']['buses']['Row'] & {
  schedule: Database['public']['Tables']['bus_schedules']['Row']
  route: Database['public']['Tables']['routes']['Row']
}

export type BookingWithDetails = Database['public']['Tables']['bookings']['Row'] & {
  schedule: Database['public']['Tables']['bus_schedules']['Row']
  bus: Database['public']['Tables']['buses']['Row']
  route: Database['public']['Tables']['routes']['Row']
}

export type ScheduleWithDetails = Database['public']['Tables']['bus_schedules']['Row'] & {
  bus: Database['public']['Tables']['buses']['Row']
  route: Database['public']['Tables']['routes']['Row']
  available_seats?: number
}
