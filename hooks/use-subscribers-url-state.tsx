'use client'

import { useSearchParams } from 'next/navigation'
import { usePathname, useRouter } from '@/i18n/routing'

export type SubscribersSearch = {
  page?: number
  pageSize?: number
  email?: string
  status?: string[]
}

function parseSubscribersSearch(raw: {
  page?: string
  pageSize?: string
  email?: string
  status: string[]
}): SubscribersSearch {
  return {
    page: raw.page ? Number.parseInt(raw.page, 10) : undefined,
    pageSize: raw.pageSize ? Number.parseInt(raw.pageSize, 10) : undefined,
    email: raw.email || undefined,
    status: raw.status.length > 0 ? raw.status : undefined,
  }
}

function serializeSubscribersSearch(search: SubscribersSearch): string {
  const params = new URLSearchParams()
  if (search.page && search.page !== 1) params.set('page', String(search.page))
  if (search.pageSize && search.pageSize !== 10) params.set('pageSize', String(search.pageSize))
  if (search.email) params.set('email', search.email)
  if (search.status && search.status.length > 0) {
    for (const s of search.status) params.append('status', s)
  }
  return params.toString()
}

export function useSubscribersUrlState() {
  const router = useRouter()
  const pathname = usePathname()
  const sp = useSearchParams()

  const search = parseSubscribersSearch({
    page: sp.get('page') ?? undefined,
    pageSize: sp.get('pageSize') ?? undefined,
    email: sp.get('email') ?? undefined,
    status: sp.getAll('status'),
  })

  function setSearch(
    patch:
      | Partial<SubscribersSearch>
      | ((prev: SubscribersSearch) => Partial<SubscribersSearch>),
  ) {
    const nextPatch = typeof patch === 'function' ? patch(search) : patch
    const next = { ...search, ...nextPatch }
    const q = serializeSubscribersSearch(next)
    router.replace(`${pathname}${q ? `?${q}` : ''}`, { scroll: false })
  }

  return { search, setSearch }
}
