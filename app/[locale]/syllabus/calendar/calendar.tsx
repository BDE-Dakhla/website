'use client'

import type { CustomComponents } from 'react-day-picker'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, Clock, MapPin, Plus } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Calendar as BaseCalendar } from '@/components/ui/calendar'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { ViewTransition } from '@/components/ui/view-transition'
import { cn } from '@/lib/utils'

function setMonth(date: Date, offset: number) {
  return new Date(date.getFullYear(), date.getMonth() + offset, 1)
}

function getWeekStart(date: Date): Date {
  const start = new Date(date)
  const day = start.getDay()
  const diff = start.getDate() - day + (day === 0 ? -6 : 1)
  return new Date(start.setDate(diff))
}

function getWeekEnd(date: Date): Date {
  const start = getWeekStart(date)
  return new Date(start.getFullYear(), start.getMonth(), start.getDate() + 6)
}

function getWeekDays(date: Date): Date[] {
  const start = getWeekStart(date)
  return Array.from(
    { length: 7 },
    (_, i) =>
      new Date(start.getFullYear(), start.getMonth(), start.getDate() + i),
  )
}

function isSameDay(date1: Date | undefined, date2: Date | undefined): boolean {
  if (!date1 || !date2) return false
  if (!(date1 instanceof Date) || !(date2 instanceof Date)) return false
  if (Number.isNaN(date1.getTime()) || Number.isNaN(date2.getTime()))
    return false

  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  )
}

function getEventsForDay(events: CalendarEvent[], date: Date): CalendarEvent[] {
  return events.filter((event) => {
    const eventStart = new Date(event.start)
    const eventEnd = new Date(event.end)

    return (
      isSameDay(eventStart, date) ||
      isSameDay(eventEnd, date) ||
      (eventStart < date && eventEnd > date)
    )
  })
}

function formatTime(date: Date): string {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

function formatTimeRange(start: Date, end: Date): string {
  return `${formatTime(start)} - ${formatTime(end)}`
}

interface EventItemProps {
  event: CalendarEvent
  onClick?: (event: CalendarEvent) => void
  compact?: boolean
}

function EventItem({ event, onClick, compact = false }: EventItemProps) {
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    onClick?.(event)
  }

  return (
    <motion.div
      animate={{ opacity: 1, scale: 1 }}
      className={`cursor-pointer rounded-md p-1.5 text-xs transition-all duration-200 ${compact ? 'mb-1' : 'mb-2'}hover:shadow-md`}
      initial={{ opacity: 0, scale: 0.9 }}
      onClick={handleClick}
      style={{
        backgroundColor: `${event.color}20`,
        borderLeft: `3px solid ${event.color}`,
        color: event.color,
      }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}>
      <div className='truncate font-medium'>{event.title}</div>
      {!compact && (
        <>
          <div className='mt-1 flex items-center gap-1 text-xs opacity-80'>
            <Clock className='h-3 w-3' />
            <span>{formatTimeRange(event.start, event.end)}</span>
          </div>
          {event.location && (
            <div className='flex items-center gap-1 text-xs opacity-80'>
              <MapPin className='h-3 w-3' />
              <span className='truncate'>{event.location}</span>
            </div>
          )}
        </>
      )}
    </motion.div>
  )
}

export interface CalendarEvent {
  id: string
  title: string
  description?: string
  start: Date
  end: Date
  color: string
  location?: string
  attendees?: string[]
}

interface Props {
  value?: Date
  onChange?: (d?: Date) => void
  events?: CalendarEvent[]
  onEventCreate?: (date: Date) => void
  onEventClick?: (event: CalendarEvent) => void
}

type View = 'month' | 'week' | 'day'

interface WeekViewProps {
  date: Date
  events: CalendarEvent[]
  onDayClick?: (date: Date) => void
  onEventClick?: (event: CalendarEvent) => void
  onEventCreate?: (date: Date) => void
}

