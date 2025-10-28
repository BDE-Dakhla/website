'use client'

import type { Sponsor } from '@/types/schema'
import useSWR from 'swr'
import { Skeleton } from '@/components/ui/skeleton'

export default function Page() {
  const { data: sponsors = [], isLoading } = useSWR<Sponsor[]>(
    '/api/sponsors',
    (url: string) => fetch(url).then((r) => r.json()),
  )

  if (!isLoading && sponsors.length === 0) return null

  return (
    <main>
      {isLoading
        ? Array.from({ length: 8 }).map((_, i) => (
            <Skeleton className='h-9 w-20' key={`skeleton-${i}`} />
          ))
        : sponsors.map((sp) => <>{sp.name}</>)}
    </main>
  )
}
