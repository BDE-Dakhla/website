import 'next-auth'
import 'next-auth/jwt'
import type { PermissionMap, Role } from './schema'

declare module 'next-auth' {
  interface Session {
    user: Session['user'] & {
      id?: string
      role?: Role
      username?: string | null
      email?: string | null
      perms?: PermissionMap
    }
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    role?: Role
    username?: string | null
    name?: string | null
    image?: string | null
    email?: string | null
    perms?: PermissionMap
  }
}
