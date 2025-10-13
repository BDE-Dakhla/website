import 'server-only'

import { KyselyAdapter } from '@auth/kysely-adapter'
import { compare } from 'bcryptjs'
import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import Google from 'next-auth/providers/google'
import { signInSchema } from './lib/auth'
import { getAuthDb, getDb } from './lib/db/instance'

const USER_META_FIELDS = [
  'permissions',
  'role',
  'username',
  'name',
  'image',
  'email',
] as const

export const { auth, handlers, signIn, signOut } = NextAuth({
  adapter: KyselyAdapter(getAuthDb()),
  session: { strategy: 'jwt' },
  secret: process.env.AUTH_NEXT_SECRET,
  providers: [
    Credentials({
      credentials: {
        cdm: { label: 'Code Massar', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      authorize: async (raw) => {
        const parsed = signInSchema.safeParse(raw)
        if (!parsed.success) return null

        const cdm = parsed.data.cdm.trim().toUpperCase()
        const password = parsed.data.password
        const db = getDb()

        const user = await db
          .selectFrom('User')
          .select([
            'id',
            'cdm',
            'username',
            'email',
            'name',
            'image',
            'password',
          ])
          .where('cdm', '=', cdm)
          .executeTakeFirst()

        if (!user || !user.password) return null
        const ok = await compare(password, user.password)
        if (!ok) return null

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
      httpOptions: {
        timeout: 15000,
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      const db = getDb()

      if (user?.id) {
        const row = await db
          .selectFrom('User')
          .select(USER_META_FIELDS)
          .where('id', '=', user.id)
          .executeTakeFirst()

        const role = row?.role ?? 'student'
        if (!row?.role) {
          await db
            .updateTable('User')
            .set({ role })
            .where('id', '=', user.id)
            .execute()
        }

        return {
          ...token,
          sub: user.id,
          role,
          username: row?.username ?? null,
          image: row?.image,
          name: row?.name ?? null,
          email: row?.email ?? null,
          permissions: row?.permissions ?? {},
        }
      }

      const sub = token.sub
      let name = token.name
      let image = token.image
      let role = token.role
      let username = token.username
      let email = token.email
      let permissions = token.permissions

      const needsBackfill =
        (role === undefined ||
          username === undefined ||
          name === undefined ||
          image === undefined ||
          email === undefined ||
          permissions === undefined) &&
        sub

      if (needsBackfill && sub) {
        const row = await db
          .selectFrom('User')
          .select(USER_META_FIELDS)
          .where('id', '=', sub)
          .executeTakeFirst()

        role = role ?? row?.role ?? 'student'
        username = username ?? row?.username ?? null
        email = email ?? row?.email ?? null
        permissions = permissions ?? row?.permissions ?? {}
        image = image ?? row?.image ?? null
        name = name ?? row?.name ?? null
      }

      return {
        ...token,
        sub,
        role: role ?? 'student',
        username: username ?? null,
        image: image ?? null,
        name: name ?? null,
        email: email ?? null,
        permissions: permissions ?? {},
      }
    },

    async session({ session, token }) {
      session.user ??= {}
      session.user.id = token.sub
      session.user.role = token.role ?? 'student'
      session.user.username = token.username ?? null
      session.user.email = token.email ?? null
      session.user.name = token.name ?? null
      session.user.image = token.image ?? null
      session.user.permissions = token.permissions ?? {}
      return session
    },

    async signIn({ account, profile }) {
      if (account?.provider === 'google') {
        const email = typeof profile?.email === 'string' ? profile.email : ''
        const verified = profile?.email_verified === true
        return Boolean(verified && email.endsWith('@edu.uiz.ac.ma'))
      }
      return true
    },
  },
  pages: {
    signIn: '/connexion',
    error: '/connexion/error',
  },
})
