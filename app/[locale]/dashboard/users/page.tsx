import { DataTable } from '@/components/data-table'
import { getDb } from '@/lib/db'

export default async function Page() {
  const db = getDb()
  const users = await db.selectFrom('User').selectAll().execute()

  console.log(users)

  return (
    <div className='flex flex-col gap-4 py-4 md:gap-6 md:py-6'>
      <DataTable data={[]} />
    </div>
  )
}
