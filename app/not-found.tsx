import { ArrowLeftToLine, LifeBuoy } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { Paragraph, Title } from '@/components/design/typography'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <main className='grid min-h-screen max-w-screen place-items-center'>
      <section className='container mx-auto flex flex-col-reverse items-center justify-center md:flex-row'>
        <div className='mx-8 max-w-md space-y-4 text-center md:mr-20 md:text-left'>
          <Title as='h1'>Page Not Found</Title>
          <Paragraph>
            If you typed the URL directly , please make sure the spelling is
            correct.
          </Paragraph>
          <div className='flex flex-wrap justify-center gap-2 md:flex-nowrap lg:justify-start'>
            <Button asChild className='w-40' color='#ffd800'>
              <Link href='/'>
                <ArrowLeftToLine />
                Go back home
              </Link>
            </Button>
            <Button asChild className='w-40' variant='glow'>
              <Link href='/support'>
                <LifeBuoy />
                Contact support
              </Link>
            </Button>
          </div>
        </div>
        <Image
          alt='Illustration'
          className='h-96 select-none'
          draggable={false}
          height={400}
          src='/not-found.svg'
          width={400}
        />
      </section>
    </main>
  )
}
