interface OpenStatusBadgeProps {
  /** null while the opening hours are still loading — the badge renders nothing. */
  isOpenNow: boolean | null
}

/** "Open Now" / "Closed" pill, computed from the saved opening hours. */
export function OpenStatusBadge({ isOpenNow }: OpenStatusBadgeProps) {
  if (isOpenNow === null) return null

  return (
    <span
      className={`rounded-full px-2 py-0.5 text-xs font-medium ${
        isOpenNow ? 'bg-available/20 text-available' : 'bg-out-of-stock/20 text-out-of-stock'
      }`}
    >
      {isOpenNow ? 'Open Now' : 'Closed'}
    </span>
  )
}
