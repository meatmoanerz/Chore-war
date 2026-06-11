# Chore War - Komplett Projektdokumentation

## Översikt

**Chore War** är en gamifierad hushållsapp för familjer där medlemmar kan slutföra sysslor för att tjäna poäng, tävla på en leaderboard och uppnå mål tillsammans. Appen är byggd för mobil-först med en modern, minimalistisk design inspirerad av "Planner"-appen (Dribbble).

### Huvudfunktioner
- 🔐 Autentisering med e-post/lösenord via Supabase
- 🏠 Skapa eller gå med i hushåll via inbjudningskod
- ✅ Lägg till och slutför sysslor för poäng
- 🏆 Leaderboard för familjemedlemmar
- 👤 Profilhantering med emoji-avatarer
- 🎯 Mål och belöningar (planerat)

---

## Tech Stack

| Teknologi | Version | Syfte |
|-----------|---------|-------|
| React | 19 | UI-ramverk |
| TypeScript | 5.8 | Typsäkerhet |
| Vite | 7.2 | Byggverktyg |
| Tailwind CSS | 4.x | Styling (med @tailwindcss/postcss) |
| Supabase | - | Backend (Auth, Database, RLS) |
| React Router | 7 | Routing |

### Installation

```bash
npm install
npm run dev
```

### Miljövariabler (.env)

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

---

## Projektstruktur

```
src/
├── App.tsx                    # Huvudapp med routing
├── main.tsx                   # Entry point
├── index.css                  # Global CSS + designsystem
├── vite-env.d.ts              # TypeScript env types
├── contexts/
│   └── AuthContext.tsx        # Autentisering + användardata
├── lib/
│   ├── supabase.ts            # Supabase-klient
│   └── utils.ts               # Hjälpfunktioner (cn, formatDate, etc.)
├── pages/
│   ├── HomePage.tsx           # Landningssida
│   ├── LoginPage.tsx          # Inloggning
│   ├── SignupPage.tsx         # Registrering
│   ├── OnboardingPage.tsx     # Onboarding (profil + hushåll)
│   └── DashboardPage.tsx      # Huvudvy efter inloggning
├── components/
│   └── ui/
│       ├── Button.tsx         # Återanvändbar knapp
│       ├── Card.tsx           # Kort-komponent
│       └── Input.tsx          # Input-komponent
└── types/
    └── database.ts            # TypeScript-typer för databasen

supabase/
└── schema.sql                 # Komplett databasschema
```

---

## Designsystem

### Färgpalett (CSS-variabler i index.css)

```css
:root {
  --color-bg: #E8F4F2;           /* Mjuk mint-bakgrund */
  --color-bg-card: #FFFFFF;       /* Vita kort */
  --color-primary: #1A1A1A;       /* Mörk text */
  --color-muted: #6B7280;         /* Sekundär text */
  --color-accent-green: #22C55E;  /* Slutförda sysslor, framgång */
  --color-accent-purple: #A78BFA; /* Dekorationer */
  --color-accent-pink: #FDA4AF;   /* Dekorationer */
  --color-accent-orange: #FB923C; /* Dekorationer */
  --radius-card: 20px;            /* Rundade hörn på kort */
  --radius-button: 14px;          /* Rundade hörn på knappar */
  --shadow-card: 0 4px 20px rgba(0, 0, 0, 0.06);
}
```

### Designprinciper
1. **Mobil-först**: Max-width 448px (max-w-md) för alla sidor
2. **Vita kort på mint-bakgrund**: Alla innehållsblock är vita kort med skugga
3. **Stora rundade hörn**: 20-24px border-radius
4. **Inline styles**: Används för att garantera att färger appliceras korrekt
5. **Emojis som ikoner**: 👧👦🏆⭐🎯📝 etc.
6. **Gröna checkmarks**: #22C55E för slutförda sysslor

### Typografi
- Rubriker: `font-weight: 700`, `color: #1A1A1A`
- Brödtext: `font-weight: 500`, `color: #1A1A1A`
- Sekundär text: `color: #6B7280`
- Font-storlekar: 13px (small), 14-15px (body), 18px (h2), 24px (h1)

---

## Databasschema (Supabase)

### Tabeller

#### profiles
```sql
create table public.profiles (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade unique not null,
  name text not null,
  avatar_emoji text default '👤',
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);
```

#### households
```sql
create table public.households (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  invite_code text unique not null,  -- Auto-genereras via trigger
  created_by uuid references auth.users(id),
  created_at timestamp with time zone default now()
);
```

