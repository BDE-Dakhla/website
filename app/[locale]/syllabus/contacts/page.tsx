'use client'

import { motion } from 'framer-motion'
import { SyllabusContentFadeIn } from '@/components/syllabus/syllabus-page-transition'

export default function Page() {
  return (
    <SyllabusContentFadeIn
      className='flex flex-col gap-4 py-4 md:gap-6 md:py-6'
      delay={0.1}>
      <motion.div
        animate={{ opacity: 1, y: 0 }}
        className='rounded-xl border bg-card p-6 text-card-foreground'
        initial={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.6, delay: 0.3 }}>
        <h1 className='mb-4 font-bold text-2xl'>Contact des professeurs</h1>
        <p className='text-muted-foreground'>
          Cette section contiendra les informations de contact des professeurs.
        </p>
      </motion.div>
    </SyllabusContentFadeIn>
  )
}
