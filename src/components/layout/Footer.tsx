import { useEffect, useState } from 'react'
import { SettingsService } from '../../services'
import type { Settings } from '../../types'

const SOCIAL_LABELS: Record<string, string> = {
  facebook: 'Facebook',
  instagram: 'Instagram',
  twitter: 'Twitter',
  tiktok: 'TikTok',
}

export function Footer() {
  const [settings, setSettings] = useState<Settings | null>(null)

  useEffect(() => {
    SettingsService.getSettings().then(setSettings)
  }, [])

  const socialEntries = settings
    ? Object.entries(settings.social_links).filter(([, url]) => Boolean(url))
    : []

  return (
    <footer className="border-t border-charcoal-700 bg-charcoal-800">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-3 lg:px-8">
        <div>
          <p className="font-display text-lg text-primary-200">
            {settings?.restaurant_name ?? 'The Restaurant'}
          </p>
          <p className="mt-2 text-sm text-charcoal-100">{settings?.address ?? 'Address coming soon'}</p>
          {socialEntries.length > 0 && (
            <div className="mt-3 flex gap-3 text-sm">
              {socialEntries.map(([key, url]) => (
                <a
                  key={key}
                  href={url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-primary-300 hover:underline"
                >
                  {SOCIAL_LABELS[key] ?? key}
                </a>
              ))}
            </div>
          )}
        </div>

        <div className="text-sm text-charcoal-100">
          <p className="font-medium text-charcoal-50">Contact</p>
          <p className="mt-2">{settings?.phone ?? '—'}</p>
          <p>{settings?.email ?? '—'}</p>
        </div>

        <div className="text-sm text-charcoal-100">
          <p className="font-medium text-charcoal-50">Hours</p>
          <p className="mt-2">Mon–Fri: {settings?.opening_hours.monday ?? '—'}</p>
          <p>Sat–Sun: {settings?.opening_hours.saturday ?? '—'}</p>
        </div>
      </div>

      <div className="border-t border-charcoal-700 px-4 py-4 text-center text-xs text-charcoal-400 sm:px-6 lg:px-8">
        © {new Date().getFullYear()} {settings?.restaurant_name ?? 'The Restaurant'}. All rights reserved.
      </div>
    </footer>
  )
}
