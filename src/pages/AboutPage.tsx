import { useEffect, useState } from 'react'
import { Container } from '../components/layout/Container'
import { SettingsService } from '../services'
import type { Settings } from '../types'

const VALUES = [
  {
    title: 'Quality First',
    description: 'Every dish starts with ingredients we would be proud to serve at our own table.',
  },
  {
    title: 'A Genuine Welcome',
    description: 'Whether it is your first visit or your fiftieth, we want you to feel at home.',
  },
  {
    title: 'Sustainable Sourcing',
    description: 'We work with local growers and fisheries who share our standards.',
  },
]

const DAY_LABELS: Record<string, string> = {
  monday: 'Monday',
  tuesday: 'Tuesday',
  wednesday: 'Wednesday',
  thursday: 'Thursday',
  friday: 'Friday',
  saturday: 'Saturday',
  sunday: 'Sunday',
}

export function AboutPage() {
  const [settings, setSettings] = useState<Settings | null>(null)

  useEffect(() => {
    // Falls back to the default restaurant name/details if this fails.
    SettingsService.getSettings()
      .then(setSettings)
      .catch((err: unknown) => console.error('Failed to load settings', err))
  }, [])

  const restaurantName = settings?.restaurant_name ?? 'The Restaurant'

  return (
    <>
      <Container>
        <h1 className="font-display text-3xl font-semibold text-charcoal-50 sm:text-4xl">
          About {restaurantName}
        </h1>
        <div className="mt-4 max-w-2xl space-y-4 text-charcoal-100">
          <p>
            What started as a single family table has grown into a neighborhood favorite, without losing the
            things that mattered from day one: honest food and a genuine welcome.
          </p>
          <p>
            Every menu is built around what is fresh that week, and every table is set with the same care
            whether it is a quiet Tuesday lunch or a Saturday night full house.
          </p>
        </div>
      </Container>

      <section className="border-y border-charcoal-700 bg-charcoal-800">
        <Container>
          <div className="grid gap-8 sm:grid-cols-3">
            {VALUES.map((value) => (
              <div key={value.title}>
                <h2 className="font-display text-lg text-primary-200">{value.title}</h2>
                <p className="mt-2 text-sm text-charcoal-100">{value.description}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <Container>
        <h2 className="font-display text-2xl text-charcoal-50">Visit Us</h2>
        <div className="mt-4 grid gap-8 sm:grid-cols-2">
          <div className="text-charcoal-100">
            <p className="font-medium text-charcoal-50">Address</p>
            <p className="mt-1">{settings?.address ?? '—'}</p>
          </div>

          <dl className="space-y-1 text-sm text-charcoal-100">
            {Object.entries(settings?.opening_hours ?? {}).map(([day, hours]) => (
              <div key={day} className="flex justify-between gap-4">
                <dt>{DAY_LABELS[day] ?? day}</dt>
                <dd>{hours}</dd>
              </div>
            ))}
          </dl>
        </div>
      </Container>
    </>
  )
}
