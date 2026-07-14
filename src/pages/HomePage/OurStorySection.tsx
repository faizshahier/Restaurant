import { Link } from 'react-router-dom'
import { Container } from '../../components/layout/Container'

export function OurStorySection() {
  return (
    <Container>
      <div className="flex flex-col items-center gap-4 py-4 text-center">
        <h2 className="font-display text-2xl text-charcoal-50">Our Story</h2>
        <p className="max-w-2xl text-charcoal-100">
          What started as a single family table has grown into a neighborhood favorite, without losing the
          things that mattered from day one: honest food and a genuine welcome.
        </p>
        <Link to="/about" className="text-primary-300 hover:underline">
          Learn more about us
        </Link>
      </div>
    </Container>
  )
}
