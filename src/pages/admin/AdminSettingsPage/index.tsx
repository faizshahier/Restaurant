import { Container } from '../../../components/layout/Container'
import { useSettingsForm } from './useSettingsForm'
import { GeneralInfoFields } from './GeneralInfoFields'
import { OpeningHoursFields } from './OpeningHoursFields'
import { SocialLinksFields } from './SocialLinksFields'

export function AdminSettingsPage() {
  const {
    form,
    errors,
    isSubmitting,
    isSaved,
    submitError,
    updateField,
    updateOpeningHours,
    updateSocialLink,
    handleSubmit,
  } = useSettingsForm()

  if (!form) {
    return (
      <Container>
        <p className="text-charcoal-100">Loading settings…</p>
      </Container>
    )
  }

  return (
    <Container>
      <h1 className="font-display text-3xl font-semibold text-charcoal-50 sm:text-4xl">Settings</h1>
      <p className="mt-2 max-w-2xl text-charcoal-100">
        Restaurant details shown across the site (Header, Footer, About, Contact).
      </p>

      <form onSubmit={handleSubmit} className="mt-8 flex max-w-2xl flex-col gap-8" noValidate>
        <GeneralInfoFields form={form} errors={errors} onChange={updateField} />
        <OpeningHoursFields hours={form.opening_hours} onChange={updateOpeningHours} />
        <SocialLinksFields links={form.social_links} onChange={updateSocialLink} />

        {submitError && <p className="text-sm text-red-400">{submitError}</p>}
        {isSaved && <p className="text-sm text-available">Settings saved.</p>}

        <button
          type="submit"
          disabled={isSubmitting}
          className="self-start rounded-md bg-primary-400 px-6 py-3 text-sm font-semibold text-charcoal-900 transition-colors hover:bg-primary-300 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? 'Saving…' : 'Save Settings'}
        </button>
      </form>
    </Container>
  )
}
