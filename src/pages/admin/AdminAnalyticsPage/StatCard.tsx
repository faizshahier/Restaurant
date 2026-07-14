interface StatCardProps {
  label: string
  value: string
}

export function StatCard({ label, value }: StatCardProps) {
  return (
    <div className="rounded-lg border border-charcoal-700 bg-charcoal-800 p-6">
      <p className="text-sm text-charcoal-100">{label}</p>
      <p className="mt-1 font-display text-2xl text-primary-200">{value}</p>
    </div>
  )
}
