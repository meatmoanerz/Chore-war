export interface Profile {
  id: string;
  user_id: string;
  name: string;
  avatar_emoji: string;
  created_at: string;
  updated_at: string;
}

export interface Household {
  id: string;
  name: string;
  invite_code: string;
  created_by: string | null;
  created_at: string;
}

export interface HouseholdMember {
  id: string;
  household_id: string;
  user_id: string;
  role: 'admin' | 'member' | 'child';
  joined_at: string;
  // Joined data
  profile?: Profile;
}

export interface Chore {
  id: string;
  household_id: string;
  title: string;
  description: string | null;
  points: number;
  estimated_minutes: number;
  is_recurring: boolean;
  recurrence_pattern: 'daily' | 'weekly' | 'monthly' | null;
  created_by: string | null;
  created_at: string;
}

export interface ChoreCompletion {
  id: string;
  chore_id: string;
  user_id: string;
  household_id: string;
  points_earned: number;
  completed_at: string;
  // Joined data
  chore?: Chore;
  profile?: Profile;
}

export interface Goal {
  id: string;
  household_id: string;
  user_id: string | null;
  title: string;
  target_points: number;
  reward: string | null;
  is_family_goal: boolean;
  is_completed: boolean;
  created_at: string;
}

export interface UserWithProfile {
  id: string;
  email: string;
  profile: Profile | null;
  household_member: HouseholdMember | null;
}
