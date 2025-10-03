'use client'

import { CalendarPlus, Clock } from 'lucide-react'
import { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { BigCalendar } from './calendar'

export default function Page() {
  const [date, setDate] = useState<Date | undefined>(new Date(2025, 5, 12))
  const count = 15

  return (
    <div className='flex h-full min-h-0 lg:space-x-5'>
      <aside className='sticky top-20 hidden w-80 shrink-0 space-y-4 xl:block'>
        <Button className='w-full'>
          <CalendarPlus /> Ajouter un événement
        </Button>

        <ScrollArea>
          <h5 className='sticky top-0 hidden items-center bg-background pb-5 font-medium xl:flex'>
            Événements à venir
            <Badge className='ml-2 select-none' variant='outline'>
              {count}
            </Badge>
          </h5>
          <div className='mt-0.5 divide-y overflow-hidden rounded-md xl:border'>
            <div className='flex min-w-72 cursor-pointer items-start gap-2 py-4 font-medium text-sm xl:px-4 xl:hover:bg-muted'>
              <span className='mt-1 block size-4 rounded-full bg-linear-to-r from-blue-500 to-purple-500' />
              <div className='space-y-2'>
                <div>Conférence Marketing Stratégique</div>
                <div className='flex items-center gap-1 text-muted-foreground text-xs'>
                  <Clock className='!size-3' />
                  Mar 3, 2025 9:00 AM
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>
      </aside>

      <div className='flex h-[calc(100svh-6rem)] min-h-0 w-full min-w-0 overflow-hidden lg:space-x-5'>
        <BigCalendar onChange={setDate} value={date} />
      </div>
    </div>
  )
}
