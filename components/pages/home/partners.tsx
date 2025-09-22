import Image from 'next/image'
import { SparklesCore } from '@/components/ui/sparkles'

const data = [
  {
    name: 'F.R.I.E.N.D.S By Lilia',
    href: 'https://www.instagram.com/friendsby_lilia',
    logo: 'friends',
  },
  {
    name: 'Le Passage',
    href: 'https://www.instagram.com/le_passage_dakhla',
    logo: 'lepassage',
  },
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

const List = () => {
  return (
    <div
      className='relative mx-auto mt-14 w-full max-w-7xl overflow-hidden py-3 text-lg text-white uppercase italic tracking-wide sm:text-xs md:text-sm lg:text-base xl:text-xl 2xl:text-2xl dark:bg-gray-900'
      x-data=''
      x-init='
            $nextTick(() => {
                const content = $refs.content;
                const item = $refs.item;
                const clone = item.cloneNode(true);
                content.appendChild(clone);
            });
    '>
      <div className='absolute left-0 z-20 h-full w-40 bg-gradient-to-r from-white to-transparent dark:from-gray-900'></div>
      <div className='absolute right-0 z-20 h-full w-40 bg-gradient-to-l from-white to-transparent dark:from-gray-900'></div>
      <div className='flex animate-marquee' x-ref='content'>
        <div
          className='flex w-full flex-shrink-0 items-center justify-around space-x-2 py-2 text-white'
          x-ref='item'>
          {data.map((part) => (
            <Image
              alt={part.name}
              className='h-9 w-auto translate-y-0.5 fill-current'
              height={60}
              key={part.name}
              src={`/partners/${part.logo}.png`}
              width={60}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export const Partners = () => {
  return (
    <section aria-label='partners' className='mt-32 overflow-hidden'>
      <div className='container mx-auto'>
        <div className='flex flex-col text-center text-3xl text-white'>
          <span className='text-black dark:text-white'>
            Trusted by experts.
          </span>
          <span className='text-black dark:text-white'>Used by leaders.</span>
        </div>
        <List />
      </div>
      <div className='-mt-32 after:-left-1/2 relative h-96 w-screen overflow-hidden [mask-image:radial-gradient(50%_50%,white,transparent)] before:absolute before:inset-0 before:bg-[radial-gradient(circle_at_bottom_center,#e60a64,transparent_70%)] before:opacity-40 after:absolute after:top-1/2 after:aspect-[1/0.7] after:w-[200%] after:rounded-[100%] after:border-[#c5769066] after:border-t after:bg-zinc-900'>
        <SparklesCore
          background='transparent'
          className='absolute inset-x-0 bottom-0 h-full w-full [mask-image:radial-gradient(50%_50%,white,transparent_85%)]'
          id='tsparticles'
          particleDensity={300}
        />
      </div>
    </section>
  )
}
