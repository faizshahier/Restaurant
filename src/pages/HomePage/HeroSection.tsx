import { Link } from 'react-router-dom'
import { Container } from '../../components/layout/Container'

export function HeroSection() {
  return (
    <section className="relative overflow-hidden border-b border-charcoal-700">
      {/* Background video: muted + autoPlay + loop + playsInline are all required for
          browsers to autoplay it silently. object-cover fills the section without
          distortion. aria-hidden since it's decorative. */}
      <video
        className="absolute inset-0 h-full w-full origin-center scale-125 object-cover"
        src="/home_video.mp4"
        autoPlay
        muted
        loop
        playsInline
        aria-hidden="true"
      />
      {/* Dark overlay keeps the heading, text, and buttons readable over the video. */}
      <div className="absolute inset-0 bg-charcoal-900/70" aria-hidden="true" />

      <Container>
        <div className="relative flex flex-col items-center gap-6 py-20 text-center sm:py-28">
          <h1 className="font-display text-4xl font-semibold text-charcoal-50 drop-shadow sm:text-5xl lg:text-6xl">
            A Warm Table, Always Waiting
          </h1>
          <p className="max-w-2xl text-base text-charcoal-100 drop-shadow sm:text-lg">
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
              className="rounded-md border border-charcoal-100/40 bg-charcoal-900/30 px-6 py-3 text-sm font-semibold text-charcoal-50 backdrop-blur-sm transition-colors hover:border-primary-300 hover:text-primary-300"
            >
              Order Now
            </Link>
          </div>
        </div>
      </Container>
    </section>
  )
}
