import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Container } from '../components/layout/Container'
import { Field, inputClasses } from '../components/form/Field'
import { useAuth } from '../context/AuthContext'
import { signInSchema, type SignInInput } from '../validation/schemas'

const initialFormState: SignInInput = { email: '', password: '' }

type FormErrors = Partial<Record<keyof SignInInput, string>>

export function SignInPage() {
  const { signIn } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState<SignInInput>(initialFormState)
  const [errors, setErrors] = useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  function updateField<K extends keyof SignInInput>(field: K, value: SignInInput[K]) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSubmitError(null)

    const result = signInSchema.safeParse(form)
    if (!result.success) {
      const fieldErrors: FormErrors = {}
      for (const issue of result.error.issues) {
        const field = issue.path[0] as keyof SignInInput
        if (!fieldErrors[field]) fieldErrors[field] = issue.message
      }
      setErrors(fieldErrors)
      return
    }

    setErrors({})
    setIsSubmitting(true)
    try {
      await signIn(result.data.email, result.data.password)
      navigate('/')
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Something went wrong. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Container>
      <div className="mx-auto max-w-sm">
        <h1 className="font-display text-3xl font-semibold text-charcoal-50">Sign In</h1>
        <p className="mt-2 text-charcoal-100">Welcome back. Sign in to track your orders.</p>

        <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-5" noValidate>
          <Field label="Email" error={errors.email}>
            <input
              type="email"
              value={form.email}
              onChange={(event) => updateField('email', event.target.value)}
              className={inputClasses}
            />
          </Field>

          <Field label="Password" error={errors.password}>
            <input
              type="password"
              value={form.password}
              onChange={(event) => updateField('password', event.target.value)}
              className={inputClasses}
            />
          </Field>

          {submitError && <p className="text-sm text-red-400">{submitError}</p>}

          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-md bg-brand-400 px-6 py-3 text-sm font-semibold text-charcoal-900 transition-colors hover:bg-brand-300 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? 'Signing in…' : 'Sign In'}
          </button>
        </form>

        <p className="mt-6 text-sm text-charcoal-100">
          Don't have an account?{' '}
          <Link to="/sign-up" className="text-brand-300 hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </Container>
  )
}
