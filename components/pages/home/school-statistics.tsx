import { useTranslations } from 'next-intl'
import { Title } from '@/components/shared/typography'

export const SchoolStatistics = () => {
  const label = 'school-statistics'
  const t = useTranslations()

  const statistics = [
    { count: 750, label: t('common.students'), approx: true },
    { count: 25, label: t('common.classrooms') },
    { count: 15, label: 'Clubs' },
    { count: 2000, label: 'Livres uniques à la médiathèque', approx: true },
  ]

  return (
    <section
      aria-label={label}
      className='container mx-auto my-10 flex flex-wrap items-center justify-center gap-x-30'>
      {statistics.map((stat) => (
        <div className='flex flex-col items-center' key={stat.label}>
          <Title as='h1' className='h-12'>
            {stat.approx ? '+' : ''}
            {stat.count}
          </Title>
          <Title
            as='h5'
            className='mt-2 h-16 max-w-[200px] text-center uppercase tracking-wider'>
            {stat.label}
          </Title>
        </div>
      ))}
    </section>
  )
}
