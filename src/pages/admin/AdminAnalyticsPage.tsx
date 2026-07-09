import { useEffect, useMemo, useState } from 'react'
import { Container } from '../../components/layout/Container'
import { formatPrice } from '../../lib/format'
import { OrderService } from '../../services'
import type { Order } from '../../types'

function isSameDay(a: Date, b: Date) {
  return a.toDateString() === b.toDateString()
}

function startOfWeek(date: Date) {
  const start = new Date(date)
  start.setDate(date.getDate() - date.getDay())
  start.setHours(0, 0, 0, 0)
  return start
}

function startOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1)
}

interface StatCardProps {
  label: string
  value: string
}

function StatCard({ label, value }: StatCardProps) {
  return (
    <div className="rounded-lg border border-charcoal-700 bg-charcoal-800 p-6">
      <p className="text-sm text-charcoal-100">{label}</p>
      <p className="mt-1 font-display text-2xl text-primary-200">{value}</p>
    </div>
  )
}

export function AdminAnalyticsPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    OrderService.listOrders().then((all) => {
      setOrders(all)
      setIsLoading(false)
    })
  }, [])

  // Cancelled orders never generate revenue and shouldn't count toward sales volume.
  const billableOrders = useMemo(() => orders.filter((order) => order.status !== 'Cancelled'), [orders])

  const { todayRevenue, weekRevenue, monthRevenue } = useMemo(() => {
    const now = new Date()
    const weekStart = startOfWeek(now)
    const monthStart = startOfMonth(now)

    return billableOrders.reduce(
      (totals, order) => {
        const orderDate = new Date(order.created_at)
        if (isSameDay(orderDate, now)) totals.todayRevenue += order.total
        if (orderDate >= weekStart) totals.weekRevenue += order.total
        if (orderDate >= monthStart) totals.monthRevenue += order.total
        return totals
      },
      { todayRevenue: 0, weekRevenue: 0, monthRevenue: 0 },
    )
  }, [billableOrders])

  const topSellers = useMemo(() => {
    const quantityByFood = new Map<string, { name: string; quantity: number }>()
    for (const order of billableOrders) {
      for (const item of order.items) {
        const existing = quantityByFood.get(item.food_id)
        quantityByFood.set(item.food_id, {
          name: item.food_name,
          quantity: (existing?.quantity ?? 0) + item.quantity,
        })
      }
    }
    return Array.from(quantityByFood.values())
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 5)
  }, [billableOrders])

  const maxQuantity = topSellers[0]?.quantity ?? 1

  return (
    <Container>
      <h1 className="font-display text-3xl font-semibold text-charcoal-50 sm:text-4xl">Analytics</h1>
      <p className="mt-2 max-w-2xl text-charcoal-100">Revenue and best sellers, computed from order data.</p>

      {isLoading ? (
        <p className="mt-10 text-charcoal-100">Loading analytics…</p>
      ) : (
        <>
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <StatCard label="Today" value={formatPrice(todayRevenue)} />
            <StatCard label="This Week" value={formatPrice(weekRevenue)} />
            <StatCard label="This Month" value={formatPrice(monthRevenue)} />
          </div>

          <h2 className="mt-10 font-display text-xl text-charcoal-50">Top Sellers</h2>
          {topSellers.length === 0 ? (
            <p className="mt-4 text-charcoal-100">No completed orders yet.</p>
          ) : (
            <div className="mt-4 flex flex-col gap-3">
              {topSellers.map((seller) => (
                <div key={seller.name} className="flex items-center gap-4">
                  <span className="w-40 shrink-0 truncate text-sm text-charcoal-50">{seller.name}</span>
                  <div className="h-3 flex-1 overflow-hidden rounded-full bg-charcoal-800">
                    <div
                      className="h-full rounded-full bg-primary-400"
                      style={{ width: `${(seller.quantity / maxQuantity) * 100}%` }}
                    />
                  </div>
                  <span className="w-10 shrink-0 text-right text-sm text-charcoal-100">
                    {seller.quantity}
                  </span>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </Container>
  )
}
