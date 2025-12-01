import type { Kysely } from 'kysely'
import type { Database } from '../../../types/schema'
import { hash } from 'bcryptjs'

export async function seed(db: Kysely<Database>) {
  console.log('Creating test users...')

  const hashedPassword = await hash('password123', 10)
  const testUsers = [
    {
      id: crypto.randomUUID(),
      username: 'teststudent',
      email: 'student@test.com',
      name: 'Test Student',
      cdm: 'R142002537',
      role: 'student',
      password: hashedPassword,
      emailVerified: new Date(),
      image: null,
      permissions: {},
    },
    {
      id: crypto.randomUUID(),
      username: 'testadmin',
      email: 'admin@test.com',
      name: 'Test Admin',
      cdm: 'A142002537',
      role: 'administrator',
      password: hashedPassword,
      emailVerified: new Date(),
      image: null,
      permissions: {
        MANAGE_USERS: 1,
        MANAGE_SPONSORS: 1,
        MANAGE_NEWSLETTER: 1,
        MANAGE_ANALYTICS: 1,
      },
    },
    {
      id: crypto.randomUUID(),
      username: 'testinvalid',
      email: 'invalid@test.com',
      name: 'Test Invalid User',
      cdm: 'R000000000',
      role: 'student',
      password: await hash('wrongpassword', 10),
      emailVerified: new Date(),
      image: null,
      permissions: {},
    },
  ]

  await db
    .insertInto('User')
    .values(testUsers as Array<Database['User']>)
    .execute()

  console.log('Test users created successfully')
}
