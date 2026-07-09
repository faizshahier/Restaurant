import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Container } from '../components/layout/Container'
import { Field, inputClasses } from '../components/form/Field'
import { useAuth } from '../context/AuthContext'
import { signUpSchema, type SignUpInput } from '../validation/schemas'

const initialFormState: SignUpInput = { name: '', email: '', password: '' }

type FormErrors = Partial<Record<keyof SignUpInput, string>>

export function SignUpPage() {
  const { signUp } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState<SignUpInput>(initialFormState)
  const [errors, setErrors] = useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  function updateField<K extends keyof SignUpInput>(field: K, value: SignUpInput[K]) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSubmitError(null)

    const result = signUpSchema.safeParse(form)
    if (!result.success) {
      const fieldErrors: FormErrors = {}
      for (const issue of result.error.issues) {
        const field = issue.path[0] as keyof SignUpInput
        if (!fieldErrors[field]) fieldErrors[field] = issue.message
      }
      setErrors(fieldErrors)
      return
    }

    setErrors({})
    setIsSubmitting(true)
    try {
      await signUp(result.data.name, result.data.email, result.data.password)
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
        <h1 className="font-display text-3xl font-semibold text-charcoal-50">Sign Up</h1>
        <p className="mt-2 text-charcoal-100">Create an account to book tables faster next time.</p>

        <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-5" noValidate>
          <Field label="Name" error={errors.name}>
            <input
              type="text"
              value={form.name}
              onChange={(event) => updateField('name', event.target.value)}
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
    </Container>
  )
}
