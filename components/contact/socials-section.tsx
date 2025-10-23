'use client'

import { useLocale } from 'next-intl'
import { socials } from '@/components/layout/footer'
import { Link } from '@/i18n/routing'
import { trackEvent } from '../common/analytics-tracker'

type SocialsSectionProps = {
  title: string
}

export function SocialsSection({ title }: SocialsSectionProps) {
  const locale = useLocale()

  return (
    <div className='relative z-1 space-y-6'>
      <h2 className='text-center font-bold text-3xl md:text-4xl'>{title}</h2>
      <div className='flex flex-wrap items-center justify-center gap-4 px-8'>
        {socials(locale).map((link) => {
          const iconRender =
            link.icon.type !== 'svg' ? <link.icon /> : link.icon
          return (
            <Link
              className='flex items-center gap-x-2 rounded-full border bg-muted/50 px-4 py-2 font-medium text-sm tracking-wider hover:bg-accent'
              href={link.href}
              key={link.name}
              onClick={async () =>
                await trackEvent(
                  `contact-social-${link.name.toLowerCase()}-button`,
                )
              }
              rel='noopener noreferrer'
              target='_blank'>
              {iconRender}
              {link.name}
            </Link>
          )
        })}
      </div>
    </div>
  )
}
