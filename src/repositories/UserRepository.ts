import type { User, UserRole } from '../types'

const now = new Date().toISOString()

// Demo credentials for local testing only: admin@example.com / AdminPass123!
// Not a real password — never used once Supabase Auth is wired up (see AuthService).
const mockUsers: User[] = [
  {
    id: 'usr-admin-1',
    name: 'Admin User',
    email: 'admin@example.com',
    password: 'AdminPass123!',
    role: 'Admin',
    created_at: now,
    updated_at: now,
  },
]

export interface CreateUserRow {
  name: string
  email: string
  password: string
  role: UserRole
}

/**
 * Data-access layer for the `users` table.
 *
 * TODO(supabase): Replace the in-memory array with real queries once the
 * project is provisioned (see src/lib/supabaseClient.ts).
 * - findAll        -> supabase.from('users').select('*')
 * - findById       -> supabase.from('users').select('*').eq('id', id).single()
 * - findByEmail    -> supabase.from('users').select('*').eq('email', email).single()
 * - create         -> supabase.from('users').insert(data).select().single()
 * - update         -> supabase.from('users').update(data).eq('id', id).select().single()
 * - remove         -> supabase.from('users').delete().eq('id', id)
 */
export class UserRepository {
  static async findAll(): Promise<User[]> {
    // TODO(supabase): supabase.from('users').select('*')
    // Return a copy — a real query never hands back the same array reference,
    // and callers rely on that for React state updates to be detected.
    return [...mockUsers]
  }

  static async findById(id: string): Promise<User | null> {
    // TODO(supabase): supabase.from('users').select('*').eq('id', id).single()
    return mockUsers.find((user) => user.id === id) ?? null
  }

  static async findByEmail(email: string): Promise<User | null> {
    // TODO(supabase): supabase.from('users').select('*').eq('email', email).single()
    return mockUsers.find((user) => user.email === email) ?? null
  }

  static async create(data: CreateUserRow): Promise<User> {
    // TODO(supabase): supabase.from('users').insert(data).select().single()
    const timestamp = new Date().toISOString()
    const user: User = {
      id: `usr-${crypto.randomUUID()}`,
      created_at: timestamp,
      updated_at: timestamp,
      ...data,
    }
    mockUsers.push(user)
    return user
  }

  static async update(id: string, data: Partial<CreateUserRow>): Promise<User | null> {
    // TODO(supabase): supabase.from('users').update(data).eq('id', id).select().single()
    const index = mockUsers.findIndex((user) => user.id === id)
    if (index === -1) return null
    mockUsers[index] = { ...mockUsers[index], ...data, updated_at: new Date().toISOString() }
    return mockUsers[index]
  }

  static async remove(id: string): Promise<void> {
    // TODO(supabase): supabase.from('users').delete().eq('id', id)
    const index = mockUsers.findIndex((user) => user.id === id)
    if (index !== -1) mockUsers.splice(index, 1)
  }
}
