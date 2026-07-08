import type { Reservation, ReservationStatus } from '../types'

const mockReservations: Reservation[] = []

export interface ReservationFilters {
  date?: string
  status?: ReservationStatus
}

/**
 * Manages table reservations.
 *
 * TODO(supabase): Back this service with a `reservations` table.
 * - createReservation -> supabase.from('reservations').insert(data)
 * - getReservationById -> supabase.from('reservations').select('*').eq('id', id).single()
 * - listReservations  -> supabase.from('reservations').select('*').match(filters)
 * - updateStatus      -> supabase.from('reservations').update({ status }).eq('id', id)
 * - cancelReservation -> supabase.from('reservations').update({ status: 'cancelled' }).eq('id', id)
 */
export class ReservationService {
  static async createReservation(data: Omit<Reservation, 'id' | 'status'>): Promise<Reservation> {
    // TODO(supabase): supabase.from('reservations').insert({ ...data, status: 'pending' })
    const reservation: Reservation = {
      id: `res-${crypto.randomUUID()}`,
      status: 'pending',
      ...data,
    }
    mockReservations.push(reservation)
    return reservation
  }

  static async getReservationById(id: string): Promise<Reservation | null> {
    // TODO(supabase): supabase.from('reservations').select('*').eq('id', id).single()
    return mockReservations.find((reservation) => reservation.id === id) ?? null
  }

  static async listReservations(filters: ReservationFilters = {}): Promise<Reservation[]> {
    // TODO(supabase): supabase.from('reservations').select('*').match(filters)
    return mockReservations.filter((reservation) => {
      if (filters.date && reservation.date !== filters.date) return false
      if (filters.status && reservation.status !== filters.status) return false
      return true
    })
  }

  static async updateStatus(id: string, status: ReservationStatus): Promise<Reservation | null> {
    // TODO(supabase): supabase.from('reservations').update({ status }).eq('id', id)
    const index = mockReservations.findIndex((reservation) => reservation.id === id)
    if (index === -1) return null
    mockReservations[index] = { ...mockReservations[index], status }
    return mockReservations[index]
  }

  static async cancelReservation(id: string): Promise<Reservation | null> {
    // TODO(supabase): supabase.from('reservations').update({ status: 'cancelled' }).eq('id', id)
    return ReservationService.updateStatus(id, 'cancelled')
  }
}
