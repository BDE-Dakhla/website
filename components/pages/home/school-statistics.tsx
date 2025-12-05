import { useTranslations } from 'next-intl'
import { Title } from '@/components/shared/typography'

export const SchoolStatistics = () => {
  const label = 'school-statistics'
  const t = useTranslations()

  const statistics = [
    { count: 750, label: t('common.students') },
    { count: 16, label: 'Classrooms' },
    { count: 1, label: '' },
    { count: 1, label: '' },
  ]

  return (
    <section
      aria-label={label}
      className='container mx-auto my-10 flex flex-wrap items-center justify-center gap-x-20 px-6'>
      {statistics.map((stat) => (
        <div className='flex flex-col items-center' key={stat.label}>
          <Title as='h1'>{stat.count}</Title>
          <Title as='h5' className='mt-2'>
            {stat.label}
          </Title>
        </div>
      ))}
    </section>
  )
}
