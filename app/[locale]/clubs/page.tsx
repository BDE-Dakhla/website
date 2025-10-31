'use client'

import { ChevronDown, ExternalLink, Globe, Users, X } from 'lucide-react'
import { useState } from 'react'
import useSWR from 'swr'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Skeleton } from '@/components/ui/skeleton'
import { Link } from '@/i18n/routing'
import Bulb from './icon'

interface Club {
  id: string
  name: string
  description: string
  category: 'sports' | 'culture' | 'academique' | 'international' | 'autre'
  hasInternationalGroup: boolean
  memberCount: number
  createdAt: string
}

const fetcher = (url: string) => fetch(url).then((res) => res.json())

interface ApiClub {
  id: string
  name: string
  description: string
  category: Club['category']
  hasInternationalGroup: boolean
  memberCount: number
  createdAt: string
}

const transformClub = (club: ApiClub): Club => ({
  ...club,
  createdAt: new Date(club.createdAt).toISOString().split('T')[0], // Format as YYYY-MM-DD
})

const getCategoryLabel = (category: Club['category']) => {
  const labels = {
    sports: 'Sports',
    culture: 'Culture',
    academique: 'Académique',
    international: 'International',
    autre: 'Autre',
  }
  return labels[category]
}

export default function Page() {
  const [selectedClub, setSelectedClub] = useState<Club | null>(null)
  const {
    data: clubs,
    error,
    isLoading,
  } = useSWR<ApiClub[]>('/api/clubs', fetcher)

  const transformedClubs = clubs?.map(transformClub) || []
  const sortedClubs = [...transformedClubs].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  )

  return (
    <main
      className={`@container/main mx-auto grid max-w-[1440px] transition-all duration-300 ${selectedClub ? 'grid-cols-[320px_1fr_320px]' : 'grid-cols-[320px_1fr_0px]'} space-y-10`}>
      <section aria-label='filters'>
        <Card className='mb-4'>
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

        <Accordion
          defaultValue={['area-of-interest', 'international-group']}
          type='multiple'>
          <AccordionItem value='area-of-interest'>
            <AccordionTrigger>Centre d&apos;intérêt</AccordionTrigger>
            <AccordionContent>
              <RadioGroup defaultValue='tous'>
                <div className='flex items-center gap-3'>
                  <RadioGroupItem id='tous' value='tous' />
                  <Label htmlFor='tous'>Tous</Label>
                  <Badge className='ml-auto' variant='secondary'>
                    {sortedClubs.length}
                  </Badge>
                </div>
                <div className='flex items-center gap-3'>
                  <RadioGroupItem id='sports' value='sports' />
                  <Label htmlFor='sports'>Sports</Label>
                  <Badge className='ml-auto' variant='secondary'>
                    {sortedClubs.filter((c) => c.category === 'sports').length}
                  </Badge>
                </div>
                <div className='flex items-center gap-3'>
                  <RadioGroupItem id='culture' value='culture' />
                  <Label htmlFor='culture'>Culture</Label>
                  <Badge className='ml-auto' variant='secondary'>
                    {sortedClubs.filter((c) => c.category === 'culture').length}
                  </Badge>
                </div>
                <div className='flex items-center gap-3'>
                  <RadioGroupItem id='academique' value='academique' />
                  <Label htmlFor='academique'>Académique</Label>
                  <Badge className='ml-auto' variant='secondary'>
                    {
                      sortedClubs.filter((c) => c.category === 'academique')
                        .length
                    }
                  </Badge>
                </div>
                <div className='flex items-center gap-3'>
                  <RadioGroupItem id='international' value='international' />
                  <Label htmlFor='international'>International</Label>
                  <Badge className='ml-auto' variant='secondary'>
                    {
                      sortedClubs.filter((c) => c.category === 'international')
                        .length
                    }
                  </Badge>
                </div>
                <div className='flex items-center gap-3'>
                  <RadioGroupItem id='autre' value='autre' />
                  <Label htmlFor='autre'>Autre</Label>
                  <Badge className='ml-auto' variant='secondary'>
                    {sortedClubs.filter((c) => c.category === 'autre').length}
                  </Badge>
                </div>
              </RadioGroup>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value='international-group'>
            <AccordionTrigger>Groupe international</AccordionTrigger>
            <AccordionContent>
              <RadioGroup defaultValue='yes'>
                <div className='flex items-center gap-3'>
                  <RadioGroupItem id='yes' value='yes' />
                  <Label htmlFor='yes'>Oui</Label>
                  <Badge className='ml-auto' variant='secondary'>
                    {sortedClubs.filter((c) => c.hasInternationalGroup).length}
                  </Badge>
                </div>
                <div className='flex items-center gap-3'>
                  <RadioGroupItem id='no' value='no' />
                  <Label htmlFor='no'>Non</Label>
                  <Badge className='ml-auto' variant='secondary'>
                    {sortedClubs.filter((c) => !c.hasInternationalGroup).length}
                  </Badge>
                </div>
              </RadioGroup>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </section>

      <section aria-label='clubs' className='ml-10'>
        <div className='flex items-center justify-between'>
          <p>
            {isLoading
              ? 'Chargement des clubs...'
              : `${sortedClubs.length} clubs trouvés`}
          </p>
          <div>
            Trier par: recent
            <ChevronDown />
          </div>
        </div>
        {error && <p>Error loading clubs</p>}
        <div className='mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
          {isLoading
            ? Array.from({ length: 8 }).map((_, i) => (
                <Card key={i}>
                  <CardHeader>
                    <Skeleton className='h-6 w-3/4' />
                    <Skeleton className='mt-2 h-4 w-full' />
                  </CardHeader>
                  <CardFooter className='flex justify-between'>
                    <Skeleton className='h-5 w-16' />
                    <Skeleton className='h-4 w-12' />
                  </CardFooter>
                </Card>
              ))
            : sortedClubs.map((club) => (
                <Card
                  className='cursor-pointer transition-shadow hover:shadow-md'
                  key={club.id}
                  onClick={() => setSelectedClub(club)}>
                  <CardHeader>
                    <div className='flex items-start justify-between'>
                      <CardTitle className='text-lg'>{club.name}</CardTitle>
                      {club.hasInternationalGroup && (
                        <Globe className='h-5 w-5 text-muted-foreground' />
                      )}
                    </div>
                    <CardDescription className='line-clamp-2'>
                      {club.description}
                    </CardDescription>
                  </CardHeader>
                  <CardFooter className='flex items-center justify-between'>
                    <Badge variant='outline'>
                      {getCategoryLabel(club.category)}
                    </Badge>
                    <div className='flex items-center gap-1 text-muted-foreground text-sm'>
                      <Users className='h-4 w-4' />
                      {club.memberCount}
                    </div>
                  </CardFooter>
                </Card>
              ))}
        </div>
      </section>

      <aside
        className={`ml-10 overflow-hidden transition-opacity duration-300 ${selectedClub ? 'opacity-100' : 'opacity-0'}`}>
        {selectedClub && (
          <Card>
            <CardHeader>
              <div className='flex items-start justify-between'>
                <CardTitle className='text-xl'>{selectedClub.name}</CardTitle>
                <div className='flex items-center gap-2'>
                  {selectedClub.hasInternationalGroup && (
                    <Globe className='h-5 w-5 text-muted-foreground' />
                  )}
                  <Button
                    className='h-6 w-6 p-0'
                    onClick={() => setSelectedClub(null)}
                    size='sm'
                    variant='ghost'>
                    <X className='h-4 w-4' />
                  </Button>
                </div>
              </div>
              <CardDescription>{selectedClub.description}</CardDescription>
            </CardHeader>
            <CardFooter className='flex flex-col items-start gap-4'>
              <div className='flex items-center gap-2'>
                <Badge variant='outline'>
                  {getCategoryLabel(selectedClub.category)}
                </Badge>
                <div className='flex items-center gap-1 text-muted-foreground text-sm'>
                  <Users className='h-4 w-4' />
                  {selectedClub.memberCount} membres
                </div>
              </div>
              <div className='text-muted-foreground text-sm'>
                <div>
                  Groupe international:{' '}
                  {selectedClub.hasInternationalGroup ? 'Oui' : 'Non'}
                </div>
                <div>
                  Créé le{' '}
                  {new Date(selectedClub.createdAt).toLocaleDateString('fr-FR')}
                </div>
              </div>
            </CardFooter>
          </Card>
        )}
      </aside>
    </main>
  )
}
