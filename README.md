# ⚡ Chore War

Gör hemsysslor roliga! En gamifierad hemsyssle-app för familjer där barn (och vuxna) tjänar poäng på sysslor, tävlar på topplistan och jobbar mot belöningsmål.

**Live:** https://chore-war.vercel.app

## Funktioner (MVP)

- 🔐 Konto med mejl + lösenord (Supabase Auth)
- 🏡 Hushåll med inbjudningskoder – en kod för vuxna, en för barn (koden styr rollen)
- 🧹 Sysslor: poäng, beskrivning, beräknad tid, deadline, "försvinner om ej tagen", brådskande-flagga, tilldelning, återkommande (dag/vecka/varannan/månad), utkast, mallar
- 💪 Flöde: Ledig → Tagen → (Pausad) → Inlämnad → Godkänd/Avvisad
- 📸 Bevis-bild vid inlämning + kommentarer med bilder
- ⚡ Poängliggare (dubbel bokföring) – godkännande betalar ut, avvisning kan ge avdrag, manuell justering av vuxen
- 🎯 Mål: individuella och gemensamma med period, poängmål och belöning
- 🏆 Topplista: vecka / månad / all time med medaljer
- 🔔 Notiser i appen (realtid)

## Teknik

- **Frontend:** React 18 + Vite + TypeScript + Tailwind CSS, mobile-first
- **Backend:** Supabase (Postgres, Auth, Storage, Realtime, RLS)
- **Hosting:** Vercel (auto-deploy från `main`)

All affärslogik (claima, lämna in, godkänna, poängutbetalning, notiser, återkommande sysslor) ligger i Postgres-funktioner med `security definer` – klienten anropar RPC:er. Row Level Security skyddar all data per hushåll och roll. Se [docs/DATABASE.md](docs/DATABASE.md).

## Kom igång lokalt

```bash
npm install
cp .env.example .env   # fyll i dina Supabase-värden
npm run dev
```

`.env`:
```
VITE_SUPABASE_URL=https://<ditt-projekt>.supabase.co
VITE_SUPABASE_ANON_KEY=<din-anon-key>
```

## Deploy

Push till `main` → Vercel bygger och deployar. Miljövariablerna ovan måste finnas i Vercel-projektets inställningar. `vercel.json` innehåller SPA-rewrite för client-side routing.
