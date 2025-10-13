'use client'

import { ROOMS, SAMPLE_EVENTS, Timetable } from './schedule'
import { SyllabusContentFadeIn } from '@/components/syllabus/syllabus-page-transition'

export default function Page() {
  return (
    <SyllabusContentFadeIn className='flex h-full min-h-0 lg:space-x-5' delay={0.1}>
      <Timetable events={SAMPLE_EVENTS} rooms={ROOMS} />
    </SyllabusContentFadeIn>
  )
}
