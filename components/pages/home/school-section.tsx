'use client'

import { ExternalLink, Video } from 'lucide-react'
import { useRef, useState } from 'react'
import { useLocale, useTranslations } from 'use-intl'
import { Paragraph, Title } from '@/components/design/typography'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { LayoutGrid } from '@/components/ui/layout-grid'
import { RainbowButton } from '@/components/ui/rainbow-button'
import { LANGS } from '@/i18n/routing'

const SkeletonOne = () => {
  const t = useTranslations('home.school-section')

  return (
    <div>
      <p className='font-bold text-4xl text-white'>{t('amphitheater')}</p>
      <p className='my-4 max-w-lg font-normal text-base text-neutral-200'>
        A serene and tranquil retreat, this house in the woods offers a peaceful
        escape from the hustle and bustle of city life.
      </p>
    </div>
  )
}

const SkeletonTwo = () => {
  return (
    <div>
      <p className='font-bold text-4xl text-white'>Club des Sports Nautiques</p>
      <p className='my-4 max-w-lg font-normal text-base text-neutral-200'>
        Sur le campus de l&apos;ENCG Dakhla, un petit bâtiment en bois abrite le
        Club des Sports Nautiques. Avec sa façade vitrée et son style simple
        mais chaleureux, ce local témoigne de l&apos;importance accordée aux
        activités sportives et maritimes dans cette école située au cœur
        d&apos;une région côtière.
      </p>
    </div>
  )
}
const SkeletonThree = () => {
  return (
    <div>
      <p className='font-bold text-4xl text-white'>La Buvette</p>
      <p className='my-4 max-w-lg font-normal text-base text-neutral-200'>
        Au sein de l&apos;ENCG Dakhla, la buvette offre un espace convivial et
        ombragé où les étudiants peuvent se détendre et partager un moment
        autour d&apos;un rafraîchissement ou d&apos;un encas. Avec son architecture
        moderne et ses espaces ouverts, ce lieu favorise les échanges et la vie
        sociale sur le campus.
      </p>
    </div>
  )
}
const SkeletonFour = () => {
  return (
    <div>
      <p className='font-bold text-4xl text-white'>Rivers are serene</p>
      <p className='my-4 max-w-lg font-normal text-base text-neutral-200'>
        A house by the river is a place of peace and tranquility. It&apos;s the
        perfect place to relax, unwind, and enjoy life.
      </p>
    </div>
  )
}

const cards = [
  {
    id: 1,
    content: <SkeletonOne />,
    className: 'col-span-2',
    thumbnail: '/school/amphi.png',
  },
  {
    id: 2,
    content: <SkeletonTwo />,
    className: 'row-span-2',
    thumbnail: '/school/clubs.png',
  },
  {
    id: 3,
    content: <SkeletonThree />,
    className: 'row-span-1 col-span-1',
    thumbnail: '/school/buvette.png',
  },
  {
    id: 4,
    content: <SkeletonFour />,
    className: 'row-span-2',
    thumbnail: '/school/classroom.png',
  },
]

export function SchoolSection() {
  const t = useTranslations('home.school-section')
  const locale = useLocale()
  const [videoOpen, setVideoOpen] = useState(false)

  const audioLang = 'fr' // change to the language the video is spoken in
  const videoRef = useRef<HTMLVideoElement>(null)

  return (
    <section
      aria-label='our-school'
      className='container mx-auto flex items-center gap-8 px-8'>
      <div className='min-w-2xl'>
        <Title as='h1'>{t('title')}</Title>

        <Paragraph className='mt-6'>{t('description_1')}</Paragraph>
        <Paragraph className='mt-4'>{t('description_2')}</Paragraph>

        <div className='mt-6 flex items-center gap-x-4'>
          <RainbowButton onClick={() => setVideoOpen(true)} size='lg'>
            <Video className='size-5' />
            {t('watch_video')}
          </RainbowButton>

          <Button asChild size='lg' variant='outline'>
            <a
              aria-label={t('visit_school_website')}
              href='https://encgd.uiz.ac.ma'
              rel='noopener noreferrer'
              target='_blank'>
              {t('visit_school_website')}
              <ExternalLink className='size-4' />
            </a>
          </Button>
        </div>
      </div>

      <LayoutGrid cards={cards} className='h-[400px] w-full' />

      <Dialog onOpenChange={setVideoOpen} open={videoOpen}>
        <DialogContent className='min-w-[65vw] overflow-hidden p-0'>
          <DialogHeader className='sr-only'>
            <DialogTitle>{t('watch_video')}</DialogTitle>
          </DialogHeader>
          <div className='relative aspect-video w-full bg-black'>
            {/** biome-ignore lint/a11y/useMediaCaption: track is already defined inside iteration */}
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
                    label={label.toUpperCase()}
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
