import { useEffect, useState } from 'react'
import { Container } from '../components/layout/Container'
import { StaticMap } from '../components/map/StaticMap'
import { SettingsService } from '../services'
import type { Settings } from '../types'

const DAY_LABELS: Record<string, string> = {
  monday: 'Monday',
  tuesday: 'Tuesday',
  wednesday: 'Wednesday',
  thursday: 'Thursday',
  friday: 'Friday',
  saturday: 'Saturday',
  sunday: 'Sunday',
}

const SOCIAL_LABELS: Record<string, string> = {
  facebook: 'Facebook',
  instagram: 'Instagram',
  twitter: 'Twitter',
  tiktok: 'TikTok',
}

export function ContactPage() {
  const [settings, setSettings] = useState<Settings | null>(null)

  useEffect(() => {
    // Falls back to the placeholder contact details if this fails.
    SettingsService.getSettings()
      .then(setSettings)
      .catch((err: unknown) => console.error('Failed to load settings', err))
  }, [])

  const socialEntries = settings
    ? Object.entries(settings.social_links).filter(([, url]) => Boolean(url))
    : []

  return (
    <Container>
      <h1 className="font-display text-3xl font-semibold text-charcoal-50 sm:text-4xl">Contact</h1>
      <p className="mt-2 max-w-2xl text-charcoal-100">Reach out, or stop by during opening hours.</p>

      <div className="mt-8 grid gap-8 lg:grid-cols-2">
        <div className="space-y-6">
          <div>
            <p className="font-medium text-charcoal-50">Address</p>
            <p className="mt-1 text-charcoal-100">{settings?.address ?? '—'}</p>
          </div>

          <div>
            <p className="font-medium text-charcoal-50">Delivery Zone</p>
            <p className="mt-1 text-charcoal-100">{settings?.delivery_zone ?? '—'}</p>
          </div>

          <div>
            <p className="font-medium text-charcoal-50">Phone</p>
            <a href={`tel:${settings?.phone ?? ''}`} className="mt-1 block text-primary-300 hover:underline">
              {settings?.phone ?? '—'}
            </a>
          </div>

          <div>
            <p className="font-medium text-charcoal-50">Email</p>
            <a
              href={`mailto:${settings?.email ?? ''}`}
              className="mt-1 block text-primary-300 hover:underline"
            >
              {settings?.email ?? '—'}
            </a>
          </div>

          {socialEntries.length > 0 && (
            <div>
              <p className="font-medium text-charcoal-50">Follow Us</p>
              <div className="mt-1 flex gap-3">
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
            </div>
          )}

          <div>
            <p className="font-medium text-charcoal-50">Hours</p>
            <dl className="mt-2 space-y-1 text-sm text-charcoal-100">
              {Object.entries(settings?.opening_hours ?? {}).map(([day, hours]) => (
                <div key={day} className="flex justify-between gap-4">
                  <dt>{DAY_LABELS[day] ?? day}</dt>
                  <dd>{hours}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>

        {/* Waits for settings so the map is built from the saved address, not an
            empty string on the first render. */}
        {/* `key` remounts the map with fresh state if the saved address changes. */}
        <div>{settings && <StaticMap key={settings.address} address={settings.address} />}</div>
      </div>
    </Container>
  )
}