function WeekView({
  date,
  events,
  onDayClick,
  onEventClick,
  onEventCreate,
}: WeekViewProps) {
  const weekDays = getWeekDays(date)
  const hours = Array.from({ length: 24 }, (_, i) => i)

  const handleDayClick = (day: Date) => {
    onDayClick?.(day)
  }

  const handleCreateEvent = (day: Date, hour: number) => {
    const eventDate = new Date(day)
    eventDate.setHours(hour, 0, 0, 0)
    onEventCreate?.(eventDate)
  }

  return (
    <div className='flex h-full flex-col'>
      <div className='grid grid-cols-8 border-b bg-muted/30'>
        <div className='border-r p-3 font-medium text-sm'>Time</div>
        {weekDays.map((day) => (
          <Button
            className='cursor-pointer border-r p-3 text-center transition-colors last:border-r-0 hover:bg-muted/50'
            key={day.toISOString()}
            onClick={() => handleDayClick(day)}>
            <div className='text-muted-foreground text-xs'>
              {day.toLocaleDateString([], { weekday: 'short' })}
            </div>
            <div
              className={`font-medium text-sm ${
                isSameDay(day, new Date()) ? 'text-primary' : ''
              }`}>
              {day.getDate()}
            </div>
          </Button>
        ))}
      </div>

      <div className='flex-1 overflow-y-auto'>
        <div className='grid min-h-full grid-cols-8'>
          <div className='border-r'>
            {hours.map((hour) => (
              <div
                className='h-16 border-b p-2 text-muted-foreground text-xs'
                key={hour}>
                {hour.toString().padStart(2, '0')}:00
              </div>
            ))}
          </div>

          {weekDays.map((day) => (
            <div
              className='relative border-r last:border-r-0'
              key={day.toISOString()}>
              {hours.map((hour) => (
                <Button
                  className='group relative h-16 cursor-pointer border-b transition-colors hover:bg-muted/20'
                  key={hour}
                  onClick={() => handleCreateEvent(day, hour)}>
                  <div className='absolute inset-0 flex items-center justify-center opacity-0 transition-opacity group-hover:opacity-100'>
                    <Plus className='h-4 w-4 text-muted-foreground' />
                  </div>
                </Button>
              ))}

              <div className='pointer-events-none absolute inset-0'>
                {getEventsForDay(events, day).map((event) => {
                  const startHour = event.start.getHours()
                  const startMinute = event.start.getMinutes()
                  const endHour = event.end.getHours()
                  const endMinute = event.end.getMinutes()

                  const top = startHour * 64 + (startMinute * 64) / 60
                  const height =
                    (endHour - startHour) * 64 +
                    ((endMinute - startMinute) * 64) / 60

                  return (
                    <div
                      className='pointer-events-auto absolute right-1 left-1'
                      key={event.id}
                      style={{
                        top: `${top}px`,
                        height: `${Math.max(height, 24)}px`,
                      }}>
                      <EventItem compact event={event} onClick={onEventClick} />
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

interface DayViewProps {
  date: Date
  events: CalendarEvent[]
  onEventClick?: (event: CalendarEvent) => void
  onEventCreate?: (date: Date) => void
}

function DayView({ date, events, onEventClick, onEventCreate }: DayViewProps) {
  const hours = Array.from({ length: 24 }, (_, i) => i)
  const dayEvents = getEventsForDay(events, date)

  const handleCreateEvent = (hour: number) => {
    const eventDate = new Date(date)
    eventDate.setHours(hour, 0, 0, 0)
    onEventCreate?.(eventDate)
  }

  return (
    <div className='flex h-full flex-col'>
      <div className='border-b bg-muted/30 p-4'>
        <div className='text-center'>
          <div className='text-muted-foreground text-xs uppercase tracking-wide'>
            {date.toLocaleDateString([], { weekday: 'long' })}
          </div>
          <div
            className={`font-bold text-2xl ${
              isSameDay(date, new Date()) ? 'text-primary' : ''
            }`}>
            {date.getDate()}
          </div>
          <div className='text-muted-foreground text-sm'>
            {date.toLocaleDateString([], { month: 'long', year: 'numeric' })}
          </div>
        </div>
      </div>

      <div className='flex-1 overflow-y-auto'>
        <div className='grid min-h-full grid-cols-[auto,1fr]'>
          <div className='border-r bg-muted/10'>
            {hours.map((hour) => (
              <div
                className='h-16 border-b p-3 text-muted-foreground text-xs'
                key={hour}>
                {hour.toString().padStart(2, '0')}:00
              </div>
            ))}
          </div>

          <div className='relative'>
            {hours.map((hour) => (
              <Button
                className='group relative h-16 cursor-pointer border-b transition-colors hover:bg-muted/20'
                key={hour}
                onClick={() => handleCreateEvent(hour)}>
                <div className='absolute inset-0 flex items-center justify-center opacity-0 transition-opacity group-hover:opacity-100'>
                  <Plus className='h-4 w-4 text-muted-foreground' />
                </div>
              </Button>
            ))}

            <div className='pointer-events-none absolute inset-0'>
              {dayEvents.map((event) => {
                const startHour = event.start.getHours()
                const startMinute = event.start.getMinutes()
                const endHour = event.end.getHours()
                const endMinute = event.end.getMinutes()

                const top = startHour * 64 + (startMinute * 64) / 60
                const height =
                  (endHour - startHour) * 64 +
                  ((endMinute - startMinute) * 64) / 60

                return (
                  <div
                    className='pointer-events-auto absolute right-2 left-2'
                    key={event.id}
                    style={{
                      top: `${top}px`,
                      height: `${Math.max(height, 32)}px`,
                    }}>
                    <EventItem event={event} onClick={onEventClick} />
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export function BigCalendar(props: Props) {
  const today = useMemo(() => new Date(), [])
  const initial = props.value ?? today
  const events = props.events ?? []

  const [selected, setSelected] = useState<Date | undefined>(props.value)
  const [currentDate, setCurrentDate] = useState<Date>(initial)
  const [view, setView] = useState<View>('month')

  const displayDate = useMemo(() => {
    switch (view) {
      case 'week':
        return getWeekStart(currentDate)
      case 'day':
        return currentDate
      default:
        return new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)
    }
  }, [currentDate, view])

  const displayLabel = useMemo(() => {
    switch (view) {
      case 'week': {
        const weekStart = getWeekStart(currentDate)
        const weekEnd = getWeekEnd(currentDate)
        return `${weekStart.toLocaleDateString([], { month: 'short', day: 'numeric' })} - ${weekEnd.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}`
      }
      case 'day':
        return currentDate.toLocaleDateString([], {
          weekday: 'long',
          month: 'long',
          day: 'numeric',
          year: 'numeric',
        })
      default:
        return currentDate.toLocaleDateString([], {
          month: 'long',
          year: 'numeric',
        })
    }
  }, [currentDate, view])

  const onSelect = (d?: Date) => {
    if (d) {
      setSelected(d)
      setCurrentDate(d)
      props.onChange?.(d)
    }
  }

  const goPrev = () => {
    switch (view) {
      case 'month':
        setCurrentDate((d) => setMonth(d, -1))
        break
      case 'week':
        setCurrentDate((d) => new Date(d.getTime() - 7 * 24 * 60 * 60 * 1000))
        break
      case 'day':
        setCurrentDate((d) => new Date(d.getTime() - 24 * 60 * 60 * 1000))
        break
    }
  }

  const goNext = () => {
    switch (view) {
      case 'month':
        setCurrentDate((d) => setMonth(d, 1))
        break
      case 'week':
        setCurrentDate((d) => new Date(d.getTime() + 7 * 24 * 60 * 60 * 1000))
        break
      case 'day':
        setCurrentDate((d) => new Date(d.getTime() + 24 * 60 * 60 * 1000))
        break
    }
  }

  const goToday = () => {
    const now = new Date()
    setCurrentDate(now)
    setSelected(now)
    props.onChange?.(now)
  }

  const handleEventCreate = (date: Date) => {
    props.onEventCreate?.(date)
  }

  const handleEventClick = (event: CalendarEvent) => {
    props.onEventClick?.(event)
  }

  const handleDayClick = (date: Date) => {
    if (view === 'month') {
      setView('day')
    }
    onSelect(date)
  }

  const CustomDayButton: CustomComponents['DayButton'] = ({
    day,
    modifiers,
    className,
    ...props
  }) => {
    const date = day?.date
    const dayEvents = getEventsForDay(events, date)
    const isSelected = selected && isSameDay(date, selected)
    const isToday = isSameDay(date, new Date())
    const isOutside = modifiers?.outside
    
    const ref = useRef<HTMLButtonElement>(null)
    useEffect(() => {
      if (modifiers?.focused) ref.current?.focus()
    }, [modifiers?.focused])

    return (
      <Button
        ref={ref}
        className={cn(
          'group relative flex aspect-square size-auto w-full h-full cursor-pointer flex-col justify-start p-2 transition-all duration-300 bg-white hover:bg-accent focus:ring-2 focus:ring-primary',
          {
            'bg-muted/50 text-muted-foreground opacity-50 hover:bg-muted/70':
              isOutside,
            'hover:bg-accent/70 hover:shadow-md': !isOutside && !isSelected && !isToday,
            'bg-primary/15 text-primary hover:bg-primary/20 shadow-md': isSelected,
            'bg-accent border-2 border-primary/40 text-primary font-semibold shadow-sm hover:bg-primary/10': isToday && !isSelected,
            'bg-primary/20 border-2 border-primary/50 text-primary font-bold shadow-md': isToday && isSelected,
          },
          className,
        )}
        variant='ghost'
        size='icon'
        onClick={() => handleDayClick(date)}
        data-day={date.toLocaleDateString()}
        data-selected={isSelected}
        data-today={isToday}
        data-outside={isOutside}
        {...props}>
        <p
          about='n_day of the month'
          className={cn(
            'mt-3 mr-2 text-right text-sm leading-none tracking-widest',
            {
              'opacity-50': isOutside,
              'font-bold text-primary': isToday,
              'font-semibold text-primary/80': isSelected && !isToday,
            },
          )}>
          {date.getDate()}
        </p>

        <div className={cn('flex-1 space-y-1', { 'opacity-60': isOutside })}>
          {dayEvents.slice(0, 3).map((event) => (
            <Button
              className='cursor-pointer truncate rounded-sm px-1.5 py-0.5 font-medium text-[10px] hover:opacity-80'
              key={event.id}
              onClick={(e) => {
                e.stopPropagation()
                handleEventClick(event)
              }}
              style={{
                backgroundColor: `${event.color}15`,
                borderLeft: `2px solid ${event.color}`,
                color: event.color,
              }}>
              {event.title}
            </Button>
          ))}
          {dayEvents.length > 3 && (
            <div className='px-1.5 font-medium text-[9px] text-gray-500'>
              +{dayEvents.length - 3} more
            </div>
          )}
        </div>

        <div className='absolute top-2 right-2 opacity-0 transition-opacity group-hover:opacity-100'>
          <button
            aria-label='Add event'
            className='flex h-5 w-5 items-center justify-center rounded-full bg-blue-100 transition-colors hover:bg-blue-200'
            onClick={(e) => {
              e.stopPropagation()
              handleEventCreate(date)
            }}
            type='button'>
            <Plus className='h-3 w-3 text-blue-600' />
          </button>
        </div>
      </Button>
    )
  }

  return (
    <div className='syllabus-calendar flex min-h-0 flex-1 grow flex-col overflow-hidden'>
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
          {displayLabel}
        </div>

        <div className='inline-flex justify-self-end rounded-md border bg-muted/40 p-0.5'>
          {(['month', 'week', 'day'] as View[]).map((v) => (
            <button
              className={[
                'rounded-sm px-3 py-1.5 text-sm transition-colors',
                view === v
                  ? 'bg-background text-primary shadow-sm'
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
        <AnimatePresence mode='wait'>
          {view === 'month' && (
            <ViewTransition keyedBy='month' preset='slide-up'>
              <BaseCalendar
                className='h-full w-full bg-transparent p-0 [&_.rdp-month]:h-full [&_.rdp-month_grid]:h-full [&_.rdp-month_grid]:min-h-0 [&_.rdp-months]:h-full [&_.rdp-week]:h-full [&_.rdp-week]:min-h-[120px] [&_.rdp-weekdays]:border-b [&_.rdp-weekdays]:bg-muted/10 [&_.rdp-weeks]:h-full [&_.rdp-weeks]:flex-1'
                classNames={{
                  nav: 'hidden',
                  month_caption: 'hidden sr-only',
                  month_grid:
                    'h-full min-h-0 flex flex-col border border-border rounded-lg overflow-hidden',
                  week: 'h-full min-h-[120px] grid grid-cols-7 border-b last:border-b-0 border-border',
                  weekdays:
                    'grid grid-cols-7 border-b border-border bg-muted/10',
                  weekday:
                    'h-10 flex items-center justify-center text-xs font-medium text-muted-foreground uppercase tracking-wide border-r last:border-r-0 border-border bg-muted/10',
                  day_button: 'h-full w-full p-0 rounded-none bg-transparent',
                  day: 'h-full w-full border-r last:border-r-0 border-border relative',
                  day_outside: '',
                  day_today: '',
                  day_disabled: '',
                  day_selected: '',
                }}
                components={{
                  DayButton: CustomDayButton,
                }}
                fixedWeeks
                mode='single'
                month={displayDate}
                onMonthChange={setCurrentDate}
                onSelect={onSelect}
                selected={selected}
                showOutsideDays
              />
            </ViewTransition>
          )}

          {view === 'week' && (
            <ViewTransition keyedBy='week' preset='slide-left'>
              <WeekView
                date={currentDate}
                events={events}
                onDayClick={handleDayClick}
                onEventClick={handleEventClick}
                onEventCreate={handleEventCreate}
              />
            </ViewTransition>
          )}

          {view === 'day' && (
            <ViewTransition keyedBy='day' preset='slide-right'>
              <DayView
                date={currentDate}
                events={events}
                onEventClick={handleEventClick}
                onEventCreate={handleEventCreate}
              />
            </ViewTransition>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
