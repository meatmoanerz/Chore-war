import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useApp } from '../context/AppContext'
import type { Chore, ChoreTemplate } from '../lib/types'
import { Button, Card, Field, inputCls } from '../components/ui'

export default function ChoreFormPage() {
  const { id } = useParams()
  const editing = Boolean(id)
  const nav = useNavigate()
  const { household, members, session } = useApp()
  const children = members.filter(m => m.role === 'child')

  const [templates, setTemplates] = useState<ChoreTemplate[]>([])
  const [showTemplates, setShowTemplates] = useState(!editing)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [points, setPoints] = useState(50)
  const [penalty, setPenalty] = useState(0)
  const [bonus, setBonus] = useState('')
  const [minutes, setMinutes] = useState<number | ''>('')
  const [deadline, setDeadline] = useState('')
  const [expires, setExpires] = useState('')
  const [urgent, setUrgent] = useState(false)
  const [assignedTo, setAssignedTo] = useState('')
  const [recurrence, setRecurrence] = useState('')
  const [saveAsTemplate, setSaveAsTemplate] = useState(false)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    supabase.from('chore_templates').select('*')
      .or(`household_id.is.null,household_id.eq.${household?.id}`)
      .order('title')
      .then(({ data }) => setTemplates((data ?? []) as ChoreTemplate[]))
  }, [household])

  useEffect(() => {
    if (!editing) return
    supabase.from('chores').select('*').eq('id', id).single().then(({ data }) => {
      const c = data as Chore | null
      if (!c) return
      setTitle(c.title); setDescription(c.description ?? ''); setPoints(c.points)
      setPenalty(c.penalty_points); setBonus(c.bonus_text ?? '')
      setMinutes(c.estimated_minutes ?? '')
      setDeadline(c.deadline ? c.deadline.slice(0, 16) : '')
      setExpires(c.expires_at ? c.expires_at.slice(0, 16) : '')
      setUrgent(c.urgent); setAssignedTo(c.assigned_to ?? ''); setRecurrence(c.recurrence ?? '')
    })
  }, [id, editing])

  function applyTemplate(t: ChoreTemplate) {
    setTitle(t.title); setDescription(t.description ?? ''); setPoints(t.points)
    setMinutes(t.estimated_minutes ?? ''); setShowTemplates(false)
  }

  async function save(status: 'open' | 'draft') {
    if (!household || !title.trim()) { setError('Ange en titel.'); return }
    setBusy(true); setError('')
    const payload = {
      household_id: household.id,
      title: title.trim(),
      description: description.trim() || null,
      points,
      penalty_points: penalty,
      bonus_text: bonus.trim() || null,
      estimated_minutes: minutes === '' ? null : Number(minutes),
      deadline: deadline ? new Date(deadline).toISOString() : null,
      expires_at: expires ? new Date(expires).toISOString() : null,
      urgent,
      assigned_to: assignedTo || null,
      recurrence: recurrence || null,
    }
    try {
      if (editing) {
        const { error } = await supabase.from('chores').update(payload).eq('id', id)
        if (error) throw error
      } else {
        const { error } = await supabase.from('chores')
          .insert({ ...payload, status, created_by: session!.user.id })
        if (error) throw error
        if (saveAsTemplate) {
          await supabase.from('chore_templates').insert({
            household_id: household.id, title: payload.title, description: payload.description,
            points, estimated_minutes: payload.estimated_minutes, created_by: session!.user.id,
          })
        }
      }
      nav('/sysslor')
    } catch (e: any) { setError(e.message); setBusy(false) }
  }

  return (
    <div className="space-y-4">
      <button onClick={() => nav(-1)} className="text-sm font-semibold text-blck/50">← Tillbaka</button>
      <h1 className="font-display font-extrabold text-2xl text-blck">{editing ? 'Redigera syssla' : 'Ny syssla'}</h1>

      {showTemplates && templates.length > 0 && (
        <Card>
          <p className="font-display font-bold text-blck mb-2">Snabbstart från mall 🪄</p>
          <div className="flex flex-wrap gap-2">
            {templates.map(t => (
              <button key={t.id} onClick={() => applyTemplate(t)}
                className="rounded-full bg-blck/5 hover:bg-blck/10 px-3 py-1.5 text-xs font-semibold text-blck">
                {t.title} · {t.points}p
              </button>
            ))}
          </div>
          <button onClick={() => setShowTemplates(false)} className="text-xs text-blck/40 underline mt-3">Hoppa över, börja från noll</button>
        </Card>
      )}

      <Card className="space-y-4">
        <Field label="Titel *">
          <input className={inputCls} value={title} onChange={e => setTitle(e.target.value)} placeholder="t.ex. Dammsuga vardagsrummet" />
        </Field>
        <Field label="Beskrivning">
          <textarea className={inputCls} rows={3} value={description} onChange={e => setDescription(e.target.value)} placeholder="Hur ska det se ut när det är klart?" />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Poäng ⚡">
            <input className={inputCls} type="number" min={0} value={points} onChange={e => setPoints(Number(e.target.value))} />
          </Field>
          <Field label="Avdrag vid miss">
            <input className={inputCls} type="number" min={0} value={penalty} onChange={e => setPenalty(Number(e.target.value))} />
          </Field>
        </div>
        <Field label="Extra belöning (fritext)">
          <input className={inputCls} value={bonus} onChange={e => setBonus(e.target.value)} placeholder="t.ex. Får välja fredagsmys-film" />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Beräknad tid (min)">
            <input className={inputCls} type="number" min={0} value={minutes} onChange={e => setMinutes(e.target.value === '' ? '' : Number(e.target.value))} />
          </Field>
          <Field label="Tilldela barn">
            <select className={inputCls} value={assignedTo} onChange={e => setAssignedTo(e.target.value)}>
              <option value="">Öppen för alla</option>
              {children.map(c => <option key={c.user_id} value={c.user_id}>{c.profile.first_name}</option>)}
            </select>
          </Field>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Deadline">
            <input className={inputCls} type="datetime-local" value={deadline} onChange={e => setDeadline(e.target.value)} />
          </Field>
          <Field label="Försvinner (om ej tagen)">
            <input className={inputCls} type="datetime-local" value={expires} onChange={e => setExpires(e.target.value)} />
          </Field>
        </div>
        <Field label="Återkommande">
          <select className={inputCls} value={recurrence} onChange={e => setRecurrence(e.target.value)}>
            <option value="">Nej, engångssyssla</option>
            <option value="daily">Varje dag</option>
            <option value="weekly">Varje vecka</option>
            <option value="biweekly">Varannan vecka</option>
            <option value="monthly">Varje månad</option>
          </select>
        </Field>
        <label className="flex items-center gap-2 text-sm font-semibold text-blck/70">
          <input type="checkbox" checked={urgent} onChange={e => setUrgent(e.target.checked)} className="w-4 h-4 accent-hallon" />
          ❗ Markera som brådskande
        </label>
        {!editing && (
          <label className="flex items-center gap-2 text-sm font-semibold text-blck/70">
            <input type="checkbox" checked={saveAsTemplate} onChange={e => setSaveAsTemplate(e.target.checked)} className="w-4 h-4 accent-hallon" />
            🪄 Spara även som mall
          </label>
        )}
      </Card>

      {error && <p className="text-sm text-red-600 bg-red-50 rounded-xl px-3 py-2">{error}</p>}

      <div className="flex gap-2">
        <Button disabled={busy} onClick={() => save('open')} full>{editing ? 'Spara ändringar' : '📣 Publicera'}</Button>
        {!editing && <Button variant="secondary" disabled={busy} onClick={() => save('draft')}>Spara utkast</Button>}
      </div>
    </div>
  )
}
