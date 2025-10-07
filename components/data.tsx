import type { Role } from '@/types/schema'
import type { UserStatus } from './schema'
import {
  Award,
  Glasses,
  GraduationCap,
  type LucideIcon,
  ShieldUser,
  Wrench,
} from 'lucide-react'

export const callTypes = new Map<UserStatus, string>([
  ['active', 'bg-teal-100/30 text-teal-900 dark:text-teal-200 border-teal-200'],
  ['inactive', 'bg-neutral-300/40 border-neutral-300'],
  ['invited', 'bg-sky-200/40 text-sky-900 dark:text-sky-100 border-sky-300'],
  [
    'suspended',
    'bg-destructive/10 dark:bg-destructive/50 text-destructive dark:text-primary border-destructive/10',
  ],
])

export const roles = [
  { label: 'Contributeur', value: 'contributor', icon: Award },
  { label: 'Développeur', value: 'developer', icon: Wrench },
  { label: 'Étudiant', value: 'student', icon: GraduationCap },
  { label: 'Professeur', value: 'teacher', icon: Glasses },
  { label: 'Administrateur', value: 'administrator', icon: ShieldUser },
] as ReadonlyArray<Readonly<{ value: Role; label: string; icon: LucideIcon }>>
