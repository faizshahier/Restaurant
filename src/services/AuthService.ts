import { UserRepository } from '../repositories'
import { createUserSchema } from '../validation/schemas'
import type { PublicUser, User } from '../types'

function toPublicUser(user: User): PublicUser {
  const { password: _password, ...publicUser } = user
  void _password
  return publicUser
}

let mockCurrentUser: PublicUser | null = null

/**
 * Handles authentication: sign in, sign up, sign out, and session state.
 *
 * TODO(supabase): Back this service with Supabase Auth instead of the `users`
 * table directly.
 * - signIn            -> supabase.auth.signInWithPassword({ email, password })
 * - signUp            -> supabase.auth.signUp({ email, password, options: { data: { name } } })
 * - signOut           -> supabase.auth.signOut()
 * - getCurrentUser    -> supabase.auth.getUser() / supabase.auth.getSession()
 * - onAuthStateChange -> supabase.auth.onAuthStateChange(callback)
 *
 * Once Supabase Auth is wired up, the `users` table becomes profile data keyed
 * by the auth user id, and this service stops storing/comparing passwords itself.
 */
export class AuthService {
  static async signIn(email: string, password: string): Promise<PublicUser> {
    // TODO(supabase): replace with supabase.auth.signInWithPassword({ email, password })
    const user = await UserRepository.findByEmail(email)
    if (!user || user.password !== password) {
      throw new Error('Invalid email or password')
    }
    mockCurrentUser = toPublicUser(user)
    return mockCurrentUser
  }

  static async signUp(name: string, email: string, password: string): Promise<PublicUser> {
    // TODO(supabase): replace with supabase.auth.signUp({ email, password, options: { data: { name } } })
    const data = createUserSchema.parse({ name, email, password, role: 'Customer' })
    const existing = await UserRepository.findByEmail(data.email)
    if (existing) {
      throw new Error('An account with this email already exists')
    }
    const user = await UserRepository.create(data)
    mockCurrentUser = toPublicUser(user)
    return mockCurrentUser
  }

  static async signOut(): Promise<void> {
    // TODO(supabase): replace with supabase.auth.signOut()
    mockCurrentUser = null
  }

  static async getCurrentUser(): Promise<PublicUser | null> {
    // TODO(supabase): replace with supabase.auth.getUser()
    return mockCurrentUser
  }

  static onAuthStateChange(callback: (user: PublicUser | null) => void): () => void {
    // TODO(supabase): replace with supabase.auth.onAuthStateChange((_event, session) => callback(...))
    callback(mockCurrentUser)
    return () => {
      /* TODO(supabase): unsubscribe the real listener here */
    }
  }
}
