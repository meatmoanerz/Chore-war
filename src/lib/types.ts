export type Role = 'adult' | 'child'

export type ChoreStatus =
  | 'draft' | 'open' | 'claimed' | 'paused'
  | 'submitted' | 'approved' | 'rejected' | 'expired'

export interface Profile {
  id: string
  first_name: string
  last_name: string
}

export interface Household {
  id: string
  name: string
  adult_code: string
  child_code: string
}

export interface Member {
  id: string
  household_id: string
  user_id: string
  role: Role
  profile: Profile
}

export interface Chore {
  id: string
  household_id: string
  title: string
  description: string | null
  points: number
  penalty_points: number
  bonus_text: string | null
  estimated_minutes: number | null
  deadline: string | null
  expires_at: string | null
  urgent: boolean
  assigned_to: string | null
  status: ChoreStatus
  claimed_by: string | null
  claimed_at: string | null
  submitted_at: string | null
  approved_at: string | null
  proof_image_url: string | null
  completion_comment: string | null
  recurrence: 'daily' | 'weekly' | 'biweekly' | 'monthly' | null
  created_by: string | null
  created_at: string
}

export interface ChoreComment {
  id: string
  chore_id: string
  user_id: string
  content: string
  image_url: string | null
  created_at: string
}

export interface PointTx {
  id: string
  household_id: string
  user_id: string
  chore_id: string | null
  amount: number
  reason: string
  created_at: string
}

export interface Goal {
  id: string
  household_id: string
  kind: 'individual' | 'shared'
  user_id: string | null
  title: string
  target_points: number
  reward: string
  period_start: string
  period_end: string
}

export interface Notification {
  id: string
  type: string
  message: string
  chore_id: string | null
  read: boolean
  created_at: string
}

export interface ChoreTemplate {
  id: string
  household_id: string | null
  title: string
  description: string | null
  points: number
  estimated_minutes: number | null
}
