import { Wrench } from 'lucide-react'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { getTranslations } from 'next-intl/server'

export async function generateMetadata() {
  const t = await getTranslations('maintenance')
  return {
    title: t('title'),
    description: t('description'),
  }
}

export default function MaintenancePage() {
  const t = useTranslations('maintenance')

  return (
    <div className='flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-background via-background to-muted/20 px-4'>
      <div className='mx-auto w-full max-w-2xl text-center'>
        <div className='relative mb-8 flex justify-center'>
          <div className='animate-bounce'>
            <Image
              alt={t('imageAlt')}
              className='drop-shadow-2xl'
              height={300}
              priority
              src='/maintenance.svg'
              width={300}
            />
          </div>
        </div>

        <div className='mb-8 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-primary'>
          <Wrench className='size-5 animate-pulse' />
          <span className='font-semibold text-sm'>{t('badge')}</span>
        </div>

        <h1 className='mb-4 font-bold text-4xl tracking-tight md:text-5xl'>
          {t('heading')}
        </h1>

        <p className='mx-auto mb-8 max-w-md text-lg text-muted-foreground'>
          {t('message')}
        </p>

        <div className='rounded-lg border bg-card p-6 shadow-sm'>
          <p className='font-medium text-card-foreground text-sm'>
            {t('info')}
          </p>
          <p className='mt-2 text-muted-foreground text-sm'>{t('thankYou')}</p>
        </div>

        <div className='mt-12 flex justify-center gap-2'>
          <div className='size-2 animate-pulse rounded-full bg-primary' />
          <div
            className='size-2 animate-pulse rounded-full bg-primary'
            style={{ animationDelay: '0.2s' }}
          />
          <div
            className='size-2 animate-pulse rounded-full bg-primary'
            style={{ animationDelay: '0.4s' }}
          />
        </div>
      </div>
    </div>
  )
}
