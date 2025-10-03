'use client'

import Image from 'next/image'
import { useTheme } from 'next-themes'
import { Button } from '@/components/ui/button'

export default function SubHeader() {
  const { theme } = useTheme()
  return (
    <div className='grid gap-4 lg:grid-cols-12'>
      <div className='relative flex flex-col gap-6 overflow-hidden rounded-xl border bg-card px-6 py-6 text-card-foreground lg:col-span-12 xl:col-span-6'>
        <div className='grid items-center pt-6 lg:grid-cols-3'>
          <div className='space-y-4 lg:col-span-2'>
            <div className='font-display text-3xl'>
              Bonjour, Walid
              <span className='ml-2 select-none text-4xl'>👋</span>
            </div>
            <div className='text-2xl'>What do you want to learn today with your partner?</div>
            <div className='text-muted-foreground'>
              Discover courses, track progress, and achieve your learning goods seamlessly.
            </div>

            <div className='pt-2'>
              <Button>Explorer les cours</Button>
            </div>
          </div>

          <Image
            alt='Illustration'
            className='block w-full dark:hidden'
            decoding='async'
            draggable={false}
            height={50}
            loading='lazy'
            src={`/academy-dashboard-${theme}.svg`}
            width={100}
          />
        </div>

        <Image
          alt='decoration'
          className='pointer-events-none absolute inset-0 aspect-auto select-none'
          decoding='async'
          draggable={false}
          height={300}
          loading='lazy'
          src='/star-shape.png'
          width={800}
        />
      </div>

      <div className='flex h-full flex-col gap-6 rounded-xl border bg-card py-6 text-card-foreground lg:col-span-6 xl:col-span-3'></div>
      <div className='flex h-full flex-col gap-6 rounded-xl border bg-card py-6 text-card-foreground lg:col-span-6 xl:col-span-3'></div>
    </div>
  )
}
