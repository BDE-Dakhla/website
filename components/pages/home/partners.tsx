import type { Sponsor } from '@/types/schema'
import useSWR from 'swr'
import Image from '@/components/layout/image'
import {
  Marquee,
  MarqueeContent,
  MarqueeFade,
  MarqueeItem,
} from '@/components/ui/marquee'
import { Skeleton } from '@/components/ui/skeleton'
import { cn, getLogoUrl } from '@/lib/utils'

export function Partners() {
  const { data: sponsors = [], isLoading } = useSWR<Sponsor[]>(
    '/api/sponsors',
    (url: string) => fetch(url).then((r) => r.json()),
  )

  if (!isLoading && sponsors.length === 0) return null

  return (
    <section aria-label='partners' className='mt-28 mb-8 overflow-hidden'>
      <div className='container mx-auto'>
        <p className='mb-12 text-center text-3xl text-black dark:text-white'>
          Trusted by experts. <br />
          Used by leaders
        </p>
        <Marquee className='mx-auto max-w-[calc(100%-300px)]'>
          <MarqueeFade side='left' />
          <MarqueeFade side='right' />
          <MarqueeContent>
            {isLoading
              ? Array.from({ length: 8 }).map((_, i) => (
                  <MarqueeItem className='h-32 w-32' key={`skeleton-${i}`}>
                    <Skeleton className='h-9 w-20' />
                  </MarqueeItem>
                ))
              : sponsors.map((sp) => (
                  <MarqueeItem className='h-32 w-32' key={sp.name}>
                    <Image
                      alt={sp.name}
                      className='h-9 w-auto translate-y-0.5 text-white dark:text-neutral-200'
                      height={80}
                      key={sp.name}
                      src={getLogoUrl(sp.logo_url)}
                      width={80}
                    />
                  </MarqueeItem>
                ))}
          </MarqueeContent>
        </Marquee>
      </div>
      <div
        className={cn(
          '-mt-32 after:-left-1/2 relative h-96 w-screen overflow-hidden',
          'mask-[radial-gradient(50%_50%,white,transparent)]',
          'before:absolute before:inset-0 before:bg-[radial-gradient(circle_at_bottom_center,#69B755,transparent_70%)]',
          'before:opacity-40 after:absolute after:top-1/2 after:aspect-[1/0.7] after:w-[200%] after:rounded-[100%]',
          'after:border-[#69B75575] after:border-t after:bg-gray-200 dark:after:bg-zinc-900',
        )}
      />
    </section>
  )
}
