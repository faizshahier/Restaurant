import type { AppUser } from '../types'

let mockCurrentUser: AppUser | null = null

/**
 * Handles authentication: sign in, sign up, sign out, and session state.
 *
 * TODO(supabase): Back this service with Supabase Auth.
 * - signIn            -> supabase.auth.signInWithPassword({ email, password })
 * - signUp            -> supabase.auth.signUp({ email, password, options: { data: { displayName } } })
 * - signOut           -> supabase.auth.signOut()
 * - getCurrentUser    -> supabase.auth.getUser() / supabase.auth.getSession()
 * - onAuthStateChange -> supabase.auth.onAuthStateChange(callback)
 */
export class AuthService {
  static async signIn(email: string, password: string): Promise<AppUser> {
    // TODO(supabase): replace with supabase.auth.signInWithPassword({ email, password })
    void password
    mockCurrentUser = {
      id: 'mock-user-id',
      email,
      displayName: email.split('@')[0],
      role: 'customer',
      createdAt: new Date().toISOString(),
    }
    return mockCurrentUser
  }

  static async signUp(email: string, password: string, displayName: string): Promise<AppUser> {
    // TODO(supabase): replace with supabase.auth.signUp({ email, password, options: { data: { displayName } } })
    void password
    mockCurrentUser = {
      id: 'mock-user-id',
      email,
      displayName,
      role: 'customer',
      createdAt: new Date().toISOString(),
    }
    return mockCurrentUser
  }

  static async signOut(): Promise<void> {
    // TODO(supabase): replace with supabase.auth.signOut()
    mockCurrentUser = null
  }

  static async getCurrentUser(): Promise<AppUser | null> {
    // TODO(supabase): replace with supabase.auth.getUser()
    return mockCurrentUser
  }

  static onAuthStateChange(callback: (user: AppUser | null) => void): () => void {
    // TODO(supabase): replace with supabase.auth.onAuthStateChange((_event, session) => callback(...))
    callback(mockCurrentUser)
    return () => {
      /* TODO(supabase): unsubscribe the real listener here */
    }
  }
}
