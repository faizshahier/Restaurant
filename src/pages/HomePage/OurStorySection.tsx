import { Link } from 'react-router-dom'
import { Container } from '../../components/layout/Container'

const STATS = [
  { value: '10+', label: 'Years serving' },
  { value: '40+', label: 'Dishes on the menu' },
  { value: '7', label: 'Days a week' },
]

export function OurStorySection() {
  return (
    <Container>
      {/* Two columns: the story on the left, proof points on the right. Stacks to
          one column on small screens. */}
      <div className="grid items-center gap-10 lg:grid-cols-2">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary-300">Our Story</p>
          <h2 className="mt-2 font-display text-2xl text-charcoal-50 sm:text-3xl">
            A neighborhood favorite, still cooking the same way
          </h2>
          <p className="mt-4 leading-relaxed text-charcoal-100">
            What started as a single family table has grown into a neighborhood favorite, without losing the
            things that mattered from day one: honest food and a genuine welcome.
          </p>
          <Link
            to="/about"
            className="mt-6 inline-block text-sm font-medium text-primary-300 transition-colors hover:text-primary-200"
          >
            Learn more about us →
          </Link>
        </div>

        <div className="grid grid-cols-3 gap-4">
          {STATS.map((stat) => (
            <div
              key={stat.label}
              className="rounded-xl border border-charcoal-700 bg-charcoal-800 px-4 py-6 text-center"
            >
              <p className="font-display text-3xl text-primary-200 sm:text-4xl">{stat.value}</p>
              <p className="mt-2 text-xs leading-snug text-charcoal-100">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </Container>
  )
}
