import { useEffect, useMemo, useState } from 'react'
import { OrderService } from '../../../services'
import type { Order } from '../../../types'

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

export interface TopSeller {
  name: string
  quantity: number
}

/** Loads all orders and derives revenue totals and top sellers for the analytics page. */
export function useOrderAnalytics() {
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

  const topSellers = useMemo<TopSeller[]>(() => {
    const quantityByFood = new Map<string, TopSeller>()
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

  return { isLoading, todayRevenue, weekRevenue, monthRevenue, topSellers }
}
