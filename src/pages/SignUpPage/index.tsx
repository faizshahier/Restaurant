import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { Container } from '../../components/layout/Container'
import { useAuth } from '../../context/AuthContext'
import {
  signUpSchema,
  verifyEmailOtpSchema,
  type SignUpInput,
  type VerifyEmailOtpInput,
} from '../../validation/schemas'
import { SignUpForm } from './SignUpForm'
import { VerifyCodeForm } from './VerifyCodeForm'
import { toErrorMessage } from '../../lib/errors'

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
      setSubmitError(toErrorMessage(error, 'Something went wrong. Please try again.'))
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
      setVerifyError(toErrorMessage(error, 'Invalid or expired code. Please try again.'))
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
      setVerifyError(toErrorMessage(error, 'Could not resend the code. Please try again.'))
    }
  }

  return (
    <Container>
      {pendingEmail ? (
        <VerifyCodeForm
          pendingEmail={pendingEmail}
          code={code}
          codeErrors={codeErrors}
          isVerifying={isVerifying}
          verifyError={verifyError}
          resendMessage={resendMessage}
          onCodeChange={setCode}
          onSubmit={handleVerify}
          onResend={() => void handleResend()}
        />
      ) : (
        <SignUpForm
          form={form}
          errors={errors}
          isSubmitting={isSubmitting}
          submitError={submitError}
          onChange={updateField}
          onSubmit={handleSubmit}
        />
      )}
    </Container>
  )
}
