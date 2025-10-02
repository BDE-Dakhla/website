import { ContentSection } from '@/components/content-section'
import { ProfileForm } from '@/components/profile-form'

export default function Page() {
  return (
    <ContentSection
      desc='Update your account settings. Set your preferred language and
          timezone.'
      title='Account'>
      <ProfileForm />
    </ContentSection>
  )
}
