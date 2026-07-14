import { Field, inputClasses } from '../../../components/form/Field'

const DAY_KEYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'] as const

const DAY_LABELS: Record<string, string> = {
  monday: 'Monday',
  tuesday: 'Tuesday',
  wednesday: 'Wednesday',
  thursday: 'Thursday',
  friday: 'Friday',
  saturday: 'Saturday',
  sunday: 'Sunday',
}

interface OpeningHoursFieldsProps {
  hours: Record<string, string>
  onChange: (day: string, value: string) => void
}

export function OpeningHoursFields({ hours, onChange }: OpeningHoursFieldsProps) {
  return (
    <div>
      <h2 className="font-display text-lg text-charcoal-50">Opening Hours</h2>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        {DAY_KEYS.map((day) => (
          <Field key={day} label={DAY_LABELS[day]}>
            <input
              type="text"
              placeholder="11:00 - 22:00"
              value={hours[day] ?? ''}
              onChange={(event) => onChange(day, event.target.value)}
              className={inputClasses}
            />
          </Field>
        ))}
      </div>
    </div>
  )
}
