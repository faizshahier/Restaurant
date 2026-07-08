import { Link } from 'react-router-dom'
import { Container } from '../components/layout/Container'

export function NotFoundPage() {
  return (
    <Container>
      <div className="flex flex-col items-center gap-4 py-20 text-center">
        <h1 className="font-display text-4xl font-semibold text-charcoal-50">Page Not Found</h1>
        <p className="text-charcoal-100">The page you're looking for doesn't exist.</p>
        <Link to="/" className="text-brand-300 hover:underline">
          Back to Home
        </Link>
      </div>
    </Container>
  )
}
