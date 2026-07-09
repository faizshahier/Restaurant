import { supabase } from '../lib/supabaseClient'
import { UserRepository } from '../repositories'
import { signUpSchema } from '../validation/schemas'
import type { PublicUser } from '../types'

async function fetchUserProfile(userId: string): Promise<PublicUser> {
  const profile = await UserRepository.findById(userId)
  if (!profile) {
    throw new Error(
      'Signed in, but no matching row exists in public.users yet. If you just ran the SQL ' +
        'schema, sign up again — the handle_new_user() trigger creates this row automatically ' +
        'on new sign-ups, not for accounts created before the trigger existed.',
    )
  }
  return profile
}

/** Handles authentication: sign in, sign up, sign out, and session state via Supabase Auth. */
export class AuthService {
  static async signIn(email: string, password: string): Promise<PublicUser> {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw new Error(error.message)
    if (!data.user) throw new Error('Invalid email or password')
    return fetchUserProfile(data.user.id)
  }

  static async signUp(name: string, email: string, password: string): Promise<PublicUser> {
    const parsed = signUpSchema.parse({ name, email, password })
    const { data, error } = await supabase.auth.signUp({
      email: parsed.email,
      password: parsed.password,
      options: { data: { name: parsed.name } },
    })
    if (error) throw new Error(error.message)
    if (!data.user) throw new Error('Sign up failed. Please try again.')

    if (!data.session) {
      // No session means the project has "Confirm email" enabled: the auth.users row
      // (and the matching public.users row, via the trigger) already exist, but the
      // caller isn't authenticated yet, so there's no session to read a profile back as.
      throw new Error('Check your email to confirm your account, then sign in.')
    }

    return fetchUserProfile(data.user.id)
  }

  static async signOut(): Promise<void> {
    const { error } = await supabase.auth.signOut()
    if (error) throw new Error(error.message)
  }

  static async getCurrentUser(): Promise<PublicUser | null> {
    const { data, error } = await supabase.auth.getUser()
    if (error || !data.user) return null
    return UserRepository.findById(data.user.id)
  }

  /** Returns an unsubscribe function; call it on cleanup (e.g. in a useEffect). */
  static onAuthStateChange(callback: (user: PublicUser | null) => void): () => void {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session?.user) {
        callback(null)
        return
      }
      UserRepository.findById(session.user.id).then(callback)
    })
    return () => subscription.unsubscribe()
  }
}
