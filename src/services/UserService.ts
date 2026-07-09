import { UserRepository } from '../repositories'
import { updateUserSchema, type UpdateUserInput } from '../validation/schemas'
import type { PublicUser } from '../types'

/**
 * Manages user profile records (separate from authentication credentials).
 *
 * Scoped to the `users` table (profile data) — AuthService owns the
 * session/credential concerns via supabase.auth.*.
 */
export class UserService {
  static async getUserById(id: string): Promise<PublicUser | null> {
    return UserRepository.findById(id)
  }

  static async listUsers(): Promise<PublicUser[]> {
    return UserRepository.findAll()
  }

  static async updateProfile(id: string, input: UpdateUserInput): Promise<PublicUser | null> {
    const data = updateUserSchema.parse(input)
    return UserRepository.update(id, data)
  }

  static async deleteUser(id: string): Promise<void> {
    return UserRepository.remove(id)
  }
}
