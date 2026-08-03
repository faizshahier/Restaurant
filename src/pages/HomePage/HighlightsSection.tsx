import { Container } from '../../components/layout/Container'

const HIGHLIGHTS = [
  {
    title: 'Seasonal Ingredients',
    description: 'Menus change with the season, sourced from local growers and fisheries.',
    // Inline SVG paths (rather than an icon library) keep the bundle small and
    // let the icon inherit its colour from the parent via currentColor.
    icon: (
      <path d="M12 3c4 2 6 5 6 8a6 6 0 0 1-12 0c0-3 2-6 6-8Zm0 0v18" strokeLinecap="round" strokeLinejoin="round" />
    ),
  },
  {
    title: 'Warm, Unhurried Service',
    description: 'A room built for long dinners, good company, and no clock-watching.',
    icon: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 2" strokeLinecap="round" strokeLinejoin="round" />
      </>
    ),
  },
  {
    title: 'Easy Ordering',
    description: 'Order online in under a minute, any day of the week.',
    icon: (
      <>
        <path d="M4 5h2l2 11h9l2-7H7" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="10" cy="19" r="1.4" />
        <circle cx="17" cy="19" r="1.4" />
      </>
    ),
  },
]

export function HighlightsSection() {
  return (
    <section className="border-y border-charcoal-700 bg-charcoal-800">
      <Container>
        <div className="grid gap-6 sm:grid-cols-3">
          {HIGHLIGHTS.map((highlight) => (
            <div
              key={highlight.title}
              className="rounded-xl border border-charcoal-700 bg-charcoal-900/50 p-6 transition-colors hover:border-primary-300/60"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-400/15 text-primary-300">
                <svg viewBox="0 0 24 24" className="h-6 w-6 fill-none stroke-current stroke-[1.6]">
                  {highlight.icon}
                </svg>
              </span>
              <h3 className="mt-4 font-display text-lg text-primary-200">{highlight.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-charcoal-100">{highlight.description}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  )
}
