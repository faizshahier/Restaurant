import { supabase } from '../lib/supabaseClient'
import type { Order, OrderItem, OrderStatus } from '../types'

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

interface OrderRow {
  id: string
  customer_name: string
  phone: string
  total: number
  notes: string | null
  status: OrderStatus
  created_at: string
  updated_at: string
  order_items: OrderItem[] | null
}

const ORDER_SELECT = '*, order_items(food_id, food_name, quantity, price)'

function mapOrderRow(row: OrderRow): Order {
  const { order_items, ...rest } = row
  return { ...rest, items: order_items ?? [] }
}

/**
 * Data-access layer for the `orders` table (and its `order_items` join table).
 *
 * `create()` calls the `create_order_with_items` Postgres function (see
 * supabase/schema.sql) instead of two separate insert calls, so the order and its
 * line items are written in one atomic transaction — a client-side failure between
 * two separate inserts could otherwise leave an order with no items.
 */
export class OrderRepository {
  static async findAll(filters: OrderFilters = {}): Promise<Order[]> {
    let query = supabase.from('orders').select(ORDER_SELECT).order('created_at', { ascending: false })
    if (filters.status) {
      query = query.eq('status', filters.status)
    }
    const { data, error } = await query
    if (error) throw error
    return (data as unknown as OrderRow[]).map(mapOrderRow)
  }

  static async findById(id: string): Promise<Order | null> {
    const { data, error } = await supabase.from('orders').select(ORDER_SELECT).eq('id', id).maybeSingle()
    if (error) throw error
    return data ? mapOrderRow(data as unknown as OrderRow) : null
  }

  static async create(data: CreateOrderRow): Promise<Order> {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    const { data: order, error } = await supabase
      .rpc('create_order_with_items', {
        p_customer_name: data.customer_name,
        p_phone: data.phone,
        p_total: data.total,
        p_notes: data.notes ?? null,
        p_user_id: user?.id ?? null,
        p_items: data.items,
      })
      .single()
    if (error) throw error

    return { ...(order as Omit<Order, 'items'>), items: data.items }
  }

  static async updateStatus(id: string, status: OrderStatus): Promise<Order | null> {
    const { error } = await supabase.from('orders').update({ status }).eq('id', id)
    if (error) throw error
    return OrderRepository.findById(id)
  }

  static async remove(id: string): Promise<void> {
    const { error } = await supabase.from('orders').delete().eq('id', id)
    if (error) throw error
  }
}
