import { Container } from '../components/layout/Container'

export function HomePage() {
  return (
    <Container>
      <div className="flex flex-col items-center gap-6 py-12 text-center sm:py-20">
        <h1 className="font-display text-4xl font-semibold text-charcoal-50 sm:text-5xl lg:text-6xl">
          A Warm Table, Always Waiting
        </h1>
        <p className="max-w-2xl text-base text-charcoal-100 sm:text-lg">
          Seasonal dishes, thoughtful service, and a room built for good company. Explore the menu or reserve
          a table for your next visit.
        </p>
      </div>
    </Container>
  )
}
