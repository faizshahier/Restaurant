import { CategoryRepository } from '../repositories'
import {
  createCategorySchema,
  updateCategorySchema,
  type CreateCategoryInput,
  type UpdateCategoryInput,
} from '../validation/schemas'
import type { Category } from '../types'

/**
 * Manages menu categories (e.g. Starters, Mains, Desserts).
 *
 * TODO(supabase): This service is transport-agnostic; once Supabase is wired up
 * only CategoryRepository needs to change.
 */
export class CategoryService {
  static async getAllCategories(): Promise<Category[]> {
    return CategoryRepository.findAll()
  }

  static async getCategoryById(id: string): Promise<Category | null> {
    return CategoryRepository.findById(id)
  }

  static async createCategory(input: CreateCategoryInput): Promise<Category> {
    const data = createCategorySchema.parse(input)
    return CategoryRepository.create(data)
  }

  static async updateCategory(id: string, input: UpdateCategoryInput): Promise<Category | null> {
    const data = updateCategorySchema.parse(input)
    return CategoryRepository.update(id, data)
  }

  static async deleteCategory(id: string): Promise<void> {
    return CategoryRepository.remove(id)
  }
}
