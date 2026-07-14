import type { FormEvent } from 'react'
import { Field, inputClasses } from '../../components/form/Field'
import type { VerifyEmailOtpInput } from '../../validation/schemas'

type CodeErrors = Partial<Record<keyof VerifyEmailOtpInput, string>>

interface VerifyCodeFormProps {
  pendingEmail: string
  code: string
  codeErrors: CodeErrors
  isVerifying: boolean
  verifyError: string | null
  resendMessage: string | null
  onCodeChange: (code: string) => void
  onSubmit: (event: FormEvent<HTMLFormElement>) => void
  onResend: () => void
}

export function VerifyCodeForm({
  pendingEmail,
  code,
  codeErrors,
  isVerifying,
  verifyError,
  resendMessage,
  onCodeChange,
  onSubmit,
  onResend,
}: VerifyCodeFormProps) {
  return (
    <div className="mx-auto max-w-sm">
      <h1 className="font-display text-3xl font-semibold text-charcoal-50">Check Your Email</h1>
      <p className="mt-2 text-charcoal-100">
        We sent a 6-digit code to <span className="font-medium text-charcoal-50">{pendingEmail}</span>. Enter
        it below to finish creating your account.
      </p>

      <form onSubmit={onSubmit} className="mt-8 flex flex-col gap-5" noValidate>
        <Field label="Verification Code" error={codeErrors.token}>
          <input
            type="text"
            inputMode="numeric"
            maxLength={6}
            placeholder="123456"
            value={code}
            onChange={(event) => onCodeChange(event.target.value)}
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
        onClick={onResend}
        className="mt-6 text-sm font-medium text-primary-300 hover:underline"
      >
        Resend code
      </button>
    </div>
  )
}
