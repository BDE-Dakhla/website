'use client'

import * as React from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Landmark, School, Monitor, TrendingUp } from 'lucide-react'
import { cn } from '@/lib/utils'

type DayKey = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday'
type SlotIndex = 0 | 1 | 2 | 3
// 0: 09h00–11h00, 1: 11h00–13h00, 2: 14h00–15h30, 3: 15h30–17h00

const DAYS: { key: DayKey; label: string }[] = [
  { key: 'monday', label: 'LUNDI' },
  { key: 'tuesday', label: 'MARDI' },
  { key: 'wednesday', label: 'MERCREDI' },
  { key: 'thursday', label: 'JEUDI' },
  { key: 'friday', label: 'VENDREDI' },
]

const SLOTS = [
  { idx: 0 as SlotIndex, label: '09h00 - 11h00' },
  { idx: 1 as SlotIndex, label: '11h00 - 13h00' },
  { idx: 2 as SlotIndex, label: '14h00 - 15h30' },
  { idx: 3 as SlotIndex, label: '15h30 - 17h00' },
] as const

type ClassType = 'TD' | 'TP' | 'Cours'
type Tag = ClassType | string

type SlotRow =
  | {
      kind: 'class'
      id: string
      title: string
      type?: ClassType // rendered as uniform badge
      tags?: Tag[] // optional extra tags
      group?: string // e.g. "Groupe A"
      teacher?: string // e.g. "Pr. Ouallou"
      avatarUrl?: string
    }
  | {
      kind: 'free'
      id: string
      label?: string // e.g. "Libre"
      start?: string // "14h00"
      end?: string // "15h00"
    }

export interface ScheduleEntry {
  day: DayKey
  slot: SlotIndex
  row: SlotRow
  span?: 1 | 2 // spans the pair (0->1 or 2->3)
}

/* Rooms registry and mapping */
export type RoomLabel =
  | 'Amphithéâtre'
  | 'Classe'
  | 'Salle des marchés'
  | "Salle d'informatique"

export interface Room {
  id: string
  name: string // e.g. "Salle 1"
  label: RoomLabel
}

type RoomByEventId = Record<string, string> // { [eventRowId]: roomId }

const RoomIconMap: Record<RoomLabel, React.ComponentType<any>> = {
  'Amphithéâtre': Landmark,
  'Classe': School,
  'Salle des marchés': TrendingUp,
  "Salle d'informatique": Monitor,
}

function initials(name: string) {
  const parts = name.split(' ').filter(Boolean)
  return (parts[0]?.[0] ?? '?') + (parts[1]?.[0] ?? '')
}

function ClassTypeBadge({ type }: { type?: ClassType }) {
  if (!type) return null
  // uniform style for TD/TP/Cours
  return (
    <Badge variant="secondary" className="text-[10px]">
      {type}
    </Badge>
  )
}

function ExtraTags({ tags }: { tags?: Tag[] }) {
  if (!tags?.length) return null
  return (
    <>
      {tags.map((t) => (
        <Badge key={t} variant="outline" className="text-[10px]">
          {t}
        </Badge>
      ))}
    </>
  )
}

function RoomPill({
  room,
}: {
  room?: Room | null
}) {
  if (!room) return null
  const Icon = RoomIconMap[room.label]
  return (
    <div className="mt-0.5 inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-xs">
      <Icon className="h-3.5 w-3.5 text-muted-foreground" />
      <span className="font-medium">{room.name}</span>
    </div>
  )
}

function ClassRowView({
  row,
  room,
}: {
  row: Extract<SlotRow, { kind: 'class' }>
  room?: Room | null
}) {
  return (
    <div className="grid place-items-center p-2 text-center">
      <div className="flex flex-col items-center gap-1">
        {/* type + group/tags */}
        <div className="flex flex-wrap items-center justify-center gap-1">
          <ClassTypeBadge type={row.type} />
          {row.group ? (
            <Badge variant="outline" className="text-[10px]">
              {row.group}
            </Badge>
          ) : null}
          <ExtraTags tags={row.tags} />
        </div>

        <div className="text-sm font-semibold leading-tight">{row.title}</div>

        {row.teacher ? (
          <div className="mt-0.5 flex items-center gap-2 text-xs">
            <Avatar className="h-5 w-5">
              {row.avatarUrl ? (
                <AvatarImage src={row.avatarUrl} alt={row.teacher} />
              ) : null}
              <AvatarFallback className="text-[10px]">
                {initials(row.teacher)}
              </AvatarFallback>
            </Avatar>
            <span>{row.teacher}</span>
          </div>
        ) : null}

        <RoomPill room={room} />
      </div>
    </div>
  )
}

