'use client'

import type { Mail } from '../data'
import Cookies from 'js-cookie'
import {
  AlertCircle,
  Archive,
  ArchiveX,
  File,
  Inbox,
  MessagesSquare,
  Search,
  Send,
  Trash2,
  Users2,
} from 'lucide-react'
import { useDeferredValue, useMemo, useState } from 'react'
import { Input } from '@/components/ui/input'
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { TooltipProvider } from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'
import { MailProvider, useMail } from '../use-mail'
import { AccountSwitcher } from './account-switcher'
import { MailDisplay } from './mail-display'
import { MailList } from './mail-list'
import { Nav } from './nav'

interface MailProps {
  accounts: {
    label: string
    email: string
    icon: React.ReactNode
  }[]
  mails: Mail[]
  defaultLayout?: number[]
  defaultCollapsed?: boolean
  navCollapsedSize: number
}

function MailInner({
  accounts,
  mails,
  defaultLayout = [20, 32, 48],
  defaultCollapsed = false,
  navCollapsedSize,
}: MailProps) {
  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed)
  const [mail] = useMail()

  // Search state (deferred for responsiveness on large lists)
  const [query, setQuery] = useState('')
  const deferredQuery = useDeferredValue(query)

  // Memoized stats to avoid repeated O(n) scans per render
  const stats = useMemo(
    () => ({
      inbox: mails.length,
      unread: mails.filter((m) => !m.read).length,
      important: mails.filter((m) => m.labels.includes('important')).length,
    }),
    [mails],
  )

  // Precompute label counts in a single pass for side nav
  const labelCounts = useMemo(() => {
    const counts: Record<string, number> = {}
    for (const m of mails) {
      for (const l of m.labels) counts[l] = (counts[l] || 0) + 1
    }
    return counts
  }, [mails])

  // Build a normalized search index once per mails change
  const normalize = (s: string) =>
    s
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')

  const searchIndex = useMemo(
    () =>
      mails.map((m) => ({
        id: m.id,
        read: m.read,
        ref: m,
        content: normalize(
          [m.subject, m.text, m.name, m.email, ...(m.labels || [])].join(' '),
        ),
      })),
    [mails],
  )

  // Tokenize the query; require all tokens to match (AND semantics)
  const tokens = useMemo(() => {
    const n = normalize(deferredQuery)
    return n.split(/\s+/).filter(Boolean)
  }, [deferredQuery])

  // Fast filter using the precomputed index
  const filteredAll = useMemo(() => {
    if (tokens.length === 0) return mails
    return searchIndex
      .filter((entry) => tokens.every((t) => entry.content.includes(t)))
      .map((e) => e.ref)
  }, [tokens, searchIndex, mails])

  const filteredUnread = useMemo(
    () => filteredAll.filter((item) => !item.read),
    [filteredAll],
  )

  return (
    <TooltipProvider delayDuration={0}>
      <ResizablePanelGroup
        className='h-full max-h-[800px] items-stretch'
        direction='horizontal'
        onLayout={(sizes: number[]) => {
          Cookies.set(
            'react-resizable-panels:layout:mail',
            JSON.stringify(sizes),
          )
        }}>
        <ResizablePanel
          className={cn(
            isCollapsed &&
              'min-w-[50px] transition-all duration-300 ease-in-out',
          )}
          collapsedSize={navCollapsedSize}
          collapsible={true}
          defaultSize={defaultLayout[0]}
          maxSize={20}
          minSize={15}
          onCollapse={() => {
            setIsCollapsed(true)
            Cookies.set(
              'react-resizable-panels:collapsed',
              JSON.stringify(true),
            )
          }}
          onResize={() => {
            setIsCollapsed(false)
            Cookies.set(
              'react-resizable-panels:collapsed',
              JSON.stringify(false),
            )
          }}>
          <div
            className={cn(
              'flex h-[52px] items-center justify-center',
              isCollapsed ? 'h-[52px]' : 'px-2',
            )}>
            <AccountSwitcher accounts={accounts} isCollapsed={isCollapsed} />
          </div>
          <Separator />
          <Nav
            isCollapsed={isCollapsed}
            links={[
              {
                title: 'Boîte de réception',
                label: stats.inbox.toString(),
                icon: Inbox,
                variant: 'default',
              },
              {
                title: 'Brouillons',
                label: '0',
                icon: File,
                variant: 'ghost',
              },
              {
                title: 'Envoyés',
                label: '',
                icon: Send,
                variant: 'ghost',
              },
              {
                title: 'Indésirables',
                label: '0',
                icon: ArchiveX,
                variant: 'ghost',
              },
              {
                title: 'Corbeille',
                label: '',
                icon: Trash2,
                variant: 'ghost',
              },
              {
                title: 'Archive',
                label: '',
                icon: Archive,
                variant: 'ghost',
              },
            ]}
          />
          <Separator />
          <Nav
            isCollapsed={isCollapsed}
            links={[
              {
                title: 'Partenariats',
                label: (labelCounts['partenariat'] || 0).toString(),
                icon: Users2,
                variant: 'ghost',
              },
              {
                title: 'Événements',
                label: (labelCounts['événement'] || 0).toString(),
                icon: AlertCircle,
                variant: 'ghost',
              },
              {
                title: 'Communications',
                label: (labelCounts['notification'] || 0).toString(),
                icon: MessagesSquare,
                variant: 'ghost',
              },
              {
                title: 'Rapports',
                label: (labelCounts['rapport'] || 0).toString(),
                icon: Archive,
                variant: 'ghost',
              },
            ]}
          />
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={defaultLayout[1]} minSize={30}>
          <Tabs defaultValue='all'>
            <div className='flex items-center px-4 py-2'>
              <h1 className='font-bold text-xl'>Boîte de réception</h1>
              <TabsList className='ml-auto'>
                <TabsTrigger
                  className='text-zinc-600 dark:text-zinc-200'
                  value='all'>
                  Tous les emails
                </TabsTrigger>
                <TabsTrigger
                  className='text-zinc-600 dark:text-zinc-200'
                  value='unread'>
                  Non lus ({stats.unread})
                </TabsTrigger>
              </TabsList>
            </div>
            <Separator />
            <div className='bg-background/95 p-4 backdrop-blur supports-[backdrop-filter]:bg-background/60'>
              <form>
                <div className='relative'>
                  <Search className='absolute top-2.5 left-2 h-4 w-4 text-muted-foreground' />
                  <Input
                    aria-label='Rechercher dans les emails'
                    autoComplete='off'
                    className='pl-8'
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder='Rechercher...'
                    value={query}
                  />
                </div>
              </form>
            </div>
            <TabsContent className='m-0' value='all'>
              <MailList items={filteredAll} />
            </TabsContent>
            <TabsContent className='m-0' value='unread'>
              <MailList items={filteredUnread} />
            </TabsContent>
          </Tabs>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={defaultLayout[2]} minSize={30}>
          <MailDisplay
            mail={mails.find((item) => item.id === mail.selected) || null}
          />
        </ResizablePanel>
      </ResizablePanelGroup>
    </TooltipProvider>
  )
}

export function Mail(props: MailProps) {
  return (
    <MailProvider>
      <MailInner {...props} />
    </MailProvider>
  )
}
