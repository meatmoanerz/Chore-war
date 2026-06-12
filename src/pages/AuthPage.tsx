import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { Button, Field, inputCls } from '../components/ui'

export default function AuthPage() {
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [info, setInfo] = useState('')
  const [busy, setBusy] = useState(false)

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setError(''); setInfo(''); setBusy(true)
    try {
      if (mode === 'register') {
        if (!firstName.trim() || !lastName.trim()) throw new Error('Fyll i för- och efternamn.')
        const { data, error } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: { data: { first_name: firstName.trim(), last_name: lastName.trim() } },
        })
        if (error) throw error
        if (!data.session) {
          setInfo('Konto skapat! Kolla din mejl och bekräfta adressen, logga sedan in.')
          setMode('login')
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password })
        if (error) throw error
      }
    } catch (err: any) {
      const msg = err?.message ?? 'Något gick fel'
      setError(
        msg.includes('Invalid login') ? 'Fel mejl eller lösenord.'
        : msg.includes('already registered') ? 'Mejladressen är redan registrerad.'
        : msg.includes('at least 6') ? 'Lösenordet måste vara minst 6 tecken.'
        : msg
      )
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="min-h-dvh bg-krita flex flex-col items-center justify-center px-6 py-10">
      <div className="text-6xl mb-2" aria-hidden>⚡</div>
      <h1 className="font-display font-extrabold text-3xl text-blck">Chore War</h1>
      <p className="text-blck/50 text-sm mb-8">Gör sysslor roliga för hela familjen</p>

      <form onSubmit={submit} className="w-full max-w-sm bg-white rounded-card shadow-card p-6 space-y-4">
        <div className="grid grid-cols-2 gap-1 rounded-full bg-blck/5 p-1">
          {(['login', 'register'] as const).map(m => (
            <button
              key={m} type="button"
              onClick={() => { setMode(m); setError(''); setInfo('') }}
              className={`rounded-full py-2 text-sm font-display font-bold transition-colors ${
                mode === m ? 'bg-white shadow-card text-blck' : 'text-blck/50'
              }`}
            >
              {m === 'login' ? 'Logga in' : 'Skapa konto'}
            </button>
          ))}
        </div>

        {mode === 'register' && (
          <div className="grid grid-cols-2 gap-3">
            <Field label="Förnamn">
              <input className={inputCls} value={firstName} onChange={e => setFirstName(e.target.value)} required autoComplete="given-name" />
            </Field>
            <Field label="Efternamn">
              <input className={inputCls} value={lastName} onChange={e => setLastName(e.target.value)} required autoComplete="family-name" />
            </Field>
          </div>
        )}

        <Field label="Mejladress">
          <input className={inputCls} type="email" value={email} onChange={e => setEmail(e.target.value)} required autoComplete="email" />
        </Field>
        <Field label="Lösenord">
          <input className={inputCls} type="password" value={password} onChange={e => setPassword(e.target.value)} required minLength={6} autoComplete={mode === 'login' ? 'current-password' : 'new-password'} />
        </Field>

        {error && <p className="text-sm text-red-600 bg-red-50 rounded-xl px-3 py-2">{error}</p>}
        {info && <p className="text-sm text-emerald-700 bg-emerald-50 rounded-xl px-3 py-2">{info}</p>}

        <Button type="submit" full disabled={busy}>
          {busy ? 'Vänta…' : mode === 'login' ? 'Logga in' : 'Skapa konto'}
        </Button>
      </form>
    </div>
  )
}
