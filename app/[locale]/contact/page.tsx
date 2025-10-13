import { type LucideIcon, Mail, MapPin, Phone } from 'lucide-react'
import { getTranslations } from 'next-intl/server'
import { CopyButton } from '@/components/contact/copy-button'
import { SocialsSection } from '@/components/contact/socials-section'
import { cn } from '@/lib/utils'
import Illustration from './illustration'

const APP_EMAIL = 'contact@bde-encgd.ma'
const APP_PHONE = '+212 6 91 77 27 92'
const APP_PHONE_2 = '+212 5 21 98 76 43'

export default async function ContactPage() {
  const t = await getTranslations('contact')

  return (
    <div className='border-y'>
      <div className='mx-auto h-full max-w-6xl lg:border-x'>
        <div
          aria-hidden
          className='-z-10 absolute inset-0 isolate opacity-80 contain-strict'>
          <div className='-translate-y-87.5 -rotate-45 absolute top-0 left-0 h-320 w-140 rounded-full bg-[radial-gradient(68.54%_68.72%_at_55.02%_31.46%,--theme(--color-foreground/.06)_0,hsla(0,0%,55%,.02)_50%,--theme(--color-foreground/.01)_80%)]' />
          <div className='-rotate-45 absolute top-0 left-0 h-320 w-60 rounded-full bg-[radial-gradient(50%_50%_at_50%_50%,--theme(--color-foreground/.04)_0,--theme(--color-foreground/.01)_80%,transparent_100%)] [translate:5%_-50%]' />
          <div className='-translate-y-87.5 -rotate-45 absolute top-0 left-0 h-320 w-60 rounded-full bg-[radial-gradient(50%_50%_at_50%_50%,--theme(--color-foreground/.04)_0,--theme(--color-foreground/.01)_80%,transparent_100%)]' />
        </div>
        <div className='relative flex grow flex-col justify-center px-4 pt-32 pb-16 md:px-6'>
          <h1 className='font-bold text-4xl md:text-5xl'>{t('title')}</h1>
          <p className='mb-5 text-base text-muted-foreground'>
            {t('description')}
          </p>
          <Illustration className='absolute top-1/2 -translate-y-1/2 right-24' />
        </div>
        <BorderSeparator />
        <div className='grid md:grid-cols-3'>
          <Box
            description={t('email.description')}
            icon={Mail}
            title={t('email.title')}>
            <a
              className='font-medium font-mono text-base tracking-wide hover:underline'
              href={`mailto:${APP_EMAIL}`}>
              {APP_EMAIL}
            </a>
            <CopyButton className='size-6' text={APP_EMAIL} />
          </Box>
          <Box
            description={t('office.description')}
            icon={MapPin}
            title={t('office.title')}>
            <span className='font-medium font-mono text-base tracking-wide'>
              {t('office.address')}
            </span>
          </Box>
          <Box
            className='border-b-0 md:border-r-0'
            description={t('phone.description')}
            icon={Phone}
            title={t('phone.title')}>
            <div>
              <div className='flex items-center gap-x-2'>
                <a
                  className='block font-medium font-mono text-base tracking-wide hover:underline'
                  href={`tel:${APP_PHONE}`}>
                  {APP_PHONE}
                </a>
                <CopyButton className='size-6' text={APP_PHONE} />
              </div>
              <div className='flex items-center gap-x-2'>
                <a
                  className='block font-medium font-mono text-base tracking-wide hover:underline'
                  href={`tel:${APP_PHONE_2}`}>
                  {APP_PHONE_2}
                </a>
                <CopyButton className='size-6' text={APP_PHONE_2} />
              </div>
            </div>
          </Box>
        </div>
        <BorderSeparator />
        <div className='relative flex h-full min-h-[320px] items-center justify-center'>
          <div
            className={cn(
              'absolute inset-0 z--10 size-full',
              'bg-[radial-gradient(color-mix(in_oklab,var(--foreground)30%,transparent)_1px,transparent_1px)]',
              'bg-[size:32px_32px]',
              '[mask-image:radial-gradient(ellipse_at_center,var(--background)_30%,transparent)]',
            )}
          />

          <SocialsSection title={t('findOnline.title')} />
        </div>
      </div>
    </div>
  )
}

function BorderSeparator() {
  return <div className='absolute inset-x-0 h-px w-full border-b' />
}

type ContactBox = React.ComponentProps<'div'> & {
  icon: LucideIcon
  title: string
  description: string
}

function Box({
  title,
  description,
  className,
  children,
  ...props
}: ContactBox) {
  return (
    <div
      className={cn(
        'flex flex-col justify-between border-b md:border-r md:border-b-0',
        className,
      )}>
      <div className='flex items-center gap-x-3 border-b bg-muted/40 p-4'>
        <props.icon className='!size-5 text-muted-foreground' strokeWidth={1} />
        <h2 className='font-heading font-medium text-lg tracking-wider'>
          {title}
        </h2>
      </div>
      <div className='flex items-center gap-x-2 p-4 py-12'>{children}</div>
      <div className='border-t p-4'>
        <p className='text-muted-foreground text-sm'>{description}</p>
      </div>
    </div>
  )
}
