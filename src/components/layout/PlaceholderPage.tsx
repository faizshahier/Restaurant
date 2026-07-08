import { Container } from './Container'

interface PlaceholderPageProps {
  title: string
  description: string
}

export function PlaceholderPage({ title, description }: PlaceholderPageProps) {
  return (
    <Container>
      <h1 className="font-display text-3xl font-semibold text-charcoal-50 sm:text-4xl">{title}</h1>
      <p className="mt-4 max-w-2xl text-charcoal-100">{description}</p>
    </Container>
  )
}
