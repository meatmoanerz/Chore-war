import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useApp } from '../context/AppContext'
import type { Chore, Goal, PointTx } from '../lib/types'
import { startOfWeek } from '../lib/utils'
import { Card, PointPill, ProgressBar, Spinner, Avatar, EmptyState, Button } from '../components/ui'
import { ChoreCard } from '../components/ChoreCard'

export default function HomePage() {
  const { household, members, role, session, profile } = useApp()
  const nav = useNavigate()
  const [txs, setTxs] = useState<PointTx[]>([])
  const [chores, setChores] = useState<Chore[]>([])
  const [goals, setGoals] = useState<Goal[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!household) return
    setLoading(true)
    Promise.all([
      supabase.from('point_transactions').select('*').eq('household_id', household.id),
      supabase.from('chores').select('*').eq('household_id', household.id)
        .in('status', ['open', 'claimed', 'paused', 'submitted'])
        .order('urgent', { ascending: false }).order('created_at', { ascending: false }),
      supabase.from('goals').select('*').eq('household_id', household.id)
        .gte('period_end', new Date().toISOString().slice(0, 10)),
    ]).then(([t, c, g]) => {
      setTxs((t.data ?? []) as PointTx[])
      setChores((c.data ?? []) as Chore[])
      setGoals((g.data ?? []) as Goal[])
      setLoading(false)
    })
  }, [household])

  if (!household) return null
  if (loading) return <Spinner />

  const me = session!.user.id
  const weekStart = startOfWeek()
  const sum = (filter: (t: PointTx) => boolean) => txs.filter(filter).reduce((a, t) => a + t.amount, 0)
  const myWeek = sum(t => t.user_id === me && new Date(t.created_at) >= weekStart)
  const myTotal = sum(t => t.user_id === me)

  const pending = chores.filter(c => c.status === 'submitted')
  const myActive = chores.filter(c => (c.status === 'claimed' || c.status === 'paused') && c.claimed_by === me)
  const available = chores.filter(c => c.status === 'open' && (!c.assigned_to || c.assigned_to === me))
    .filter(c => !c.expires_at || new Date(c.expires_at) > new Date())

  const goalProgress = (g: Goal) =>
    sum(t =>
      new Date(t.created_at) >= new Date(g.period_start) &&
      new Date(t.created_at) <= new Date(g.period_end + 'T23:59:59') &&
      (g.kind === 'shared' ? true : t.user_id === g.user_id)
    )

  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-display font-extrabold text-2xl text-blck">Hej {profile?.first_name}! 👋</h1>
        <p className="text-sm text-blck/50">{role === 'adult' ? 'Här är läget i hushållet.' : 'Dags att tjäna poäng!'}</p>
      </div>

      {/* My points */}
      <Card className="flex items-center justify-between bg-gradient-to-br from-white to-sol/10">
        <div>
          <p className="text-xs font-semibold text-blck/50 uppercase tracking-wide">Mina poäng denna vecka</p>
          <p className="font-display font-extrabold text-4xl text-blck">{myWeek}<span className="text-lg text-blck/40"> p</span></p>
          <p className="text-xs text-blck/40 mt-1">Totalt genom tiderna: <b>{myTotal} p</b></p>
        </div>
        <span className="text-5xl" aria-hidden>⚡</span>
      </Card>

      {/* Adult: pending approvals */}
      {role === 'adult' && pending.length > 0 && (
        <Card className="border-2 border-hallon/30" onClick={() => nav('/godkann')}>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-display font-bold text-blck">🔔 {pending.length} {pending.length === 1 ? 'syssla väntar' : 'sysslor väntar'} på godkännande</p>
              <p className="text-xs text-blck/50">Tryck för att granska</p>
            </div>
            <span className="text-hallon font-bold text-xl">→</span>
          </div>
        </Card>
      )}

      {/* My active chores */}
      {myActive.length > 0 && (
        <section>
          <h2 className="font-display font-bold text-lg text-blck mb-2">Pågående 💪</h2>
          <div className="space-y-3">
            {myActive.map(c => <ChoreCard key={c.id} chore={c} members={members} />)}
          </div>
        </section>
      )}

      {/* Goals */}
      {goals.length > 0 && (
        <section>
          <h2 className="font-display font-bold text-lg text-blck mb-2">Mål 🎯</h2>
          <div className="space-y-3">
            {goals.slice(0, 3).map(g => {
              const prog = goalProgress(g)
              const m = members.find(x => x.user_id === g.user_id)
              return (
                <Card key={g.id} onClick={() => nav('/mal')}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2 min-w-0">
                      {g.kind === 'individual' && m
                        ? <Avatar size="sm" first={m.profile.first_name} last={m.profile.last_name} id={m.user_id} />
                        : <span className="text-lg">👨‍👩‍👧‍👦</span>}
                      <span className="font-semibold text-sm text-blck truncate">{g.title}</span>
                    </div>
                    <span className="text-xs font-bold text-blck/60 shrink-0">{Math.min(prog, g.target_points)}/{g.target_points}p</span>
                  </div>
                  <ProgressBar value={prog} max={g.target_points} color={prog >= g.target_points ? 'bg-emerald-400' : 'bg-mynta'} />
                  {prog >= g.target_points && <p className="text-xs text-emerald-600 font-semibold mt-1.5">Målet är nått! 🎉 {g.reward}</p>}
                </Card>
              )
            })}
          </div>
        </section>
      )}

      {/* Available chores */}
      <section>
        <div className="flex items-center justify-between mb-2">
          <h2 className="font-display font-bold text-lg text-blck">Lediga sysslor 🧹</h2>
          <Link to="/sysslor" className="text-sm font-semibold text-hallon">Visa alla</Link>
        </div>
        {available.length === 0 ? (
          <EmptyState emoji="🌴" title="Inga lediga sysslor just nu"
            hint={role === 'adult' ? 'Skapa en ny syssla så barnen har något att göra!' : 'Bra jobbat – njut av ledigheten!'} />
        ) : (
          <div className="space-y-3">
            {available.slice(0, 4).map(c => <ChoreCard key={c.id} chore={c} members={members} />)}
          </div>
        )}
        {role === 'adult' && (
          <div className="mt-3">
            <Button full onClick={() => nav('/sysslor/ny')}>+ Ny syssla</Button>
          </div>
        )}
      </section>
    </div>
  )
}
