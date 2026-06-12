import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { useApp } from '../context/AppContext'
import type { PointTx } from '../lib/types'
import { startOfMonth, startOfWeek } from '../lib/utils'
import { Avatar, Card, Spinner, EmptyState } from '../components/ui'

type Period = 'week' | 'month' | 'all'
const MEDALS = ['🥇', '🥈', '🥉']

export default function LeaderboardPage() {
  const { household, members } = useApp()
  const [txs, setTxs] = useState<PointTx[]>([])
  const [period, setPeriod] = useState<Period>('week')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!household) return
    setLoading(true)
    supabase.from('point_transactions').select('*').eq('household_id', household.id)
      .then(({ data }) => { setTxs((data ?? []) as PointTx[]); setLoading(false) })
  }, [household])

  if (loading) return <Spinner />

  const cutoff = period === 'week' ? startOfWeek() : period === 'month' ? startOfMonth() : null
  const totals = new Map<string, number>()
  for (const t of txs) {
    if (cutoff && new Date(t.created_at) < cutoff) continue
    totals.set(t.user_id, (totals.get(t.user_id) ?? 0) + t.amount)
  }
  const rows = members
    .map(m => ({ m, points: totals.get(m.user_id) ?? 0 }))
    .sort((a, b) => b.points - a.points)

  const max = Math.max(1, ...rows.map(r => r.points))

  return (
    <div className="space-y-4">
      <h1 className="font-display font-extrabold text-2xl text-blck">Topplista 🏆</h1>

      <div className="grid grid-cols-3 gap-1 rounded-full bg-white shadow-card p-1">
        {([['week', 'Vecka'], ['month', 'Månad'], ['all', 'All time']] as [Period, string][]).map(([p, label]) => (
          <button key={p} onClick={() => setPeriod(p)}
            className={`rounded-full py-2 text-sm font-display font-bold transition-colors ${
              period === p ? 'bg-blck text-white' : 'text-blck/50'
            }`}>
            {label}
          </button>
        ))}
      </div>

      {rows.length === 0 ? (
        <EmptyState emoji="🏁" title="Inga deltagare ännu" />
      ) : (
        <div className="space-y-3">
          {rows.map((r, i) => (
            <Card key={r.m.user_id} className={i === 0 && r.points > 0 ? 'border-2 border-sol/60 bg-gradient-to-br from-white to-sol/10' : ''}>
              <div className="flex items-center gap-3">
                <span className="w-8 text-center text-xl font-display font-extrabold text-blck/40">
                  {r.points > 0 && MEDALS[i] ? MEDALS[i] : i + 1}
                </span>
                <Avatar first={r.m.profile.first_name} last={r.m.profile.last_name} id={r.m.user_id} />
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-blck truncate">
                    {r.m.profile.first_name}
                    {r.m.role === 'adult' && <span className="text-xs text-blck/40 ml-1">(vuxen)</span>}
                  </p>
                  <div className="w-full h-2 rounded-full bg-blck/10 mt-1 overflow-hidden">
                    <div className="h-full rounded-full bg-sol transition-all duration-700" style={{ width: `${Math.max(0, (r.points / max) * 100)}%` }} />
                  </div>
                </div>
                <span className="font-display font-extrabold text-lg text-blck shrink-0">{r.points}p</span>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
