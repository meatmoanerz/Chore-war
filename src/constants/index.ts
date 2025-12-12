// Application constants

// Limits
export const MAX_CHILDREN_PER_HOUSEHOLD = 10;
export const MAX_CHORE_TITLE_LENGTH = 100;
export const MAX_CHORE_DESCRIPTION_LENGTH = 500;
export const MAX_COMMENT_LENGTH = 500;
export const MAX_HOUSEHOLD_NAME_LENGTH = 50;
export const MAX_DISPLAY_NAME_LENGTH = 50;

// Durations (in milliseconds)
export const NOTIFICATION_DURATION = 5000;
export const DEBOUNCE_DELAY = 300;

// Breakpoints (matching Tailwind)
export const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
} as const;

// Routes
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  SIGNUP: '/signup',
  DASHBOARD: '/dashboard',
  CHORES: '/chores',
  CHORE_DETAIL: '/chores/:id',
  CREATE_CHORE: '/chores/new',
  GOALS: '/goals',
  LEADERBOARD: '/leaderboard',
  PROFILE: '/profile',
  SETTINGS: '/settings',
  HOUSEHOLD: '/household',
} as const;

// Chore priorities with colors
export const CHORE_PRIORITIES = {
  normal: {
    label: 'Normal',
    color: 'gray',
  },
  high: {
    label: 'Hög',
    color: 'orange',
  },
  urgent: {
    label: 'Brådskande',
    color: 'red',
  },
} as const;

// Chore difficulties with point suggestions
export const CHORE_DIFFICULTIES = {
  easy: {
    label: 'Lätt',
    suggestedPoints: 50,
    color: 'green',
  },
  medium: {
    label: 'Medel',
    suggestedPoints: 100,
    color: 'yellow',
  },
  hard: {
    label: 'Svår',
    suggestedPoints: 200,
    color: 'red',
  },
} as const;

// Goal periods
export const GOAL_PERIODS = {
  week: {
    label: 'Vecka',
    days: 7,
  },
  month: {
    label: 'Månad',
    days: 30,
  },
  year: {
    label: 'År',
    days: 365,
  },
  custom: {
    label: 'Anpassad',
    days: null,
  },
} as const;

// Notification types with Swedish labels
export const NOTIFICATION_TYPES = {
  chore_claimed: 'Syssla claimad',
  chore_completed: 'Syssla slutförd',
  chore_paused: 'Syssla pausad',
  chore_approved: 'Syssla godkänd',
  goal_achieved: 'Mål uppnått',
  chore_overdue: 'Syssla försenad',
} as const;

// Default chore templates (Swedish)
export const DEFAULT_CHORE_TEMPLATES = [
  {
    title: 'Plocka ur diskmaskinen',
    description: 'Tömma diskmaskinen och ställa in disken i skåpen',
    points: 50,
    estimatedDurationMinutes: 10,
    category: 'Kök',
    difficulty: 'easy' as const,
  },
  {
    title: 'Damma',
    description: 'Damma alla ytor i vardagsrummet',
    points: 75,
    estimatedDurationMinutes: 20,
    category: 'Städning',
    difficulty: 'easy' as const,
  },
  {
    title: 'Dammsuga',
    description: 'Dammsuga alla rum i huset',
    points: 100,
    estimatedDurationMinutes: 30,
    category: 'Städning',
    difficulty: 'medium' as const,
  },
  {
    title: 'Ta ut soporna',
    description: 'Samla alla sopor och ta ut dem till soptunnan',
    points: 30,
    estimatedDurationMinutes: 5,
    category: 'Hushåll',
    difficulty: 'easy' as const,
  },
  {
    title: 'Städa ditt rum',
    description: 'Plocka undan, bädda sängen och se till att rummet är snyggt',
    points: 100,
    estimatedDurationMinutes: 30,
    category: 'Städning',
    difficulty: 'medium' as const,
  },
  {
    title: 'Diska för hand',
    description: 'Diska tallrikar, glas och bestick som inte får i diskmaskinen',
    points: 75,
    estimatedDurationMinutes: 15,
    category: 'Kök',
    difficulty: 'medium' as const,
  },
  {
    title: 'Vattna blommorna',
    description: 'Vattna alla växter i huset',
    points: 25,
    estimatedDurationMinutes: 10,
    category: 'Hushåll',
    difficulty: 'easy' as const,
  },
  {
    title: 'Torka av köksytor',
    description: 'Torka av bänkar, spis och diskbänk',
    points: 40,
    estimatedDurationMinutes: 10,
    category: 'Kök',
    difficulty: 'easy' as const,
  },
  {
    title: 'Bädda sängen',
    description: 'Bädda din säng snyggt',
    points: 20,
    estimatedDurationMinutes: 5,
    category: 'Sovrum',
    difficulty: 'easy' as const,
  },
  {
    title: 'Putsa badrummet',
    description: 'Putsa toalett, handfat och dusch',
    points: 150,
    estimatedDurationMinutes: 40,
    category: 'Badrum',
    difficulty: 'hard' as const,
  },
  {
    title: 'Sortera tvätt',
    description: 'Sortera smutsig tvätt i rätt färger',
    points: 30,
    estimatedDurationMinutes: 10,
    category: 'Tvätt',
    difficulty: 'easy' as const,
  },
  {
    title: 'Hänga upp tvätt',
    description: 'Ta ur tvättmaskinen och hänga upp tvätten',
    points: 50,
    estimatedDurationMinutes: 15,
    category: 'Tvätt',
    difficulty: 'easy' as const,
  },
] as const;

// Swedish translations
export const TRANSLATIONS = {
  sv: {
    common: {
      save: 'Spara',
      cancel: 'Avbryt',
      delete: 'Ta bort',
      edit: 'Redigera',
      create: 'Skapa',
      loading: 'Laddar...',
      error: 'Ett fel uppstod',
      success: 'Lyckades!',
      confirm: 'Bekräfta',
      back: 'Tillbaka',
      next: 'Nästa',
      skip: 'Hoppa över',
      finish: 'Slutför',
    },
    auth: {
      login: 'Logga in',
      logout: 'Logga ut',
      signup: 'Registrera',
      email: 'E-post',
      password: 'Lösenord',
      forgotPassword: 'Glömt lösenord?',
    },
    chores: {
      title: 'Sysslor',
      createChore: 'Skapa syssla',
      availableChores: 'Tillgängliga sysslor',
      myChores: 'Mina sysslor',
      claim: 'Claima',
      unclaim: 'Släpp',
      complete: 'Slutför',
      pause: 'Pausa',
      resume: 'Återuppta',
      approve: 'Godkänn',
      points: 'poäng',
    },
    goals: {
      title: 'Mål',
      createGoal: 'Skapa mål',
      myGoals: 'Mina mål',
      familyGoals: 'Familjemål',
      progress: 'Framsteg',
      achieved: 'Uppnått!',
    },
    dashboard: {
      title: 'Dashboard',
      leaderboard: 'Leaderboard',
      stats: 'Statistik',
      activity: 'Aktivitet',
    },
  },
} as const;
