import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { useApp } from '../context/AppContext'
import type { Goal, PointTx } from '../lib/types'
import { fmtDate, startOfWeek } from '../lib/utils'
import { Avatar, Button, Card, EmptyState, Field, ProgressBar, Spinner, inputCls } from '../components/ui'

export default function GoalsPage() {
  const { household, members, role, session } = useApp()
  const [goals, setGoals] = useState<Goal[]>([])
  const [txs, setTxs] = useState<PointTx[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [showPast, setShowPast] = useState(false)

  // form state
  const [kind, setKind] = useState<'individual' | 'shared'>('individual')
  const [userId, setUserId] = useState('')
  const [title, setTitle] = useState('')
  const [target, setTarget] = useState(300)
  const [reward, setReward] = useState('')
  const monday = startOfWeek()
  const sunday = new Date(monday); sunday.setDate(sunday.getDate() + 6)
  const [start, setStart] = useState(monday.toISOString().slice(0, 10))
  const [end, setEnd] = useState(sunday.toISOString().slice(0, 10))
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  async function load() {
    if (!household) return
    const [g, t] = await Promise.all([
      supabase.from('goals').select('*').eq('household_id', household.id).order('period_end', { ascending: false }),
      supabase.from('point_transactions').select('*').eq('household_id', household.id),
    ])
    setGoals((g.data ?? []) as Goal[])
    setTxs((t.data ?? []) as PointTx[])
    setLoading(false)
  }
  useEffect(() => { setLoading(true); load() }, [household])

  async function createGoal() {
    if (!title.trim() || (kind === 'individual' && !userId)) { setError('Fyll i alla fält.'); return }
    setBusy(true); setError('')
    const { error } = await supabase.from('goals').insert({
      household_id: household!.id, kind,
      user_id: kind === 'individual' ? userId : null,
      title: title.trim(), target_points: target, reward: reward.trim(),
      period_start: start, period_end: end, created_by: session!.user.id,
    })
    setBusy(false)
    if (error) { setError(error.message); return }
    setShowForm(false); setTitle(''); setReward('')
    await load()
  }

  async function removeGoal(id: string) {
    if (!confirm('Ta bort målet?')) return
    await supabase.from('goals').delete().eq('id', id)
    await load()
  }

  if (loading) return <Spinner />

  const progress = (g: Goal) => txs
    .filter(t =>
      new Date(t.created_at) >= new Date(g.period_start) &&
      new Date(t.created_at) <= new Date(g.period_end + 'T23:59:59') &&
      (g.kind === 'shared' ? true : t.user_id === g.user_id))
    .reduce((a, t) => a + t.amount, 0)

  const today = new Date().toISOString().slice(0, 10)
  const active = goals.filter(g => g.period_end >= today)
  const past = goals.filter(g => g.period_end < today)
  const shown = showPast ? past : active

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="font-display font-extrabold text-2xl text-blck">Mål 🎯</h1>
        {role === 'adult' && <Button onClick={() => setShowForm(v => !v)}>{showForm ? 'Stäng' : '+ Nytt mål'}</Button>}
      </div>

      {showForm && (
        <Card className="space-y-3 border-2 border-mynta/40">
          <div className="grid grid-cols-2 gap-1 rounded-full bg-blck/5 p-1">
            {([['individual', 'Individuellt'], ['shared', 'Gemensamt 👨‍👩‍👧‍👦']] as const).map(([k, label]) => (
              <button key={k} type="button" onClick={() => setKind(k)}
                className={`rounded-full py-1.5 text-sm font-display font-bold ${kind === k ? 'bg-white shadow-card text-blck' : 'text-blck/50'}`}>
                {label}
              </button>
            ))}
          </div>
          {kind === 'individual' && (
            <Field label="Vem gäller målet?">
              <select className={inputCls} value={userId} onChange={e => setUserId(e.target.value)}>
                <option value="">Välj familjemedlem…</option>
                {members.map(m => <option key={m.user_id} value={m.user_id}>{m.profile.first_name}</option>)}
              </select>
            </Field>
          )}
          <Field label="Titel">
            <input className={inputCls} value={title} onChange={e => setTitle(e.target.value)} placeholder="t.ex. Veckopeng-målet" />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Poängmål ⚡">
              <input className={inputCls} type="number" min={1} value={target} onChange={e => setTarget(Number(e.target.value))} />
            </Field>
            <Field label="Belöning 🎁">
              <input className={inputCls} value={reward} onChange={e => setReward(e.target.value)} placeholder="t.ex. Veckopeng" />
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Från"><input className={inputCls} type="date" value={start} onChange={e => setStart(e.target.value)} /></Field>
            <Field label="Till"><input className={inputCls} type="date" value={end} onChange={e => setEnd(e.target.value)} /></Field>
          </div>
          {error && <p className="text-sm text-red-600 bg-red-50 rounded-xl px-3 py-2">{error}</p>}
          <Button full disabled={busy} onClick={createGoal}>{busy ? 'Sparar…' : 'Skapa mål'}</Button>
        </Card>
      )}

      <div className="flex gap-1.5">
        <button onClick={() => setShowPast(false)} className={`rounded-full px-4 py-1.5 text-sm font-display font-bold ${!showPast ? 'bg-blck text-white' : 'bg-white text-blck/60 shadow-card'}`}>Aktiva</button>
        <button onClick={() => setShowPast(true)} className={`rounded-full px-4 py-1.5 text-sm font-display font-bold ${showPast ? 'bg-blck text-white' : 'bg-white text-blck/60 shadow-card'}`}>Tidigare</button>
      </div>

      {shown.length === 0 ? (
        <EmptyState emoji="🎯" title={showPast ? 'Inga tidigare mål' : 'Inga aktiva mål'}
          hint={role === 'adult' && !showPast ? 'Skapa ett mål – t.ex. ett veckomål för veckopengen.' : undefined} />
      ) : (
        <div className="space-y-3">
          {shown.map(g => {
            const prog = progress(g)
            const m = members.find(x => x.user_id === g.user_id)
            const reached = prog >= g.target_points
            return (
              <Card key={g.id} className={reached ? 'border-2 border-emerald-300' : ''}>
                <div className="flex items-center justify-between gap-2 mb-1">
                  <div className="flex items-center gap-2 min-w-0">
                    {g.kind === 'individual' && m
                      ? <Avatar size="sm" first={m.profile.first_name} last={m.profile.last_name} id={m.user_id} />
                      : <span className="text-lg">👨‍👩‍👧‍👦</span>}
                    <span className="font-display font-bold text-blck truncate">{g.title}</span>
                  </div>
                  {role === 'adult' && <button onClick={() => removeGoal(g.id)} className="text-blck/30 text-sm shrink-0">🗑</button>}
                </div>
                <p className="text-xs text-blck/50 mb-2">
                  {fmtDate(g.period_start)} – {fmtDate(g.period_end)}
                  {g.reward && <> · 🎁 {g.reward}</>}
                </p>
                <ProgressBar value={prog} max={g.target_points} color={reached ? 'bg-emerald-400' : 'bg-mynta'} />
                <p className="text-xs font-bold text-blck/60 mt-1.5">
                  {reached ? `Målet är nått! 🎉` : `${prog} av ${g.target_points} poäng`}
                </p>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
