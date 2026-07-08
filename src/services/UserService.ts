import type { AppUser } from '../types'

const mockUsers: AppUser[] = [
  {
    id: 'mock-user-id',
    email: 'guest@example.com',
    displayName: 'Guest',
    role: 'customer',
    createdAt: new Date().toISOString(),
  },
]

/**
 * Manages user profile records (separate from auth credentials).
 *
 * TODO(supabase): Back this service with a `profiles` table.
 * - getUserById   -> supabase.from('profiles').select('*').eq('id', id).single()
 * - listUsers     -> supabase.from('profiles').select('*')
 * - updateProfile -> supabase.from('profiles').update(data).eq('id', id)
 * - deleteUser    -> supabase.from('profiles').delete().eq('id', id)
 */
export class UserService {
  static async getUserById(id: string): Promise<AppUser | null> {
    // TODO(supabase): supabase.from('profiles').select('*').eq('id', id).single()
    return mockUsers.find((user) => user.id === id) ?? null
  }

  static async listUsers(): Promise<AppUser[]> {
    // TODO(supabase): supabase.from('profiles').select('*')
    return mockUsers
  }

  static async updateProfile(id: string, data: Partial<AppUser>): Promise<AppUser | null> {
    // TODO(supabase): supabase.from('profiles').update(data).eq('id', id)
    const index = mockUsers.findIndex((user) => user.id === id)
    if (index === -1) return null
    mockUsers[index] = { ...mockUsers[index], ...data }
    return mockUsers[index]
  }

  static async deleteUser(id: string): Promise<void> {
    // TODO(supabase): supabase.from('profiles').delete().eq('id', id)
    const index = mockUsers.findIndex((user) => user.id === id)
    if (index !== -1) mockUsers.splice(index, 1)
  }
}
