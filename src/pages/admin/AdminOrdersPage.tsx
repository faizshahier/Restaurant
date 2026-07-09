import { useEffect, useMemo, useState } from 'react'
import { Container } from '../../components/layout/Container'
import { formatPrice } from '../../lib/format'
import { OrderService } from '../../services'
import type { Order, OrderStatus } from '../../types'

const STATUS_FILTERS: Array<OrderStatus | 'All'> = ['All', 'Pending', 'Preparing', 'Shipped', 'Cancelled']

const statusBadgeClasses: Record<OrderStatus, string> = {
  Pending: 'bg-status-pending/20 text-status-pending',
  Preparing: 'bg-status-preparing/20 text-status-preparing',
  Shipped: 'bg-status-shipped/20 text-status-shipped',
  Cancelled: 'bg-status-cancelled/20 text-status-cancelled',
}

function pillClasses(active: boolean) {
  return `rounded-full border px-4 py-1.5 text-sm font-medium transition-colors ${
    active
      ? 'border-primary-300 bg-primary-400 text-charcoal-900'
      : 'border-charcoal-700 text-charcoal-100 hover:border-primary-300 hover:text-primary-300'
  }`
}

export function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'All'>('All')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    OrderService.listOrders().then((all) => {
      setOrders(all)
      setIsLoading(false)
    })
  }, [])

  const visibleOrders = useMemo(
    () => (statusFilter === 'All' ? orders : orders.filter((order) => order.status === statusFilter)),
    [orders, statusFilter],
  )

  async function updateStatus(id: string, status: OrderStatus) {
    await OrderService.updateStatus(id, status)
    const all = await OrderService.listOrders()
    setOrders(all)
  }

  return (
    <Container>
      <h1 className="font-display text-3xl font-semibold text-charcoal-50 sm:text-4xl">Orders</h1>
      <p className="mt-2 max-w-2xl text-charcoal-100">
        Review incoming orders and move them through the kitchen.
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
        <p className="mt-10 text-charcoal-100">Loading orders…</p>
      ) : visibleOrders.length === 0 ? (
        <p className="mt-10 text-charcoal-100">No orders to show.</p>
      ) : (
        <div className="mt-8 overflow-x-auto rounded-lg border border-charcoal-700">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="bg-charcoal-800 text-charcoal-100">
              <tr>
                <th className="px-4 py-3 font-medium">Customer</th>
                <th className="px-4 py-3 font-medium">Phone</th>
                <th className="px-4 py-3 font-medium">Items</th>
                <th className="px-4 py-3 font-medium">Total</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-charcoal-700">
              {visibleOrders.map((order) => (
                <tr key={order.id}>
                  <td className="px-4 py-3 text-charcoal-50">{order.customer_name}</td>
                  <td className="px-4 py-3 text-charcoal-100">{order.phone}</td>
                  <td className="px-4 py-3 text-charcoal-100">
                    {order.items.map((item) => `${item.quantity}x ${item.food_name}`).join(', ')}
                  </td>
                  <td className="px-4 py-3 text-charcoal-100">{formatPrice(order.total)}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2 py-1 text-xs font-medium ${statusBadgeClasses[order.status]}`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-3">
                      {order.status === 'Pending' && (
                        <>
                          <button
                            type="button"
                            onClick={() => void updateStatus(order.id, 'Preparing')}
                            className="text-primary-300 hover:underline"
                          >
                            Start Preparing
                          </button>
                          <button
                            type="button"
                            onClick={() => void updateStatus(order.id, 'Cancelled')}
                            className="text-red-400 hover:underline"
                          >
                            Cancel
                          </button>
                        </>
                      )}
                      {order.status === 'Preparing' && (
                        <>
                          <button
                            type="button"
                            onClick={() => void updateStatus(order.id, 'Shipped')}
                            className="text-primary-300 hover:underline"
                          >
                            Mark Shipped
                          </button>
                          <button
                            type="button"
                            onClick={() => void updateStatus(order.id, 'Cancelled')}
                            className="text-red-400 hover:underline"
                          >
                            Cancel
                          </button>
                        </>
                      )}
                      {(order.status === 'Shipped' || order.status === 'Cancelled') && (
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
