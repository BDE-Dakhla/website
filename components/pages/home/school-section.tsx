'use client'

import { ExternalLink, Video } from 'lucide-react'
import { useRef, useState } from 'react'
import { useLocale, useTranslations } from 'use-intl'
import { trackEvent } from '@/components/common/analytics-tracker'
import { Paragraph, Title } from '@/components/shared/typography'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { LayoutGrid } from '@/components/ui/layout-grid'
import { RainbowButton } from '@/components/ui/rainbow-button'
import { LANGS, Link } from '@/i18n/routing'

interface SkeletonCardProps {
  title: string
  description: string
}

const SkeletonCard = ({ title, description }: SkeletonCardProps) => {
  return (
    <div>
      <p className='font-bold text-4xl text-white'>{title}</p>
      <p className='my-4 max-w-lg font-normal text-base text-neutral-200'>
        {description}
      </p>
    </div>
  )
}

export function SchoolSection() {
  const t = useTranslations('home.school-section')
  const tCards = useTranslations('home.school-section.cards')
  const locale = useLocale()
  const [videoOpen, setVideoOpen] = useState(false)

  const audioLang = 'fr'
  const videoRef = useRef<HTMLVideoElement>(null)

  const cards = [
    {
      id: 1,
      content: (
        <SkeletonCard
          description={tCards('amphitheater.description')}
          title={tCards('amphitheater.title')}
        />
      ),
      className: 'col-span-2',
      thumbnail: '/school/amphi.png',
      alt: tCards('amphitheater.alt'),
    },
    {
      id: 2,
      content: (
        <SkeletonCard
          description={tCards('sports_club.description')}
          title={tCards('sports_club.title')}
        />
      ),
      className: 'row-span-2',
      thumbnail: '/school/clubs.png',
      alt: tCards('sports_club.alt'),
    },
    {
      id: 3,
      content: (
        <SkeletonCard
          description={tCards('cafeteria.description')}
          title={tCards('cafeteria.title')}
        />
      ),
      className: 'row-span-1 col-span-1',
      thumbnail: '/school/buvette.png',
      alt: tCards('cafeteria.alt'),
    },
    {
      id: 4,
      content: (
        <SkeletonCard
          description={tCards('classroom.description')}
          title={tCards('classroom.title')}
        />
      ),
      className: 'row-span-2',
      thumbnail: '/school/classroom.png',
      alt: tCards('classroom.alt'),
    },
  ]

  const interactWithVideo = (): void => {
    setVideoOpen(true)
    trackEvent('watch-school-video')
  }

  const handleVideoDialogChange = (open: boolean): void => {
    setVideoOpen(open)
    if (!open && videoRef.current) {
      videoRef.current.pause()
      videoRef.current.currentTime = 0
    }
  }

  return (
    <section
      aria-label='our-school'
      className='container mx-auto flex flex-col items-center gap-8 px-8 lg:flex-row'>
      <div className='max-w-2xl'>
        <Title as='h1'>{t('title')}</Title>

        <Paragraph className='mt-6'>{t('description_1')}</Paragraph>
        <Paragraph className='mt-4'>{t('description_2')}</Paragraph>

        <div className='mt-6 flex items-center gap-x-4'>
          <RainbowButton onClick={interactWithVideo} size='lg'>
            <Video aria-hidden='true' className='size-5' />
            {t('watch_video')}
          </RainbowButton>

          <Button
            asChild
            onClick={async (): Promise<void> =>
              await trackEvent('visit-school-website')
            }
            size='lg'
            variant='outline'>
            <Link
              aria-label={t('visit_school_website')}
              href='https://encgd.uiz.ac.ma'
              rel='noopener noreferrer'
              target='_blank'>
              {t('visit_school_website')}
              <ExternalLink aria-hidden='true' className='size-4' />
            </Link>
          </Button>
        </div>
      </div>

      <LayoutGrid cards={cards} className='h-[300px] w-full sm:h-[400px]' />

      <Dialog onOpenChange={handleVideoDialogChange} open={videoOpen}>
        <DialogContent className='min-w-[65vw] overflow-hidden p-0'>
          <DialogHeader className='sr-only'>
            <DialogTitle>{t('watch_video')}</DialogTitle>
          </DialogHeader>
          <div className='relative aspect-video w-full bg-black'>
            <video
              className='absolute inset-0 h-full w-full'
              controls
              key={videoOpen ? 'open' : 'closed'}
              playsInline
              preload='metadata'
              ref={videoRef}
              src='/school/video.mp4'>
              {LANGS.map(
                ({ locale: lc, label }): React.ReactNode => (
                  <track
                    default={lc === locale}
                    key={lc}
                    kind={lc === audioLang ? 'captions' : 'subtitles'}
                    label={label}
                    src={`/school/video.${lc}.vtt`}
                    srcLang={lc}
                  />
                ),
              )}
            </video>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  )
}
