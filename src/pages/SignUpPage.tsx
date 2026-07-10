import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Container } from '../components/layout/Container'
import { Field, inputClasses } from '../components/form/Field'
import { useAuth } from '../context/AuthContext'
import {
  signUpSchema,
  verifyEmailOtpSchema,
  type SignUpInput,
  type VerifyEmailOtpInput,
} from '../validation/schemas'

const initialFormState: SignUpInput = { name: '', email: '', password: '' }

type FormErrors = Partial<Record<keyof SignUpInput, string>>
type CodeErrors = Partial<Record<keyof VerifyEmailOtpInput, string>>

export function SignUpPage() {
  const { signUp, verifyEmailOtp, resendSignUpCode } = useAuth()
  const navigate = useNavigate()

  const [form, setForm] = useState<SignUpInput>(initialFormState)
  const [errors, setErrors] = useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const [pendingEmail, setPendingEmail] = useState<string | null>(null)
  const [code, setCode] = useState('')
  const [codeErrors, setCodeErrors] = useState<CodeErrors>({})
  const [isVerifying, setIsVerifying] = useState(false)
  const [verifyError, setVerifyError] = useState<string | null>(null)
  const [resendMessage, setResendMessage] = useState<string | null>(null)

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
      const signUpResult = await signUp(result.data.name, result.data.email, result.data.password)
      if (signUpResult.status === 'needs-verification') {
        setPendingEmail(signUpResult.email)
      } else {
        navigate('/')
      }
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Something went wrong. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleVerify(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setVerifyError(null)
    if (!pendingEmail) return

    const result = verifyEmailOtpSchema.safeParse({ email: pendingEmail, token: code })
    if (!result.success) {
      const fieldErrors: CodeErrors = {}
      for (const issue of result.error.issues) {
        const field = issue.path[0] as keyof CodeErrors
        if (!fieldErrors[field]) fieldErrors[field] = issue.message
      }
      setCodeErrors(fieldErrors)
      return
    }

    setCodeErrors({})
    setIsVerifying(true)
    try {
      await verifyEmailOtp(result.data.email, result.data.token)
      navigate('/')
    } catch (error) {
      setVerifyError(error instanceof Error ? error.message : 'Invalid or expired code. Please try again.')
    } finally {
      setIsVerifying(false)
    }
  }

  async function handleResend() {
    if (!pendingEmail) return
    setResendMessage(null)
    setVerifyError(null)
    try {
      await resendSignUpCode(pendingEmail)
      setResendMessage('A new code is on its way.')
    } catch (error) {
      setVerifyError(error instanceof Error ? error.message : 'Could not resend the code. Please try again.')
    }
  }

  if (pendingEmail) {
    return (
      <Container>
        <div className="mx-auto max-w-sm">
          <h1 className="font-display text-3xl font-semibold text-charcoal-50">Check Your Email</h1>
          <p className="mt-2 text-charcoal-100">
            We sent a 6-digit code to <span className="font-medium text-charcoal-50">{pendingEmail}</span>.
            Enter it below to finish creating your account.
          </p>

          <form onSubmit={handleVerify} className="mt-8 flex flex-col gap-5" noValidate>
            <Field label="Verification Code" error={codeErrors.token}>
              <input
                type="text"
                inputMode="numeric"
                maxLength={6}
                placeholder="123456"
                value={code}
                onChange={(event) => setCode(event.target.value)}
                className={inputClasses}
              />
            </Field>

            {verifyError && <p className="text-sm text-red-400">{verifyError}</p>}
            {resendMessage && <p className="text-sm text-available">{resendMessage}</p>}

            <button
              type="submit"
              disabled={isVerifying}
              className="rounded-md bg-primary-400 px-6 py-3 text-sm font-semibold text-charcoal-900 transition-colors hover:bg-primary-300 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isVerifying ? 'Verifying…' : 'Verify & Continue'}
            </button>
          </form>

          <button
            type="button"
            onClick={() => void handleResend()}
            className="mt-6 text-sm font-medium text-primary-300 hover:underline"
          >
            Resend code
          </button>
        </div>
      </Container>
    )
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
