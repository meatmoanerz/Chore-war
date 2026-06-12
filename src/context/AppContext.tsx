import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from 'react'
import type { Session } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'
import type { Household, Member, Profile, Role } from '../lib/types'

interface AppState {
  session: Session | null
  profile: Profile | null
  households: Household[]
  household: Household | null
  members: Member[]
  role: Role | null
  unread: number
  loading: boolean
  selectHousehold: (id: string) => void
  refreshHouseholds: () => Promise<void>
  refreshUnread: () => Promise<void>
  signOut: () => Promise<void>
}

const Ctx = createContext<AppState>(null as unknown as AppState)
export const useApp = () => useContext(Ctx)

export function AppProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [households, setHouseholds] = useState<Household[]>([])
  const [householdId, setHouseholdId] = useState<string | null>(() => localStorage.getItem('cw_household'))
  const [members, setMembers] = useState<Member[]>([])
  const [unread, setUnread] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
      if (!data.session) setLoading(false)
    })
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => {
      setSession(s)
      if (!s) {
        setProfile(null); setHouseholds([]); setMembers([]); setUnread(0); setLoading(false)
      }
    })
    return () => sub.subscription.unsubscribe()
  }, [])

  const refreshHouseholds = useCallback(async () => {
    if (!session) return
    const [{ data: prof }, { data: hms }] = await Promise.all([
      supabase.from('profiles').select('*').eq('id', session.user.id).single(),
      supabase.from('household_members').select('household_id, households(*)').eq('user_id', session.user.id),
    ])
    setProfile(prof as Profile | null)
    const hs = (hms ?? []).map((r: any) => r.households as Household).filter(Boolean)
    setHouseholds(hs)
    setHouseholdId(prev => {
      const valid = prev && hs.some(h => h.id === prev) ? prev : (hs[0]?.id ?? null)
      if (valid) localStorage.setItem('cw_household', valid)
      return valid
    })
    setLoading(false)
  }, [session])

  useEffect(() => { if (session) refreshHouseholds() }, [session, refreshHouseholds])

  // load members of selected household
  useEffect(() => {
    if (!householdId) { setMembers([]); return }
    supabase
      .from('household_members')
      .select('id, household_id, user_id, role, profile:profiles(*)')
      .eq('household_id', householdId)
      .then(({ data }) => setMembers((data ?? []) as unknown as Member[]))
  }, [householdId])

  const refreshUnread = useCallback(async () => {
    if (!session || !householdId) { setUnread(0); return }
    const { count } = await supabase
      .from('notifications')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', session.user.id)
      .eq('household_id', householdId)
      .eq('read', false)
    setUnread(count ?? 0)
  }, [session, householdId])

  useEffect(() => { refreshUnread() }, [refreshUnread])

  // realtime: bump unread badge on new notifications
  useEffect(() => {
    if (!session) return
    const ch = supabase
      .channel('notif-' + session.user.id)
      .on('postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'notifications', filter: `user_id=eq.${session.user.id}` },
        () => refreshUnread())
      .subscribe()
    return () => { supabase.removeChannel(ch) }
  }, [session, refreshUnread])

  const household = households.find(h => h.id === householdId) ?? null
  const role: Role | null = members.find(m => m.user_id === session?.user.id)?.role ?? null

  const selectHousehold = (id: string) => {
    localStorage.setItem('cw_household', id)
    setHouseholdId(id)
  }

  const signOut = async () => {
    await supabase.auth.signOut()
    localStorage.removeItem('cw_household')
  }

  return (
    <Ctx.Provider value={{
      session, profile, households, household, members, role, unread, loading,
      selectHousehold, refreshHouseholds, refreshUnread, signOut,
    }}>
      {children}
    </Ctx.Provider>
  )
}
