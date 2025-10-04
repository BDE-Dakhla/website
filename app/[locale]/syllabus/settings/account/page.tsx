import { ContentSection } from '@/components/content-section'
import { ProfileForm } from '@/components/profile-form'
import { SyllabusContentFadeIn } from '@/components/syllabus-page-transition'

export default function Page() {
  return (
    <SyllabusContentFadeIn delay={0.1}>
      <ContentSection
        desc='Update your account settings. Set your preferred language and
            timezone.'
        title='Account'>
        <ProfileForm />
      </ContentSection>
    </SyllabusContentFadeIn>
  )
}
