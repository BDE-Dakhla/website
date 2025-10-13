'use client'

import { createContext, useCallback, useContext, useState } from 'react'

interface MailState {
  selected: string | null
}

interface MailContextType {
  mail: MailState
  setMail: (updates: Partial<MailState>) => void
}

const MailContext = createContext<MailContextType | null>(null)

export function MailProvider({ children }: { children: React.ReactNode }) {
  const [mail, setMailState] = useState<MailState>({
    selected: null,
  })

  const setMail = useCallback((updates: Partial<MailState>) => {
    setMailState((prev) => ({ ...prev, ...updates }))
  }, [])

  return (
    <MailContext.Provider value={{ mail, setMail }}>
      {children}
    </MailContext.Provider>
  )
}

export function useMail() {
  const context = useContext(MailContext)
  if (!context) throw new Error('useMail must be used within a MailProvider')
  return [context.mail, context.setMail] as const
}
