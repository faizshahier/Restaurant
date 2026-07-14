import { useEffect, useMemo, useState } from 'react'
import { Container } from '../../../components/layout/Container'
import { OrderService } from '../../../services'
import type { Order, OrderStatus } from '../../../types'
import { OrdersTable } from './OrdersTable'
import { StatusFilterBar } from './StatusFilterBar'

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

      <StatusFilterBar value={statusFilter} onChange={setStatusFilter} />

      {isLoading ? (
        <p className="mt-10 text-charcoal-100">Loading orders…</p>
      ) : visibleOrders.length === 0 ? (
        <p className="mt-10 text-charcoal-100">No orders to show.</p>
      ) : (
        <OrdersTable orders={visibleOrders} onUpdateStatus={(id, status) => void updateStatus(id, status)} />
      )}
    </Container>
  )
}
