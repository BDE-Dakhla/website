'use client'

import { UsersTable } from '@/components/users-table'
import { useUsersUrlState } from '@/hooks/use-users-url-state'

export function Hi({ users }: any) {
  const { search, setSearch } = useUsersUrlState()

  return (
    <UsersTable
      data={users}
      navigate={({ search: s }: any) => {
        // adapter if your table calls navigate({ search: fn | obj })
        const patch = typeof s === 'function' ? s(search) : s
        setSearch(patch)
      }}
      search={search}
    />
  )
}
