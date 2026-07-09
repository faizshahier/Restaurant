import { supabase } from '../lib/supabaseClient'
import type { Food } from '../types'

export interface CreateFoodRow {
  name: string
  description: string
  price: number
  discount_percentage: number
  image: string
  category_id: string
  available: boolean
}

/** Data-access layer for the `foods` table. */
export class FoodRepository {
  static async findAll(): Promise<Food[]> {
    const { data, error } = await supabase.from('foods').select('*').order('name')
    if (error) throw error
    return data
  }

  static async findById(id: string): Promise<Food | null> {
    const { data, error } = await supabase.from('foods').select('*').eq('id', id).maybeSingle()
    if (error) throw error
    return data
  }

  static async findByCategory(categoryId: string): Promise<Food[]> {
    const { data, error } = await supabase
      .from('foods')
      .select('*')
      .eq('category_id', categoryId)
      .order('name')
    if (error) throw error
    return data
  }

  static async create(data: CreateFoodRow): Promise<Food> {
    const { data: created, error } = await supabase.from('foods').insert(data).select().single()
    if (error) throw error
    return created
  }

  static async update(id: string, data: Partial<CreateFoodRow>): Promise<Food | null> {
    const { data: updated, error } = await supabase
      .from('foods')
      .update(data)
      .eq('id', id)
      .select()
      .maybeSingle()
    if (error) throw error
    return updated
  }

  static async remove(id: string): Promise<void> {
    const { error } = await supabase.from('foods').delete().eq('id', id)
    if (error) throw error
  }
}
