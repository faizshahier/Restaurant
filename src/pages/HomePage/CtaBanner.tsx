import { Link } from 'react-router-dom'
import { Container } from '../../components/layout/Container'

export function CtaBanner() {
  return (
    <section className="border-b border-charcoal-700">
      <Container>
        <div className="flex flex-col items-center gap-4 py-4 text-center sm:flex-row sm:justify-between sm:text-left">
          <div>
            <h2 className="font-display text-2xl text-charcoal-50">Hungry?</h2>
            <p className="mt-1 text-charcoal-100">
              Order online for delivery or pickup, any day of the week.
            </p>
          </div>
          <Link
            to="/order"
            className="shrink-0 rounded-md bg-primary-400 px-6 py-3 text-sm font-semibold text-charcoal-900 transition-colors hover:bg-primary-300"
          >
            Order Now
          </Link>
        </div>
      </Container>
    </section>
  )
}
