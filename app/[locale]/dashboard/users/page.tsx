import { UsersProvider } from '@/hooks/users-provider'
import { getDb } from '@/lib/db'
import { Hi } from './hi'
import { SubHeader } from './sub-header'
import { UsersDialogs } from './users-dialog'

export default async function Page() {
  const db = getDb()
  const users = await db.selectFrom('User').selectAll().execute()

  console.log(users)

  return (
    <UsersProvider>
      <div className='flex flex-col gap-4 py-4 md:gap-6 md:py-6'>
        <SubHeader />

        <div className='-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0'>
          <Hi users={users} />
        </div>
      </div>

      <UsersDialogs />
    </UsersProvider>
  )
}
