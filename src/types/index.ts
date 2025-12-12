// Core types for Chore War

export type UserRole = 'owner' | 'admin' | 'parent' | 'child';

export type ChoreStatus =
  | 'draft'
  | 'published'
  | 'claimed'
  | 'paused'
  | 'completed'
  | 'approved'
  | 'expired';

export type ChorePriority = 'normal' | 'high' | 'urgent';

export type ChoreDifficulty = 'easy' | 'medium' | 'hard';

export type GoalPeriod = 'week' | 'month' | 'year' | 'custom';

export type GoalType = 'individual' | 'collective';

export type GoalStatus = 'active' | 'completed' | 'failed' | 'archived';

export type NotificationType =
  | 'chore_claimed'
  | 'chore_completed'
  | 'chore_paused'
  | 'chore_approved'
  | 'goal_achieved'
  | 'chore_overdue';

export type NotificationLevel = 'all' | 'personal' | 'none';

// User & Household
export interface User {
  id: string;
  email?: string;
  role: UserRole;
  displayName: string;
  avatarUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ChildProfile {
  id: string;
  householdId: string;
  displayName: string;
  avatarUrl?: string;
  pinCode?: string;  // hashed
  inviteCode?: string;
  createdBy: string;
  createdAt: string;
}

export interface Household {
  id: string;
  name: string;
  avatarUrl?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface HouseholdMember {
  id: string;
  householdId: string;
  userId: string;
  role: UserRole;
  joinedAt: string;
}

// Chores
export interface Chore {
  id: string;
  householdId: string;
  title: string;
  description?: string;
  points: number;
  extraReward?: string;
  estimatedDurationMinutes?: number;
  deadline?: string;
  expiresAt?: string;
  priority: ChorePriority;
  status: ChoreStatus;
  isRecurring: boolean;
  recurrencePattern?: RecurrencePattern;
  category?: string;
  difficulty?: ChoreDifficulty;
  penaltyPoints?: number;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface RecurrencePattern {
  frequency: 'daily' | 'weekly' | 'monthly';
  interval?: number;  // every X days/weeks/months
  daysOfWeek?: number[];  // 0-6 (Sunday-Saturday)
  dayOfMonth?: number;  // 1-31
}

export interface ChoreAssignment {
  id: string;
  choreId: string;
  assignedTo: string;  // user or child profile id
  assignedBy: string;
  isVisibleToOthers: boolean;
  assignedAt: string;
}

export interface ChoreInstance {
  id: string;
  choreId: string;
  householdId: string;
  status: ChoreStatus;
  claimedBy?: string;
  claimedAt?: string;
  pausedAt?: string;
  completedAt?: string;
  approvedAt?: string;
  approvedBy?: string;
  penaltyApplied: boolean;
  createdAt: string;
}

export interface ChoreComment {
  id: string;
  choreInstanceId: string;
  userId: string;
  comment: string;
  imageUrl?: string;
  createdAt: string;
}

export interface ChoreTemplate {
  id: string;
  householdId?: string;
  isGlobal: boolean;
  title: string;
  description?: string;
  points: number;
  estimatedDurationMinutes?: number;
  category?: string;
  difficulty?: ChoreDifficulty;
  createdBy?: string;
  createdAt: string;
}

// Points
export interface PointsAccount {
  id: string;
  householdId: string;
  userId: string;
  totalPoints: number;
  weeklyPoints: number;
  monthlyPoints: number;
  yearlyPoints: number;
  lastWeeklyReset?: string;
  lastMonthlyReset?: string;
  lastYearlyReset?: string;
  createdAt: string;
}

export interface PointsTransaction {
  id: string;
  accountId: string;
  amount: number;
  type: 'chore_completed' | 'manual_adjustment' | 'penalty' | 'bonus';
  description?: string;
  choreInstanceId?: string;
  createdBy?: string;
  createdAt: string;
}

// Goals
export interface Goal {
  id: string;
  householdId: string;
  title: string;
  description?: string;
  targetPoints: number;
  period: GoalPeriod;
  periodStart: string;
  periodEnd: string;
  isRecurring: boolean;
  type: GoalType;
  rewardText?: string;
  status: GoalStatus;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface GoalAssignment {
  id: string;
  goalId: string;
  userId: string;
  targetPoints?: number;  // override goal's target for this user
  achieved: boolean;
  achievedAt?: string;
}

export interface GoalProgress {
  id: string;
  goalId: string;
  userId?: string;  // null for collective goals
  date: string;
  pointsAtDate: number;
  createdAt: string;
}

// Notifications
export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  data?: Record<string, unknown>;
  isRead: boolean;
  createdAt: string;
}

// Settings
export interface HouseholdSettings {
  id: string;
  householdId: string;
  showLeaderboardToChildren: boolean;
  childrenCanSeeOthersPoints: boolean;
  childrenCanSeeOthersChores: boolean;
  commentsEnabled: boolean;
  language: string;
  createdAt: string;
  updatedAt: string;
}

export interface NotificationPreferences {
  id: string;
  userId: string;
  householdId: string;
  level: NotificationLevel;
  createdAt: string;
}
