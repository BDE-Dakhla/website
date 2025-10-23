import { ChevronDown, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Link } from '@/i18n/routing'
import Bulb from './icon'

export default function Page() {
  return (
    <main className='@container/main mx-auto max-w-[1440px] space-y-10'>
      {/* search bar */}

      <section className='max-w-xs'>
        <Card>
          <CardHeader>
            <CardTitle className='flex'>
              <Bulb className='mr-2 min-w-max' />
              Vous ne retrouvez pas un club ou qu'il vient d'être créé ?
            </CardTitle>
            <CardDescription>
              Suivez notre guide pour que ce club s&apos;affiche sur cette page
              !
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Button asChild className='w-full border'>
              <Link href='/'>
                <ExternalLink />
                En savoir plus
              </Link>
            </Button>
          </CardFooter>
        </Card>

        <div about='area-of-interest'>
          *{/* TODO: convert this into accordion component */}
          <div>
            Centre d&apos;intérêt
            <ChevronDown />
          </div>
          <ul aria-label='clubs-categories'></ul>
        </div>

        <div about='international-group'>
          <div>
            Centre d&apos;intérêt
            <ChevronDown />
          </div>
          <ul aria-label='clubs-categories'></ul>
        </div>
      </section>
    </main>
  )
}
