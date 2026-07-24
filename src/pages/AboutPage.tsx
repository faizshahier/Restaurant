import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
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

const TIMELINE = [
  {
    year: 'Year One',
    title: 'One Table, One Recipe',
    description:
      'We started with a single family recipe, a small kitchen, and a stubborn belief that good food does not need shortcuts.',
  },
  {
    year: 'Year Three',
    title: 'The Room Grows',
    description:
      'Word travelled further than we expected. We took the space next door, doubled the seating, and kept the same six suppliers.',
  },
  {
    year: 'Year Five',
    title: 'Beyond the Dining Room',
    description:
      'Takeaway and delivery arrived, so the food could reach the tables at home that had supported us from the start.',
  },
  {
    year: 'Today',
    title: 'Still the Same Kitchen',
    description:
      'A bigger menu and a busier pass, but every plate still leaves the kitchen the way it would for family.',
  },
]

const KITCHEN_NOTES = [
  {
    title: 'Made to Order',
    description:
      'Nothing sits under a heat lamp. Every plate is cooked when you order it, which is why some dishes take a little longer.',
  },
  {
    title: 'Seasonal by Default',
    description:
      'The menu shifts through the year. If something is not at its best this month, it comes off until it is.',
  },
  {
    title: 'Made From Scratch',
    description:
      'Stocks, sauces, dressings and desserts are all made in house, most of them before the doors open each morning.',
  },
  {
    title: 'Ask Us Anything',
    description:
      'Allergies, swaps, or a dish built around what you can eat — tell us and the kitchen will work with you.',
  },
]

const SERVICES = ['Dine-In', 'Takeaway', 'Delivery']

const FEATURES = [
  'Free WiFi',
  'Family Friendly',
  'Parking Available',
  'Vegetarian Options',
  'Group Bookings',
  'Card & Contactless',
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

// The settings row stores hours keyed by lowercase day name; this fixes the
// display order so it never depends on JSON key ordering.
const DAY_ORDER = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']

export function AboutPage() {
  const [settings, setSettings] = useState<Settings | null>(null)

  useEffect(() => {
    // Falls back to the default restaurant name/details if this fails.
    SettingsService.getSettings()
      .then(setSettings)
      .catch((err: unknown) => console.error('Failed to load settings', err))
  }, [])

  const restaurantName = settings?.restaurant_name || 'The Restaurant'

  const orderedHours = DAY_ORDER.filter((day) => settings?.opening_hours?.[day]).map(
    (day) => [day, settings?.opening_hours[day] ?? ''] as const,
  )

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
          <p>
            We cook the way we were taught — slowly, from scratch, and without pretending a shortcut is
            anything other than a shortcut. Some things take time, and we think you can taste the difference.
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
        <h2 className="font-display text-2xl text-charcoal-50">Our Story</h2>
        <ol className="mt-6 space-y-6 border-l border-charcoal-700 pl-6">
          {TIMELINE.map((entry) => (
            <li key={entry.year} className="relative">
              <span className="absolute -left-[1.9rem] top-1.5 h-3 w-3 rounded-full border-2 border-primary-300 bg-charcoal-900" />
              <p className="text-xs font-medium uppercase tracking-wide text-primary-300">{entry.year}</p>
              <h3 className="mt-1 font-display text-lg text-charcoal-50">{entry.title}</h3>
              <p className="mt-1 max-w-2xl text-sm text-charcoal-100">{entry.description}</p>
            </li>
          ))}
        </ol>
      </Container>

      <section className="border-y border-charcoal-700 bg-charcoal-800">
        <Container>
          <h2 className="font-display text-2xl text-charcoal-50">In the Kitchen</h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-2">
            {KITCHEN_NOTES.map((note) => (
              <div key={note.title} className="rounded-lg border border-charcoal-700 bg-charcoal-900 p-5">
                <h3 className="font-display text-lg text-primary-200">{note.title}</h3>
                <p className="mt-2 text-sm text-charcoal-100">{note.description}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <Container>
        <div className="grid gap-10 sm:grid-cols-2">
          <div>
            <h2 className="font-display text-2xl text-charcoal-50">How to Enjoy Us</h2>
            <p className="mt-2 text-sm text-charcoal-100">
              Eat in, take it with you, or have it brought to your door.
            </p>
            <ul className="mt-4 flex flex-wrap gap-2">
              {SERVICES.map((service) => (
                <li
                  key={service}
                  className="rounded-full border border-primary-300 px-3 py-1 text-sm text-primary-200"
                >
                  {service}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="font-display text-2xl text-charcoal-50">Good to Know</h2>
            <p className="mt-2 text-sm text-charcoal-100">A few things guests ask us most often.</p>
            <ul className="mt-4 flex flex-wrap gap-2">
              {FEATURES.map((feature) => (
                <li
                  key={feature}
                  className="rounded-full border border-charcoal-700 bg-charcoal-800 px-3 py-1 text-sm text-charcoal-100"
                >
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Container>

      <Container>
        <h2 className="font-display text-2xl text-charcoal-50">Visit Us</h2>
        <div className="mt-4 grid gap-8 sm:grid-cols-2">
          <div className="text-charcoal-100">
            <p className="font-medium text-charcoal-50">Address</p>
            <p className="mt-1">{settings?.address || '—'}</p>

            {settings?.delivery_zone && (
              <>
                <p className="mt-4 font-medium text-charcoal-50">Delivery Zone</p>
                <p className="mt-1">{settings.delivery_zone}</p>
              </>
            )}

            <p className="mt-6 text-sm">
              Ready to eat?{' '}
              <Link to="/menu" className="text-primary-300 hover:underline">
                Browse the menu
              </Link>{' '}
              or{' '}
              <Link to="/order" className="text-primary-300 hover:underline">
                order online
              </Link>
              .
            </p>
          </div>

          <div>
            <p className="font-medium text-charcoal-50">Opening Hours</p>
            {orderedHours.length === 0 ? (
              <p className="mt-1 text-sm text-charcoal-100">—</p>
            ) : (
              <dl className="mt-1 space-y-1 text-sm text-charcoal-100">
                {orderedHours.map(([day, hours]) => (
                  <div key={day} className="flex justify-between gap-4">
                    <dt>{DAY_LABELS[day] ?? day}</dt>
                    <dd>{hours}</dd>
                  </div>
                ))}
              </dl>
            )}
          </div>
        </div>
      </Container>
    </>
  )
}
