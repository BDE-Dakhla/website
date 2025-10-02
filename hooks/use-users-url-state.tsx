'use client'

import { useSearchParams } from 'next/navigation'
import { usePathname, useRouter } from '@/i18n/routing'
import { parseUsersSearch, serializeUsersSearch, type UsersSearch } from '@/lib/search'

export function useUsersUrlState() {
  const router = useRouter()
  const pathname = usePathname()
  const sp = useSearchParams()

  const search = parseUsersSearch({
    page: sp.get('page') ?? undefined,
    pageSize: sp.get('pageSize') ?? undefined,
    status: sp.getAll('status'),
    role: sp.getAll('role'),
    username: sp.get('username') ?? undefined
  })

  function setSearch(patch: Partial<UsersSearch> | ((prev: UsersSearch) => Partial<UsersSearch>)) {
    const nextPatch = typeof patch === 'function' ? patch(search) : patch
    const next = { ...search, ...nextPatch }
    const q = serializeUsersSearch(next)
    router.replace(`${pathname}${q ? `?${q}` : ''}`, { scroll: false })
  }

  return { search, setSearch }
}
