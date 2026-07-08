import { useEffect, useMemo, useState } from 'react'
import { Container } from '../../components/layout/Container'
import { ReservationService } from '../../services'
import type { Reservation, ReservationStatus } from '../../types'

const STATUS_FILTERS: Array<ReservationStatus | 'All'> = [
  'All',
  'Pending',
  'Approved',
  'Rejected',
  'Cancelled',
]

const statusBadgeClasses: Record<ReservationStatus, string> = {
  Pending: 'bg-yellow-400/20 text-yellow-300',
  Approved: 'bg-green-400/20 text-green-300',
  Rejected: 'bg-red-400/20 text-red-300',
  Cancelled: 'bg-charcoal-700 text-charcoal-100',
}

function pillClasses(active: boolean) {
  return `rounded-full border px-4 py-1.5 text-sm font-medium transition-colors ${
    active
      ? 'border-brand-300 bg-brand-400 text-charcoal-900'
      : 'border-charcoal-700 text-charcoal-100 hover:border-brand-300 hover:text-brand-300'
  }`
}

export function AdminReservationsPage() {
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [statusFilter, setStatusFilter] = useState<ReservationStatus | 'All'>('All')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    ReservationService.listReservations().then((all) => {
      setReservations(all)
      setIsLoading(false)
    })
  }, [])

  const visibleReservations = useMemo(
    () =>
      statusFilter === 'All'
        ? reservations
        : reservations.filter((reservation) => reservation.status === statusFilter),
    [reservations, statusFilter],
  )

  async function updateStatus(id: string, status: ReservationStatus) {
    await ReservationService.updateStatus(id, status)
    const all = await ReservationService.listReservations()
    setReservations(all)
  }

  return (
    <Container>
      <h1 className="font-display text-3xl font-semibold text-charcoal-50 sm:text-4xl">Reservations</h1>
      <p className="mt-2 max-w-2xl text-charcoal-100">
        Review incoming reservation requests and update their status.
      </p>

      <div className="mt-6 flex flex-wrap gap-2">
        {STATUS_FILTERS.map((status) => (
          <button
            key={status}
            type="button"
            onClick={() => setStatusFilter(status)}
            className={pillClasses(statusFilter === status)}
          >
            {status}
          </button>
        ))}
      </div>

      {isLoading ? (
        <p className="mt-10 text-charcoal-100">Loading reservations…</p>
      ) : visibleReservations.length === 0 ? (
        <p className="mt-10 text-charcoal-100">No reservations to show.</p>
      ) : (
        <div className="mt-8 overflow-x-auto rounded-lg border border-charcoal-700">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="bg-charcoal-800 text-charcoal-100">
              <tr>
                <th className="px-4 py-3 font-medium">Customer</th>
                <th className="px-4 py-3 font-medium">Phone</th>
                <th className="px-4 py-3 font-medium">Guests</th>
                <th className="px-4 py-3 font-medium">Date</th>
                <th className="px-4 py-3 font-medium">Time</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-charcoal-700">
              {visibleReservations.map((reservation) => (
                <tr key={reservation.id}>
                  <td className="px-4 py-3 text-charcoal-50">{reservation.customer_name}</td>
                  <td className="px-4 py-3 text-charcoal-100">{reservation.phone}</td>
                  <td className="px-4 py-3 text-charcoal-100">{reservation.guests}</td>
                  <td className="px-4 py-3 text-charcoal-100">{reservation.reservation_date}</td>
                  <td className="px-4 py-3 text-charcoal-100">{reservation.reservation_time}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2 py-1 text-xs font-medium ${statusBadgeClasses[reservation.status]}`}
                    >
                      {reservation.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-3">
                      {reservation.status === 'Pending' && (
                        <>
                          <button
                            type="button"
                            onClick={() => void updateStatus(reservation.id, 'Approved')}
                            className="text-brand-300 hover:underline"
                          >
                            Approve
                          </button>
                          <button
                            type="button"
                            onClick={() => void updateStatus(reservation.id, 'Rejected')}
                            className="text-red-400 hover:underline"
                          >
                            Reject
                          </button>
                        </>
                      )}
                      {reservation.status === 'Approved' && (
                        <button
                          type="button"
                          onClick={() => void updateStatus(reservation.id, 'Cancelled')}
                          className="text-red-400 hover:underline"
                        >
                          Cancel
                        </button>
                      )}
                      {(reservation.status === 'Rejected' || reservation.status === 'Cancelled') && (
                        <span className="text-charcoal-400">—</span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Container>
  )
}
