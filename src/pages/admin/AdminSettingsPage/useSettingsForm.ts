import { useEffect, useState, type FormEvent } from 'react'
import { SettingsService } from '../../../services'
import { updateSettingsSchema } from '../../../validation/schemas'
import type { Settings } from '../../../types'

export interface SettingsFormState {
  restaurant_name: string
  logo: string
  phone: string
  email: string
  address: string
  delivery_zone: string
  opening_hours: Record<string, string>
  social_links: Record<string, string>
}

function toFormState(settings: Settings): SettingsFormState {
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

type FormErrors = Partial<Record<keyof Omit<SettingsFormState, 'opening_hours' | 'social_links'>, string>>

/** Encapsulates the settings form's state, field updaters, and submit handling. */
export function useSettingsForm() {
  const [form, setForm] = useState<SettingsFormState | null>(null)
  const [errors, setErrors] = useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSaved, setIsSaved] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  useEffect(() => {
    SettingsService.getSettings().then((settings) => setForm(toFormState(settings)))
  }, [])

  function updateField<K extends keyof SettingsFormState>(field: K, value: SettingsFormState[K]) {
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

  return {
    form,
    errors,
    isSubmitting,
    isSaved,
    submitError,
    updateField,
    updateOpeningHours,
    updateSocialLink,
    handleSubmit,
  }
}
