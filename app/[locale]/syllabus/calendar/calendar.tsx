'use client'

import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Calendar as BaseCalendar } from '@/components/ui/calendar'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'

function setMonth(date: Date, offset: number) {
  return new Date(date.getFullYear(), date.getMonth() + offset, 1)
}

type View = 'month' | 'week' | 'day'

interface Props {
  value?: Date
  onChange?: (d?: Date) => void
}

export function BigCalendar(props: Props) {
  const today = useMemo(() => new Date(), [])
  const initial = props.value ?? today

  const [selected, setSelected] = useState<Date | undefined>(props.value)
  const [month, setMonthState] = useState<Date>(
    new Date(initial.getFullYear(), initial.getMonth(), 1),
  )
  const [view, setView] = useState<View>('month')

  const monthLabel = useMemo(
    () =>
      month.toLocaleDateString(undefined, {
        month: 'long',
        year: 'numeric',
      }),
    [month],
  )

  const onSelect = (d?: Date) => {
    setSelected(d)
    props.onChange?.(d)
  }

  const goPrev = () => setMonthState((m) => setMonth(m, -1))
  const goNext = () => setMonthState((m) => setMonth(m, +1))
  const goToday = () => {
    const now = new Date()
    setMonthState(new Date(now.getFullYear(), now.getMonth(), 1))
    onSelect(now)
  }

  return (
    <div className='flex min-h-0 flex-1 grow flex-col overflow-hidden'>
      <div className='flex items-center justify-between px-2 pb-2'>
        <div className='flex items-center gap-2'>
          <ToggleGroup type='single' variant='outline'>
            <ToggleGroupItem
              className='cursor-pointer'
              onClick={goPrev}
              value='previous'>
              <ChevronLeft className='h-4 w-4' />
            </ToggleGroupItem>
            <ToggleGroupItem
              className='cursor-pointer'
              onClick={goNext}
              value='next'>
              <ChevronRight className='h-4 w-4' />
            </ToggleGroupItem>
          </ToggleGroup>
          <Button onClick={goToday} variant='outline'>
            Today
          </Button>
        </div>

        <div className='select-none text-center font-medium text-sm tabular-nums'>
          {monthLabel}
        </div>

        <div className='inline-flex justify-self-end rounded-md border bg-muted/40 p-0.5'>
          {(['month', 'week', 'day'] as View[]).map((v) => (
            <button
              className={[
                'rounded-sm px-3 py-1.5 text-sm transition-colors',
                view === v
                  ? 'bg-background shadow-sm'
                  : 'text-muted-foreground hover:text-foreground',
              ].join(' ')}
              key={v}
              onClick={() => setView(v)}
              type='button'>
              {v[0].toUpperCase() + v.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className='min-h-0 flex-1 overflow-hidden'>
        <BaseCalendar
          className='h-full w-full overflow-y-auto [&_.rdp-month]:h-full [&_.rdp-month_grid]:grid [&_.rdp-month_grid]:h-full [&_.rdp-month_grid]:min-h-0 [&_.rdp-month_grid]:grid-rows-[auto,1fr] [&_.rdp-months]:h-full [&_.rdp-week]:grid [&_.rdp-week]:min-h-[110px] [&_.rdp-week]:grid-cols-7 [&_.rdp-weekdays]:sticky [&_.rdp-weekdays]:top-0 [&_.rdp-weekdays]:z-10 [&_.rdp-weekdays]:bg-background [&_.rdp-weeks]:min-h-0 [&_.rdp-weeks]:overflow-y-auto [&_.rdp-weeks]:overscroll-contain'
          classNames={{
            nav: 'hidden',
            month_caption: 'hidden sr-only',

            month_grid: 'border h-full min-h-0',

            week: 'grid grid-cols-7 w-full border-b last:border-b-0',
            weekdays: 'grid grid-cols-7 border-b bg-muted/40',
            weekday:
              'text-muted-foreground px-3 py-2 text-left text-sm font-medium border-r last:border-r-0 rounded-none',

            day_button: 'rounded-none',
            day: 'h-full w-full bg-transparent rounded-none text-left text-sm border-r last:border-r-0 aria-selected:bg-primary aria-selected:text-primary-foreground',
            day_outside: 'text-muted-foreground/50',
            day_today: 'bg-muted/30',
            day_disabled: 'text-muted-foreground opacity-50',
            day_selected:
              'bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground',
          }}
          fixedWeeks
          mode='single'
          month={month}
          onMonthChange={setMonthState}
          onSelect={onSelect}
          selected={selected}
          showOutsideDays
        />
      </div>
    </div>
  )
}
