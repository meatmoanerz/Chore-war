import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useApp } from '../context/AppContext'
import type { PointTx } from '../lib/types'
import { fmtDateTime } from '../lib/utils'
import { Avatar, Button, Card, Field, Spinner, inputCls } from '../components/ui'

export default function MorePage() {
  const { household, households, members, role, session, profile, selectHousehold, refreshHouseholds, signOut } = useApp()
  const nav = useNavigate()
  const [txs, setTxs] = useState<PointTx[]>([])
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState('')

  // adjust points form
  const [adjUser, setAdjUser] = useState('')
  const [adjAmount, setAdjAmount] = useState(0)
  const [adjReason, setAdjReason] = useState('')
  const [adjBusy, setAdjBusy] = useState(false)
  const [adjMsg, setAdjMsg] = useState('')

  async function load() {
    if (!household) return
    const { data } = await supabase.from('point_transactions').select('*')
      .eq('household_id', household.id).order('created_at', { ascending: false }).limit(50)
    setTxs((data ?? []) as PointTx[])
    setLoading(false)
  }
  useEffect(() => { setLoading(true); load() }, [household])

  function copy(code: string) {
    navigator.clipboard?.writeText(code)
    setCopied(code)
    setTimeout(() => setCopied(''), 1500)
  }

  async function adjust() {
    if (!adjUser || !adjAmount) { setAdjMsg('Välj person och ange poäng (kan vara minus).'); return }
    setAdjBusy(true); setAdjMsg('')
    const { error } = await supabase.rpc('adjust_points', {
      p_household: household!.id, p_user: adjUser, p_amount: adjAmount, p_reason: adjReason.trim() || 'Manuell justering',
    })
    setAdjBusy(false)
    if (error) { setAdjMsg(error.message); return }
    setAdjMsg('Poäng justerade! ✅'); setAdjAmount(0); setAdjReason('')
    await load()
  }

  async function leaveHousehold() {
    if (!confirm(`Lämna ${household?.name}? Dina poäng i hushållet försvinner.`)) return
    await supabase.from('household_members').delete()
      .eq('household_id', household!.id).eq('user_id', session!.user.id)
    localStorage.removeItem('cw_household')
    await refreshHouseholds()
    nav('/')
  }

  if (!household) return null
  if (loading) return <Spinner />

  const nameOf = (uid: string) => members.find(m => m.user_id === uid)?.profile.first_name ?? 'Okänd'

  return (
    <div className="space-y-5">
      <h1 className="font-display font-extrabold text-2xl text-blck">Mer ⚙️</h1>

      {/* Profile */}
      <Card className="flex items-center gap-3">
        <Avatar size="lg" first={profile?.first_name ?? '?'} last={profile?.last_name ?? ''} id={session!.user.id} />
        <div>
          <p className="font-display font-bold text-blck">{profile?.first_name} {profile?.last_name}</p>
          <p className="text-xs text-blck/50">{session?.user.email} · {role === 'adult' ? 'Vuxen' : 'Barn'}</p>
        </div>
      </Card>

      {/* Household switcher */}
      {households.length > 1 && (
        <Card>
          <p className="font-display font-bold text-blck mb-2">Byt hushåll 🏡</p>
          <div className="space-y-1.5">
            {households.map(h => (
              <button key={h.id} onClick={() => selectHousehold(h.id)}
                className={`w-full text-left rounded-xl px-3 py-2 text-sm font-semibold ${
                  h.id === household.id ? 'bg-hallon/10 text-hallon' : 'bg-blck/5 text-blck'
                }`}>
                {h.name} {h.id === household.id && '✓'}
              </button>
            ))}
          </div>
        </Card>
      )}

      {/* Members */}
      <Card>
        <p className="font-display font-bold text-blck mb-3">Familjen 👨‍👩‍👧‍👦</p>
        <div className="space-y-2.5">
          {members.map(m => (
            <div key={m.id} className="flex items-center gap-2.5">
              <Avatar size="sm" first={m.profile.first_name} last={m.profile.last_name} id={m.user_id} />
              <span className="text-sm font-semibold text-blck flex-1">{m.profile.first_name} {m.profile.last_name}</span>
              <span className="text-xs text-blck/40">{m.role === 'adult' ? 'Vuxen' : 'Barn'}</span>
            </div>
          ))}
        </div>
      </Card>

      {/* Invite codes (adult only) */}
      {role === 'adult' && (
        <Card>
          <p className="font-display font-bold text-blck mb-1">Bjud in 💌</p>
          <p className="text-xs text-blck/50 mb-3">Dela rätt kod – den avgör rollen i hushållet.</p>
          {([['Vuxen-kod', household.adult_code], ['Barn-kod', household.child_code]] as const).map(([label, code]) => (
            <button key={code} onClick={() => copy(code)}
              className="w-full flex items-center justify-between rounded-xl bg-blck/5 px-3 py-2.5 mb-2 text-left">
              <div>
                <p className="text-xs text-blck/50">{label}</p>
                <p className="font-mono font-bold text-blck tracking-wider">{code}</p>
              </div>
              <span className="text-xs font-semibold text-hallon">{copied === code ? 'Kopierad ✓' : 'Kopiera'}</span>
            </button>
          ))}
        </Card>
      )}

      {/* Adjust points (adult only) */}
      {role === 'adult' && (
        <Card className="space-y-3">
          <p className="font-display font-bold text-blck">Justera poäng ⚡</p>
          <Field label="Person">
            <select className={inputCls} value={adjUser} onChange={e => setAdjUser(e.target.value)}>
              <option value="">Välj…</option>
              {members.map(m => <option key={m.user_id} value={m.user_id}>{m.profile.first_name}</option>)}
            </select>
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Poäng (+/-)">
              <input className={inputCls} type="number" value={adjAmount || ''} onChange={e => setAdjAmount(Number(e.target.value))} placeholder="t.ex. 50 eller -20" />
            </Field>
            <Field label="Anledning">
              <input className={inputCls} value={adjReason} onChange={e => setAdjReason(e.target.value)} placeholder="t.ex. Extra hjälpsam" />
            </Field>
          </div>
          {adjMsg && <p className="text-sm text-blck/60">{adjMsg}</p>}
          <Button disabled={adjBusy} onClick={adjust}>Justera</Button>
        </Card>
      )}

      {/* Point history */}
      <Card>
        <p className="font-display font-bold text-blck mb-3">Poänghistorik 📜</p>
        {txs.length === 0 ? (
          <p className="text-sm text-blck/40">Inga poäng utdelade ännu.</p>
        ) : (
          <div className="space-y-2.5">
            {txs.map(t => (
              <div key={t.id} className="flex items-start justify-between gap-2 text-sm">
                <div className="min-w-0">
                  <p className="text-blck font-semibold truncate">{nameOf(t.user_id)} · <span className="font-normal text-blck/60">{t.reason}</span></p>
                  <p className="text-xs text-blck/40">{fmtDateTime(t.created_at)}</p>
                </div>
                <span className={`font-display font-bold shrink-0 ${t.amount >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                  {t.amount >= 0 ? '+' : ''}{t.amount}p
                </span>
              </div>
            ))}
          </div>
        )}
      </Card>

      <div className="space-y-2">
        <Button variant="secondary" full onClick={() => nav('/setup')}>+ Skapa eller gå med i annat hushåll</Button>
        <Button variant="danger" full onClick={leaveHousehold}>Lämna hushållet</Button>
        <Button variant="ghost" full onClick={signOut}>Logga ut</Button>
      </div>
    </div>
  )
}
