'use client'

import { motion } from 'framer-motion'
import { Calendar as CalendarIcon, CalendarPlus, Clock } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { SyllabusContentFadeIn } from '@/components/syllabus-page-transition'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Calendar as MiniCalendar } from '@/components/ui/calendar'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Textarea } from '@/components/ui/textarea'
import { BigCalendar } from './calendar'

type EventItem = {
  id: string
  title: string
  description?: string
  start: Date
  end: Date
  color: string
}

function formatDateTime(d: Date, locale = 'fr-FR') {
  return new Intl.DateTimeFormat(locale, {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(d)
}

function withTime(datePart: Date, timeSource: Date) {
  return new Date(
    datePart.getFullYear(),
    datePart.getMonth(),
    datePart.getDate(),
    timeSource.getHours(),
    timeSource.getMinutes(),
    0,
    0,
  )
}

function clampEndAfterStart(start: Date, end: Date) {
  return end > start ? end : new Date(start.getTime() + 60 * 60 * 1000)
}

function DateTimePicker({
  id,
  value,
  onChange,
  placeholder = 'Sélectionner une date',
}: {
  id?: string
  value?: Date
  onChange: (d: Date) => void
  placeholder?: string
}) {
  const [open, setOpen] = useState(false)
  const base = value ?? new Date()
  const [temp, setTemp] = useState<Date>(base)
  const [month, setMonth] = useState<Date>(
    new Date(base.getFullYear(), base.getMonth(), 1),
  )

  useEffect(() => {
    if (open) {
      const next = value ?? new Date()
      setTemp(next)
      setMonth(new Date(next.getFullYear(), next.getMonth(), 1))
    }
  }, [open, value])

  const hour = temp.getHours()
  const minute = temp.getMinutes()

  const setHour = (h: number) =>
    setTemp(
      (t) =>
        new Date(t.getFullYear(), t.getMonth(), t.getDate(), h, t.getMinutes()),
    )
  const setMinute = (m: number) =>
    setTemp(
      (t) =>
        new Date(t.getFullYear(), t.getMonth(), t.getDate(), t.getHours(), m),
    )

  const onSelectDate = (d?: Date) => {
    if (!d) return
    setTemp((t) => withTime(d, t))
  }

  const apply = () => {
    onChange(temp)
    setOpen(false)
  }

  return (
    <Popover onOpenChange={setOpen} open={open}>
      <PopoverTrigger asChild>
        <Button
          className='w-full justify-start text-left font-normal'
          id={id}
          type='button'
          variant='outline'>
          <CalendarIcon className='mr-2 h-4 w-4' />
          {value ? (
            formatDateTime(value)
          ) : (
            <span className='text-muted-foreground'>{placeholder}</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent align='start' className='w-auto p-0'>
        <MiniCalendar
          autoFocus
          mode='single'
          month={month}
          onMonthChange={setMonth}
          onSelect={onSelectDate}
          selected={temp}
        />
        <div className='flex items-center gap-2 border-t p-3'>
          <div className='flex items-center gap-2'>
            <span className='text-muted-foreground text-sm'>Heure</span>
            <select
              aria-label='Heure'
              className='h-9 rounded-md border bg-background px-2 text-sm'
              onChange={(e) => setHour(parseInt(e.target.value, 10))}
              value={hour}>
              {Array.from({ length: 24 }, (_, h) => (
                // biome-ignore lint/suspicious/noArrayIndexKey: h refers to index
                <option key={h} value={h}>
                  {String(h).padStart(2, '0')}
                </option>
              ))}
            </select>
            <span className='text-muted-foreground'>:</span>
            <select
              aria-label='Minutes'
              className='h-9 rounded-md border bg-background px-2 text-sm'
              onChange={(e) => setMinute(parseInt(e.target.value, 10))}
              value={Math.floor(minute / 5) * 5}>
              {[0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55].map((m) => (
                <option key={m} value={m}>
                  {String(m).padStart(2, '0')}
                </option>
              ))}
            </select>
          </div>

          <div className='ml-auto flex items-center gap-2'>
            <Button
              onClick={() => setTemp(new Date())}
              size='sm'
              type='button'
              variant='ghost'>
              Maintenant
            </Button>
            <Button onClick={apply} size='sm' type='button'>
              OK
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}

export default function Page() {
  const [date, setDate] = useState<Date | undefined>(new Date(2025, 5, 12))

  const [events, setEvents] = useState<EventItem[]>([
    {
      id: 'seed-1',
      title: 'Conférence Marketing Stratégique',
      description: 'Présentation des tendances 2025',
      start: new Date(2025, 2, 3, 9, 0),
      end: new Date(2025, 2, 3, 10, 30),
      color: '#6366F1',
    },
  ])

  const [drawerOpen, setDrawerOpen] = useState(false)
  const [errors, setErrors] = useState<string | null>(null)
  const [form, setForm] = useState({
    title: '',
    description: '',
    start: new Date(),
    end: new Date(),
    color: '#3b82f6',
  })

  const onDaySelected = (d?: Date) => {
    setDate(d)
    if (!d) return
    const start = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 9, 0)
    const end = new Date(start.getTime() + 60 * 60 * 1000)
    setForm({ title: '', description: '', start, end, color: '#3b82f6' })
    setErrors(null)
    setDrawerOpen(true)
  }

  const upcoming = useMemo(
    () => [...events].sort((a, b) => a.start.getTime() - b.start.getTime()),
    [events],
  )

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setErrors(null)

    const title = form.title.trim()
    if (!title) return setErrors('Veuillez saisir un titre.')
    if (Number.isNaN(form.start.getTime()) || Number.isNaN(form.end.getTime()))
      return setErrors('Merci de fournir des dates valides.')
    if (form.end <= form.start)
      return setErrors(
        'La date de fin doit être postérieure à la date de début.',
      )

    const newEvent: EventItem = {
      id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
      title,
      description: form.description.trim(),
      start: form.start,
      end: form.end,
      color: form.color,
    }

    setEvents((prev) => [...prev, newEvent])
    setDrawerOpen(false)
  }

  return (
    <SyllabusContentFadeIn
      className='flex h-full min-h-0 lg:space-x-5'
      delay={0.1}>
      <motion.aside
        animate={{ opacity: 1, x: 0 }}
        className='sticky top-20 hidden w-80 shrink-0 space-y-4 xl:block'
        initial={{ opacity: 0, x: -50 }}
        transition={{ duration: 0.6, delay: 0.2 }}>
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          initial={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.5, delay: 0.3 }}>
          <Button
            className='w-full'
            onClick={() => {
              const today = new Date()
              const start = new Date(
                today.getFullYear(),
                today.getMonth(),
                today.getDate(),
                9,
                0,
              )
              const end = new Date(start.getTime() + 60 * 60 * 1000)
              setForm({
                title: '',
                description: '',
                start,
                end,
                color: '#3b82f6',
              })
              setErrors(null)
              setDrawerOpen(true)
            }}>
            <CalendarPlus /> Ajouter un événement
          </Button>
        </motion.div>

        <ScrollArea>
          <motion.h5
            animate={{ opacity: 1 }}
            className='sticky top-0 hidden items-center pb-5 font-medium xl:flex'
            initial={{ opacity: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}>
            Événements à venir
            <Badge className='ml-2 select-none' variant='outline'>
              {upcoming.length}
            </Badge>
          </motion.h5>

          <motion.div
            animate={{ opacity: 1, y: 0 }}
            className='mt-0.5 divide-y overflow-hidden rounded-md xl:border'
            initial={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.5 }}>
            {upcoming.map((evt, index) => (
              <motion.div
                animate={{ opacity: 1, x: 0 }}
                className='flex min-w-72 cursor-pointer items-start gap-2 py-4 font-medium text-sm xl:px-4 xl:hover:bg-muted'
                initial={{ opacity: 0, x: -20 }}
                key={evt.id}
                transition={{ duration: 0.4, delay: 0.6 + index * 0.1 }}
                whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
                whileTap={{ scale: 0.98 }}>
                <span
                  className='mt-1 block size-4 rounded-full'
                  style={{ backgroundColor: evt.color }}
                />
                <div className='space-y-2'>
                  <div className='line-clamp-2'>{evt.title}</div>
                  <div className='flex items-center gap-1 text-muted-foreground text-xs'>
                    <Clock className='!size-3' />
                    {formatDateTime(evt.start)}
                  </div>
                </div>
              </motion.div>
            ))}

            {upcoming.length === 0 && (
              <motion.div
                animate={{ opacity: 1 }}
                className='p-4 text-muted-foreground text-sm'
                initial={{ opacity: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}>
                Aucun événement à venir.
              </motion.div>
            )}
          </motion.div>
        </ScrollArea>
      </motion.aside>

      <motion.div
        animate={{ opacity: 1, scale: 1 }}
        className='flex h-[calc(100svh-7rem)] min-h-0 w-full min-w-0 overflow-hidden lg:space-x-5'
        initial={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.6, delay: 0.1 }}>
        <BigCalendar
          events={events}
          onChange={onDaySelected}
          onEventCreate={onDaySelected}
          value={date}
        />
      </motion.div>

      <Drawer onOpenChange={setDrawerOpen} open={drawerOpen}>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Nouvel événement</DrawerTitle>
            <DrawerDescription>
              Renseignez les détails de votre événement puis enregistrez.
            </DrawerDescription>
          </DrawerHeader>

          <form
            className='mx-auto w-full max-w-xl space-y-4 px-4 pb-4'
            onSubmit={handleSubmit}>
            {errors && (
              <div className='rounded-md border border-destructive/30 bg-destructive/10 p-3 text-destructive text-sm'>
                {errors}
              </div>
            )}

            <div className='space-y-2'>
              <Label htmlFor='title'>Titre</Label>
              <Input
                id='title'
                onChange={(e) =>
                  setForm((f) => ({ ...f, title: e.target.value }))
                }
                placeholder='Ex. Réunion d’équipe'
                required
                value={form.title}
              />
            </div>

            <div className='space-y-2'>
              <Label htmlFor='description'>Description</Label>
              <Textarea
                id='description'
                onChange={(e) =>
                  setForm((f) => ({ ...f, description: e.target.value }))
                }
                placeholder='Détails, liens, etc.'
                rows={4}
                value={form.description}
              />
            </div>

            <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
              <div className='space-y-2'>
                <Label htmlFor='start'>Début</Label>
                <DateTimePicker
                  id='start'
                  onChange={(d) =>
                    setForm((f) => ({
                      ...f,
                      start: d,
                      end: clampEndAfterStart(d, f.end),
                    }))
                  }
                  placeholder='Sélectionner la date de début'
                  value={form.start}
                />
              </div>

              <div className='space-y-2'>
                <Label htmlFor='end'>Fin</Label>
                <DateTimePicker
                  id='end'
                  onChange={(d) =>
                    setForm((f) => ({
                      ...f,
                      end: d <= f.start ? clampEndAfterStart(f.start, d) : d,
                    }))
                  }
                  placeholder='Sélectionner la date de fin'
                  value={form.end}
                />
              </div>
            </div>

            <div className='space-y-2'>
              <Label htmlFor='color'>Couleur</Label>
              <div className='flex items-center gap-3'>
                <Input
                  className='h-10 w-14 cursor-pointer p-1'
                  id='color'
                  onChange={(e) =>
                    setForm((f) => ({ ...f, color: e.target.value }))
                  }
                  type='color'
                  value={form.color}
                />
                <div className='text-muted-foreground text-xs'>
                  Choisissez une couleur pour l’événement
                </div>
              </div>
            </div>

            <DrawerFooter className='px-0'>
              <Button type='submit'>Enregistrer</Button>
              <DrawerClose asChild>
                <Button type='button' variant='outline'>
                  Annuler
                </Button>
              </DrawerClose>
            </DrawerFooter>
          </form>
        </DrawerContent>
      </Drawer>
    </SyllabusContentFadeIn>
  )
}
