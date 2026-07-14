import { Field, inputClasses } from '../../../components/form/Field'
import type { SettingsFormState } from './useSettingsForm'

type FormErrors = Partial<Record<keyof Omit<SettingsFormState, 'opening_hours' | 'social_links'>, string>>

interface GeneralInfoFieldsProps {
  form: SettingsFormState
  errors: FormErrors
  onChange: <K extends keyof SettingsFormState>(field: K, value: SettingsFormState[K]) => void
}

export function GeneralInfoFields({ form, errors, onChange }: GeneralInfoFieldsProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <Field label="Restaurant Name" error={errors.restaurant_name}>
        <input
          type="text"
          value={form.restaurant_name}
          onChange={(event) => onChange('restaurant_name', event.target.value)}
          className={inputClasses}
        />
      </Field>

      <Field label="Logo URL" error={errors.logo}>
        <input
          type="text"
          value={form.logo}
          onChange={(event) => onChange('logo', event.target.value)}
          className={inputClasses}
        />
      </Field>

      <Field label="Phone" error={errors.phone}>
        <input
          type="tel"
          value={form.phone}
          onChange={(event) => onChange('phone', event.target.value)}
          className={inputClasses}
        />
      </Field>

      <Field label="Email" error={errors.email}>
        <input
          type="email"
          value={form.email}
          onChange={(event) => onChange('email', event.target.value)}
          className={inputClasses}
        />
      </Field>

      <Field label="Address" error={errors.address}>
        <input
          type="text"
          value={form.address}
          onChange={(event) => onChange('address', event.target.value)}
          className={inputClasses}
        />
      </Field>

      <Field label="Delivery Zone" error={errors.delivery_zone}>
        <input
          type="text"
          value={form.delivery_zone}
          onChange={(event) => onChange('delivery_zone', event.target.value)}
          className={inputClasses}
        />
      </Field>
    </div>
  )
}
