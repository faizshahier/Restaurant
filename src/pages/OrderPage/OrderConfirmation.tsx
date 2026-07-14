import { formatPrice } from '../../lib/format'
import type { Order } from '../../types'

interface OrderConfirmationProps {
  order: Order
  onPlaceAnother: () => void
}

export function OrderConfirmation({ order, onPlaceAnother }: OrderConfirmationProps) {
  return (
    <div className="mx-auto max-w-lg rounded-lg border border-charcoal-700 bg-charcoal-800 p-8 text-center">
      <h1 className="font-display text-2xl text-charcoal-50">Order Placed</h1>
      <p className="mt-2 text-charcoal-100">
        Thanks, {order.customer_name}. Your order total is{' '}
        <span className="font-medium text-primary-200">{formatPrice(order.total)}</span>.
      </p>
      <p className="mt-2 text-sm text-charcoal-100">Delivering to: {order.location}</p>
      <p className="mt-4 text-sm text-primary-300">Status: {order.status}</p>
      <button
        type="button"
        onClick={onPlaceAnother}
        className="mt-6 rounded-md bg-primary-400 px-6 py-3 text-sm font-semibold text-charcoal-900 transition-colors hover:bg-primary-300"
      >
        Place Another Order
      </button>
    </div>
  )
}
