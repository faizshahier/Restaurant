import type { OrderStatus } from '../../../types'

const STATUS_FILTERS: Array<OrderStatus | 'All'> = ['All', 'Pending', 'Preparing', 'Shipped', 'Cancelled']

function pillClasses(active: boolean) {
  return `rounded-full border px-4 py-1.5 text-sm font-medium transition-colors ${
    active
      ? 'border-primary-300 bg-primary-400 text-charcoal-900'
      : 'border-charcoal-700 text-charcoal-100 hover:border-primary-300 hover:text-primary-300'
  }`
}

interface StatusFilterBarProps {
  value: OrderStatus | 'All'
  onChange: (status: OrderStatus | 'All') => void
}

export function StatusFilterBar({ value, onChange }: StatusFilterBarProps) {
  return (
    <div className="mt-6 flex flex-wrap gap-2">
      {STATUS_FILTERS.map((status) => (
        <button
          key={status}
          type="button"
          onClick={() => onChange(status)}
          className={pillClasses(value === status)}
        >
          {status}
        </button>
      ))}
    </div>
  )
}
