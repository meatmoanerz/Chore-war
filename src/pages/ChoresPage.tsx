import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useApp } from '../context/AppContext'
import type { Chore } from '../lib/types'
import { Spinner, EmptyState, Button } from '../components/ui'
import { ChoreCard } from '../components/ChoreCard'

type Filter = 'aktiva' | 'lediga' | 'mina' | 'arkiv'

export default function ChoresPage() {
  const { household, members, role, session } = useApp()
  const nav = useNavigate()
  const [chores, setChores] = useState<Chore[]>([])
  const [filter, setFilter] = useState<Filter>('aktiva')
  const [loading, setLoading] = useState(true)

  async function load() {
    if (!household) return
    const { data } = await supabase.from('chores').select('*')
      .eq('household_id', household.id)
      .order('urgent', { ascending: false })
      .order('created_at', { ascending: false })
      .limit(200)
    setChores((data ?? []) as Chore[])
    setLoading(false)
  }

  useEffect(() => { setLoading(true); load() }, [household])

  // realtime refresh on chore changes in this household
  useEffect(() => {
    if (!household) return
    const ch = supabase.channel('chores-' + household.id)
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'chores', filter: `household_id=eq.${household.id}` },
        () => load())
      .subscribe()
    return () => { supabase.removeChannel(ch) }
  }, [household])

  if (loading) return <Spinner />

  const me = session!.user.id
  const filtered = chores.filter(c => {
    switch (filter) {
      case 'aktiva': return ['open', 'claimed', 'paused', 'submitted'].includes(c.status)
      case 'lediga': return c.status === 'open' && (!c.assigned_to || c.assigned_to === me || role === 'adult')
      case 'mina': return c.claimed_by === me || c.assigned_to === me
      case 'arkiv': return ['approved', 'rejected', 'expired', 'draft'].includes(c.status)
    }
  })

  const tabs: { key: Filter; label: string }[] = [
    { key: 'aktiva', label: 'Aktiva' },
    { key: 'lediga', label: 'Lediga' },
    { key: 'mina', label: 'Mina' },
    { key: 'arkiv', label: 'Arkiv' },
  ]

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="font-display font-extrabold text-2xl text-blck">Sysslor</h1>
        {role === 'adult' && <Button onClick={() => nav('/sysslor/ny')}>+ Ny</Button>}
      </div>

      <div className="flex gap-1.5 overflow-x-auto pb-1">
        {tabs.map(t => (
          <button key={t.key} onClick={() => setFilter(t.key)}
            className={`shrink-0 rounded-full px-4 py-1.5 text-sm font-display font-bold transition-colors ${
              filter === t.key ? 'bg-blck text-white' : 'bg-white text-blck/60 shadow-card'
            }`}>
            {t.label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <EmptyState emoji="🧺" title="Inget här ännu"
          hint={role === 'adult' ? 'Skapa en syssla med knappen ovan.' : 'Kolla in igen lite senare.'} />
      ) : (
        <div className="space-y-3">
          {filtered.map(c => <ChoreCard key={c.id} chore={c} members={members} />)}
        </div>
      )}
    </div>
  )
}