function FreeRowView({ row }: { row: Extract<SlotRow, { kind: 'free' }> }) {
  return (
    <div className="mx-2 my-1 flex items-center justify-center rounded bg-muted/40 px-4 py-1 text-[11px] leading-none text-muted-foreground">
      <span className="font-medium">
        {row.label ?? 'Libre'}
        {row.start || row.end ? ` — ${row.start ?? ''}${row.start && row.end ? ' - ' : ''}${row.end ?? ''}` : ''}
      </span>
    </div>
  )
}

function CellView({
  rows,
  resolveRoom,
}: {
  rows: SlotRow[]
  resolveRoom: (rowId: string) => Room | undefined
}) {
  // centered cell content; stacked rows divide the cell height evenly
  return (
    <div className="flex h-full min-h-[96px] flex-col justify-center divide-y divide-border">
      {rows.length === 0 ? (
        <div className="h-[96px] grid place-items-center bg-muted/10" />
      ) : (
        rows.map((r) =>
          r.kind === 'class' ? (
            <ClassRowView key={r.id} row={r} room={resolveRoom(r.id)} />
          ) : (
            <FreeRowView key={r.id} row={r} />
          ),
        )
      )}
    </div>
  )
}

function TimetableRow({
  day,
  entries,
  isFirstRow,
  resolveRoom,
}: {
  day: DayKey
  entries: ScheduleEntry[]
  isFirstRow: boolean
  resolveRoom: (rowId: string) => Room | undefined
}) {
  const getRows = (slot: SlotIndex) =>
    entries
      .filter((e) => e.day === day && e.slot === slot)
      .map((e) => e.row)

  const renderPair = (firstSlot: SlotIndex, secondSlot: SlotIndex) => {
    const spanning = entries.find(
      (e) => e.day === day && e.slot === firstSlot && e.span === 2,
    )
    if (spanning) {
      return (
        <TableCell
          key={`${day}-pair-${firstSlot}`}
          colSpan={2}
          className="p-0 align-middle border border-border bg-background"
        >
          <CellView rows={[spanning.row]} resolveRoom={resolveRoom} />
        </TableCell>
      )
    }

    return (
      <>
        <TableCell
          key={`${day}-${firstSlot}`}
          className="p-0 align-middle border border-border bg-background"
        >
          <CellView rows={getRows(firstSlot)} resolveRoom={resolveRoom} />
        </TableCell>
        <TableCell
          key={`${day}-${secondSlot}`}
          className="p-0 align-middle border border-border bg-background"
        >
          <CellView rows={getRows(secondSlot)} resolveRoom={resolveRoom} />
        </TableCell>
      </>
    )
  }

  return (
    <TableRow className="hover:bg-transparent">
      <TableCell className={cn(
        'w-28 select-none text-center font-bold uppercase',
        'bg-amber-600 text-white',
        'border border-border'
      )}>
        {DAYS.find((d) => d.key === day)?.label}
      </TableCell>

      {renderPair(0, 1)}

      {isFirstRow ? (
        <TableCell
          rowSpan={DAYS.length}
          className="w-10 p-0 text-center border border-border bg-sky-700 text-white"
        >
          <div className="flex h-full items-center justify-center">
            <span className="rotate-180 [writing-mode:vertical-rl] tracking-wider font-bold text-xs">
              PAUSE DEJEUNER
            </span>
          </div>
        </TableCell>
      ) : null}

      {renderPair(2, 3)}
    </TableRow>
  )
}

