import type { Reservation, ReservationStatus } from '../types'

const now = new Date().toISOString()

const mockReservations: Reservation[] = [
  {
    id: 'res-sample-pending',
    customer_name: 'Alex Rivera',
    phone: '555-201-3344',
    guests: 2,
    reservation_date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
    reservation_time: '18:30',
    notes: 'Window seat if possible',
    status: 'Pending',
    created_at: now,
    updated_at: now,
  },
  {
    id: 'res-sample-approved',
    customer_name: 'Priya Nair',
    phone: '555-467-8899',
    guests: 5,
    reservation_date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
    reservation_time: '19:00',
    notes: null,
    status: 'Approved',
    created_at: now,
    updated_at: now,
  },
]

export interface ReservationFilters {
  reservation_date?: string
  status?: ReservationStatus
}

export interface CreateReservationRow {
  customer_name: string
  phone: string
  guests: number
  reservation_date: string
  reservation_time: string
  notes?: string | null
}

/**
 * Data-access layer for the `reservations` table.
 *
 * TODO(supabase): Replace the in-memory array with real queries.
 * - findAll         -> supabase.from('reservations').select('*').match(filters)
 * - findById        -> supabase.from('reservations').select('*').eq('id', id).single()
 * - create          -> supabase.from('reservations').insert({ ...data, status: 'Pending' }).select().single()
 * - updateStatus    -> supabase.from('reservations').update({ status }).eq('id', id).select().single()
 * - remove          -> supabase.from('reservations').delete().eq('id', id)
 */
export class ReservationRepository {
  static async findAll(filters: ReservationFilters = {}): Promise<Reservation[]> {
    // TODO(supabase): supabase.from('reservations').select('*').match(filters)
    return mockReservations.filter((reservation) => {
      if (filters.reservation_date && reservation.reservation_date !== filters.reservation_date) return false
      if (filters.status && reservation.status !== filters.status) return false
      return true
    })
  }

  static async findById(id: string): Promise<Reservation | null> {
    // TODO(supabase): supabase.from('reservations').select('*').eq('id', id).single()
    return mockReservations.find((reservation) => reservation.id === id) ?? null
  }

  static async create(data: CreateReservationRow): Promise<Reservation> {
    // TODO(supabase): supabase.from('reservations').insert({ ...data, status: 'Pending' }).select().single()
    const timestamp = new Date().toISOString()
    const reservation: Reservation = {
      id: `res-${crypto.randomUUID()}`,
      notes: null,
      status: 'Pending',
      created_at: timestamp,
      updated_at: timestamp,
      ...data,
    }
    mockReservations.push(reservation)
    return reservation
  }

  static async updateStatus(id: string, status: ReservationStatus): Promise<Reservation | null> {
    // TODO(supabase): supabase.from('reservations').update({ status }).eq('id', id).select().single()
    const index = mockReservations.findIndex((reservation) => reservation.id === id)
    if (index === -1) return null
    mockReservations[index] = { ...mockReservations[index], status, updated_at: new Date().toISOString() }
    return mockReservations[index]
  }

  static async remove(id: string): Promise<void> {
    // TODO(supabase): supabase.from('reservations').delete().eq('id', id)
    const index = mockReservations.findIndex((reservation) => reservation.id === id)
    if (index !== -1) mockReservations.splice(index, 1)
  }
}
