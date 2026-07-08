import { OrderRepository, type OrderFilters } from '../repositories'
import { createOrderSchema, updateOrderStatusSchema, type CreateOrderInput } from '../validation/schemas'
import type { Order, OrderStatus } from '../types'

/**
 * Manages food orders (replaces the earlier dine-in reservation flow).
 *
 * TODO(supabase): This service is transport-agnostic; once Supabase is wired up
 * only OrderRepository needs to change. Consider a Postgres check constraint on
 * `status` to mirror the OrderStatus union.
 */
export class OrderService {
  static async createOrder(input: CreateOrderInput): Promise<Order> {
    const data = createOrderSchema.parse(input)
    // The total is computed here, never trusted from the caller, so a client can't
    // tamper with the charged amount by submitting a mismatched total.
    const total = data.items.reduce((sum, item) => sum + item.price * item.quantity, 0)
    return OrderRepository.create({ ...data, total })
  }

  static async getOrderById(id: string): Promise<Order | null> {
    return OrderRepository.findById(id)
  }

  static async listOrders(filters: OrderFilters = {}): Promise<Order[]> {
    return OrderRepository.findAll(filters)
  }

  static async updateStatus(id: string, status: OrderStatus): Promise<Order | null> {
    const { status: validStatus } = updateOrderStatusSchema.parse({ status })
    return OrderRepository.updateStatus(id, validStatus)
  }

  static async markPreparing(id: string): Promise<Order | null> {
    return OrderService.updateStatus(id, 'Preparing')
  }

  static async markShipped(id: string): Promise<Order | null> {
    return OrderService.updateStatus(id, 'Shipped')
  }

  static async cancelOrder(id: string): Promise<Order | null> {
    return OrderService.updateStatus(id, 'Cancelled')
  }
}
