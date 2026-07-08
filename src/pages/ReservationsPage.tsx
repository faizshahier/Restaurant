import { useState, type FormEvent } from 'react'
import { Container } from '../components/layout/Container'
import { Field, inputClasses } from '../components/form/Field'
import { ReservationService } from '../services'
import { createReservationSchema, type CreateReservationInput } from '../validation/schemas'
import type { Reservation } from '../types'

const initialFormState: CreateReservationInput = {
  customer_name: '',
  phone: '',
  guests: 1,
  reservation_date: '',
  reservation_time: '',
  notes: '',
}

type FormErrors = Partial<Record<keyof CreateReservationInput, string>>

function todayIsoDate() {
  return new Date().toISOString().slice(0, 10)
}

export function ReservationsPage() {
  const [form, setForm] = useState<CreateReservationInput>(initialFormState)
  const [errors, setErrors] = useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [confirmedReservation, setConfirmedReservation] = useState<Reservation | null>(null)

  function updateField<K extends keyof CreateReservationInput>(field: K, value: CreateReservationInput[K]) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSubmitError(null)

    const result = createReservationSchema.safeParse(form)
    if (!result.success) {
      const fieldErrors: FormErrors = {}
      for (const issue of result.error.issues) {
        const field = issue.path[0] as keyof CreateReservationInput
        if (!fieldErrors[field]) fieldErrors[field] = issue.message
      }
      setErrors(fieldErrors)
      return
    }

    setErrors({})
    setIsSubmitting(true)
    try {
      const reservation = await ReservationService.createReservation(result.data)
      setConfirmedReservation(reservation)
      setForm(initialFormState)
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Something went wrong. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (confirmedReservation) {
    return (
      <Container>
        <div className="mx-auto max-w-lg rounded-lg border border-charcoal-700 bg-charcoal-800 p-8 text-center">
          <h1 className="font-display text-2xl text-charcoal-50">Reservation Requested</h1>
          <p className="mt-2 text-charcoal-100">
            Thanks, {confirmedReservation.customer_name}. We'll confirm your table for{' '}
            {confirmedReservation.guests} {confirmedReservation.guests === 1 ? 'guest' : 'guests'} on{' '}
            {confirmedReservation.reservation_date} at {confirmedReservation.reservation_time} shortly.
          </p>
          <p className="mt-4 text-sm text-brand-300">Status: {confirmedReservation.status}</p>
          <button
            type="button"
            onClick={() => setConfirmedReservation(null)}
            className="mt-6 rounded-md bg-brand-400 px-6 py-3 text-sm font-semibold text-charcoal-900 transition-colors hover:bg-brand-300"
          >
            Make Another Reservation
          </button>
        </div>
      </Container>
    )
  }

  return (
    <Container>
      <h1 className="font-display text-3xl font-semibold text-charcoal-50 sm:text-4xl">Reservations</h1>
      <p className="mt-2 max-w-2xl text-charcoal-100">
        Tell us when you'd like to visit and we'll hold a table for you.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 flex max-w-lg flex-col gap-5" noValidate>
        <Field label="Name" error={errors.customer_name}>
          <input
            type="text"
            value={form.customer_name}
            onChange={(event) => updateField('customer_name', event.target.value)}
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

        <div className="grid grid-cols-2 gap-4">
          <Field label="Date" error={errors.reservation_date}>
            <input
              type="date"
              min={todayIsoDate()}
              value={form.reservation_date}
              onChange={(event) => updateField('reservation_date', event.target.value)}
              className={inputClasses}
            />
          </Field>

          <Field label="Time" error={errors.reservation_time}>
            <input
              type="time"
              value={form.reservation_time}
              onChange={(event) => updateField('reservation_time', event.target.value)}
              className={inputClasses}
            />
          </Field>
        </div>

        <Field label="Guests" error={errors.guests}>
          <input
            type="number"
            min={1}
            value={form.guests}
            onChange={(event) => updateField('guests', Number(event.target.value))}
            className={inputClasses}
          />
        </Field>

        <Field label="Notes (optional)" error={errors.notes}>
          <textarea
            value={form.notes ?? ''}
            onChange={(event) => updateField('notes', event.target.value)}
            rows={3}
            className={inputClasses}
          />
        </Field>

        {submitError && <p className="text-sm text-red-400">{submitError}</p>}

        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-md bg-brand-400 px-6 py-3 text-sm font-semibold text-charcoal-900 transition-colors hover:bg-brand-300 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? 'Submitting…' : 'Request Reservation'}
        </button>
      </form>
    </Container>
  )
}
