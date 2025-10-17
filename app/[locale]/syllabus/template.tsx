'use client'

import type { ReactNode } from 'react'
import { SyllabusPageTransition } from '@/components/syllabus/syllabus-page-transition'

interface TemplateProps {
  children: ReactNode
}

export default function Template({ children }: TemplateProps) {
  return (
    <SyllabusPageTransition className='flex flex-col'>
      {children}
    </SyllabusPageTransition>
  )
}
