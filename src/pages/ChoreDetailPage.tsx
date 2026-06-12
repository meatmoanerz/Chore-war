import { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useApp } from '../context/AppContext'
import type { Chore, ChoreComment } from '../lib/types'
import { fmtDateTime, fmtMinutes, recurrenceLabel } from '../lib/utils'
import { Avatar, Button, Card, PointPill, Spinner, StatusChip, inputCls } from '../components/ui'

async function uploadImage(file: File, prefix: string): Promise<string> {
  const ext = file.name.split('.').pop() || 'jpg'
  const path = `${prefix}/${Date.now()}.${ext}`
  const { error } = await supabase.storage.from('chore-images').upload(path, file, { upsert: false })
  if (error) throw error
  return supabase.storage.from('chore-images').getPublicUrl(path).data.publicUrl
}

export default function ChoreDetailPage() {
  const { id } = useParams()
  const nav = useNavigate()
  const { members, role, session, refreshUnread } = useApp()
  const [chore, setChore] = useState<Chore | null>(null)
  const [comments, setComments] = useState<ChoreComment[]>([])
  const [newComment, setNewComment] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [submitOpen, setSubmitOpen] = useState(false)
  const [submitComment, setSubmitComment] = useState('')
  const proofRef = useRef<HTMLInputElement>(null)
  const commentImgRef = useRef<HTMLInputElement>(null)

  async function load() {
    const [{ data: c }, { data: cm }] = await Promise.all([
      supabase.from('chores').select('*').eq('id', id).single(),
      supabase.from('chore_comments').select('*').eq('chore_id', id).order('created_at'),
    ])
    setChore(c as Chore | null)
    setComments((cm ?? []) as ChoreComment[])
  }
  useEffect(() => { load() }, [id])

  if (!chore) return <Spinner />

  const me = session!.user.id
  const memberOf = (uid: string | null) => members.find(m => m.user_id === uid)
  const isMine = chore.claimed_by === me
  const canClaim = chore.status === 'open' && (!chore.assigned_to || chore.assigned_to === me)
    && (!chore.expires_at || new Date(chore.expires_at) > new Date())

  async function rpc(fn: string, args: Record<string, unknown> = {}) {
    setBusy(true); setError('')
    const { error } = await supabase.rpc(fn, { p_chore: chore!.id, ...args })
    setBusy(false)
    if (error) { setError(error.message); return false }
    await load(); refreshUnread()
    return true
  }

  async function handleSubmit() {
    setBusy(true); setError('')
    try {
      let proofUrl: string | null = null
      const file = proofRef.current?.files?.[0]
      if (file) proofUrl = await uploadImage(file, chore!.id)
      const { error } = await supabase.rpc('submit_chore', {
        p_chore: chore!.id, p_proof_url: proofUrl, p_comment: submitComment || null,
      })
      if (error) throw error
      setSubmitOpen(false); setSubmitComment('')
      await load()
    } catch (e: any) { setError(e.message) } finally { setBusy(false) }
  }

  async function postComment() {
    if (!newComment.trim() && !commentImgRef.current?.files?.[0]) return
    setBusy(true); setError('')
    try {
      let imageUrl: string | null = null
      const file = commentImgRef.current?.files?.[0]
      if (file) imageUrl = await uploadImage(file, chore!.id + '/comments')
      const { error } = await supabase.from('chore_comments').insert({
        chore_id: chore!.id, user_id: me, content: newComment.trim(), image_url: imageUrl,
      })
      if (error) throw error
      setNewComment('')
      if (commentImgRef.current) commentImgRef.current.value = ''
      await load()
    } catch (e: any) { setError(e.message) } finally { setBusy(false) }
  }

  async function deleteChore() {
    if (!confirm('Ta bort sysslan permanent?')) return
    await supabase.from('chores').delete().eq('id', chore!.id)
    nav('/sysslor')
  }

  async function publishDraft() {
    await supabase.from('chores').update({ status: 'open' }).eq('id', chore!.id)
    await load()
  }

  const assignee = memberOf(chore.assigned_to)
  const claimer = memberOf(chore.claimed_by)

  return (
    <div className="space-y-4">
      <button onClick={() => nav(-1)} className="text-sm font-semibold text-blck/50">← Tillbaka</button>

      <Card>
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-1.5">
              {chore.urgent && <span className="text-hallon">❗</span>}
              <h1 className="font-display font-extrabold text-xl text-blck">{chore.title}</h1>
            </div>
            <div className="mt-1.5"><StatusChip status={chore.status} /></div>
          </div>
          <PointPill points={chore.points} size="lg" />
        </div>

        {chore.description && <p className="text-sm text-blck/70 mt-3 whitespace-pre-wrap">{chore.description}</p>}
        {chore.bonus_text && <p className="text-sm mt-2 bg-sol/15 text-amber-700 rounded-xl px-3 py-2">🎁 Extra: {chore.bonus_text}</p>}

        <div className="grid grid-cols-2 gap-2 mt-4 text-xs text-blck/60">
          {chore.estimated_minutes ? <div>⏱ Beräknad tid: <b>{fmtMinutes(chore.estimated_minutes)}</b></div> : null}
          {chore.deadline && <div>📅 Deadline: <b>{fmtDateTime(chore.deadline)}</b></div>}
          {chore.expires_at && <div>⌛ Försvinner: <b>{fmtDateTime(chore.expires_at)}</b></div>}
          {chore.recurrence && <div>🔁 <b>{recurrenceLabel[chore.recurrence]}</b></div>}
          {chore.penalty_points > 0 && <div>⚠️ Avdrag vid miss: <b>-{chore.penalty_points}p</b></div>}
          {assignee && <div>👤 Tilldelad: <b>{assignee.profile.first_name}</b></div>}
          {claimer && <div>💪 Tagen av: <b>{claimer.profile.first_name}</b></div>}
        </div>

        {chore.proof_image_url && (
          <div className="mt-4">
            <p className="text-xs font-semibold text-blck/50 mb-1">Bevis-bild</p>
            <img src={chore.proof_image_url} alt="Bevis" className="rounded-xl max-h-64 w-full object-cover" />
          </div>
        )}
        {chore.completion_comment && (
          <p className="text-sm mt-3 bg-blck/5 rounded-xl px-3 py-2">💬 {chore.completion_comment}</p>
        )}
      </Card>

      {error && <p className="text-sm text-red-600 bg-red-50 rounded-xl px-3 py-2">{error}</p>}

      {/* Actions */}
      <div className="flex flex-wrap gap-2">
        {canClaim && <Button disabled={busy} onClick={() => rpc('claim_chore')}>💪 Jag tar den!</Button>}
        {isMine && (chore.status === 'claimed' || chore.status === 'paused') && (
          <>
            <Button disabled={busy} onClick={() => setSubmitOpen(true)}>✅ Klar – lämna in</Button>
            {chore.status === 'claimed'
              ? <Button variant="secondary" disabled={busy} onClick={() => rpc('pause_chore')}>⏸ Pausa</Button>
              : <Button variant="secondary" disabled={busy} onClick={() => rpc('resume_chore')}>▶️ Fortsätt</Button>}
            <Button variant="ghost" disabled={busy} onClick={() => rpc('unclaim_chore')}>Släpp sysslan</Button>
          </>
        )}
        {role === 'adult' && chore.status === 'submitted' && (
          <>
            <Button disabled={busy} onClick={() => rpc('approve_chore')}>👍 Godkänn ({chore.points}p)</Button>
            <Button variant="danger" disabled={busy} onClick={() => {
              const penalty = chore.penalty_points > 0 && confirm(`Dra av ${chore.penalty_points} poäng som avdrag?`)
              rpc('reject_chore', { p_apply_penalty: penalty, p_reason: null })
            }}>👎 Avvisa</Button>
          </>
        )}
        {role === 'adult' && chore.status === 'draft' && <Button disabled={busy} onClick={publishDraft}>📣 Publicera</Button>}
        {role === 'adult' && (
          <>
            <Button variant="secondary" onClick={() => nav(`/sysslor/${chore.id}/redigera`)}>✏️ Redigera</Button>
            <Button variant="danger" onClick={deleteChore}>🗑 Ta bort</Button>
          </>
        )}
      </div>

      {/* Submit modal */}
      {submitOpen && (
        <Card className="border-2 border-mynta/40 space-y-3">
          <p className="font-display font-bold text-blck">Lämna in sysslan</p>
          <label className="block text-sm text-blck/60">
            Bevis-bild (valfritt)
            <input ref={proofRef} type="file" accept="image/*" capture="environment" className="block mt-1 text-xs" />
          </label>
          <input className={inputCls} placeholder="Kommentar (valfritt)" value={submitComment} onChange={e => setSubmitComment(e.target.value)} />
          <div className="flex gap-2">
            <Button disabled={busy} onClick={handleSubmit}>{busy ? 'Skickar…' : 'Skicka in'}</Button>
            <Button variant="ghost" onClick={() => setSubmitOpen(false)}>Avbryt</Button>
          </div>
        </Card>
      )}

      {/* Comments */}
      <section>
        <h2 className="font-display font-bold text-lg text-blck mb-2">Kommentarer 💬</h2>
        <div className="space-y-3">
          {comments.map(c => {
            const m = memberOf(c.user_id)
            return (
              <Card key={c.id} className="!p-3">
                <div className="flex items-start gap-2.5">
                  <Avatar size="sm" first={m?.profile.first_name ?? '?'} last={m?.profile.last_name ?? ''} id={c.user_id} />
                  <div className="min-w-0">
                    <p className="text-xs text-blck/50">
                      <b className="text-blck">{m?.profile.first_name ?? 'Okänd'}</b> · {fmtDateTime(c.created_at)}
                    </p>
                    {c.content && <p className="text-sm text-blck mt-0.5 whitespace-pre-wrap">{c.content}</p>}
                    {c.image_url && <img src={c.image_url} alt="" className="rounded-xl mt-2 max-h-48" />}
                  </div>
                </div>
              </Card>
            )
          })}
          {comments.length === 0 && <p className="text-sm text-blck/40">Inga kommentarer ännu.</p>}
        </div>
        <div className="mt-3 space-y-2">
          <input className={inputCls} placeholder="Skriv en kommentar…" value={newComment}
            onChange={e => setNewComment(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && postComment()} />
          <div className="flex items-center justify-between gap-2">
            <input ref={commentImgRef} type="file" accept="image/*" className="text-xs" />
            <Button disabled={busy} onClick={postComment}>Skicka</Button>
          </div>
        </div>
      </section>
    </div>
  )
}