#### household_members
```sql
create table public.household_members (
  id uuid primary key default uuid_generate_v4(),
  household_id uuid references households(id) on delete cascade,
  user_id uuid references auth.users(id) on delete cascade,
  role text default 'member' check (role in ('admin', 'member', 'child')),
  joined_at timestamp with time zone default now(),
  unique(household_id, user_id)
);
```

#### chores
```sql
create table public.chores (
  id uuid primary key default uuid_generate_v4(),
  household_id uuid references households(id) on delete cascade,
  title text not null,
  description text,
  points integer not null default 10,
  estimated_minutes integer default 10,
  is_recurring boolean default false,
  recurrence_pattern text,  -- 'daily', 'weekly', 'monthly'
  created_by uuid references auth.users(id),
  created_at timestamp with time zone default now()
);
```

#### chore_completions
```sql
create table public.chore_completions (
  id uuid primary key default uuid_generate_v4(),
  chore_id uuid references chores(id) on delete cascade,
  user_id uuid references auth.users(id) on delete cascade,
  household_id uuid references households(id) on delete cascade,
  points_earned integer not null,
  completed_at timestamp with time zone default now()
);
```

#### goals (planerad)
```sql
create table public.goals (
  id uuid primary key default uuid_generate_v4(),
  household_id uuid references households(id) on delete cascade,
  user_id uuid references auth.users(id),  -- null för familjemål
  title text not null,
  target_points integer not null,
  reward text,
  is_family_goal boolean default false,
  is_completed boolean default false,
  created_at timestamp with time zone default now()
);
```

### Row Level Security (RLS)

Alla tabeller har RLS aktiverat. Viktiga policies:

```sql
-- Profiles
create policy "Users can view their own profile" on profiles
  for select using (auth.uid() = user_id);
create policy "Users can insert their own profile" on profiles
  for insert with check (auth.uid() = user_id);

-- Households
create policy "Users can view households they belong to" on households
  for select using (
    id in (select household_id from household_members where user_id = auth.uid())
  );
create policy "Users can view households they created" on households
  for select using (auth.uid() = created_by);
create policy "Users can create households" on households
  for insert with check (auth.uid() = created_by);

-- Household members
create policy "Users can join households" on household_members
  for insert with check (auth.uid() = user_id);

-- Chores (CRUD för hushållsmedlemmar)
-- Completions (insert för sig själv, view för hushåll)
```

### Trigger för inbjudningskod
```sql
create or replace function generate_invite_code() returns text as $$
  -- Genererar 8-teckens kod: ABCDEFGHJKLMNPQRSTUVWXYZ23456789
$$ language plpgsql;

create trigger households_invite_code_trigger
  before insert on households
  for each row execute function set_invite_code();
```

---

## Autentiseringsflöde

### AuthContext (src/contexts/AuthContext.tsx)

Exponerar:
```typescript
interface AuthContextType {
  user: User | null;           // Supabase auth user
  session: Session | null;     // Supabase session
  profile: Profile | null;     // Användarprofil från profiles-tabellen
  household: Household | null; // Användarens hushåll
  householdMember: HouseholdMember | null;  // Medlemskap med roll
  loading: boolean;
  needsOnboarding: boolean;    // true om ingen profil eller hushåll
  signUp: (email, password, name) => Promise<{ error }>;
  signIn: (email, password) => Promise<{ error }>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}
```

### Routing (src/App.tsx)

```
/               → HomePage (publik)
/login          → LoginPage (PublicRoute - redirectar till dashboard om inloggad)
/signup         → SignupPage (PublicRoute)
/onboarding     → OnboardingPage (OnboardingRoute - kräver inloggning, visas om needsOnboarding)
/dashboard      → DashboardPage (ProtectedRoute - kräver inloggning + slutförd onboarding)
```

### Onboarding-flöde

1. **Steg 1: Profil** - Ange namn, välj emoji-avatar
2. **Steg 2: Val** - "Skapa hushåll" eller "Gå med i hushåll"
3. **Steg 3a: Skapa** - Ange hushållsnamn → skapas med auto-genererad invite_code
4. **Steg 3b: Gå med** - Ange 8-siffrig kod + välj roll (Vuxen/Barn)

---

## Komponentmönster

### Inline Styles
Projektet använder primärt inline styles för att garantera att färger appliceras:

