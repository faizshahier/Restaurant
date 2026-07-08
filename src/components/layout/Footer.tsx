import { useEffect, useState } from 'react'
import { SettingsService } from '../../services'
import type { RestaurantSettings } from '../../types'

export function Footer() {
  const [settings, setSettings] = useState<RestaurantSettings | null>(null)

  useEffect(() => {
    SettingsService.getSettings().then(setSettings)
  }, [])

  return (
    <footer className="border-t border-charcoal-700 bg-charcoal-800">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-3 lg:px-8">
        <div>
          <p className="font-display text-lg text-brand-200">
            {settings?.restaurantName ?? 'The Restaurant'}
          </p>
          <p className="mt-2 text-sm text-charcoal-100">{settings?.address ?? 'Address coming soon'}</p>
        </div>

        <div className="text-sm text-charcoal-100">
          <p className="font-medium text-charcoal-50">Contact</p>
          <p className="mt-2">{settings?.phone ?? '—'}</p>
          <p>{settings?.email ?? '—'}</p>
        </div>

        <div className="text-sm text-charcoal-100">
          <p className="font-medium text-charcoal-50">Hours</p>
          <p className="mt-2">Mon–Fri: {settings?.openingHours.monday ?? '—'}</p>
          <p>Sat–Sun: {settings?.openingHours.saturday ?? '—'}</p>
        </div>
      </div>

      <div className="border-t border-charcoal-700 px-4 py-4 text-center text-xs text-charcoal-400 sm:px-6 lg:px-8">
        © {new Date().getFullYear()} {settings?.restaurantName ?? 'The Restaurant'}. All rights reserved.
      </div>
    </footer>
  )
}
