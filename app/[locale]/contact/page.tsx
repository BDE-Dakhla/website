import { type LucideIcon, Mail, MapPin, Phone } from 'lucide-react'
import { getTranslations } from 'next-intl/server'
import { CopyButton } from '@/components/contact/copy-button'
import { LocationMap } from '@/components/contact/location-map'
import { SocialsSection } from '@/components/contact/socials-section'
import { Link } from '@/i18n/routing'
import { cn } from '@/lib/utils'
import Illustration from './illustration'

const APP_EMAIL = 'contact@bde-encgd.ma'
const APP_PHONE = '+212 6 91 77 27 92'
const APP_PHONE_2 = '+212 5 21 98 76 43'

const GlowEffect = () => {
  return (
    <div
      aria-hidden
      className='-z-10 absolute inset-0 isolate opacity-80 contain-strict'>
      <div className='-translate-y-87.5 -rotate-45 absolute top-0 left-0 h-320 w-140 rounded-full bg-[radial-gradient(68.54%_68.72%_at_55.02%_31.46%,--theme(--color-foreground/.06)_0,hsla(0,0%,55%,.02)_50%,--theme(--color-foreground/.01)_80%)]' />
      <div className='-rotate-45 absolute top-0 left-0 h-320 w-60 rounded-full bg-[radial-gradient(50%_50%_at_50%_50%,--theme(--color-foreground/.04)_0,--theme(--color-foreground/.01)_80%,transparent_100%)] [translate:5%_-50%]' />
      <div className='-translate-y-87.5 -rotate-45 absolute top-0 left-0 h-320 w-60 rounded-full bg-[radial-gradient(50%_50%_at_50%_50%,--theme(--color-foreground/.04)_0,--theme(--color-foreground/.01)_80%,transparent_100%)]' />
    </div>
  )
}

export default async function ContactPage() {
  const t = await getTranslations('contact')

  return (
    <div className='border-y'>
      <div className='mx-auto h-full max-w-[1440px] lg:border-x'>
        <GlowEffect />
        <div className='grid auto-rows-min place-items-center space-y-6 p-12 text-center'>
          <h1 className='row-start-2 font-bold text-4xl md:text-5xl'>
            {t('title')}
          </h1>
          <p className='text-muted-foreground'>{t('description')}</p>
          <Illustration className='row-start-1 mb-12' />
        </div>
        <BorderSeparator />
        <div className='grid md:grid-cols-3'>
          <Box
            description={t('email.description')}
            icon={Mail}
            title={t('email.title')}>
            <Link
              className='font-medium font-mono text-base tracking-wide hover:underline'
              href={`mailto:${APP_EMAIL}`}>
              {APP_EMAIL}
            </Link>
            <CopyButton className='size-6' text={APP_EMAIL} />
          </Box>
          <Box
            description={t('office.description')}
            icon={MapPin}
            title={t('office.title')}>
            <div className='flex w-full flex-col items-center'>
              <LocationMap />
            </div>
          </Box>
          <Box
            className='border-b-0 md:border-r-0'
            description={t('phone.description')}
            icon={Phone}
            title={t('phone.title')}>
            <div>
              <div className='flex items-center gap-x-2'>
                <Link
                  className='block font-medium font-mono text-base tracking-wide hover:underline'
                  href={`tel:${APP_PHONE}`}>
                  {APP_PHONE}
                </Link>
                <CopyButton className='size-6' text={APP_PHONE} />
              </div>
              <div className='flex items-center gap-x-2'>
                <Link
                  className='block font-medium font-mono text-base tracking-wide hover:underline'
                  href={`tel:${APP_PHONE_2}`}>
                  {APP_PHONE_2}
                </Link>
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
      <div className='flex items-center justify-center gap-x-3 border-b bg-muted/40 p-4'>
        <props.icon className='!size-5 text-muted-foreground' strokeWidth={1} />
        <h2 className='select-none font-heading font-medium text-lg tracking-wider'>
          {title}
        </h2>
      </div>
      <div className='flex items-center justify-center gap-x-2 p-4 text-center'>
        {children}
      </div>
      <p className='border-t p-4 text-center text-muted-foreground text-sm'>
        {description}
      </p>
    </div>
  )
}
