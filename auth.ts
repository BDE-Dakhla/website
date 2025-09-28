import 'server-only'

import type { Kysely } from 'kysely'
import { type Database as AuthDb, KyselyAdapter } from '@auth/kysely-adapter'
import { compare } from 'bcryptjs'
import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import Google from 'next-auth/providers/google'
import { signInSchema } from './lib/auth'
import { getDb } from './lib/db'

export const { auth, handlers, signIn, signOut } = NextAuth({
  adapter: KyselyAdapter(getDb() as unknown as Kysely<AuthDb>),
  providers: [
    Credentials({
      credentials: {
        cdm: { label: 'Code Massar', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      authorize: async (credentials) => {
        const parsed = signInSchema.safeParse(credentials)
        if (!parsed.success) return null

        const cdm = parsed.data.cdm.toUpperCase()
        const password = parsed.data.password
        const db = getDb()
        const user = await db
          .selectFrom('User')
          .select(['id', 'cdm', 'first_name', 'last_name', 'email', 'password'])
          .where('cdm', '=', cdm)
          .executeTakeFirst()

        if (!user) return null

        const isMatching = await compare(password, user.password)
        if (!isMatching) return null

        // remove password key
        const { password: _pw, ...safeUser } = user
        return safeUser
      },
    }),
    Google({
      authorization: {
        params: {
          prompt: 'consent',
          access_type: 'offline',
          response_type: 'code',
        },
      },
    }),
  ],
})