```tsx
<div style={{
  background: '#FFFFFF',
  borderRadius: '24px',
  padding: '24px',
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.06)'
}}>
```

### Sysslor med checkmarks
```tsx
<div
  onClick={() => handleCompleteChore(chore)}
  style={{
    background: isCompleted ? '#F0FDF4' : '#F9FAFB',
    cursor: isCompleted ? 'default' : 'pointer'
  }}
>
  <div style={{
    width: '28px',
    height: '28px',
    borderRadius: '50%',
    background: isCompleted ? '#22C55E' : 'transparent',
    border: isCompleted ? 'none' : '2px solid #D1D5DB'
  }}>
    {isCompleted && <CheckIcon />}
  </div>
</div>
```

---

## API-mönster (Supabase)

### Hämta data
```typescript
const { data, error } = await supabase
  .from('chores')
  .select('*')
  .eq('household_id', household.id)
  .order('created_at', { ascending: false });
```

### Skapa data
```typescript
const { data, error } = await supabase
  .from('chores')
  .insert({
    household_id: household.id,
    title: 'Diska',
    points: 50,
    estimated_minutes: 15,
    created_by: user.id
  })
  .select()
  .single();
```

### Joins
```typescript
const { data } = await supabase
  .from('household_members')
  .select('*, profiles(*)')
  .eq('household_id', household.id);
```

---

## Funktioner per sida

### HomePage
- Hero med app-beskrivning
- Feature-lista med ikoner
- CTA-knappar till login/signup

### LoginPage
- E-post + lösenord-formulär
- Felhantering (visar error från Supabase)
- Länk till registrering
- "Fortsätt med Google" (placeholder)

### SignupPage
- Namn + e-post + lösenord + bekräfta lösenord
- Validering (minst 6 tecken, lösenord matchar)
- Framgångsmeddelande vid registrering

### OnboardingPage
- Progress-indikator (3 steg)
- Emoji-avatar-väljare (16 val)
- Formulär för hushållsnamn eller inbjudningskod
- Roll-väljare vid "Gå med" (Vuxen/Barn)

### DashboardPage
- Header med hushållsnamn + användarnamn + avatar (klicka = logga ut)
- Stat-kort: Totala poäng, Poäng idag
- Inbjudningskod-kort (endast admin, klicka för att visa)
- Sysslor-kort med "Lägg till"-knapp (admin)
- Formulär för ny syssla (titel, poäng, tid)
- Sysslelista med checkmarks (klicka = slutför, en gång per dag)
- Leaderboard med medaljer (🥇🥈🥉) och stjärnor för #1

---

## Planerade funktioner

1. **Mål och belöningar** - Veckomål med progress bar, familjemål
2. **Återkommande sysslor** - Dagliga/veckovisa sysslor som återställs
3. **Notifikationer** - Påminnelser om ogjorda sysslor
4. **Statistik** - Grafer över poäng över tid
5. **Admin-panel** - Hantera medlemmar, ändra roller
6. **Google-inloggning** - OAuth via Supabase

---

## Deployment

### Vercel

1. Koppla GitHub-repo
2. Lägg till miljövariabler:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
3. Deploy Hook för specifik branch: `claude/fix-app-styling-B6R39`

### Build-kommando
```bash
npm run build  # tsc -b && vite build
```

Output: `dist/`

---

## Vanliga fel och lösningar

### "Kunde inte skapa hushållet"
**Orsak**: RLS-policy saknas för att läsa hushåll man just skapade.
**Lösning**: 
```sql
create policy "Users can view households they created" on public.households
  for select using (auth.uid() = created_by);
```

### TypeScript TS1484: Type-only import
**Orsak**: `verbatimModuleSyntax` kräver `type` keyword.
**Lösning**: `import { type ButtonHTMLAttributes } from 'react'`

### PostCSS/Tailwind error
**Orsak**: Tailwind v4 använder `@tailwindcss/postcss`.
**Lösning** (postcss.config.js):
```js
export default {
  plugins: {
    '@tailwindcss/postcss': {},
    autoprefixer: {},
  },
}
```

---

## Språk

Appen är på **svenska**. Alla UI-texter, felmeddelanden och labels är på svenska.

Exempel:
- "Logga in" / "Registrera dig"
- "Sysslor" / "Poäng" / "Minuter"
- "Skapa hushåll" / "Gå med i hushåll"
- "Bjud in familjen"
- "Kunde inte skapa hushållet. Försök igen."
