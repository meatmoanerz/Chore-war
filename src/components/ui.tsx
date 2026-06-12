import type { ReactNode } from 'react'
import type { ChoreStatus } from '../lib/types'
import { statusLabel, statusColor, initials, avatarColor } from '../lib/utils'

export function PointPill({ points, size = 'md' }: { points: number; size?: 'sm' | 'md' | 'lg' }) {
  const cls = size === 'lg'
    ? 'text-xl px-4 py-1.5'
    : size === 'sm' ? 'text-xs px-2 py-0.5' : 'text-sm px-2.5 py-1'
  return (
    <span className={`inline-flex items-center gap-1 rounded-full bg-sol/20 text-amber-700 font-display font-bold ${cls}`}>
      <span aria-hidden>⚡</span>{points}p
    </span>
  )
}

export function Avatar({ first, last, id, size = 'md' }: { first: string; last: string; id: string; size?: 'sm' | 'md' | 'lg' }) {
  const cls = size === 'lg' ? 'w-12 h-12 text-base' : size === 'sm' ? 'w-7 h-7 text-[10px]' : 'w-9 h-9 text-xs'
  return (
    <span className={`inline-flex items-center justify-center rounded-full text-white font-bold shrink-0 ${avatarColor(id)} ${cls}`}>
      {initials(first, last)}
    </span>
  )
}

export function ProgressBar({ value, max, color = 'bg-mynta' }: { value: number; max: number; color?: string }) {
  const pct = max > 0 ? Math.min(100, Math.round((value / max) * 100)) : 0
  return (
    <div className="w-full h-3 rounded-full bg-blck/10 overflow-hidden">
      <div className={`h-full rounded-full ${color} transition-all duration-500`} style={{ width: `${pct}%` }} />
    </div>
  )
}

export function StatusChip({ status }: { status: ChoreStatus }) {
  return (
    <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ${statusColor[status]}`}>
      {statusLabel[status]}
    </span>
  )
}

export function EmptyState({ emoji, title, hint }: { emoji: string; title: string; hint?: string }) {
  return (
    <div className="text-center py-12 px-6">
      <div className="text-5xl mb-3">{emoji}</div>
      <p className="font-display font-bold text-lg text-blck">{title}</p>
      {hint && <p className="text-sm text-blck/50 mt-1">{hint}</p>}
    </div>
  )
}

export function Spinner() {
  return (
    <div className="flex justify-center py-12">
      <div className="w-8 h-8 rounded-full border-4 border-hallon/20 border-t-hallon animate-spin" />
    </div>
  )
}

export function Card({ children, className = '', onClick }: { children: ReactNode; className?: string; onClick?: () => void }) {
  return (
    <div onClick={onClick} className={`bg-white rounded-card shadow-card p-4 ${onClick ? 'cursor-pointer active:scale-[0.99] transition-transform' : ''} ${className}`}>
      {children}
    </div>
  )
}

export function Button({ children, onClick, variant = 'primary', disabled, type = 'button', full }: {
  children: ReactNode
  onClick?: () => void
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  disabled?: boolean
  type?: 'button' | 'submit'
  full?: boolean
}) {
  const base = 'rounded-full font-display font-bold px-5 py-2.5 text-sm transition-all active:scale-95 disabled:opacity-40 disabled:pointer-events-none'
  const styles = {
    primary: 'bg-hallon text-white hover:bg-hallondark shadow-card',
    secondary: 'bg-blck/5 text-blck hover:bg-blck/10',
    ghost: 'text-blck/60 hover:bg-blck/5',
    danger: 'bg-red-50 text-red-600 hover:bg-red-100',
  }
  return (
    <button type={type} onClick={onClick} disabled={disabled} className={`${base} ${styles[variant]} ${full ? 'w-full' : ''}`}>
      {children}
    </button>
  )
}

export function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="block text-sm font-semibold text-blck/70 mb-1">{label}</span>
      {children}
    </label>
  )
}

export const inputCls = 'w-full rounded-xl border border-blck/15 bg-white px-3.5 py-2.5 text-blck placeholder:text-blck/30 focus:outline-none focus:ring-2 focus:ring-hallon/40 focus:border-hallon'
