import { UserRepository } from '../repositories'
import { updateUserSchema, type UpdateUserInput } from '../validation/schemas'
import type { PublicUser, User } from '../types'

function toPublicUser(user: User): PublicUser {
  const { password: _password, ...publicUser } = user
  void _password
  return publicUser
}

/**
 * Manages user profile records (separate from authentication credentials).
 *
 * TODO(supabase): Once Supabase Auth is wired up, keep this service scoped to
 * the `users` table (profile data) and let AuthService own the session/credential
 * concerns via supabase.auth.*.
 */
export class UserService {
  static async getUserById(id: string): Promise<PublicUser | null> {
    const user = await UserRepository.findById(id)
    return user ? toPublicUser(user) : null
  }

  static async listUsers(): Promise<PublicUser[]> {
    const users = await UserRepository.findAll()
    return users.map(toPublicUser)
  }

  static async updateProfile(id: string, input: UpdateUserInput): Promise<PublicUser | null> {
    const data = updateUserSchema.parse(input)
    const user = await UserRepository.update(id, data)
    return user ? toPublicUser(user) : null
  }

  static async deleteUser(id: string): Promise<void> {
    return UserRepository.remove(id)
  }
}
