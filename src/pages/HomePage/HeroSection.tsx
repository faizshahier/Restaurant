import { Link } from 'react-router-dom'
import { Container } from '../../components/layout/Container'

export function HeroSection() {
  return (
    <section className="border-b border-charcoal-700">
      <Container>
        <div className="flex flex-col items-center gap-6 py-12 text-center sm:py-20">
          <h1 className="font-display text-4xl font-semibold text-charcoal-50 sm:text-5xl lg:text-6xl">
            A Warm Table, Always Waiting
          </h1>
          <p className="max-w-2xl text-base text-charcoal-100 sm:text-lg">
            Seasonal dishes, thoughtful service, and a room built for good company. Explore the menu or order
            online for delivery and pickup.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              to="/menu"
              className="rounded-md bg-primary-400 px-6 py-3 text-sm font-semibold text-charcoal-900 transition-colors hover:bg-primary-300"
            >
              View Menu
            </Link>
            <Link
              to="/order"
              className="rounded-md border border-charcoal-700 px-6 py-3 text-sm font-semibold text-charcoal-50 transition-colors hover:border-primary-300 hover:text-primary-300"
            >
              Order Now
            </Link>
          </div>
        </div>
      </Container>
    </section>
  )
}
