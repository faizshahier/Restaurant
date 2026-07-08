import type { Settings } from '../types'

let mockSettings: Settings = {
  id: 'settings-singleton',
  restaurant_name: 'The Restaurant',
  logo: '',
  phone: '+1 (555) 010-0000',
  email: 'hello@example.com',
  address: '123 Main Street, Your City',
  opening_hours: {
    monday: '11:00 - 22:00',
    tuesday: '11:00 - 22:00',
    wednesday: '11:00 - 22:00',
    thursday: '11:00 - 22:00',
    friday: '11:00 - 23:00',
    saturday: '10:00 - 23:00',
    sunday: '10:00 - 21:00',
  },
  social_links: {},
}

/**
 * Data-access layer for the single-row `settings` table.
 *
 * TODO(supabase): Replace the in-memory object with real queries.
 * - find   -> supabase.from('settings').select('*').single()
 * - update -> supabase.from('settings').update(data).eq('id', id).select().single()
 */
export class SettingsRepository {
  static async find(): Promise<Settings> {
    // TODO(supabase): supabase.from('settings').select('*').single()
    return mockSettings
  }

  static async update(data: Partial<Omit<Settings, 'id'>>): Promise<Settings> {
    // TODO(supabase): supabase.from('settings').update(data).eq('id', mockSettings.id).select().single()
    mockSettings = { ...mockSettings, ...data }
    return mockSettings
  }
}
