import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useApp } from '../context/AppContext'
import { Button, Field, inputCls } from '../components/ui'

export default function SetupPage() {
  const { refreshHouseholds, selectHousehold, profile, signOut } = useApp()
  const nav = useNavigate()
  const [tab, setTab] = useState<'create' | 'join'>('create')
  const [name, setName] = useState('')
  const [code, setCode] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  async function run(fn: string, args: Record<string, string>) {
    setError(''); setBusy(true)
    const { data, error } = await supabase.rpc(fn, args)
    setBusy(false)
    if (error) { setError(error.message); return }
    await refreshHouseholds()
    if (data?.id) selectHousehold(data.id)
    nav('/')
  }

  return (
    <div className="min-h-dvh bg-krita flex flex-col items-center justify-center px-6 py-10">
      <div className="text-5xl mb-2" aria-hidden>🏡</div>
      <h1 className="font-display font-extrabold text-2xl text-blck">Hej {profile?.first_name}!</h1>
      <p className="text-blck/50 text-sm mb-8 text-center">Skapa ett hushåll eller gå med i ett befintligt med en kod.</p>

      <div className="w-full max-w-sm bg-white rounded-card shadow-card p-6 space-y-4">
        <div className="grid grid-cols-2 gap-1 rounded-full bg-blck/5 p-1">
          {(['create', 'join'] as const).map(t => (
            <button key={t} type="button" onClick={() => { setTab(t); setError('') }}
              className={`rounded-full py-2 text-sm font-display font-bold transition-colors ${tab === t ? 'bg-white shadow-card text-blck' : 'text-blck/50'}`}>
              {t === 'create' ? 'Skapa hushåll' : 'Gå med'}
            </button>
          ))}
        </div>

        {tab === 'create' ? (
          <>
            <Field label="Hushållets namn">
              <input className={inputCls} value={name} onChange={e => setName(e.target.value)} placeholder="t.ex. Familjen Andersson" />
            </Field>
            <Button full disabled={busy || !name.trim()} onClick={() => run('create_household', { p_name: name.trim() })}>
              {busy ? 'Skapar…' : 'Skapa hushåll'}
            </Button>
            <p className="text-xs text-blck/40">Du blir vuxen/admin och får två inbjudningskoder – en för vuxna och en för barn.</p>
          </>
        ) : (
          <>
            <Field label="Inbjudningskod">
              <input className={inputCls + ' uppercase tracking-wider'} value={code} onChange={e => setCode(e.target.value)} placeholder="VUXEN-XXXXXX eller BARN-XXXXXX" />
            </Field>
            <Button full disabled={busy || !code.trim()} onClick={() => run('join_household', { p_code: code.trim() })}>
              {busy ? 'Går med…' : 'Gå med i hushåll'}
            </Button>
            <p className="text-xs text-blck/40">Koden avgör om du blir vuxen eller barn i hushållet.</p>
          </>
        )}

        {error && <p className="text-sm text-red-600 bg-red-50 rounded-xl px-3 py-2">{error}</p>}
      </div>

      <button onClick={signOut} className="mt-6 text-sm text-blck/40 underline">Logga ut</button>
    </div>
  )
}
