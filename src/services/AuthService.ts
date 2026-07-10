import { supabase } from '../lib/supabaseClient'
import { UserRepository } from '../repositories'
import { signUpSchema, verifyEmailOtpSchema } from '../validation/schemas'
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

export type SignUpResult =
  { status: 'signed-in'; user: PublicUser } | { status: 'needs-verification'; email: string }

/** Handles authentication: sign in, sign up, sign out, and session state via Supabase Auth. */
export class AuthService {
  static async signIn(email: string, password: string): Promise<PublicUser> {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw new Error(error.message)
    if (!data.user) throw new Error('Invalid email or password')
    return fetchUserProfile(data.user.id)
  }

  static async signUp(name: string, email: string, password: string): Promise<SignUpResult> {
    const parsed = signUpSchema.parse({ name, email, password })
    const { data, error } = await supabase.auth.signUp({
      email: parsed.email,
      password: parsed.password,
      options: { data: { name: parsed.name } },
    })
    if (error) throw new Error(error.message)
    if (!data.user) throw new Error('Sign up failed. Please try again.')

    if (!data.session) {
      // "Confirm email" is enabled on this project: the auth.users row (and the matching
      // public.users row, via the trigger) already exist, but there's no session yet. The
      // caller enters the 6-digit code Supabase just emailed them next, via verifyEmailOtp().
      return { status: 'needs-verification', email: parsed.email }
    }

    return { status: 'signed-in', user: await fetchUserProfile(data.user.id) }
  }

  /**
   * Completes sign-up after the caller enters the code Supabase emailed them.
   *
   * TODO(dashboard): the "Confirm signup" email template (Authentication → Email
   * Templates in the Supabase dashboard) must include `{{ .Token }}` for this code to
   * actually appear in the email — the default template only shows a confirmation link.
   */
  static async verifyEmailOtp(email: string, token: string): Promise<PublicUser> {
    const parsed = verifyEmailOtpSchema.parse({ email, token })
    const { data, error } = await supabase.auth.verifyOtp({
      email: parsed.email,
      token: parsed.token,
      type: 'signup',
    })
    if (error) throw new Error(error.message)
    if (!data.user) throw new Error('Verification failed. Please try again.')
    return fetchUserProfile(data.user.id)
  }

  /** Re-sends the sign-up verification code (rate-limited by Supabase). */
  static async resendSignUpCode(email: string): Promise<void> {
    const { error } = await supabase.auth.resend({ type: 'signup', email })
    if (error) throw new Error(error.message)
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
