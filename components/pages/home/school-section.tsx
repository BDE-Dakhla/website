'use client'

import { ExternalLink, Video } from 'lucide-react'
import { useRef, useState } from 'react'
import { useLocale, useTranslations } from 'use-intl'
import { trackEvent } from '@/components/analytics-tracker'
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
import { LANGS, Link } from '@/i18n/routing'

const SkeletonOne = () => {
  return (
    <div>
      <p className='font-bold text-4xl text-white'>
        Amphithéâtre moderne, à la hauteur des ambitions
      </p>
      <p className='my-4 max-w-lg font-normal text-base text-neutral-200'>
        Gradins courbes de fauteuils bordeaux, large scène avec bureau et
        projection, plafond et parois traités pour l&apos;acoustique: un espace
        pensé pour cours magistraux, conférences et soutenances. Reconnue au
        Maroc pour la qualité de sa formation en management, l&apos;ENCG Dakhla
        y accueille experts et événements de réseau — un cadre qui reflète sa
        notoriété et crée des opportunités.
      </p>
    </div>
  )
}

const SkeletonTwo = () => {
  return (
    <div>
      <p className='font-bold text-4xl text-white'>
        Club Sports Nautiques, vie de campus en mouvement
      </p>
      <p className='my-4 max-w-lg font-normal text-base text-neutral-200'>
        Pavillon en bois clair, grandes baies vitrées et enseigne bleue: un
        espace associatif dédié aux activités nautiques et aux événements
        étudiants. À l&apos;ENCG Dakhla, membre du réseau ENCG et reconnue pour
        sa formation exigeante, ces lieux prolongent les cours par des projets,
        des rencontres et des opportunités concrètes.
      </p>
    </div>
  )
}
const SkeletonThree = () => {
  return (
    <div>
      <p className='font-bold text-4xl text-white'>
        Buvette et patio, la pause qui relie
      </p>
      <p className='my-4 max-w-lg font-normal text-base text-neutral-200'>
        Patio ombragé, enseigne “Buvette”, murs ajourés et plantes succulentes:
        un espace frais et convivial pour cafés et déjeuners. Reconnue pour sa
        formation en management au sein du réseau ENCG, l&apos;ENCG Dakhla en
        fait un lieu d&apos;échanges et de projets — là où le réseau se tisse au
        quotidien.
      </p>
    </div>
  )
}
const SkeletonFour = () => {
  return (
    <div>
      <p className='font-bold text-4xl text-white'>
        Une salle lumineuse, prête à apprendre
      </p>
      <p className='my-4 max-w-lg font-normal text-base text-neutral-200'>
        Rangées en bois, tableau blanc et écran de projection, lumière filtrée
        par de grands rideaux bleus: un cadre calme et fonctionnel pour cours,
        cas pratiques et ateliers. Référence publique en commerce et gestion au
        Maroc, l&apos;ENCG Dakhla y relie la théorie à des projets, des stages
        et de vraies opportunités.
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

  const interactWithVideo = (): void => {
    setVideoOpen(true)
    trackEvent('watch-school-video')
  }

  return (
    <section
      aria-label='our-school'
      className='container mx-auto flex items-center gap-8 px-8'>
      <div className='min-w-2xl'>
        <Title as='h1'>{t('title')}</Title>

        <Paragraph className='mt-6'>{t('description_1')}</Paragraph>
        <Paragraph className='mt-4'>{t('description_2')}</Paragraph>

        <div className='mt-6 flex items-center gap-x-4'>
          <RainbowButton onClick={interactWithVideo} size='lg'>
            <Video className='size-5' />
            {t('watch_video')}
          </RainbowButton>

          <Button asChild size='lg' variant='outline'>
            <Link
              aria-label={t('visit_school_website')}
              href='https://encgd.uiz.ac.ma'
              rel='noopener noreferrer'
              target='_blank'>
              {t('visit_school_website')}
              <ExternalLink className='size-4' />
            </Link>
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
