import { Link } from 'react-router-dom'
import { Container } from '../../components/layout/Container'

export function CtaBanner() {
  return (
    <section className="border-y border-charcoal-700">
      <Container>
        {/* The page's main call to action, so it gets a tinted panel and real
            breathing room instead of sitting flat against the background. */}
        <div className="flex flex-col items-center gap-6 rounded-2xl border border-primary-300/25 bg-primary-400/10 px-6 py-10 text-center sm:flex-row sm:justify-between sm:px-10 sm:text-left">
          <div>
            <h2 className="font-display text-2xl text-charcoal-50 sm:text-3xl">Hungry?</h2>
            <p className="mt-2 max-w-md text-charcoal-100">
              Order online for delivery or pickup, any day of the week.
            </p>
          </div>
          <Link
            to="/order"
            className="shrink-0 rounded-md bg-primary-400 px-8 py-3.5 text-sm font-semibold text-charcoal-900 shadow-lg shadow-primary-400/20 transition-colors hover:bg-primary-300"
          >
            Order Now
          </Link>
        </div>
      </Container>
    </section>
  )
}
