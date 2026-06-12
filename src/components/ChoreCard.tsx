import { useNavigate } from 'react-router-dom'
import type { Chore, Member } from '../lib/types'
import { fmtDateTime, fmtMinutes, recurrenceLabel } from '../lib/utils'
import { Card, PointPill, StatusChip, Avatar } from './ui'

export function ChoreCard({ chore, members }: { chore: Chore; members: Member[] }) {
  const nav = useNavigate()
  const assignee = members.find(m => m.user_id === chore.assigned_to)
  const claimer = members.find(m => m.user_id === chore.claimed_by)

  return (
    <Card onClick={() => nav(`/sysslor/${chore.id}`)}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap">
            {chore.urgent && <span title="Brådskande" className="text-hallon font-bold">❗</span>}
            <span className="font-display font-bold text-blck truncate">{chore.title}</span>
          </div>
          <div className="flex items-center gap-2 mt-1 flex-wrap text-xs text-blck/50">
            <StatusChip status={chore.status} />
            {chore.estimated_minutes ? <span>⏱ {fmtMinutes(chore.estimated_minutes)}</span> : null}
            {chore.deadline && <span>📅 {fmtDateTime(chore.deadline)}</span>}
            {chore.recurrence && <span>🔁 {recurrenceLabel[chore.recurrence]}</span>}
          </div>
          {(assignee || claimer) && (
            <div className="flex items-center gap-1.5 mt-2 text-xs text-blck/50">
              {claimer ? (
                <><Avatar size="sm" first={claimer.profile.first_name} last={claimer.profile.last_name} id={claimer.user_id} /> {claimer.profile.first_name}</>
              ) : assignee ? (
                <><Avatar size="sm" first={assignee.profile.first_name} last={assignee.profile.last_name} id={assignee.user_id} /> Tilldelad {assignee.profile.first_name}</>
              ) : null}
            </div>
          )}
        </div>
        <PointPill points={chore.points} />
      </div>
    </Card>
  )
}
