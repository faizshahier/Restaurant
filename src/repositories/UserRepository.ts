import { supabase } from '../lib/supabaseClient'
import { toAppError } from '../lib/errors'
import type { User } from '../types'

export interface UpdateUserRow {
  name?: string
  email?: string
  role?: User['role']
  phone_number?: string | null
}

/**
 * Data-access layer for the `users` table.
 *
 * There is deliberately no `create()` here. A `users` row is created exactly once,
 * automatically, by the `handle_new_user()` Postgres trigger when a matching row is
 * inserted into `auth.users` — which only happens through `supabase.auth.signUp()`
 * (see AuthService). `public.users` has no INSERT policy for any client role, so a
 * direct insert from this repository would always be rejected by RLS anyway.
 */
export class UserRepository {
  static async findAll(): Promise<User[]> {
    const { data, error } = await supabase.from('users').select('*')
    if (error) throw toAppError(error)
    return data
  }

  static async findById(id: string): Promise<User | null> {
    const { data, error } = await supabase.from('users').select('*').eq('id', id).maybeSingle()
    if (error) throw toAppError(error)
    return data
  }

  static async findByEmail(email: string): Promise<User | null> {
    const { data, error } = await supabase.from('users').select('*').eq('email', email).maybeSingle()
    if (error) throw toAppError(error)
    return data
  }

  static async update(id: string, data: UpdateUserRow): Promise<User | null> {
    const { data: updated, error } = await supabase
      .from('users')
      .update(data)
      .eq('id', id)
      .select()
      .maybeSingle()
    if (error) throw toAppError(error)
    return updated
  }

  static async remove(id: string): Promise<void> {
    const { error } = await supabase.from('users').delete().eq('id', id)
    if (error) throw toAppError(error)
  }
}
