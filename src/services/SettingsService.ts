import type { RestaurantSettings } from '../types'

let mockSettings: RestaurantSettings = {
  id: 'settings-singleton',
  restaurantName: 'The Restaurant',
  address: '123 Main Street, Your City',
  phone: '+1 (555) 010-0000',
  email: 'hello@example.com',
  openingHours: {
    monday: '11:00 - 22:00',
    tuesday: '11:00 - 22:00',
    wednesday: '11:00 - 22:00',
    thursday: '11:00 - 22:00',
    friday: '11:00 - 23:00',
    saturday: '10:00 - 23:00',
    sunday: '10:00 - 21:00',
  },
}

/**
 * Manages global restaurant settings (name, contact info, opening hours).
 *
 * TODO(supabase): Back this service with a single-row `settings` table.
 * - getSettings    -> supabase.from('settings').select('*').single()
 * - updateSettings -> supabase.from('settings').update(data).eq('id', id)
 */
export class SettingsService {
  static async getSettings(): Promise<RestaurantSettings> {
    // TODO(supabase): supabase.from('settings').select('*').single()
    return mockSettings
  }

  static async updateSettings(data: Partial<RestaurantSettings>): Promise<RestaurantSettings> {
    // TODO(supabase): supabase.from('settings').update(data).eq('id', mockSettings.id)
    mockSettings = { ...mockSettings, ...data }
    return mockSettings
  }
}
