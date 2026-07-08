import { SettingsRepository } from '../repositories'
import { updateSettingsSchema, type UpdateSettingsInput } from '../validation/schemas'
import type { Settings } from '../types'

/**
 * Manages global restaurant settings (name, logo, contact info, hours, socials).
 *
 * TODO(supabase): This service is transport-agnostic; once Supabase is wired up
 * only SettingsRepository needs to change.
 */
export class SettingsService {
  static async getSettings(): Promise<Settings> {
    return SettingsRepository.find()
  }

  static async updateSettings(input: UpdateSettingsInput): Promise<Settings> {
    const data = updateSettingsSchema.parse(input)
    return SettingsRepository.update(data)
  }
}
