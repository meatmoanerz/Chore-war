# Chore War - Build Plan 🏗️

> Strukturerad plan för att bygga Chore War från grunden till MVP och vidare

---

## 📋 Innehållsförteckning

1. [Översikt](#översikt)
2. [Teknisk Stack](#teknisk-stack)
3. [Utvecklingsfaser](#utvecklingsfaser)
4. [Detaljerad Byggplan](#detaljerad-byggplan)
5. [Testing & Quality Assurance](#testing--quality-assurance)
6. [Deployment](#deployment)
7. [Post-Launch](#post-launch)

---

## 🎯 Översikt

### Projektmål
Bygga en mobile-first webapp som gör hemmasysslor roliga för familjer genom gamification.

### Timeline (Uppskattad)
- **Fas 1 (Foundation)**: Setup, Auth, Grundläggande struktur
- **Fas 2 (Core Features)**: Sysslor, Poäng, Mål
- **Fas 3 (UX & Polish)**: Dashboard, Statistik, Design
- **Fas 4 (Testing & Launch)**: QA, Bug fixes, Deploy

### Success Criteria för MVP
- ✅ Föräldrar kan skapa hushåll och bjuda in familjemedlemmar
- ✅ Föräldrar kan skapa, redigera och ta bort sysslor
- ✅ Barn kan claima, slutföra och kommentera på sysslor
- ✅ Poängsystem (total + period) fungerar korrekt
- ✅ Mål kan skapas och progress visas
- ✅ Dashboard visar leaderboard och statistik
- ✅ Appen är snabb, responsiv och bugfri
- ✅ Onboarding guider nya användare

---

## 🛠️ Teknisk Stack

### Frontend
**Rekommendation: React + TypeScript**

**Motivering:**
- React är industry standard med stort community
- TypeScript ger type-safety och bättre DX
- Perfekt för mobile-first responsive design
- Enkelt att senare porta till React Native för iOS/Android
- Utmärkt ekosystem med libraries för alla behov

**UI Framework:**
- **Tailwind CSS**: Utility-first, snabb utveckling, mobile-first
- **shadcn/ui** eller **Radix UI**: Accessible, moderna komponenter
- **Framer Motion**: Smooth animationer och mikrointeraktioner

**State Management:**
- **Zustand** eller **React Query**: Enkel, modern state management
- **React Query**: Perfekt för server state (sysslor, poäng, användare)

**Routing:**
- **React Router v6**: Standard för React SPAs

**Forms:**
- **React Hook Form**: Performant, enkel validering
- **Zod**: Schema validation

**Internationalisering:**
- **i18next**: Industry standard för i18n

### Backend
**Rekommendation: Node.js + Express/Fastify + TypeScript**

**Motivering:**
- JavaScript/TypeScript både frontend och backend (code sharing)
- Snabbt och skalbart
- Stort ekosystem
- Enkel integration med alla databaser

**Alternativ:**
- **NestJS**: Mer strukturerat, Angular-liknande DI
- **tRPC**: Type-safe API utan code generation

### Databas
**Rekommendation: PostgreSQL**

**Motivering:**
- Relationell data passar perfekt (hushåll → användare → sysslor → poäng)
- ACID-compliant (viktigt för poäng-transaktioner)
- Utmärkt performance
- JSON support för flexibel data
- Robust och beprövad

**ORM:**
- **Prisma**: Type-safe, modern, utmärkt DX
- Auto-generated TypeScript types
- Enkel migration-hantering

### Autentisering
**Rekommendation: NextAuth.js (Auth.js) eller Supabase Auth**

**Motivering:**
- Stöd för Email/Password + Google OAuth
- Session management
- Säkerhet out-of-the-box
- Enkel integration

**Alternativ:**
- **Clerk**: Premium alternativ med bra UX
- **Firebase Auth**: Om vi använder Firebase

### File Storage
**Rekommendation: Cloudinary eller AWS S3**

**För:** Bilduppladdning (profilbilder, syssla-bilder, bevis-bilder)

### Hosting & Deployment
**Frontend:**
- **Vercel**: Perfekt för React, gratis tier, automatic deployments
- **Netlify**: Alternativ med liknande features

**Backend:**
- **Railway** eller **Render**: Enkel Node.js hosting
- **Fly.io**: Närmre Europa, bra performance

**Databas:**
- **Supabase**: Managed PostgreSQL + Auth + Storage (all-in-one)
- **Railway/Render**: Managed PostgreSQL
- **Neon**: Serverless PostgreSQL

### Rekommenderad Stack (Enklast för MVP)
🏆 **Supabase + React + TypeScript + Tailwind**

**Varför:**
- **Supabase** ger oss: Database (PostgreSQL) + Auth (email/Google) + Storage (bilder) + Realtime
- **React** för UI
- **TypeScript** för type-safety
- **Tailwind** för styling
- **Vercel** för hosting

**Resultat:**
- Minimal backend code (Supabase gör jobbet)
- Snabb utveckling
- Skalbar
- Gratis tier för start
- Enkel migration till egna server senare om behövs

---

## 🏗️ Utvecklingsfaser

### Fas 1: Foundation & Setup
**Mål:** Sätt upp projektet och grundläggande struktur

**Uppgifter:**
1. ✅ Skapa projekt repository
2. ⬜ Initiera React + TypeScript projekt (Vite recommended)
3. ⬜ Sätt upp Tailwind CSS
4. ⬜ Konfigurera ESLint + Prettier
5. ⬜ Sätt upp Supabase projekt
6. ⬜ Konfigurera environment variables
7. ⬜ Skapa grundläggande mappstruktur
8. ⬜ Sätt upp routing (React Router)
9. ⬜ Skapa design system (färger, typografi, komponenter)

**Deliverables:**
- Fungerande dev environment
- Grundläggande UI komponenter (Button, Input, Card, etc.)
- Routing setup
- Design tokens definierade

---

### Fas 2: Autentisering & Användarhantering
**Mål:** Användare kan registrera sig, logga in och skapa profiler

#### 2.1 Databas Schema
**Tabeller att skapa:**

```sql
-- Users (Supabase auth.users + custom profile)
profiles (
  id UUID PRIMARY KEY REFERENCES auth.users,
  role VARCHAR (adult/child),
  display_name VARCHAR,
  avatar_url VARCHAR,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
)

-- Households
households (
  id UUID PRIMARY KEY,
  name VARCHAR,
  avatar_url VARCHAR,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMP,
  updated_at TIMESTAMP
)

-- Household Members
household_members (
  id UUID PRIMARY KEY,
  household_id UUID REFERENCES households(id),
  user_id UUID REFERENCES profiles(id),
  role VARCHAR (owner/admin/parent/child),
  joined_at TIMESTAMP,
  UNIQUE(household_id, user_id)
)

-- Child Profiles (för barn utan konto)
child_profiles (
  id UUID PRIMARY KEY,
  household_id UUID REFERENCES households(id),
  display_name VARCHAR,
  avatar_url VARCHAR,
  pin_code VARCHAR (hashed),
  invite_code VARCHAR (unique),
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMP
)
```

#### 2.2 Auth Implementation
**Uppgifter:**
1. ⬜ Implementera email/password registrering
2. ⬜ Implementera Google OAuth
3. ⬜ Skapa login/signup UI
4. ⬜ Implementera PIN-kod login för barnprofiler
5. ⬜ Session management
6. ⬜ Protected routes (måste vara inloggad)
7. ⬜ Role-based access control (RBAC)

**Deliverables:**
- Användare kan registrera sig och logga in
- Google login fungerar
- Barn kan logga in med PIN

#### 2.3 Hushållshantering
**Uppgifter:**
1. ⬜ Skapa hushåll (första-användare flow)
2. ⬜ Bjud in vuxna via email
3. ⬜ Skapa barnprofiler (med/utan konto)
4. ⬜ Generera invite-koder för barnprofiler
5. ⬜ Join household med invite-kod
6. ⬜ Lista familjemedlemmar
7. ⬜ Redigera profiler
8. ⬜ Hantera flera hushåll (barn i växelvis boende)

**UI Komponenter:**
- Household creation wizard
- Member management interface
- Invite flow (email + kod)
- Profile settings

**Deliverables:**
- Komplett hushållshantering
- Barn kan vara i flera hushåll
- Invite-system fungerar

---

### Fas 3: Sysslor (Core Feature)
**Mål:** Föräldrar kan skapa sysslor, barn kan claima och slutföra dem

#### 3.1 Databas Schema

```sql
-- Chores
chores (
  id UUID PRIMARY KEY,
  household_id UUID REFERENCES households(id),
  title VARCHAR,
  description TEXT,
  points INTEGER,
  extra_reward TEXT,
  estimated_duration_minutes INTEGER,
  deadline TIMESTAMP,
  expires_at TIMESTAMP,
  priority VARCHAR (normal/high/urgent),
  status VARCHAR (draft/published/archived),
  is_recurring BOOLEAN,
  recurrence_pattern JSONB,
  category VARCHAR,
  difficulty VARCHAR,
  penalty_points INTEGER,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMP,
  updated_at TIMESTAMP
)

-- Chore Assignments (tilldelade sysslor)
chore_assignments (
  id UUID PRIMARY KEY,
  chore_id UUID REFERENCES chores(id),
  assigned_to UUID, -- kan vara profile eller child_profile
  assigned_by UUID REFERENCES profiles(id),
  is_visible_to_others BOOLEAN,
  assigned_at TIMESTAMP
)

-- Chore Images
chore_images (
  id UUID PRIMARY KEY,
  chore_id UUID REFERENCES chores(id),
  image_url VARCHAR,
  uploaded_by UUID,
  uploaded_at TIMESTAMP
)

-- Chore Instances (varje gång en syssla blir tillgänglig)
chore_instances (
  id UUID PRIMARY KEY,
  chore_id UUID REFERENCES chores(id),
  household_id UUID REFERENCES households(id),
  status VARCHAR (available/claimed/paused/completed/approved/expired),
  claimed_by UUID,
  claimed_at TIMESTAMP,
  paused_at TIMESTAMP,
  completed_at TIMESTAMP,
  approved_at TIMESTAMP,
  approved_by UUID REFERENCES profiles(id),
  penalty_applied BOOLEAN,
  created_at TIMESTAMP
)

-- Chore Comments
chore_comments (
  id UUID PRIMARY KEY,
  chore_instance_id UUID REFERENCES chore_instances(id),
  user_id UUID,
  comment TEXT,
  image_url VARCHAR,
  created_at TIMESTAMP
)

-- Chore Templates
chore_templates (
  id UUID PRIMARY KEY,
  household_id UUID REFERENCES households(id),
  is_global BOOLEAN, -- förinställda mallar
  title VARCHAR,
  description TEXT,
  points INTEGER,
  estimated_duration_minutes INTEGER,
  category VARCHAR,
  difficulty VARCHAR,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMP
)
```

#### 3.2 Syssla-funktionalitet
**Uppgifter:**

**Skapa sysslor:**
1. ⬜ Skapa syssla-formulär (multi-step?)
2. ⬜ Validering av inputs
3. ⬜ Bilduppladdning (instruktioner)
4. ⬜ Draft vs Publicera
5. ⬜ Tilldelning (specifika barn eller allmän)
6. ⬜ Återkommande sysslor (cron-liknande schema)
7. ⬜ Spara som mall

**Mallar:**
8. ⬜ Skapa förinställda mallar (10-15 vanliga sysslor)
9. ⬜ Skapa syssla från mall
10. ⬜ Spara custom mallar

**Lista & Visa sysslor:**
11. ⬜ Lista tillgängliga sysslor (barn)
12. ⬜ Lista alla sysslor (föräldrar)
13. ⬜ Filter: status, kategori, tilldelade/allmänna
14. ⬜ Sök funktion
15. ⬜ Syssla-detaljvy

**Claima sysslor:**
16. ⬜ Barn kan claima tillgänglig syssla
17. ⬜ Kontrollera att sysslan inte redan är claimad
18. ⬜ Kontrollera tilldelning (endast tilldelade kan claima)
19. ⬜ Starta timer baserat på beräknad tid
20. ⬜ Unclaima funktion

**Under pågående syssla:**
21. ⬜ Visa återstående tid (uppskattning)
22. ⬜ Pausa funktion
23. ⬜ Notifikation om tid håller på att gå ut
24. ⬜ Notifikation till föräldrar om syssla tar för lång tid

**Slutföra syssla:**
25. ⬜ "Slutför"-knapp
26. ⬜ Optional: Ladda upp bevis-bild
27. ⬜ Optional: Kommentar
28. ⬜ Notifikation till föräldrar

**Godkänna syssla (Föräldrar):**
29. ⬜ Lista väntande godkännanden
30. ⬜ Granska syssla (se bilder, kommentarer)
31. ⬜ Godkänn → Poäng betalas ut
32. ⬜ Optional: Ge penalty (manuellt)

**Kommentarer:**
33. ⬜ Kommentarsfält per syssla-instans
34. ⬜ Text-kommentarer
35. ⬜ Bild-kommentarer
36. ⬜ Realtids-uppdatering

**Recurring Chores:**
37. ⬜ Cron-job eller scheduled function för att skapa nya instances
38. ⬜ Hantera recurrence patterns (dagligen, veckovis, specifika dagar)

**UI Komponenter:**
- Chore creation form (multi-step wizard)
- Chore card (list view)
- Chore detail view
- Chore claim modal
- Chore complete modal (med bild-upload)
- Comments section
- Template selector
- Filter/search interface

**Deliverables:**
- Komplett syssla-hantering
- Barn kan claima, pausa, slutföra
- Föräldrar kan godkänna
- Kommentarsfunktion fungerar
- Mallar fungerar
- Återkommande sysslor skapas automatiskt

---

### Fas 4: Poängsystem
**Mål:** Spåra poäng, hantera transaktioner, visa saldon

#### 4.1 Databas Schema

```sql
-- Points Accounts (per barn per hushåll)
points_accounts (
  id UUID PRIMARY KEY,
  household_id UUID REFERENCES households(id),
  user_id UUID, -- profile eller child_profile
  total_points INTEGER DEFAULT 0,
  weekly_points INTEGER DEFAULT 0,
  monthly_points INTEGER DEFAULT 0,
  yearly_points INTEGER DEFAULT 0,
  last_weekly_reset TIMESTAMP,
  last_monthly_reset TIMESTAMP,
  last_yearly_reset TIMESTAMP,
  created_at TIMESTAMP,
  UNIQUE(household_id, user_id)
)

-- Points Transactions (historik)
points_transactions (
  id UUID PRIMARY KEY,
  account_id UUID REFERENCES points_accounts(id),
  amount INTEGER, -- kan vara negativt
  type VARCHAR (chore_completed/manual_adjustment/penalty/bonus),
  description TEXT,
  chore_instance_id UUID REFERENCES chore_instances(id),
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMP
)
```

#### 4.2 Poäng-funktionalitet
**Uppgifter:**

1. ⬜ Skapa points_account när barn joins hushåll
2. ⬜ Utbetala poäng vid godkänd syssla
3. ⬜ Logga alla transaktioner
4. ⬜ Manuell poängjustering (föräldrar)
5. ⬜ Apply penalty (föräldrar)
6. ⬜ Period reset (weekly/monthly/yearly) - cron job
7. ⬜ Visa poängsaldo (total + periods)
8. ⬜ Transaktionshistorik
9. ⬜ Säkerställ ACID (inga lost updates)

**UI Komponenter:**
- Points balance display
- Transaction history
- Manual adjustment modal (föräldar)

**Deliverables:**
- Poängsystem fungerar korrekt
- Automatisk period reset
- Transaktionshistorik sparas

---

### Fas 5: Mål & Belöningar
**Mål:** Skapa individuella och gemensamma mål med belöningar

#### 5.1 Databas Schema

```sql
-- Goals
goals (
  id UUID PRIMARY KEY,
  household_id UUID REFERENCES households(id),
  title VARCHAR,
  description TEXT,
  target_points INTEGER,
  period VARCHAR (week/month/year/custom),
  period_start DATE,
  period_end DATE,
  is_recurring BOOLEAN,
  type VARCHAR (individual/collective),
  reward_text TEXT,
  status VARCHAR (active/completed/failed/archived),
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMP,
  updated_at TIMESTAMP
)

-- Goal Assignments (för individuella mål)
goal_assignments (
  id UUID PRIMARY KEY,
  goal_id UUID REFERENCES goals(id),
  user_id UUID,
  target_points INTEGER, -- kan overrida goal target för olika barn
  achieved BOOLEAN DEFAULT false,
  achieved_at TIMESTAMP,
  UNIQUE(goal_id, user_id)
)

-- Goal Progress (snapshot varje dag för grafer)
goal_progress (
  id UUID PRIMARY KEY,
  goal_id UUID REFERENCES goals(id),
  user_id UUID, -- NULL för collective goals
  date DATE,
  points_at_date INTEGER,
  created_at TIMESTAMP
)
```

#### 5.2 Mål-funktionalitet
**Uppgifter:**

**Skapa mål:**
1. ⬜ Skapa mål-formulär
2. ⬜ Välj typ (individuell/gemensam)
3. ⬜ Välj period (vecka/månad/år)
4. ⬜ Sätt target points (samma för alla eller olika per barn)
5. ⬜ Återkommande mål (auto-renew)
6. ⬜ Belöning (fritext)

**Spåra progress:**
7. ⬜ Beräkna progress mot mål (realtid)
8. ⬜ Individuell progress för varje barn
9. ⬜ Kollektiv progress (summa av alla barn)
10. ⬜ Daglig snapshot för historiska grafer
11. ⬜ Markera mål som uppnått

**Automatisk hantering:**
12. ⬜ Cron job för att checka om mål är uppnådda
13. ⬜ Notifikation när mål uppnås
14. ⬜ Auto-renew återkommande mål
15. ⬜ Arkivera gamla mål

**UI Komponenter:**
- Goal creation form
- Goal card med progress bar
- Individual vs collective goal views
- Goal achievement celebration (animation!)
- Goal history/archive

**Deliverables:**
- Mål kan skapas och spåras
- Progress visas korrekt
- Återkommande mål förnyas automatiskt
- Notifikationer vid uppnådda mål

---

### Fas 6: Dashboard & Statistik
**Mål:** Visuellt tilltalande dashboard med leaderboard och statistik

#### 6.1 Databas Views/Queries
Behöver effektiva queries för:
- Leaderboard (weekly/monthly/all-time)
- Antal slutförda sysslor per barn
- Claimed vs unclaimed sysslor
- Streaks (dagar i rad med minst en slutförd syssla)
- Genomsnittlig sysseltid
- Aktivitet över tid

#### 6.2 Dashboard-funktionalitet
**Uppgifter:**

**Föräldravy:**
1. ⬜ Översikt-kort (aktiva sysslor, väntande godkännanden, etc.)
2. ⬜ Leaderboard (valbar period)
3. ⬜ Målprogress (alla mål)
4. ⬜ Aktivitetsfeed (senaste händelser)
5. ⬜ Statistik-kort:
   - Antal slutförda sysslor idag/vecka/månad
   - Claimed vs unclaimed
   - Mest aktiva barn
   - Genomsnittlig tid per syssla
6. ⬜ Grafer:
   - Poäng över tid (line chart)
   - Sysslor per barn (bar chart)
   - Aktivitet per dag (heatmap?)

**Barnvy:**
7. ⬜ Mina mål (progress bars)
8. ⬜ Familjemål (progress bars)
9. ⬜ Min placering (leaderboard preview)
10. ⬜ Mina aktiva sysslor
11. ⬜ Tillgängliga sysslor (call-to-action)
12. ⬜ Min statistik:
    - Totala poäng
    - Poäng denna vecka/månad
    - Antal slutförda sysslor
    - Min streak

**Leaderboard:**
13. ⬜ Växla mellan weekly/monthly/all-time
14. ⬜ Visuellt tilltalande ranking (medaljer för top 3?)
15. ⬜ Animationer vid platsändringar

**UI Komponenter:**
- Dashboard layout (grid-based)
- Stat cards (med ikoner och färger)
- Leaderboard component
- Progress bars med animationer
- Charts (använd Recharts eller Chart.js)
- Activity feed

**Deliverables:**
- Funktionell och snygg dashboard
- Leaderboard med olika vyer
- Grafer och statistik
- Responsiv design

---

### Fas 7: Notifikationer
**Mål:** In-app notifikationer för viktiga händelser

#### 7.1 Databas Schema

```sql
-- Notifications
notifications (
  id UUID PRIMARY KEY,
  user_id UUID, -- mottagare
  type VARCHAR (chore_claimed/chore_completed/goal_achieved/etc),
  title VARCHAR,
  message TEXT,
  data JSONB, -- extra data (t.ex. chore_id)
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP
)

-- Notification Preferences
notification_preferences (
  id UUID PRIMARY KEY,
  user_id UUID,
  household_id UUID REFERENCES households(id),
  level VARCHAR (all/personal/none),
  created_at TIMESTAMP,
  UNIQUE(user_id, household_id)
)
```

#### 7.2 Notifikations-funktionalitet
**Uppgifter:**

1. ⬜ Skapa notification vid events:
   - Barn claimat syssla
   - Barn slutfört syssla
   - Barn pausat syssla
   - Syssla tar för lång tid
   - Syssla godkänd
   - Mål uppnått
2. ⬜ Notifikationscenter (lista olästa)
3. ⬜ Markera som läst
4. ⬜ Markera alla som lästa
5. ⬜ Badge count (antal olästa)
6. ⬜ Realtidsuppdatering (Supabase Realtime)
7. ⬜ Notifikationsinställningar (all/personal/none)
8. ⬜ Auto-delete gamla notifikationer (>30 dagar)

**UI Komponenter:**
- Notification bell icon med badge
- Notification dropdown/panel
- Notification item component
- Notification settings

**Deliverables:**
- Fungerande in-app notifikationer
- Realtidsuppdateringar
- Användarinställningar

---

### Fas 8: Inställningar & Konfiguration
**Mål:** Användare kan anpassa appen efter sina behov

#### 8.1 Databas Schema

```sql
-- Household Settings
household_settings (
  id UUID PRIMARY KEY,
  household_id UUID REFERENCES households(id) UNIQUE,
  show_leaderboard_to_children BOOLEAN DEFAULT true,
  children_can_see_others_points BOOLEAN DEFAULT true,
  children_can_see_others_chores BOOLEAN DEFAULT true,
  comments_enabled BOOLEAN DEFAULT true,
  language VARCHAR DEFAULT 'sv',
  created_at TIMESTAMP,
  updated_at TIMESTAMP
)
```

#### 8.2 Inställnings-funktionalitet
**Uppgifter:**

**Hushållsinställningar (Föräldrar):**
1. ⬜ Synlighet för barn (leaderboard, andras poäng, etc.)
2. ⬜ Aktivera/inaktivera kommentarer
3. ⬜ Språkval
4. ⬜ Notifikationsinställningar

**Personliga inställningar:**
5. ⬜ Profilbild upload
6. ⬜ Ändra display name
7. ⬜ Ändra lösenord
8. ⬜ Återställ PIN (föräldrar för barnprofiler)
9. ⬜ Notifikationspreferenser

**Hushållshantering:**
10. ⬜ Se alla medlemmar
11. ⬜ Bjud in nya medlemmar
12. ⬜ Ta bort medlemmar (om ägare)
13. ⬜ Lämna hushåll
14. ⬜ Ta bort hushåll (om ägare, med bekräftelse)

**UI Komponenter:**
- Settings page (tabbed eller accordion)
- Toggle switches
- Image upload component
- Password change form
- Danger zone (destructive actions)

**Deliverables:**
- Komplett inställningssida
- Användare kan anpassa appen
- Säker hantering av känsliga ändringar

---

### Fas 9: Onboarding
**Mål:** Guida nya användare genom appen

#### 9.1 Onboarding-funktionalitet
**Uppgifter:**

1. ⬜ Välkomstskärm med intro
2. ⬜ Multi-step onboarding wizard:
   - Skapa hushåll
   - Bjud in familjemedlemmar
   - Skapa första sysslan (från mall?)
   - Skapa första målet
   - Färdig!
3. ⬜ "Hoppa över"-funktion
4. ⬜ Spara onboarding status (visa inte igen)
5. ⬜ "Visa guide igen" i inställningar
6. ⬜ Tooltips och hints första gången användaren ser features
7. ⬜ Interaktiv tutorial (optional)

**UI Komponenter:**
- Onboarding wizard (stepper component)
- Welcome screen
- Tooltips/Popovers
- Tutorial overlays

**Deliverables:**
- Smidig onboarding-upplevelse
- Nya användare förstår hur appen fungerar
- Kan skippa eller återbesöka

---

### Fas 10: Design & Polish
**Mål:** Gör appen visuellt tilltalande och lekfull

#### 10.1 Design System
**Uppgifter:**

1. ⬜ Definiera färgpalett (primär, sekundär, accent, success, warning, error)
2. ⬜ Typografi (font families, sizes, weights)
3. ⬜ Spacing system (4px baseline)
4. ⬜ Border radius (rounded corners)
5. ⬜ Shadows och elevation
6. ⬜ Ikoner (välj icon library - Lucide eller Heroicons)
7. ⬜ Illustrationer (skapa eller köp)

#### 10.2 UI/UX Förbättringar
**Uppgifter:**

**Animationer & Mikrointeraktioner:**
8. ⬜ Poäng som "poppar" när de betalas ut
9. ⬜ Progress bars som fylls med animation
10. ⬜ Konfetti vid uppnått mål
11. ⬜ Smooth transitions mellan sidor
12. ⬜ Loading states med skeletons
13. ⬜ Hover/active states på alla interaktiva element

**Visuell Hierarki:**
14. ⬜ Tydliga CTAs (Call-to-Actions)
15. ⬜ Konsekvent användning av färger för status
16. ⬜ Whitespace och breathing room
17. ⬜ Visuell feedback vid actions (success toasts, error messages)

**Gamification:**
18. ⬜ Badges/Achievements visuals (ikoner)
19. ⬜ Leaderboard medals (🥇🥈🥉)
20. ⬜ Streak flame icon 🔥
21. ⬜ Progress circles/rings
22. ⬜ "Level up" känsla vid milstolpar

**Responsiv Design:**
23. ⬜ Testa på alla breakpoints (320px - desktop)
24. ⬜ Touch-friendly targets (minst 44x44px)
25. ⬜ Thumb-zone navigation (viktigt på mobil)
26. ⬜ Landscape-läge på mobil

**Accessibility:**
27. ⬜ Tillräcklig färgkontrast (WCAG AA)
28. ⬜ Keyboard navigation
29. ⬜ Screen reader support (ARIA labels)
30. ⬜ Focus indicators

**UI Komponenter att polisha:**
- Alla cards (shadow, hover effects)
- Buttons (olika varianter: primary, secondary, ghost, danger)
- Forms (labels, errors, help text)
- Modals (smooth entry/exit)
- Toasts/Notifications (color-coded)
- Loading states
- Empty states (illustrated)
- Error states (friendly messaging)

**Deliverables:**
- Komplett design system
- Visuellt tilltalande UI
- Smooth animationer
- Responsiv på alla enheter
- Accessible

---

### Fas 11: Arkiv & Historik
**Mål:** Användare kan se historik över slutförda sysslor

#### 11.1 Databas Optimering
- Indexera relevanta kolumner för snabba queries
- Pagination för stora dataset

#### 11.2 Arkiv-funktionalitet
**Uppgifter:**

1. ⬜ Arkivsida med alla slutförda sysslor
2. ⬜ Filter:
   - Efter barn
   - Efter tidsperiod (denna vecka/månad, custom range)
   - Efter kategori
   - Efter status (godkänd/penalty)
3. ⬜ Sök i arkiv
4. ⬜ Pagination (infinite scroll eller page numbers)
5. ⬜ Export till CSV/Excel (future feature, men lägg grund)
6. ⬜ Detaljvy för arkiverad syssla (med kommentarer, bilder, etc.)

**UI Komponenter:**
- Archive page med filters
- Archive card/list item
- Date range picker
- Pagination controls

**Deliverables:**
- Fungerande arkiv
- Snabb sökning och filtrering
- Komplett historik

---

## 🧪 Testing & Quality Assurance

### Testing Strategi

#### Unit Tests
**Vad:** Individuella funktioner och komponenter
**Verktyg:** Vitest + React Testing Library
**Coverage mål:** >70%

**Prioriterade områden:**
- Poäng-beräkningar (kritiskt!)
- Mål-progress beräkningar
- Datum/tid-logik (deadlines, expiration, recurring)
- Validering (forms)
- Utility functions

#### Integration Tests
**Vad:** Flera komponenter/features tillsammans
**Verktyg:** Vitest + React Testing Library

**Prioriterade flöden:**
- Skapa syssla → Claima → Slutföra → Godkänna → Poäng utbetalas
- Skapa mål → Slutför sysslor → Nå mål
- Registrering → Skapa hushåll → Bjud in medlem

#### End-to-End Tests
**Vad:** Hela user journeys
**Verktyg:** Playwright eller Cypress

**Kritiska flöden:**
- Ny användare onboarding
- Komplett syssla-livscykel
- Multi-household navigation
- Förälder/barn olika vyer

#### Manual Testing
**Uppgifter:**
- Testa på riktiga enheter (iPhone, Android, olika browsers)
- Testa med verkliga familjer (beta testers)
- Accessibility testing (keyboard, screen reader)
- Performance testing (Lighthouse)

### Testing Checklist
- ⬜ Unit tests för kritiska funktioner
- ⬜ Integration tests för huvudflöden
- ⬜ E2E tests för user journeys
- ⬜ Cross-browser testing (Chrome, Safari, Firefox)
- ⬜ Mobile device testing (iOS Safari, Chrome Android)
- ⬜ Performance testing (Lighthouse score >90)
- ⬜ Accessibility audit (WAVE, axe)
- ⬜ Security audit (OWASP top 10)
- ⬜ Beta testing med riktiga familjer

---

## 🚀 Deployment

### Pre-Deploy Checklist
- ⬜ All kritisk funktionalitet testad
- ⬜ Inga blocking bugs
- ⬜ Performance optimerad (Lighthouse >90)
- ⬜ SEO basics (meta tags, sitemap)
- ⬜ Error tracking setup (Sentry eller liknande)
- ⬜ Analytics setup (Plausible, Umami, eller GA)
- ⬜ Environment variables säkert hanterade
- ⬜ Database backups konfigurerade
- ⬜ SSL/HTTPS aktiverat
- ⬜ GDPR-compliance checkat (privacy policy, cookie consent)

### Deployment Plan

**1. Staging Environment**
- Deploy till staging (t.ex. staging.chorewar.app)
- Final testing på staging
- Beta testers får access

**2. Production Deploy**
- Deploy frontend till Vercel
- Backend/Database på Supabase (eller vald plattform)
- Custom domain setup (chorewar.app eller liknande)
- Monitor for errors första dagarna

**3. Monitoring**
- Setup error tracking (Sentry)
- Setup uptime monitoring (Better Uptime, Upptime)
- Setup analytics
- Dashboard för att följa usage

---

## 📈 Post-Launch

### Iteration Plan

**Vecka 1-2 efter launch:**
- ⬜ Fixa kritiska bugs omedelbart
- ⬜ Samla användarfeedback
- ⬜ Monitor performance och errors
- ⬜ Snabba UX-förbättringar baserat på feedback

**Månad 1:**
- ⬜ Analysera användarbeteende (vilka features används mest?)
- ⬜ Förbättra onboarding baserat på drop-off rate
- ⬜ Implementera mest efterfrågade små features
- ⬜ Performance-optimeringar

**Månad 2-3:**
- ⬜ Börja planera v2 features (från README future features)
- ⬜ Achievements & Badges
- ⬜ Streaks & Bonusar
- ⬜ Förbättrad statistik

**Månad 4-6:**
- ⬜ Public Vy
- ⬜ Belönings-Shop
- ⬜ Säsonger & Kampanjer

### Feedback Kanaler
- In-app feedback-formulär
- Email support
- User interviews (frivilliga beta testers)
- Analytics data

### Success Metrics att följa
- **DAU/MAU**: Hur många familjer använder appen dagligen/månadsvis
- **Retention**: Hur många kommer tillbaka efter 1 vecka, 1 månad
- **Chores Completion Rate**: % av claimade sysslor som blir godkända
- **Goal Achievement Rate**: % av mål som nås
- **Time to First Chore**: Hur snabbt skapar nya användare sin första syssla
- **NPS**: Net Promoter Score från användare

---

## 📝 Development Best Practices

### Code Organization

```
src/
├── components/
│   ├── ui/              # Återanvändbara UI-komponenter (Button, Input, etc.)
│   ├── chores/          # Syssla-relaterade komponenter
│   ├── dashboard/       # Dashboard-komponenter
│   ├── goals/           # Mål-komponenter
│   └── ...
├── pages/               # Route-komponenter
├── hooks/               # Custom React hooks
├── lib/                 # Utility functions, helpers
├── services/            # API calls, Supabase queries
├── types/               # TypeScript types och interfaces
├── constants/           # Konstanter, config
├── styles/              # Global styles, Tailwind config
└── assets/              # Bilder, ikoner, fonts
```

### Naming Conventions
- **Komponenter**: PascalCase (ChoreCard.tsx)
- **Hooks**: camelCase med "use" prefix (useChores.ts)
- **Utils**: camelCase (formatDate.ts)
- **Constants**: UPPER_SNAKE_CASE (MAX_CHILDREN_PER_HOUSEHOLD)
- **Types**: PascalCase (ChoreStatus, UserRole)

### Git Workflow
- **Main branch**: Produktionskod (alltid deploybar)
- **Develop branch**: Integration branch för development
- **Feature branches**: `feature/chore-creation`, `feature/dashboard`
- **Bugfix branches**: `bugfix/points-calculation`
- **Commit messages**: Conventional Commits format
  - `feat: Add chore creation form`
  - `fix: Correct points calculation for penalties`
  - `docs: Update README with setup instructions`
  - `style: Format code with Prettier`
  - `refactor: Simplify goal progress calculation`
  - `test: Add tests for chore lifecycle`

### Pull Request Process
1. Create feature branch
2. Implement feature with tests
3. Self-review code
4. Create PR with description
5. Code review
6. Address feedback
7. Merge to develop
8. Test on staging
9. Merge to main → Deploy

---

## 🎯 MVP Priority Matrix

### Must Have (P0) - Critical för launch
- ✅ Autentisering (email + Google)
- ✅ Hushåll och medlemshantering
- ✅ Barnprofiler (med och utan konto)
- ✅ Skapa och hantera sysslor
- ✅ Claima, slutföra, godkänna sysslor
- ✅ Poängsystem (total + periods)
- ✅ Enkla mål (individuella + kollektiva)
- ✅ Grundläggande dashboard med leaderboard
- ✅ In-app notifikationer
- ✅ Mobile-responsiv design

### Should Have (P1) - Viktigt men inte kritiskt
- ⭐ Kommentarer på sysslor
- ⭐ Bilduppladdning (sysslor, bevis)
- ⭐ Mallar för sysslor
- ⭐ Återkommande sysslor
- ⭐ Statistik och grafer
- ⭐ Arkiv/historik
- ⭐ Onboarding wizard
- ⭐ Inställningar (synlighet, etc.)

### Could Have (P2) - Nice to have
- ◆ Deadline och expiration på sysslor
- ◆ Pausa-funktion
- ◆ Penalty system
- ◆ Återkommande mål
- ◆ Avancerade filter och sök
- ◆ Export data

### Won't Have (v1) - Sparas till v2
- ❌ Public Vy
- ❌ Achievements & Badges
- ❌ Belönings-shop
- ❌ Vecko/månadspeng hantering
- ❌ Säsonger & Kampanjer
- ❌ Extended family access
- ❌ Push notifications
- ❌ Native iOS/Android apps

---

## 🏁 Definition of Done

En feature är KLAR när:
- ✅ Kod är skriven och fungerar enligt spec
- ✅ Kod är testad (unit/integration tests där relevant)
- ✅ UI är responsiv (mobile/tablet/desktop)
- ✅ Accessibility är säkerställd (keyboard nav, ARIA labels)
- ✅ Kod är reviewad av minst en annan person (eller self-review om solo)
- ✅ Dokumentation uppdaterad (om nödvändigt)
- ✅ Testad på flera browsers/devices
- ✅ Ingen breaking changes (eller om så, migrering planerad)
- ✅ Deployed till staging och verifierad

---

## 📞 Support Resources

### Dokumentation
- React: https://react.dev
- TypeScript: https://www.typescriptlang.org/docs
- Tailwind CSS: https://tailwindcss.com/docs
- Supabase: https://supabase.com/docs
- Prisma (om används): https://www.prisma.io/docs

### Communities
- React Discord
- Supabase Discord
- Stack Overflow
- Reddit: r/reactjs, r/webdev

### Design Inspiration
- Dribbble: Sök "family app", "gamification", "dashboard"
- Mobbin: Mobile app design patterns
- Duolingo: För gamification inspiration
- Kahoot: För lekfull UI inspiration

---

## 🎉 Slutord

Detta är en levande byggplan som kommer att uppdateras under projektets gång. Varje fas kan justeras baserat på lärdomar och feedback.

**Viktigt att komma ihåg:**
- **MVP först**: Bygg det enkla, perfekta kan komma senare
- **Testa tidigt och ofta**: Snabbare att fixa bugs innan de sprider sig
- **Användarfeedback**: Lyssna på riktiga användare, de vet bäst
- **Iterera**: Första versionen behöver inte vara perfekt
- **Ha kul**: Detta är ett roligt projekt som kommer hjälpa riktiga familjer!

**Let's build something awesome! 🚀**

---

*Senast uppdaterad: 2025-12-12*
