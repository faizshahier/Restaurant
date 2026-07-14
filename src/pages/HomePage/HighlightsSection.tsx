import { Container } from '../../components/layout/Container'

const HIGHLIGHTS = [
  {
    title: 'Seasonal Ingredients',
    description: 'Menus change with the season, sourced from local growers and fisheries.',
  },
  {
    title: 'Warm, Unhurried Service',
    description: 'A room built for long dinners, good company, and no clock-watching.',
  },
  {
    title: 'Easy Ordering',
    description: 'Order online in under a minute, any day of the week.',
  },
]

export function HighlightsSection() {
  return (
    <section className="border-y border-charcoal-700 bg-charcoal-800">
      <Container>
        <div className="grid gap-8 sm:grid-cols-3">
          {HIGHLIGHTS.map((highlight) => (
            <div key={highlight.title}>
              <h3 className="font-display text-lg text-primary-200">{highlight.title}</h3>
              <p className="mt-2 text-sm text-charcoal-100">{highlight.description}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  )
}
