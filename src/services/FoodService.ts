import { FoodRepository } from '../repositories'
import {
  createFoodSchema,
  updateFoodSchema,
  type CreateFoodInput,
  type UpdateFoodInput,
} from '../validation/schemas'
import type { Food } from '../types'

/**
 * Manages menu items (food/drink dishes shown on the public menu).
 *
 * TODO(supabase): This service is transport-agnostic; once Supabase is wired up
 * only FoodRepository needs to change.
 */
export class FoodService {
  static async getAllItems(): Promise<Food[]> {
    return FoodRepository.findAll()
  }

  static async getAvailableItems(): Promise<Food[]> {
    // The database does the filtering, so unavailable dishes never travel to the
    // browser. Previously every row was fetched and filtered here.
    return FoodRepository.findAvailable()
  }

  static async getItemById(id: string): Promise<Food | null> {
    return FoodRepository.findById(id)
  }

  static async getItemsByCategory(categoryId: string): Promise<Food[]> {
    return FoodRepository.findByCategory(categoryId)
  }

  static async createItem(input: CreateFoodInput): Promise<Food> {
    const data = createFoodSchema.parse(input)
    return FoodRepository.create(data)
  }

  static async updateItem(id: string, input: UpdateFoodInput): Promise<Food | null> {
    const data = updateFoodSchema.parse(input)
    return FoodRepository.update(id, data)
  }

  static async deleteItem(id: string): Promise<void> {
    return FoodRepository.remove(id)
  }
}
