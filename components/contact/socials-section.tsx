'use client'

import { useLocale } from 'next-intl'
import { socials } from '@/components/layout/footer'

type SocialsSectionProps = {
  title: string
}

export function SocialsSection({ title }: SocialsSectionProps) {
  const locale = useLocale()

  return (
    <div className='relative z-1 space-y-6'>
      <h2 className='text-center font-bold text-3xl md:text-4xl'>{title}</h2>
      <div className='flex flex-wrap items-center gap-4'>
        {socials(locale).map((link) => {
          const iconRender =
            link.icon.type !== 'svg' ? <link.icon /> : link.icon
          return (
            <a
              className='flex items-center gap-x-2 rounded-full border bg-muted/50 px-4 py-2 hover:bg-accent'
              href={link.href}
              key={link.name}
              rel='noopener noreferrer'
              target='_blank'>
              {iconRender}
              <span className='font-medium font-mono text-sm tracking-wide'>
                {link.name}
              </span>
            </a>
          )
        })}
      </div>
    </div>
  )
}
