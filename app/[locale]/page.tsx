'use client'

import { useTranslations } from 'next-intl'
import { Footer } from '@/components/layout/footer'
import { NavBar } from '@/components/layout/navbar'
import { Partners } from '@/components/pages/home/partners'
import { SchoolSection } from '@/components/pages/home/school-section'

export default function Page() {
  const t = useTranslations('')

  const statistics = [
    { count: 824, label: t('common.students') },
    { count: 3, label: 'schools' },
    { count: 1, label: 'university' },
    { count: 1, label: 'high school' },
  ]

  return (
    <main>
      <NavBar />

      {/* <section
        aria-label='school-statistics'
        className='container mx-auto my-10 flex flex-wrap items-center justify-center gap-x-20 px-6'>
        {statistics.map((stat) => (
          <div className='flex flex-col items-center' key={stat.label}>
            <Title as='h1'>{stat.count}</Title>
            <Title as='h5' className='mt-2'>
              {stat.label}
            </Title>
          </div>
        ))}
      </section> */}

      <SchoolSection />

      <Partners />

      <Footer />
    </main>
  )
}
