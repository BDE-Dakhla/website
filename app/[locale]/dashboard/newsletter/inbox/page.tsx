'use client'

import type { InboxEmail } from '@/lib/inbox-mock'
import { useCallback, useEffect, useState } from 'react'
import { Mail } from './components/mail'
import { accounts, transformInboxEmailToMail } from './data'

export default function InboxPage() {
  const [emails, setEmails] = useState<InboxEmail[]>([])
  const [loading, setLoading] = useState(true)

  const fetchEmails = useCallback(async () => {
    try {
      const response = await fetch('/api/newsletter/inbox')
      const data = await response.json()
      setEmails(data.emails || [])
    } catch (error) {
      console.error('Failed to fetch emails:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchEmails()
  }, [fetchEmails])

  // Transform emails to match shadcn mail interface
  const mails = emails.map(transformInboxEmailToMail)

  if (loading) {
    return (
      <div className='flex h-[800px] items-center justify-center'>
        <div className='text-center'>
          <div className='mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent'></div>
          <p>Chargement de la boîte de réception...</p>
        </div>
      </div>
    )
  }

  return (
    <div className='h-[800px]'>
      <Mail
        accounts={accounts}
        defaultCollapsed={false}
        defaultLayout={[20, 32, 48]}
        mails={mails}
        navCollapsedSize={4}
      />
    </div>
  )
}
