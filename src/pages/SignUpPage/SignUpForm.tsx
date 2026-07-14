import type { FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { Field, inputClasses } from '../../components/form/Field'
import type { SignUpInput } from '../../validation/schemas'

type FormErrors = Partial<Record<keyof SignUpInput, string>>

interface SignUpFormProps {
  form: SignUpInput
  errors: FormErrors
  isSubmitting: boolean
  submitError: string | null
  onChange: <K extends keyof SignUpInput>(field: K, value: SignUpInput[K]) => void
  onSubmit: (event: FormEvent<HTMLFormElement>) => void
}

export function SignUpForm({ form, errors, isSubmitting, submitError, onChange, onSubmit }: SignUpFormProps) {
  return (
    <div className="mx-auto max-w-sm">
      <h1 className="font-display text-3xl font-semibold text-charcoal-50">Sign Up</h1>
      <p className="mt-2 text-charcoal-100">Create an account to book tables faster next time.</p>

      <form onSubmit={onSubmit} className="mt-8 flex flex-col gap-5" noValidate>
        <Field label="Name" error={errors.name}>
          <input
            type="text"
            value={form.name}
            onChange={(event) => onChange('name', event.target.value)}
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

        <Field label="Password" error={errors.password}>
          <input
            type="password"
            value={form.password}
            onChange={(event) => onChange('password', event.target.value)}
            className={inputClasses}
          />
        </Field>

        {submitError && <p className="text-sm text-red-400">{submitError}</p>}

        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-md bg-primary-400 px-6 py-3 text-sm font-semibold text-charcoal-900 transition-colors hover:bg-primary-300 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? 'Creating account…' : 'Sign Up'}
        </button>
      </form>

      <p className="mt-6 text-sm text-charcoal-100">
        Already have an account?{' '}
        <Link to="/sign-in" className="text-primary-300 hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  )
}
