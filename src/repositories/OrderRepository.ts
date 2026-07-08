import type { Order, OrderItem, OrderStatus } from '../types'

const now = new Date().toISOString()

const mockOrders: Order[] = [
  {
    id: 'order-sample-pending',
    customer_name: 'Alex Rivera',
    phone: '555-201-3344',
    items: [
      { food_id: 'food-bruschetta', food_name: 'Bruschetta', quantity: 2, price: 8.5 },
      { food_id: 'food-margherita', food_name: 'Margherita Pizza', quantity: 1, price: 13.5 },
    ],
    total: 30.5,
    notes: 'Ring the doorbell twice',
    status: 'Pending',
    created_at: now,
    updated_at: now,
  },
  {
    id: 'order-sample-preparing',
    customer_name: 'Priya Nair',
    phone: '555-467-8899',
    items: [
      { food_id: 'food-tiramisu', food_name: 'Tiramisu', quantity: 1, price: 7 },
      { food_id: 'food-margherita', food_name: 'Margherita Pizza', quantity: 2, price: 13.5 },
    ],
    total: 34,
    notes: null,
    status: 'Preparing',
    created_at: now,
    updated_at: now,
  },
]

export interface OrderFilters {
  status?: OrderStatus
}

export interface CreateOrderRow {
  customer_name: string
  phone: string
  items: OrderItem[]
  total: number
  notes?: string | null
}

/**
 * Data-access layer for the `orders` table.
 *
 * TODO(supabase): Replace the in-memory array with real queries.
 * - findAll      -> supabase.from('orders').select('*').match(filters)
 * - findById     -> supabase.from('orders').select('*').eq('id', id).single()
 * - create       -> supabase.from('orders').insert({ ...data, status: 'Pending' }).select().single()
 * - updateStatus -> supabase.from('orders').update({ status }).eq('id', id).select().single()
 * - remove       -> supabase.from('orders').delete().eq('id', id)
 *
 * Order items are modeled as a JSON column here for simplicity; a normalized schema would use a
 * separate `order_items` table with a foreign key to `orders` and `foods`.
 */
export class OrderRepository {
  static async findAll(filters: OrderFilters = {}): Promise<Order[]> {
    // TODO(supabase): supabase.from('orders').select('*').match(filters)
    return mockOrders.filter((order) => {
      if (filters.status && order.status !== filters.status) return false
      return true
    })
  }

  static async findById(id: string): Promise<Order | null> {
    // TODO(supabase): supabase.from('orders').select('*').eq('id', id).single()
    return mockOrders.find((order) => order.id === id) ?? null
  }

  static async create(data: CreateOrderRow): Promise<Order> {
    // TODO(supabase): supabase.from('orders').insert({ ...data, status: 'Pending' }).select().single()
    const timestamp = new Date().toISOString()
    const order: Order = {
      id: `order-${crypto.randomUUID()}`,
      notes: null,
      status: 'Pending',
      created_at: timestamp,
      updated_at: timestamp,
      ...data,
    }
    mockOrders.push(order)
    return order
  }

  static async updateStatus(id: string, status: OrderStatus): Promise<Order | null> {
    // TODO(supabase): supabase.from('orders').update({ status }).eq('id', id).select().single()
    const index = mockOrders.findIndex((order) => order.id === id)
    if (index === -1) return null
    mockOrders[index] = { ...mockOrders[index], status, updated_at: new Date().toISOString() }
    return mockOrders[index]
  }

  static async remove(id: string): Promise<void> {
    // TODO(supabase): supabase.from('orders').delete().eq('id', id)
    const index = mockOrders.findIndex((order) => order.id === id)
    if (index !== -1) mockOrders.splice(index, 1)
  }
}
