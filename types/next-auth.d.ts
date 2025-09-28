import 'next-auth'
import 'next-auth/jwt'
import type { Permission } from './schema'

declare module 'next-auth' {
  interface Session {
    user: Session['user'] & { id?: string; permMask?: number }
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    permMask?: Permission[]
  }
}
