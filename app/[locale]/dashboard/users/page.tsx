import { UsersProvider } from '@/hooks/users-provider'
import { getDb } from '@/lib/db'
import { Hi } from './hi'
import { SubHeader } from './sub-header'
import { UsersDialogs } from './users-dialog'

export default async function Page() {
  const db = getDb()
  const users = await db.selectFrom('User').selectAll().execute()

  return (
    <UsersProvider>
      <SubHeader />

      <Hi users={users} />

      <UsersDialogs />
    </UsersProvider>
  )
}
