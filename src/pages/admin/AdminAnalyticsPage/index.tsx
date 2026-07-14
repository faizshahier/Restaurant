import { Container } from '../../../components/layout/Container'
import { formatPrice } from '../../../lib/format'
import { useOrderAnalytics } from './useOrderAnalytics'
import { StatCard } from './StatCard'
import { TopSellersChart } from './TopSellersChart'

export function AdminAnalyticsPage() {
  const { isLoading, todayRevenue, weekRevenue, monthRevenue, topSellers } = useOrderAnalytics()

  return (
    <Container>
      <h1 className="font-display text-3xl font-semibold text-charcoal-50 sm:text-4xl">Analytics</h1>
      <p className="mt-2 max-w-2xl text-charcoal-100">Revenue and best sellers, computed from order data.</p>

      {isLoading ? (
        <p className="mt-10 text-charcoal-100">Loading analytics…</p>
      ) : (
        <>
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <StatCard label="Today" value={formatPrice(todayRevenue)} />
            <StatCard label="This Week" value={formatPrice(weekRevenue)} />
            <StatCard label="This Month" value={formatPrice(monthRevenue)} />
          </div>

          <h2 className="mt-10 font-display text-xl text-charcoal-50">Top Sellers</h2>
          <TopSellersChart sellers={topSellers} />
        </>
      )}
    </Container>
  )
}
