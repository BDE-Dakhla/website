'use client'

import type { Sponsor } from '@/types/schema'
import useSWR from 'swr'
import { PartnerCard } from '@/components/partners/partner-card'
import { Skeleton } from '@/components/ui/skeleton'

export default function Page() {
  const { data: sponsors = [], isLoading } = useSWR<Sponsor[]>(
    '/api/sponsors',
    (url: string) => fetch(url).then((r) => r.json()),
  )

  if (!isLoading && sponsors.length === 0) return null

  return (
    <main className='flex flex-wrap justify-center gap-4'>
      {isLoading
        ? Array.from({ length: 8 }).map((_, i) => (
            <Skeleton className='h-[181px] w-[266px]' key={`skeleton-${i}`} />
          ))
        : sponsors.map((sp) => <PartnerCard key={sp.id} sponsor={sp} />)}
    </main>
  )
}