export function Timetable({
  events,
  rooms,
  roomByEventId,
  className,
}: {
  events: ScheduleEntry[]
  rooms: Room[]
  roomByEventId?: RoomByEventId // map class-row id -> roomId
  className?: string
}) {
  const roomMap = React.useMemo(() => {
    const m = new Map<string, Room>()
    rooms.forEach((r) => m.set(r.id, r))
    return m
  }, [rooms])

  const resolveRoom = React.useCallback(
    (rowId: string) => {
      const roomId = roomByEventId?.[rowId]
      return roomId ? roomMap.get(roomId) : undefined
    },
    [roomByEventId, roomMap],
  )

  return (
    <ScrollArea className={cn('w-full', className)}>
      <div className="min-w-[1040px] rounded-md border">
        <Table className="w-full border-separate border-spacing-0 text-sm">
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              {/* empty top-left header */}
              <TableHead className="w-28 p-2 text-left font-bold border border-border bg-muted/40" />

              {/* Morning headers */}
              {SLOTS.slice(0, 2).map((s) => (
                <TableHead
                  key={s.idx}
                  className="text-center font-bold text-white border border-border bg-amber-600"
                >
                  {s.label}
                </TableHead>
              ))}

              {/* Lunch header column (no label here to avoid duplication) */}
              <TableHead
                aria-hidden
                className="w-10 p-0 text-center border border-border bg-sky-700"
              />

              {/* Afternoon headers */}
              {SLOTS.slice(2).map((s) => (
                <TableHead
                  key={s.idx}
                  className="text-center font-bold text-white border border-border bg-amber-600"
                >
                  {s.label}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>

          <TableBody>
            {DAYS.map((d, i) => (
              <TimetableRow
                key={d.key}
                day={d.key}
                entries={events}
                isFirstRow={i === 0}
                resolveRoom={resolveRoom}
              />
            ))}
          </TableBody>
        </Table>
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  )
}

/* ----------------------------------
   Example Rooms + Mapping + Events
-----------------------------------*/

export const ROOMS: Room[] = [
  { id: 'r-amphi-1', name: 'Amphi 1', label: 'Amphithéâtre' },
  { id: 'r-salle-1', name: 'Salle 1', label: 'Classe' },
  { id: 'r-marche-1', name: 'Salle des marchés', label: 'Salle des marchés' },
  { id: 'r-info-1', name: "Salle d'informatique", label: "Salle d'informatique" },
]

export const ROOM_BY_EVENT_ID: RoomByEventId = {
  // Lundi
  'mon-09-micro': 'r-salle-1',
  'mon-11-droit': 'r-salle-1',
  'mon-14-cg-a': 'r-salle-1',
  'mon-14-droit-c': 'r-salle-1',
  'mon-1530-cg-b': 'r-salle-1',
  'mon-1530-droit-c': 'r-salle-1',

  // Mardi
  'tue-09-free': 'r-salle-1',
  'tue-09-mgmt': 'r-salle-1',
  'tue-11-cg': 'r-salle-1',

  // Mercredi
  'wed-14-english-span': 'r-marche-1',

  // Jeudi
  'thu-09-fr': 'r-amphi-1',
  'thu-11-en': 'r-amphi-1',
}

export const SAMPLE_EVENTS: ScheduleEntry[] = [
  // Lundi — matin
  {
    day: 'monday',
    slot: 0,
    row: {
      kind: 'class',
      id: 'mon-09-micro',
      title: 'Micro-Économie',
      type: 'Cours',
      teacher: 'Pr. Naoui',
    },
  },
  {
    day: 'monday',
    slot: 1,
    row: {
      kind: 'class',
      id: 'mon-11-droit',
      title: 'Droit général',
      type: 'Cours',
      teacher: 'Pr. Ouallou',
    },
  },

  // Lundi — 14:00–15:30: two groups in the same slot
  {
    day: 'monday',
    slot: 2,
    row: {
      kind: 'class',
      id: 'mon-14-cg-a',
      title: 'Comptabilité Générale',
      type: 'TD',
      group: 'Groupe A',
      teacher: 'Pr. Bouzia',
    },
  },
  {
    day: 'monday',
    slot: 2,
    row: {
      kind: 'class',
      id: 'mon-14-droit-c',
      title: 'Droit général',
      type: 'TD',
      group: 'Groupe C',
      teacher: 'Pr. Ouallou',
    },
  },

  // Lundi — 15:30–17:00: two groups in the same slot
  {
    day: 'monday',
    slot: 3,
    row: {
      kind: 'class',
      id: 'mon-1530-cg-b',
      title: 'Comptabilité Générale',
      type: 'TD',
      group: 'Groupe B',
      teacher: 'Pr. Bouzia',
    },
  },
  {
    day: 'monday',
    slot: 3,
    row: {
      kind: 'class',
      id: 'mon-1530-droit-c',
      title: 'Droit général',
      type: 'TD',
      group: 'Groupe C',
      teacher: 'Pr. Ouallou',
    },
  },

  // Mardi — example with "free time" band plus a class
  {
    day: 'tuesday',
    slot: 0,
    row: { kind: 'free', id: 'tue-09-free', label: 'Libre', start: '09h00', end: '09h45' },
  },
  {
    day: 'tuesday',
    slot: 0,
    row: {
      kind: 'class',
      id: 'tue-09-mgmt',
      title: 'Management',
      type: 'Cours',
      teacher: 'Pr. Erraji',
    },
  },
  {
    day: 'tuesday',
    slot: 1,
    row: {
      kind: 'class',
      id: 'tue-11-cg',
      title: 'Comptabilité Générale',
      type: 'Cours',
      teacher: 'Pr. Erraji',
    },
  },

  // Mercredi — spanning pm
  {
    day: 'wednesday',
    slot: 2,
    span: 2,
    row: {
      kind: 'class',
      id: 'wed-14-english-span',
      title: 'Anglais',
      type: 'Cours',
      teacher: 'Pre. El Amrani',
    },
  },

  // Jeudi
  {
    day: 'thursday',
    slot: 0,
    row: {
      kind: 'class',
      id: 'thu-09-fr',
      title: 'Français',
      type: 'Cours',
      group: 'G.3 Com',
      teacher: 'Pre. Bouchaf',
    },
  },
  {
    day: 'thursday',
    slot: 1,
    row: {
      kind: 'class',
      id: 'thu-11-en',
      title: 'Anglais',
      type: 'Cours',
      group: 'G.3 Com',
      teacher: 'Pre. El Amrani',
    },
  },
]