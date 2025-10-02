'use client'

import { UsersTable } from '@/components/users-table'
import { useUsersUrlState } from '@/hooks/use-users-url-state'

export function Hi({ users }: any) {
  const { search, setSearch } = useUsersUrlState()

  return (
    <UsersTable
      data={users.map((user: any) => ({ ...user, username: user.name }))}
      navigate={({ search: s }: any) => setSearch(s(search))}
      search={search}
    />
  )
}
