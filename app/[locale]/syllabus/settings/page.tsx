import { ContentSection } from '@/components/pages/syllabus/content-section'
import { ProfileForm } from '@/components/profile/profile-form'
import { SyllabusContentFadeIn } from '@/components/syllabus/syllabus-page-transition'

export default function Page() {
  return (
    <SyllabusContentFadeIn delay={0.1}>
      <ContentSection
        desc='This is how others will see you on the site.'
        title='Profile'>
        <ProfileForm />
      </ContentSection>
    </SyllabusContentFadeIn>
  )
}
