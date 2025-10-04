import { ContentSection } from '@/components/content-section'
import { ProfileForm } from '@/components/profile-form'
import { SyllabusContentFadeIn } from '@/components/syllabus-page-transition'

export default function Page() {
  return (
    <SyllabusContentFadeIn delay={0.1}>
      <ContentSection desc='This is how others will see you on the site.' title='Profile'>
        <ProfileForm />
      </ContentSection>
    </SyllabusContentFadeIn>
  )
}
