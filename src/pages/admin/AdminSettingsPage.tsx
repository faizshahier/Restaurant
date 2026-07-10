import { useEffect, useState, type FormEvent } from 'react'
import { Container } from '../../components/layout/Container'
import { Field, inputClasses } from '../../components/form/Field'
import { SettingsService } from '../../services'
import { updateSettingsSchema } from '../../validation/schemas'
import type { Settings } from '../../types'

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

const SOCIAL_KEYS = ['facebook', 'instagram', 'twitter', 'tiktok'] as const

const SOCIAL_LABELS: Record<string, string> = {
  facebook: 'Facebook URL',
  instagram: 'Instagram URL',
  twitter: 'Twitter URL',
  tiktok: 'TikTok URL',
}

interface FormState {
  restaurant_name: string
  logo: string
  phone: string
  email: string
  address: string
  delivery_zone: string
  opening_hours: Record<string, string>
  social_links: Record<string, string>
}

function toFormState(settings: Settings): FormState {
  return {
    restaurant_name: settings.restaurant_name,
    logo: settings.logo,
    phone: settings.phone,
    email: settings.email,
    address: settings.address,
    delivery_zone: settings.delivery_zone,
    opening_hours: { ...settings.opening_hours },
    social_links: {
      facebook: settings.social_links.facebook ?? '',
      instagram: settings.social_links.instagram ?? '',
      twitter: settings.social_links.twitter ?? '',
      tiktok: settings.social_links.tiktok ?? '',
    },
  }
}

type FormErrors = Partial<Record<keyof Omit<FormState, 'opening_hours' | 'social_links'>, string>>

export function AdminSettingsPage() {
  const [form, setForm] = useState<FormState | null>(null)
  const [errors, setErrors] = useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSaved, setIsSaved] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  useEffect(() => {
    SettingsService.getSettings().then((settings) => setForm(toFormState(settings)))
  }, [])

  function updateField<K extends keyof FormState>(field: K, value: FormState[K]) {
    setForm((prev) => (prev ? { ...prev, [field]: value } : prev))
    setIsSaved(false)
  }

  function updateOpeningHours(day: string, value: string) {
    setForm((prev) => (prev ? { ...prev, opening_hours: { ...prev.opening_hours, [day]: value } } : prev))
    setIsSaved(false)
  }

  function updateSocialLink(key: string, value: string) {
    setForm((prev) => (prev ? { ...prev, social_links: { ...prev.social_links, [key]: value } } : prev))
    setIsSaved(false)
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!form) return
    setSubmitError(null)
    setIsSaved(false)

    const socialLinks = Object.fromEntries(
      Object.entries(form.social_links).filter(([, value]) => value.trim() !== ''),
    )

    const result = updateSettingsSchema.safeParse({
      restaurant_name: form.restaurant_name,
      logo: form.logo,
      phone: form.phone,
      email: form.email,
      address: form.address,
      delivery_zone: form.delivery_zone,
      opening_hours: form.opening_hours,
      social_links: socialLinks,
    })

    if (!result.success) {
      const fieldErrors: FormErrors = {}
      for (const issue of result.error.issues) {
        const field = issue.path[0] as keyof FormErrors
        if (!fieldErrors[field]) fieldErrors[field] = issue.message
      }
      setErrors(fieldErrors)
      return
    }

    setErrors({})
    setIsSubmitting(true)
    try {
      const updated = await SettingsService.updateSettings(result.data)
      setForm(toFormState(updated))
      setIsSaved(true)
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Something went wrong. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!form) {
    return (
      <Container>
        <p className="text-charcoal-100">Loading settings…</p>
      </Container>
    )
  }

  return (
    <Container>
      <h1 className="font-display text-3xl font-semibold text-charcoal-50 sm:text-4xl">Settings</h1>
      <p className="mt-2 max-w-2xl text-charcoal-100">
        Restaurant details shown across the site (Header, Footer, About, Contact).
      </p>

      <form onSubmit={handleSubmit} className="mt-8 flex max-w-2xl flex-col gap-8" noValidate>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Restaurant Name" error={errors.restaurant_name}>
            <input
              type="text"
              value={form.restaurant_name}
              onChange={(event) => updateField('restaurant_name', event.target.value)}
              className={inputClasses}
            />
          </Field>

          <Field label="Logo URL" error={errors.logo}>
            <input
              type="text"
              value={form.logo}
              onChange={(event) => updateField('logo', event.target.value)}
              className={inputClasses}
            />
          </Field>

          <Field label="Phone" error={errors.phone}>
            <input
              type="tel"
              value={form.phone}
              onChange={(event) => updateField('phone', event.target.value)}
              className={inputClasses}
            />
          </Field>

          <Field label="Email" error={errors.email}>
            <input
              type="email"
              value={form.email}
              onChange={(event) => updateField('email', event.target.value)}
              className={inputClasses}
            />
          </Field>

          <Field label="Address" error={errors.address}>
            <input
              type="text"
              value={form.address}
              onChange={(event) => updateField('address', event.target.value)}
              className={inputClasses}
            />
          </Field>

          <Field label="Delivery Zone" error={errors.delivery_zone}>
            <input
              type="text"
              value={form.delivery_zone}
              onChange={(event) => updateField('delivery_zone', event.target.value)}
              className={inputClasses}
            />
          </Field>
        </div>

        <div>
          <h2 className="font-display text-lg text-charcoal-50">Opening Hours</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {DAY_KEYS.map((day) => (
              <Field key={day} label={DAY_LABELS[day]}>
                <input
                  type="text"
                  placeholder="11:00 - 22:00"
                  value={form.opening_hours[day] ?? ''}
                  onChange={(event) => updateOpeningHours(day, event.target.value)}
                  className={inputClasses}
                />
              </Field>
            ))}
          </div>
        </div>

        <div>
          <h2 className="font-display text-lg text-charcoal-50">Social Links</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {SOCIAL_KEYS.map((key) => (
              <Field key={key} label={SOCIAL_LABELS[key]}>
                <input
                  type="text"
                  placeholder="https://…"
                  value={form.social_links[key] ?? ''}
                  onChange={(event) => updateSocialLink(key, event.target.value)}
                  className={inputClasses}
                />
              </Field>
            ))}
          </div>
        </div>

        {submitError && <p className="text-sm text-red-400">{submitError}</p>}
        {isSaved && <p className="text-sm text-available">Settings saved.</p>}

        <button
          type="submit"
          disabled={isSubmitting}
          className="self-start rounded-md bg-primary-400 px-6 py-3 text-sm font-semibold text-charcoal-900 transition-colors hover:bg-primary-300 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? 'Saving…' : 'Save Settings'}
        </button>
      </form>
    </Container>
  )
}
