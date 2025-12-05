import { useTranslations } from 'use-intl'

export const SchoolEcoWebConsumer = () => {
  const label = 'school-principal-editorial'
  const t = useTranslations()

  return (
    <section aria-label={label} className=''>
      {t('common.students')}
    </section>
  )
}
