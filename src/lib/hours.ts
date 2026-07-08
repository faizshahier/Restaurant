const DAY_KEYS = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']

function parseTimeToMinutes(time: string): number | null {
  const [hours, minutes] = time.split(':').map(Number)
  if (Number.isNaN(hours) || Number.isNaN(minutes)) return null
  return hours * 60 + minutes
}

/** Computed from `opening_hours` at render time — never persisted. */
export function isRestaurantOpenNow(openingHours: Record<string, string>, now: Date = new Date()): boolean {
  const hoursToday = openingHours[DAY_KEYS[now.getDay()]]
  if (!hoursToday) return false

  const [start, end] = hoursToday.split('-').map((part) => part.trim())
  const startMinutes = start ? parseTimeToMinutes(start) : null
  const endMinutes = end ? parseTimeToMinutes(end) : null
  if (startMinutes === null || endMinutes === null) return false

  const nowMinutes = now.getHours() * 60 + now.getMinutes()

  if (endMinutes <= startMinutes) {
    // Overnight hours (e.g. 18:00 - 02:00).
    return nowMinutes >= startMinutes || nowMinutes < endMinutes
  }

  return nowMinutes >= startMinutes && nowMinutes < endMinutes
}
