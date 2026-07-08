import type { MenuItem } from '../types'

const mockMenuItems: MenuItem[] = [
  {
    id: 'item-bruschetta',
    categoryId: 'cat-starters',
    name: 'Bruschetta',
    description: 'Grilled bread rubbed with garlic and topped with olive oil, salt, and tomato.',
    price: 8.5,
    imageUrl: '',
    isAvailable: true,
  },
  {
    id: 'item-margherita',
    categoryId: 'cat-mains',
    name: 'Margherita Pizza',
    description: 'San Marzano tomatoes, fresh mozzarella, basil, extra virgin olive oil.',
    price: 15,
    imageUrl: '',
    isAvailable: true,
  },
  {
    id: 'item-tiramisu',
    categoryId: 'cat-desserts',
    name: 'Tiramisu',
    description: 'Espresso-soaked ladyfingers layered with mascarpone cream.',
    price: 7,
    imageUrl: '',
    isAvailable: true,
  },
]

/**
 * Manages menu items (food/drink dishes shown on the public menu).
 *
 * TODO(supabase): Back this service with a `menu_items` table.
 * - getAllItems       -> supabase.from('menu_items').select('*')
 * - getItemById       -> supabase.from('menu_items').select('*').eq('id', id).single()
 * - getItemsByCategory -> supabase.from('menu_items').select('*').eq('categoryId', categoryId)
 * - createItem        -> supabase.from('menu_items').insert(data)
 * - updateItem        -> supabase.from('menu_items').update(data).eq('id', id)
 * - deleteItem        -> supabase.from('menu_items').delete().eq('id', id)
 */
export class FoodService {
  static async getAllItems(): Promise<MenuItem[]> {
    // TODO(supabase): supabase.from('menu_items').select('*')
    return mockMenuItems
  }

  static async getItemById(id: string): Promise<MenuItem | null> {
    // TODO(supabase): supabase.from('menu_items').select('*').eq('id', id).single()
    return mockMenuItems.find((item) => item.id === id) ?? null
  }

  static async getItemsByCategory(categoryId: string): Promise<MenuItem[]> {
    // TODO(supabase): supabase.from('menu_items').select('*').eq('categoryId', categoryId)
    return mockMenuItems.filter((item) => item.categoryId === categoryId)
  }

  static async createItem(data: Omit<MenuItem, 'id'>): Promise<MenuItem> {
    // TODO(supabase): supabase.from('menu_items').insert(data)
    const item: MenuItem = { id: `item-${crypto.randomUUID()}`, ...data }
    mockMenuItems.push(item)
    return item
  }

  static async updateItem(id: string, data: Partial<MenuItem>): Promise<MenuItem | null> {
    // TODO(supabase): supabase.from('menu_items').update(data).eq('id', id)
    const index = mockMenuItems.findIndex((item) => item.id === id)
    if (index === -1) return null
    mockMenuItems[index] = { ...mockMenuItems[index], ...data }
    return mockMenuItems[index]
  }

  static async deleteItem(id: string): Promise<void> {
    // TODO(supabase): supabase.from('menu_items').delete().eq('id', id)
    const index = mockMenuItems.findIndex((item) => item.id === id)
    if (index !== -1) mockMenuItems.splice(index, 1)
  }
}
