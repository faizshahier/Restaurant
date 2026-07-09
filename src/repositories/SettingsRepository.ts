import { supabase } from '../lib/supabaseClient'
import type { Settings } from '../types'

/** Data-access layer for the single-row `settings` table. */
export class SettingsRepository {
  static async find(): Promise<Settings> {
    const { data, error } = await supabase.from('settings').select('*').single()
    if (error) throw error
    return data
  }

  static async update(data: Partial<Omit<Settings, 'id'>>): Promise<Settings> {
    // The table's `is_singleton` unique constraint guarantees exactly one row, so
    // there's no need to look up its id first — targeting is_singleton = true always
    // hits that same row.
    const { data: updated, error } = await supabase
      .from('settings')
      .update(data)
      .eq('is_singleton', true)
      .select()
      .single()
    if (error) throw error
    return updated
  }
}
