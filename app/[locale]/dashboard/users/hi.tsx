'use client'

import type { Database } from '@/types/schema'
import { UsersTable } from '@/components/users/users-table'
import { useUsersUrlState } from '@/hooks/use-users-url-state'

export function Hi({ users }: { users: Array<Database['User']> }) {
  const { search, setSearch } = useUsersUrlState()

  return (
    <UsersTable
      data={users.map((user) => ({ ...user, username: user.name ?? null }))}
      navigate={({ search: s }) => {
        if (s !== true && typeof s !== 'boolean') {
          setSearch(s)
        }
      }}
      search={search}
    />
  )
}
