import type { InboxEmail } from '@/lib/inbox-mock'

export interface Mail {
  id: string
  name: string
  email: string
  subject: string
  text: string
  date: string
  read: boolean
  labels: string[]
}

export function transformInboxEmailToMail(email: InboxEmail): Mail {
  return {
    id: email.id,
    name: email.from.includes('<')
      ? email.from.split('<')[0].trim().replace(/"/g, '')
      : email.from.split('@')[0],
    email: email.from.includes('<')
      ? email.from.match(/<(.+)>/)?.[1] || email.from
      : email.from,
    subject: email.subject,
    text: email.body,
    date: email.receivedAt,
    read: email.isRead,
    labels: email.labels,
  }
}

export const accounts = [
  {
    label: 'BDE Dakhla Newsletter',
    email: 'newsletter@bde-dakhla.com',
    icon: (
      <svg role='img' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'>
        <title>Newsletter</title>
        <path
          d='M24 4.5v15c0 .85-.65 1.5-1.5 1.5h-21C.65 21 0 20.35 0 19.5v-15c0-.85.65-1.5 1.5-1.5h21c.85 0 1.5.65 1.5 1.5zM22.5 6L12 13.5 1.5 6v13.5h21V6z'
          fill='currentColor'
        />
      </svg>
    ),
  },
  {
    label: 'Admin BDE',
    email: 'admin@bde-dakhla.com',
    icon: (
      <svg role='img' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'>
        <title>Admin</title>
        <path
          d='M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 22C6.486 22 2 17.514 2 12S6.486 2 12 2s10 4.486 10 10-4.486 10-10 10z'
          fill='currentColor'
        />
        <path
          d='M12 6c-3.309 0-6 2.691-6 6s2.691 6 6 6 6-2.691 6-6-2.691-6-6-6zm0 10c-2.206 0-4-1.794-4-4s1.794-4 4-4 4 1.794 4 4-1.794 4-4 4z'
          fill='currentColor'
        />
      </svg>
    ),
  },
]

export type Account = (typeof accounts)[number]
