import type { TopSeller } from './useOrderAnalytics'

interface TopSellersChartProps {
  sellers: TopSeller[]
}

export function TopSellersChart({ sellers }: TopSellersChartProps) {
  if (sellers.length === 0) {
    return <p className="mt-4 text-charcoal-100">No completed orders yet.</p>
  }

  const maxQuantity = sellers[0]?.quantity ?? 1

  return (
    <div className="mt-4 flex flex-col gap-3">
      {sellers.map((seller) => (
        <div key={seller.name} className="flex items-center gap-4">
          <span className="w-40 shrink-0 truncate text-sm text-charcoal-50">{seller.name}</span>
          <div className="h-3 flex-1 overflow-hidden rounded-full bg-charcoal-800">
            <div
              className="h-full rounded-full bg-primary-400"
              style={{ width: `${(seller.quantity / maxQuantity) * 100}%` }}
            />
          </div>
          <span className="w-10 shrink-0 text-right text-sm text-charcoal-100">{seller.quantity}</span>
        </div>
      ))}
    </div>
  )
}
