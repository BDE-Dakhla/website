import Image from 'next/image'
import {
  Marquee,
  MarqueeContent,
  MarqueeFade,
  MarqueeItem,
} from '@/components/ui/shadcn-io/marquee'
import { SparklesCore } from '@/components/ui/sparkles'
import { cn } from '@/lib/utils'

const data = [
  {
    name: 'CIH Bank',
    href: 'https://www.instagram.com/le_passage_dakhla',
    logo: 'cih',
  },
  {
    name: 'Attijari Wafabank',
    href: 'https://www.instagram.com/le_passage_dakhla',
    logo: 'awb',
  },
  {
    name: 'Société Générale',
    href: 'https://www.instagram.com/le_passage_dakhla',
    logo: 'sg',
  },
]

export const Partners = () => {
  return (
    <section aria-label='partners' className='mt-28 mb-8 overflow-hidden'>
      <div className='container mx-auto'>
        <div className='flex flex-col text-center text-3xl text-white'>
          <span className='text-black dark:text-white'>
            Trusted by experts.
          </span>
          <span className='text-black dark:text-white'>Used by leaders.</span>
        </div>
        <Marquee>
          <MarqueeFade side='left' />
          <MarqueeFade side='right' />
          <MarqueeContent>
            {data.map((part) => (
              <MarqueeItem className='h-32 w-32' key={part.name}>
                <Image
                  alt={part.name}
                  className='h-9 w-auto translate-y-0.5 select-none text-white dark:text-neutral-200'
                  draggable={false}
                  height={80}
                  key={part.name}
                  src={`/partners/${part.logo}.svg`}
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
          '[mask-image:radial-gradient(50%_50%,white,transparent)]',
          'before:absolute before:inset-0 before:bg-[radial-gradient(circle_at_bottom_center,#69B755,transparent_70%)]',
          'before:opacity-40 after:absolute after:top-1/2 after:aspect-[1/0.7] after:w-[200%] after:rounded-[100%]',
          'after:border-[#69B75575] after:border-t after:bg-zinc-900',
        )}>
        <SparklesCore
          background='#69B755'
          className='absolute inset-x-0 bottom-0 h-full w-full [mask-image:radial-gradient(50%_50%,white,transparent_85%)]'
          particleDensity={300}
        />
      </div>
    </section>
  )
}
