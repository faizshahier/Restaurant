import { Field, inputClasses } from '../../../components/form/Field'

const SOCIAL_KEYS = ['facebook', 'instagram', 'twitter', 'tiktok'] as const

const SOCIAL_LABELS: Record<string, string> = {
  facebook: 'Facebook URL',
  instagram: 'Instagram URL',
  twitter: 'Twitter URL',
  tiktok: 'TikTok URL',
}

interface SocialLinksFieldsProps {
  links: Record<string, string>
  onChange: (key: string, value: string) => void
}

export function SocialLinksFields({ links, onChange }: SocialLinksFieldsProps) {
  return (
    <div>
      <h2 className="font-display text-lg text-charcoal-50">Social Links</h2>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        {SOCIAL_KEYS.map((key) => (
          <Field key={key} label={SOCIAL_LABELS[key]}>
            <input
              type="text"
              placeholder="https://…"
              value={links[key] ?? ''}
              onChange={(event) => onChange(key, event.target.value)}
              className={inputClasses}
            />
          </Field>
        ))}
      </div>
    </div>
  )
}
