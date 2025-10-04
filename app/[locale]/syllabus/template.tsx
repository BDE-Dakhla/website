'use client'

import { SyllabusPageTransition } from '@/components/syllabus-page-transition'
import { ReactNode } from 'react'

interface TemplateProps {
  children: ReactNode
}

export default function Template({ children }: TemplateProps) {
  return (
    <SyllabusPageTransition className="flex flex-col">
      {children}
    </SyllabusPageTransition>
  )
}