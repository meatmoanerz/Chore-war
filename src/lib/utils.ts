import type { ChoreStatus } from './types'

export function startOfWeek(d = new Date()): Date {
  const x = new Date(d)
  const day = (x.getDay() + 6) % 7 // Monday = 0
  x.setDate(x.getDate() - day)
  x.setHours(0, 0, 0, 0)
  return x
}

export function startOfMonth(d = new Date()): Date {
  return new Date(d.getFullYear(), d.getMonth(), 1)
}

export function fmtDate(iso: string | null): string {
  if (!iso) return ''
  return new Date(iso).toLocaleDateString('sv-SE', { day: 'numeric', month: 'short' })
}

export function fmtDateTime(iso: string | null): string {
  if (!iso) return ''
  return new Date(iso).toLocaleString('sv-SE', {
    day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit',
  })
}

export function fmtMinutes(min: number | null): string {
  if (!min) return ''
  if (min < 60) return `${min} min`
  const h = Math.floor(min / 60)
  const m = min % 60
  return m ? `${h} h ${m} min` : `${h} h`
}

export const statusLabel: Record<ChoreStatus, string> = {
  draft: 'Utkast',
  open: 'Ledig',
  claimed: 'Pågår',
  paused: 'Pausad',
  submitted: 'Väntar på OK',
  approved: 'Godkänd',
  rejected: 'Ej godkänd',
  expired: 'Utgången',
}

export const statusColor: Record<ChoreStatus, string> = {
  draft: 'bg-gray-200 text-gray-600',
  open: 'bg-mynta/15 text-teal-700',
  claimed: 'bg-himmel/15 text-himmel',
  paused: 'bg-sol/20 text-amber-700',
  submitted: 'bg-hallon/10 text-hallon',
  approved: 'bg-emerald-100 text-emerald-700',
  rejected: 'bg-red-100 text-red-600',
  expired: 'bg-gray-100 text-gray-400',
}

export const recurrenceLabel: Record<string, string> = {
  daily: 'Varje dag',
  weekly: 'Varje vecka',
  biweekly: 'Varannan vecka',
  monthly: 'Varje månad',
}

export function initials(first: string, last: string): string {
  return ((first[0] ?? '') + (last[0] ?? '')).toUpperCase() || '?'
}

const AVATAR_COLORS = ['bg-hallon', 'bg-himmel', 'bg-mynta', 'bg-sol', 'bg-violet-500', 'bg-emerald-500']
export function avatarColor(id: string): string {
  let h = 0
  for (const c of id) h = (h * 31 + c.charCodeAt(0)) >>> 0
  return AVATAR_COLORS[h % AVATAR_COLORS.length]
}
