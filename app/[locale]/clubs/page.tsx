'use client'

import { ExternalLink, Globe, Users, X } from 'lucide-react'
import { useTranslations } from 'next-intl'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { Link } from '@/i18n/routing'
import Bulb from './icon'

interface Club {
  id: string
  name: string
  description: string
  category: string
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

export default function Page() {
  const [selectedClub, setSelectedClub] = useState<Club | null>(null)
  const [selectedInterest, setSelectedInterest] = useState<string>('all')
  const [selectedInternationalGroup, setSelectedInternationalGroup] =
    useState<string>('all')
  const [sortBy, setSortBy] = useState<string>('newest')
  const t = useTranslations()
  const {
    data: clubs,
    error,
    isLoading,
  } = useSWR<ApiClub[]>('/api/clubs', fetcher)

  const transformedClubs = clubs?.map(transformClub) || []
  const sortedClubs = [...transformedClubs].sort((a, b) => {
    switch (sortBy) {
      case 'oldest':
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      case 'newest':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      case 'members-asc':
        return a.memberCount - b.memberCount
      case 'members-desc':
        return b.memberCount - a.memberCount
      default:
        return 0
    }
  })

  const filteredClubs = sortedClubs.filter((club) => {
    const matchesInterest =
      selectedInterest === 'all' || club.category === selectedInterest
    const matchesInternational =
      selectedInternationalGroup === 'all' ||
      (selectedInternationalGroup === 'yes' && club.hasInternationalGroup) ||
      (selectedInternationalGroup === 'no' && !club.hasInternationalGroup)
    return matchesInterest && matchesInternational
  })

  const categories = Array.from(
    new Set(transformedClubs.map((c) => c.category)),
  )
  const interestData = [
    { type: 'all', size: transformedClubs.length },
    ...categories.map((cat) => ({
      type: cat,
      size: transformedClubs.filter((c) => c.category === cat).length,
    })),
  ]

  const sortOptions = [
    { value: 'newest', label: t('clubs.page.filters.sort.newest') },
    { value: 'oldest', label: t('clubs.page.filters.sort.oldest') },
    { value: 'members-desc', label: t('clubs.page.filters.sort.membersDesc') },
    { value: 'members-asc', label: t('clubs.page.filters.sort.membersAsc') },
  ]

  const internationalGroupOptions = [
    { value: 'all', label: t('clubs.page.filters.internationalGroup.all') },
    { value: 'yes', label: t('clubs.page.filters.internationalGroup.yes') },
    { value: 'no', label: t('clubs.page.filters.internationalGroup.no') },
  ]

  return (
    <main
      className={`@container/main mx-auto grid max-w-[1440px] transition-all duration-300 ${selectedClub ? 'grid-cols-[320px_1fr_320px]' : 'grid-cols-[320px_1fr_0px]'} space-y-10`}>
      <section aria-label='filters'>
        <Card className='mb-4'>
          <CardHeader>
            <CardTitle className='flex leading-6'>
              <Bulb className='mr-2 min-w-max' />
              {t('clubs.page.infoCard.title')}
            </CardTitle>
            <CardDescription className='mt-2'>
              {t('clubs.page.infoCard.description')}
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Button asChild className='w-full border'>
              <Link href='/'>
                <ExternalLink />
                {t('clubs.page.infoCard.button')}
              </Link>
            </Button>
          </CardFooter>
        </Card>

        <Accordion
          defaultValue={['area-of-interest', 'international-group']}
          type='multiple'>
          <AccordionItem value='area-of-interest'>
            <AccordionTrigger>
              {t('clubs.page.filters.areaOfInterest.label')}
            </AccordionTrigger>
            <AccordionContent>
              <RadioGroup
                defaultValue='all'
                onValueChange={setSelectedInterest}
                value={selectedInterest}>
                {interestData.map(({ type, size }) => (
                  <div className='flex items-center gap-3' key={type}>
                    <RadioGroupItem id={type} value={type} />
                    <Label htmlFor={type}>
                      {type === 'all'
                        ? t('clubs.page.filters.areaOfInterest.all')
                        : t(`clubs.page.categories.${type}`)}
                    </Label>
                    <Badge className='ml-auto' variant='secondary'>
                      {size}
                    </Badge>
                  </div>
                ))}
              </RadioGroup>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value='international-group'>
            <AccordionTrigger>
              {t('clubs.page.filters.internationalGroup.label')}
            </AccordionTrigger>
            <AccordionContent>
              <RadioGroup
                defaultValue='all'
                onValueChange={setSelectedInternationalGroup}
                value={selectedInternationalGroup}>
                {internationalGroupOptions.map(({ value, label }) => {
                  const count =
                    value === 'all'
                      ? transformedClubs.length
                      : value === 'yes'
                        ? transformedClubs.filter(
                            (c) => c.hasInternationalGroup,
                          ).length
                        : transformedClubs.filter(
                            (c) => !c.hasInternationalGroup,
                          ).length
                  return (
                    <div className='flex items-center gap-3' key={value}>
                      <RadioGroupItem id={value} value={value} />
                      <Label htmlFor={value}>{label}</Label>
                      <Badge className='ml-auto' variant='secondary'>
                        {count}
                      </Badge>
                    </div>
                  )
                })}
              </RadioGroup>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </section>

      <section aria-label='clubs' className='ml-10'>
        <div className='flex items-center justify-between'>
          <p>
            {isLoading
              ? t('clubs.page.loading')
              : t('clubs.page.clubsFound', { count: filteredClubs.length })}
          </p>
          <Select
            defaultValue='newest'
            onValueChange={setSortBy}
            value={sortBy}>
            <SelectTrigger>
              <SelectValue placeholder={t('clubs.page.filters.sort.label')} />
            </SelectTrigger>
            <SelectContent>
              {sortOptions.map(({ value, label }) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {error && <p>{t('clubs.page.error')}</p>}
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
            : filteredClubs.map((club) => (
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
                      {t(`clubs.page.categories.${club.category}`)}
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
                  {t(`clubs.page.categories.${selectedClub.category}`)}
                </Badge>
                <div className='flex items-center gap-1 text-muted-foreground text-sm'>
                  <Users className='h-4 w-4' />
                  {selectedClub.memberCount} {t('clubs.page.members')}
                </div>
              </div>
              <div className='text-muted-foreground text-sm'>
                <div>
                  {`${t('clubs.page.filters.internationalGroup.label')}: ${
                    selectedClub.hasInternationalGroup
                      ? t('clubs.page.filters.internationalGroup.yes')
                      : t('clubs.page.filters.internationalGroup.no')
                  }`}
                </div>
                <div>
                  {`${t('clubs.page.createdOn')} ${new Date(selectedClub.createdAt).toLocaleDateString()}`}
                </div>
              </div>
            </CardFooter>
          </Card>
        )}
      </aside>
    </main>
  )
}
