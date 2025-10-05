import { SyllabusContentFadeIn } from '@/components/syllabus-page-transition'
import { Greetings } from './greetings'

export default function Page() {
  return (
    <SyllabusContentFadeIn
      className='flex flex-col gap-4 py-4 md:gap-6 md:py-6'
      delay={0.1}>
      <Greetings />
    </SyllabusContentFadeIn>
  )
}
