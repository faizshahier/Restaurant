import { formatPrice } from '../../../lib/format'
import type { Order, OrderStatus } from '../../../types'

const statusBadgeClasses: Record<OrderStatus, string> = {
  Pending: 'bg-status-pending/20 text-status-pending',
  Preparing: 'bg-status-preparing/20 text-status-preparing',
  Shipped: 'bg-status-shipped/20 text-status-shipped',
  Cancelled: 'bg-status-cancelled/20 text-status-cancelled',
}

interface OrdersTableProps {
  orders: Order[]
  onUpdateStatus: (id: string, status: OrderStatus) => void
}

export function OrdersTable({ orders, onUpdateStatus }: OrdersTableProps) {
  return (
    <div className="mt-8 overflow-x-auto rounded-lg border border-charcoal-700">
      <table className="w-full min-w-[720px] text-left text-sm">
        <thead className="bg-charcoal-800 text-charcoal-100">
          <tr>
            <th className="px-4 py-3 font-medium">Customer</th>
            <th className="px-4 py-3 font-medium">Phone</th>
            <th className="px-4 py-3 font-medium">Location</th>
            <th className="px-4 py-3 font-medium">Items</th>
            <th className="px-4 py-3 font-medium">Total</th>
            <th className="px-4 py-3 font-medium">Status</th>
            <th className="px-4 py-3 font-medium">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-charcoal-700">
          {orders.map((order) => (
            <tr key={order.id}>
              <td className="px-4 py-3 text-charcoal-50">{order.customer_name}</td>
              <td className="px-4 py-3 text-charcoal-100">{order.phone}</td>
              <td className="px-4 py-3 text-charcoal-100">{order.location}</td>
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
                        onClick={() => onUpdateStatus(order.id, 'Preparing')}
                        className="text-primary-300 hover:underline"
                      >
                        Start Preparing
                      </button>
                      <button
                        type="button"
                        onClick={() => onUpdateStatus(order.id, 'Cancelled')}
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
                        onClick={() => onUpdateStatus(order.id, 'Shipped')}
                        className="text-primary-300 hover:underline"
                      >
                        Mark Shipped
                      </button>
                      <button
                        type="button"
                        onClick={() => onUpdateStatus(order.id, 'Cancelled')}
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
  )
}
