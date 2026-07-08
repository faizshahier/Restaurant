import type { ReactNode } from 'react'

export const inputClasses =
  'w-full rounded-md border border-charcoal-700 bg-charcoal-900 px-3 py-2 text-charcoal-50 placeholder:text-charcoal-400 focus:border-brand-300 focus:outline-none'

interface FieldProps {
  label: string
  error?: string
  children: ReactNode
}

export function Field({ label, error, children }: FieldProps) {
  return (
    <label className="flex flex-col gap-1 text-sm text-charcoal-100">
      {label}
      {children}
      {error && <span className="text-xs text-red-400">{error}</span>}
    </label>
  )
}
