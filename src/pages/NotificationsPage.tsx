import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useApp } from '../context/AppContext'
import type { Notification } from '../lib/types'
import { fmtDateTime } from '../lib/utils'
import { Card, EmptyState, Spinner } from '../components/ui'

const typeEmoji: Record<string, string> = {
  claimed: '💪', submitted: '📬', approved: '🎉', rejected: '👎',
  paused: '⏸', comment: '💬', points_adjusted: '⚡',
}

export default function NotificationsPage() {
  const { household, session, refreshUnread } = useApp()
  const nav = useNavigate()
  const [items, setItems] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!household || !session) return
    supabase.from('notifications').select('*')
      .eq('user_id', session.user.id).eq('household_id', household.id)
      .order('created_at', { ascending: false }).limit(50)
      .then(async ({ data }) => {
        setItems((data ?? []) as Notification[])
        setLoading(false)
        // mark all as read
        await supabase.from('notifications').update({ read: true })
          .eq('user_id', session.user.id).eq('household_id', household.id).eq('read', false)
        refreshUnread()
      })
  }, [household, session])

  if (loading) return <Spinner />

  return (
    <div className="space-y-4">
      <h1 className="font-display font-extrabold text-2xl text-blck">Notiser 🔔</h1>
      {items.length === 0 ? (
        <EmptyState emoji="🔕" title="Inga notiser ännu" hint="Här dyker det upp när något händer i hushållet." />
      ) : (
        <div className="space-y-2.5">
          {items.map(n => (
            <Card key={n.id} className={`!p-3 ${!n.read ? 'border-2 border-hallon/30' : ''}`}
              onClick={n.chore_id ? () => nav(`/sysslor/${n.chore_id}`) : undefined}>
              <div className="flex items-start gap-2.5">
                <span className="text-xl">{typeEmoji[n.type] ?? '🔔'}</span>
                <div>
                  <p className="text-sm text-blck">{n.message}</p>
                  <p className="text-xs text-blck/40 mt-0.5">{fmtDateTime(n.created_at)}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
