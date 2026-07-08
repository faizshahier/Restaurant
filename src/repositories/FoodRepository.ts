import type { Food } from '../types'

const now = new Date().toISOString()

const mockFoods: Food[] = [
  {
    id: 'food-bruschetta',
    name: 'Bruschetta',
    description: 'Grilled bread rubbed with garlic and topped with olive oil, salt, and tomato.',
    price: 8.5,
    image: '',
    category_id: 'cat-starters',
    available: true,
    created_at: now,
    updated_at: now,
  },
  {
    id: 'food-margherita',
    name: 'Margherita Pizza',
    description: 'San Marzano tomatoes, fresh mozzarella, basil, extra virgin olive oil.',
    price: 15,
    image: '',
    category_id: 'cat-mains',
    available: true,
    created_at: now,
    updated_at: now,
  },
  {
    id: 'food-tiramisu',
    name: 'Tiramisu',
    description: 'Espresso-soaked ladyfingers layered with mascarpone cream.',
    price: 7,
    image: '',
    category_id: 'cat-desserts',
    available: true,
    created_at: now,
    updated_at: now,
  },
]

export interface CreateFoodRow {
  name: string
  description: string
  price: number
  image: string
  category_id: string
  available: boolean
}

/**
 * Data-access layer for the `foods` table.
 *
 * TODO(supabase): Replace the in-memory array with real queries.
 * - findAll        -> supabase.from('foods').select('*')
 * - findById       -> supabase.from('foods').select('*').eq('id', id).single()
 * - findByCategory -> supabase.from('foods').select('*').eq('category_id', categoryId)
 * - create         -> supabase.from('foods').insert(data).select().single()
 * - update         -> supabase.from('foods').update(data).eq('id', id).select().single()
 * - remove         -> supabase.from('foods').delete().eq('id', id)
 */
export class FoodRepository {
  static async findAll(): Promise<Food[]> {
    // TODO(supabase): supabase.from('foods').select('*')
    return mockFoods
  }

  static async findById(id: string): Promise<Food | null> {
    // TODO(supabase): supabase.from('foods').select('*').eq('id', id).single()
    return mockFoods.find((food) => food.id === id) ?? null
  }

  static async findByCategory(categoryId: string): Promise<Food[]> {
    // TODO(supabase): supabase.from('foods').select('*').eq('category_id', categoryId)
    return mockFoods.filter((food) => food.category_id === categoryId)
  }

  static async create(data: CreateFoodRow): Promise<Food> {
    // TODO(supabase): supabase.from('foods').insert(data).select().single()
    const timestamp = new Date().toISOString()
    const food: Food = {
      id: `food-${crypto.randomUUID()}`,
      created_at: timestamp,
      updated_at: timestamp,
      ...data,
    }
    mockFoods.push(food)
    return food
  }

  static async update(id: string, data: Partial<CreateFoodRow>): Promise<Food | null> {
    // TODO(supabase): supabase.from('foods').update(data).eq('id', id).select().single()
    const index = mockFoods.findIndex((food) => food.id === id)
    if (index === -1) return null
    mockFoods[index] = { ...mockFoods[index], ...data, updated_at: new Date().toISOString() }
    return mockFoods[index]
  }

  static async remove(id: string): Promise<void> {
    // TODO(supabase): supabase.from('foods').delete().eq('id', id)
    const index = mockFoods.findIndex((food) => food.id === id)
    if (index !== -1) mockFoods.splice(index, 1)
  }
}
