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
import { useState } from 'react'

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

  const stats = {
    inbox: mails.length,
    unread: mails.filter((m) => !m.read).length,
    important: mails.filter((m) => m.labels.includes('important')).length,
  }

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
                label: mails
                  .filter((m) => m.labels.includes('partenariat'))
                  .length.toString(),
                icon: Users2,
                variant: 'ghost',
              },
              {
                title: 'Événements',
                label: mails
                  .filter((m) => m.labels.includes('événement'))
                  .length.toString(),
                icon: AlertCircle,
                variant: 'ghost',
              },
              {
                title: 'Communications',
                label: mails
                  .filter((m) => m.labels.includes('notification'))
                  .length.toString(),
                icon: MessagesSquare,
                variant: 'ghost',
              },
              {
                title: 'Rapports',
                label: mails
                  .filter((m) => m.labels.includes('rapport'))
                  .length.toString(),
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
                  <Input className='pl-8' placeholder='Rechercher...' />
                </div>
              </form>
            </div>
            <TabsContent className='m-0' value='all'>
              <MailList items={mails} />
            </TabsContent>
            <TabsContent className='m-0' value='unread'>
              <MailList items={mails.filter((item) => !item.read)} />
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
