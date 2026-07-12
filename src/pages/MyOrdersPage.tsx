import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Container } from '../components/layout/Container'
import { formatPrice } from '../lib/format'
import { OrderService } from '../services'
import type { Order, OrderStatus } from '../types'

const statusBadgeClasses: Record<OrderStatus, string> = {
  Pending: 'bg-status-pending/20 text-status-pending',
  Preparing: 'bg-status-preparing/20 text-status-preparing',
  Shipped: 'bg-status-shipped/20 text-status-shipped',
  Cancelled: 'bg-status-cancelled/20 text-status-cancelled',
}

export function MyOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // No filter needed: RLS already scopes this to the signed-in user's own orders
    // (or everything, for staff) — the same OrderService.listOrders() used in the
    // admin dashboard returns the right rows for whoever is asking.
    OrderService.listOrders().then((allOrders) => {
      setOrders(allOrders)
      setIsLoading(false)
    })
  }, [])

  return (
    <Container>
      <h1 className="font-display text-3xl font-semibold text-charcoal-50 sm:text-4xl">My Orders</h1>
      <p className="mt-2 max-w-2xl text-charcoal-100">Your past and current orders.</p>

      {isLoading ? (
        <p className="mt-10 text-charcoal-100">Loading your orders…</p>
      ) : orders.length === 0 ? (
        <p className="mt-10 text-charcoal-100">
          You haven't placed any orders yet.{' '}
          <Link to="/order" className="text-primary-300 hover:underline">
            Order something
          </Link>
          .
        </p>
      ) : (
        <div className="mt-8 flex flex-col gap-4">
          {orders.map((order) => (
            <div key={order.id} className="rounded-lg border border-charcoal-700 bg-charcoal-800 p-6">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-sm text-charcoal-100">{new Date(order.created_at).toLocaleString()}</p>
                <span
                  className={`rounded-full px-2 py-1 text-xs font-medium ${statusBadgeClasses[order.status]}`}
                >
                  {order.status}
                </span>
              </div>

              <ul className="mt-3 space-y-1 text-sm text-charcoal-100">
                {order.items.map((item, index) => (
                  <li key={`${item.food_id}-${index}`}>
                    {item.quantity}x {item.food_name} — {formatPrice(item.price * item.quantity)}
                  </li>
                ))}
              </ul>

              {order.notes && <p className="mt-2 text-sm italic text-charcoal-400">Note: {order.notes}</p>}

              <p className="mt-3 font-medium text-charcoal-50">Total: {formatPrice(order.total)}</p>
            </div>
          ))}
        </div>
      )}
    </Container>
  )
}
