import 'server-only'

import type { Kysely } from 'kysely'
import { type Database as AuthDb, KyselyAdapter } from '@auth/kysely-adapter'
import { compareSync } from 'bcryptjs'
import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import Google from 'next-auth/providers/google'
import { signInSchema } from './lib/auth'
import { getDb } from './lib/db/instance'

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
          .select(['id', 'cdm', 'username', 'email', 'password'])
          .where('cdm', '=', cdm)
          .executeTakeFirst()

        if (!user) return null

        const isMatching = compareSync(password, user.password ?? '')
        if (!isMatching) return null

        // remove password key
        const { password: _pw, ...safeUser } = user
        return safeUser
      },
    }),
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
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

      if (user?.id) {
        const row = await db
          .selectFrom('User')
          .select(['permissions', 'role'])
          .where('id', '=', user.id)
          .executeTakeFirst()

        const permMask = row?.permissions ?? 0
        const role = row?.role ?? 'student'

        if (!row?.role) {
          await db
            .updateTable('User')
            .set({ role })
            .where('id', '=', user.id)
            .execute()
        }

        return {
          sub: user.id,
          permMask,
          role,
        }
      }

      const { sub } = token
      let permMask = token.permMask as number | undefined
      let role = token.role as
        | 'student'
        | 'professor'
        | 'contributor'
        | 'developer'
        | 'administrator'
        | undefined

      if ((!permMask || !role) && sub) {
        const row = await db
          .selectFrom('User')
          .select(['permissions', 'role'])
          .where('id', '=', sub)
          .executeTakeFirst()

        permMask = row?.permissions ?? 0
        role = row?.role ?? 'student'
      }

      return {
        sub,
        permMask: permMask ?? 0,
        role: role ?? 'student',
      }
    },

    async session({ session, token }) {
      session.user ??= {}
      session.user.id = token.sub
      session.user.permMask = token.permMask ?? 0
      session.user.role =
        token.role ??
        ('student' as
          | 'student'
          | 'professor'
          | 'contributor'
          | 'developer'
          | 'administrator')

      return session
    },

    async signIn({ account, profile }) {
      if (account?.provider === 'google') {
        return Boolean(
          profile?.email_verified && profile.email?.endsWith('@edu.uiz.ac.ma'),
        )
      }

      return true
    },
  },
})
