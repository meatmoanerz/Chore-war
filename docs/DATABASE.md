# Databas – Chore War

Schemat ligger i Supabase-projektet `ChoreWar-app` och har applicerats som namngivna migrations:
`chorewar_core_schema`, `chorewar_rls_policies`, `chorewar_workflow_functions`.

## Tabeller

| Tabell | Beskrivning |
|---|---|
| `profiles` | Skapas automatiskt vid registrering (trigger på `auth.users`). För-/efternamn. |
| `households` | Hushåll med unika koder: `adult_code` (VUXEN-XXXXXX) och `child_code` (BARN-XXXXXX). |
| `household_members` | Medlemskap med roll `adult`/`child`. Unik per (hushåll, användare). |
| `chores` | Sysslor. Status: draft, open, claimed, paused, submitted, approved, rejected, expired. Poäng, avdrag, bonus, deadline, expires_at, urgent, tilldelning, recurrence. |
| `chore_comments` | Kommentarer (text + bild) per syssla. |
| `point_transactions` | Poängliggare (dubbel bokföring). Saldon beräknas alltid härifrån. |
| `goals` | Individuella/gemensamma mål med period, poängmål och belöning. |
| `notifications` | In-app-notiser per mottagare. Realtime aktiverat. |
| `chore_templates` | Mallar. `household_id = null` = globala standardmallar (10 st seedade). |

## RPC-funktioner (security definer)

- `create_household(p_name)` – skapar hushåll + koder, gör skaparen till vuxen
- `join_household(p_code)` – går med via kod, rollen bestäms av koden
- `claim_chore / unclaim_chore / pause_chore / resume_chore(p_chore)`
- `submit_chore(p_chore, p_proof_url, p_comment)` – lämnar in, notifierar vuxna
- `approve_chore(p_chore)` – betalar ut poäng, notifierar barnet, skapar nästa instans om återkommande
- `reject_chore(p_chore, p_apply_penalty, p_reason)` – avvisar, ev. poängavdrag
- `adjust_points(p_household, p_user, p_amount, p_reason)` – manuell justering (vuxen)

## Säkerhet

RLS aktiverat på samtliga tabeller. Hjälpfunktioner `is_member(h)`, `is_adult(h)`, `shares_household(u)`.
Barn kan inte skapa/ändra sysslor direkt – alla statusövergångar går via RPC:erna som validerar roll och ägarskap.
Storage-bucket `chore-images` (publik läsning, skrivning kräver inloggning).
