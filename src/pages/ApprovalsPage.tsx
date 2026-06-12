import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { useApp } from '../context/AppContext'
import type { Chore } from '../lib/types'
import { fmtDateTime } from '../lib/utils'
import { Avatar, Button, Card, EmptyState, PointPill, Spinner } from '../components/ui'

export default function ApprovalsPage() {
  const { household, members } = useApp()
  const [chores, setChores] = useState<Chore[]>([])
  const [loading, setLoading] = useState(true)
  const [busy, setBusy] = useState<string | null>(null)

  async function load() {
    if (!household) return
    const { data } = await supabase.from('chores').select('*')
      .eq('household_id', household.id).eq('status', 'submitted')
      .order('submitted_at')
    setChores((data ?? []) as Chore[])
    setLoading(false)
  }
  useEffect(() => { setLoading(true); load() }, [household])

  async function act(fn: 'approve_chore' | 'reject_chore', c: Chore) {
    setBusy(c.id)
    const args: Record<string, unknown> = { p_chore: c.id }
    if (fn === 'reject_chore') {
      args.p_apply_penalty = c.penalty_points > 0 && confirm(`Dra av ${c.penalty_points} poäng som avdrag?`)
      args.p_reason = null
    }
    await supabase.rpc(fn, args)
    setBusy(null)
    await load()
  }

  if (loading) return <Spinner />

  return (
    <div className="space-y-4">
      <h1 className="font-display font-extrabold text-2xl text-blck">Att godkänna ✅</h1>
      {chores.length === 0 ? (
        <EmptyState emoji="🎉" title="Inget att godkänna" hint="Alla sysslor är hanterade." />
      ) : (
        <div className="space-y-3">
          {chores.map(c => {
            const m = members.find(x => x.user_id === c.claimed_by)
            return (
              <Card key={c.id}>
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-display font-bold text-blck">{c.title}</p>
                    <div className="flex items-center gap-1.5 text-xs text-blck/50 mt-1">
                      {m && <Avatar size="sm" first={m.profile.first_name} last={m.profile.last_name} id={m.user_id} />}
                      {m?.profile.first_name} · inlämnad {fmtDateTime(c.submitted_at)}
                    </div>
                  </div>
                  <PointPill points={c.points} />
                </div>
                {c.proof_image_url && <img src={c.proof_image_url} alt="Bevis" className="rounded-xl mt-3 max-h-56 w-full object-cover" />}
                {c.completion_comment && <p className="text-sm mt-2 bg-blck/5 rounded-xl px-3 py-2">💬 {c.completion_comment}</p>}
                <div className="flex gap-2 mt-3">
                  <Button disabled={busy === c.id} onClick={() => act('approve_chore', c)}>👍 Godkänn</Button>
                  <Button variant="danger" disabled={busy === c.id} onClick={() => act('reject_chore', c)}>👎 Avvisa</Button>
                </div>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
