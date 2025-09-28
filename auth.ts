import 'server-only'

import type { Kysely } from 'kysely'
import { type Database as AuthDb, KyselyAdapter } from '@auth/kysely-adapter'
import { compare } from 'bcryptjs'
import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import Google from 'next-auth/providers/google'
import { signInSchema } from './lib/auth'
import { getDb } from './lib/db'
import { permissionsToMask } from './lib/permission'

export const { auth, handlers, signIn, signOut } = NextAuth({
  adapter: KyselyAdapter(getDb() as unknown as Kysely<AuthDb>),
  session: { strategy: 'jwt' },
  secret: process.env.AUTH_NEXT_SECRET,
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
  callbacks: {
    async jwt({ token, user }) {
      const db = getDb()

      if (user.id) {
        const row = await db
          .selectFrom('User')
          .select(['id', 'permissions'])
          .where('id', '=', user.id)
          .executeTakeFirst()
        const list = row?.permissions ?? []

        token.permMask = permissionsToMask(list)
      } else if (token.permMask == null && token.sub) {
        const row = await db
          .selectFrom('User')
          .select(['permissions'])
          .where('id', '=', token.sub)
          .executeTakeFirst()
        const list = row?.permissions ?? []
        token.permMask = permissionsToMask(list)
      }

      return token
    },
    async session({ session, token }) {
      session.user ??= {}
      session.user.id = token.sub
      session.user.permMask = token.permMask ?? 0

      return session
    },
    async signIn({ account, profile }) {
      if (account?.provider === 'google') {
        return (
          profile?.email_verified && profile.email?.endsWith('@edu.uiz.ac.ma')
        )
      }

      return true // Do different verification for other providers that don't have `email_verified`
    },
  },
})
