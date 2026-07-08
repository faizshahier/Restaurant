import { ReservationRepository, type ReservationFilters } from '../repositories'
import {
  createReservationSchema,
  updateReservationStatusSchema,
  type CreateReservationInput,
} from '../validation/schemas'
import type { Reservation, ReservationStatus } from '../types'

/**
 * Manages table reservations.
 *
 * TODO(supabase): This service is transport-agnostic; once Supabase is wired up
 * only ReservationRepository needs to change. Consider adding a Postgres check
 * constraint on `status` to mirror the ReservationStatus union.
 */
export class ReservationService {
  static async createReservation(input: CreateReservationInput): Promise<Reservation> {
    const data = createReservationSchema.parse(input)
    return ReservationRepository.create(data)
  }

  static async getReservationById(id: string): Promise<Reservation | null> {
    return ReservationRepository.findById(id)
  }

  static async listReservations(filters: ReservationFilters = {}): Promise<Reservation[]> {
    return ReservationRepository.findAll(filters)
  }

  static async updateStatus(id: string, status: ReservationStatus): Promise<Reservation | null> {
    const { status: validStatus } = updateReservationStatusSchema.parse({ status })
    return ReservationRepository.updateStatus(id, validStatus)
  }

  static async approveReservation(id: string): Promise<Reservation | null> {
    return ReservationService.updateStatus(id, 'Approved')
  }

  static async rejectReservation(id: string): Promise<Reservation | null> {
    return ReservationService.updateStatus(id, 'Rejected')
  }

  static async cancelReservation(id: string): Promise<Reservation | null> {
    return ReservationService.updateStatus(id, 'Cancelled')
  }
}
