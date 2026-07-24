import { useEffect, useMemo, useState } from 'react'
import { Container } from '../../../components/layout/Container'
import { OrderService } from '../../../services'
import type { Order, OrderStatus } from '../../../types'
import { OrdersTable } from './OrdersTable'
import { StatusFilterBar } from './StatusFilterBar'
import { toErrorMessage } from '../../../lib/errors'

export function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'All'>('All')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    OrderService.listOrders()
      .then((all) => {
        setOrders(all)
        setIsLoading(false)
      })
      .catch((err: unknown) => {
        console.error('Failed to load orders', err)
        setError("We couldn't load orders. Please check your connection and try again.")
        setIsLoading(false)
      })
  }, [])

  const visibleOrders = useMemo(
    () => (statusFilter === 'All' ? orders : orders.filter((order) => order.status === statusFilter)),
    [orders, statusFilter],
  )

  async function updateStatus(id: string, status: OrderStatus) {
    setError(null)
    try {
      await OrderService.updateStatus(id, status)
      const all = await OrderService.listOrders()
      setOrders(all)
    } catch (err: unknown) {
      console.error('Failed to update order status', err)
      setError(toErrorMessage(err, 'Could not update the order. Please try again.'))
    }
  }

  return (
    <Container>
      <h1 className="font-display text-3xl font-semibold text-charcoal-50 sm:text-4xl">Orders</h1>
      <p className="mt-2 max-w-2xl text-charcoal-100">
        Review incoming orders and move them through the kitchen.
      </p>

      <StatusFilterBar value={statusFilter} onChange={setStatusFilter} />

      {error && <p className="mt-4 text-sm text-red-400">{error}</p>}

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
