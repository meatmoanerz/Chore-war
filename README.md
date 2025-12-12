# Chore War 🎮

> En lekfull och engagerande app som förvandlar hemmasysslor till ett roligt familjespel

## 📖 Vision

Chore War är en familjeapp som kombinerar gamification med praktisk hushållsorganisation. Genom att göra sysslor till ett spel med poäng, belöningar och leaderboards, motiverar vi barn att ta ansvar för hemmet samtidigt som föräldrar får en tydlig överblick och verktyg för att organisera och belöna familjemedlemmarnas insatser.

Appen ska kännas **lekfull, modern och cool** - som Duolingo eller Kahoot fast för hemmasysslor - med en scandi-modern designkänsla som gör hela familjen glad när de öppnar den.

---

## 🎯 Målgrupp

- **Primär**: Familjer med barn i åldrarna 5-17 år
- **Sekundär**: Sammanslagna familjer, växelvis boende
- **Framtida**: Extended family (mor-/farföräldrar med begränsad access)

---

## ✨ Kärnfunktioner

### 👥 Användarhantering

#### Hushåll & Familjestruktur
- Ett vuxenkonto skapar hushållet
- Obegränsat antal vuxna kan bjudas in (alla har admin-rättigheter)
- Max 10 barn per hushåll (initialt)
- Barn kan vara medlemmar i **flera hushåll** (t.ex. mamma + pappa vid växelvis boende)
- Varje hushåll har **separata poängsaldon** för barnen

#### Barnkonton - Två alternativ

**Alternativ 1: Registrerat konto**
- Barn med egen mailadress kan skapa fullständigt konto
- Loggar in med email + lösenord eller Google

**Alternativ 2: Barnprofil (utan konto)**
- Förälder skapar barnprofil i systemet
- Föräldern får en unik **invite-kod** (t.ex. "FAMILY-1234")
- Barnet:
  1. Öppnar appen → "Jag har en kod"
  2. Anger invite-koden
  3. Väljer sitt namn från listan
  4. Skapar sin 4-siffriga PIN-kod
  5. Loggar in framöver med bara PIN
- Föräldrar kan återskapa/återställa PIN vid behov

#### Autentisering
- **Vuxna**: Email + lösenord ELLER Google login
- **Barn med konto**: Email + lösenord ELLER Google login
- **Barnprofiler**: 4-siffrig PIN-kod

---

### 🧹 Sysslor (Chores)

#### Grundläggande Funktionalitet
Föräldrar skapar sysslor som barn kan utföra för att tjäna poäng och belöningar.

#### Syssla-egenskaper

**Poäng & Belöningar**
- Varje syssla har ett **poängvärde** (föräldern bestämmer)
- Optional: **Extra belöning** (fritext, t.ex. "Får också en pizza till middag")
- Svårighetsgrader/kategorier kan användas som vägledning för poäng

**Tidshantering**
- **Beräknad tidsåtgång**: Dagar, timmar och/eller minuter
- **Deadline** (optional): "Måste vara klar innan 18:00" eller "Måste göras idag"
- **Expiration** (optional): Sysslan försvinner automatiskt efter X tid om den inte blir claimad

**Tilldelning**
- **Allmänna sysslor**: Synliga för alla, first-come-first-served
- **Tilldelade sysslor**: Kopplade till specifika barn
  - Endast tilldelade barn kan claima
  - Optional: Dölj för andra barn ELLER visa som "upptagen"
  - Föräldrar kan ändra tilldelning

**Visuellt & Socialt**
- **Bilder**: Föräldern kan lägga till instruktionsbilder (t.ex. hur rummet ska se ut städat)
- **Kommentarsfält**: Chat-funktion per syssla där familjen kan:
  - Ställa frågor
  - Dela uppdateringar
  - Ladda upp bilder (t.ex. "Kolla mamma, jag är klar! 📸")
  - Skapa familjeinteraktion

**Prioritering**
- Markera sysslor som **brådskande** eller **viktiga** (t.ex. rött utropstecken)

**Status**
- Draft (förberedelse)
- Publicerad (synlig för barn)
- Claimad (barn har tagit sysslan)
- Pausad (barn har satt på paus)
- Slutförd (väntar godkännande)
- Godkänd (poäng utbetalda)
- Expired (tiden gick ut)

#### Återkommande Sysslor
Föräldern kan sätta sysslor att återkomma automatiskt:
- **Intervall**: Varje dag, varje vecka, varannan vecka, varje månad
- **Specifika dagar**: "Varje måndag och torsdag"
- **Månadsspecifikt**: "Första dagen varje månad"

#### Syssla-flöde

**1. Skapande (Förälder)**
- Förälder skapar syssla
- Väljer mellan "Spara som draft" eller "Publicera nu"
- Kan skapa mallar för återanvändning

**2. Claiming (Barn)**
- Barn ser tillgängliga sysslor
- Klickar "Claima"
- Timer startar baserat på beräknad tidsåtgång
- Barn kan **unclaima** om de ångrar sig

**3. Under pågående syssla (Barn)**
- Barn kan **pausa** syssla → föräldrar får notifikation
- Appen påminner om tid håller på att gå ut
- Om sysslan tar **betydligt längre** än beräknad tid → föräldrar får varning

**4. Slutförande (Barn)**
- Barn klickar "Slutfört"
- Optional: Laddar upp bevis-bild
- Optional: Skriver kommentar

**5. Godkännande (Förälder)**
- Förälder får **notifikation** i appen
- Granskar sysslan (kan se bilder/kommentarer)
- Klickar **"Godkänn"** → Poäng betalas ut till barnet
- Kan ge **penalty** om sysslan inte slutfördes (belopp definierat i sysslan)

#### Mallar (Templates)
- **Fördefinierade mallar**: "Plocka ur diskmaskinen - 50p", "Damma - 100p", etc.
- **Egna mallar**: Föräldern kan spara sina vanliga sysslor som mallar
- Snabb-skapande från mall med möjlighet att justera detaljer

---

### 🏆 Poängsystem

#### Dubbel Bokföring
Varje barn har två typer av poäng:

**1. Total Poäng (Lifetime)**
- Växer kontinuerligt, nollställs **aldrig**
- Används för övergripande leaderboard
- Visar barnets totala insats över tid

**2. Period-Poäng (Vecka/Månad/År)**
- Nollställs efter varje period
- Används för att mäta mot mål
- Kan vara olika perioder för olika mål samtidigt

#### Poänghantering
- **Automatisk utbetalning**: När förälder godkänner syssla
- **Manuell justering**: Förälder kan när som helst lägga till eller dra av poäng (även utan koppling till syssla)
- **Penalty**: Definieras i sysslan, appliceras manuellt av förälder vid behov
- **Historik**: All poängförändring loggas med tidsstämpel och anledning

#### Separata Hushåll
Barn som är i flera hushåll har **separata poängsaldon** per hushåll:
- Barnet "Emma" kan ha 200p hos mamma och 300p hos pappa
- Poäng, mål och sysslor är helt separata mellan hushållen
- *Future feature: Transfer points mellan hushåll*

---

### 🎁 Mål & Belöningar

#### Typer av Mål

**Individuella Mål**
- Sätts per barn
- Kan vara **olika** för olika barn (t.ex. 5-åringen: 200p/vecka, 12-åringen: 500p/vecka)
- Belöning vid uppnått mål är individuell (t.ex. "Får sin veckopeng")

**Gemensamma Mål**
- Hela familjens poäng räknas ihop
- Alla får belöningen om målet nås (t.ex. "Hela familjen går på bio")
- Uppmuntrar teamwork och familjekänsla

#### Målperioder
- Veckomål
- Månadsmål
- Årsmål
- Custom period

#### Återkommande Mål
- Föräldern kan sätta mål att **automatiskt förnyas**
- T.ex. "Varje vecka ska barnen nå 300p för veckopeng"
- Förhindrar att föräldern måste skapa nya mål manuellt varje period

#### Belöningar
- **Fritext beskrivning**: "Får veckopeng", "Går på bio", "Väljer kvällsfilm"
- Kopplas till specifika mål
- Ingen numerisk hantering i v1 (bara beskrivningar)

---

### 📊 Dashboard & Statistik

#### Föräldravy Dashboard
- **Översikt**: Aktiva sysslor, väntande godkännanden, dagens aktivitet
- **Leaderboard**: Valbar vy (denna vecka / denna månad / all time)
- **Målprogress**: Visuella progress bars för individuella och gemensamma mål
- **Statistik**:
  - Antal slutförda sysslor per barn (idag/vecka/månad)
  - Claimed vs unclaimed sysslor
  - Genomsnittlig sysseltid
  - Streaks (dagar i rad med slutförda sysslor)
- **Historiska grafer**: Aktivitet över tid, poängutveckling
- **Arkiv**: Alla slutförda sysslor med filter och sökfunktion

#### Barnvy Dashboard
- **Mina mål**: Progress mot personliga mål
- **Familjemål**: Progress mot gemensamma mål
- **Tillgängliga sysslor**: Lista på vad som kan göras
- **Mina aktiva sysslor**: Vad jag håller på med just nu
- **Leaderboard**: Se sin placering (om aktiverat av förälder)
- **Min statistik**:
  - Totala poäng
  - Poäng denna vecka/månad
  - Antal slutförda sysslor
  - Min streak

#### Leaderboard-Vyer
Användare kan växla mellan:
- **Veckans leaderboard**: Baserat på veckans intjänade poäng
- **Månadens leaderboard**: Baserat på månadens intjänade poäng
- **All-time leaderboard**: Baserat på total lifetime poäng

---

### 🔔 Notifikationer

#### Notifikationstyper (In-App för v1)

**För Föräldrar:**
- Barn har claimat en syssla
- Barn har rapporterat syssla som slutförd → **Kräver godkännande**
- Barn har pausat en syssla
- Syssla tar längre tid än beräknat
- Barn har nått ett mål

**För Barn:**
- Syssla har godkänts → Poäng mottagna
- Ny syssla tilldelad till dig
- Påminnelse: Syssla närmar sig deadline
- Du har nått ett mål! 🎉

#### Notifikationsinställningar
Användare kan välja:
- **Allt**: Alla notifikationer
- **Det som gäller mig**: Endast personligt relevanta notifikationer
- **Inga**: Stäng av notifikationer

*Push notifications sparas till mobilapp-versionen*

---

### ⚙️ Inställningar

#### Hushållsinställningar (Föräldrar)

**Synlighet för Barn**
- Visa/dölj leaderboard för barn
- Barn kan se varandras poäng: Ja/Nej
- Barn kan se andras claimade sysslor: Ja/Nej

**Funktioner**
- Aktivera/inaktivera kommentarsfält på sysslor
- Notifikationsinställningar per användare

**Public Vy (v2)**
- PIN-kod för åtkomst till admin-funktioner

#### Personliga Inställningar
- Språk (Svenska initialt, i18n-redo)
- Notifikationspreferenser
- Tema (future: ljust/mörkt läge)

---

### 🖥️ Användarroller & Vyer

#### 1. Föräldravy (Admin)
**Full åtkomst till:**
- Skapa, redigera, ta bort sysslor
- Godkänna slutförda sysslor
- Skapa och hantera mål
- Justera poäng manuellt
- Bjuda in familjemedlemmar
- Se all statistik och historik
- Hantera inställningar
- Skapa och hantera mallar

#### 2. Barnvy
**Begränsad åtkomst:**
- Se tillgängliga sysslor
- Claima/unclaima sysslor
- Se syssladetaljer och instruktioner
- Rapportera syssla som slutförd
- Pausa pågående syssla
- Kommentera på sysslor (om aktiverat)
- Se egen statistik och progress
- Se leaderboard (om aktiverat)
- **Kan INTE**: Skapa sysslor, godkänna, justera poäng, ändra inställningar

#### 3. Public Vy (v2 - Future Feature)
**Dashboard på delad enhet (t.ex. iPad på kylskåpet):**
- Familjedashboard med progress
- Leaderboard
- Dagens tillgängliga sysslor
- Möjlighet att claima sysslor från vyn
- **Admin-funktioner**: Kräver förälder-PIN för att lägga till/ändra sysslor eller inställningar

---

## 🎨 Design & UX

### Designfilosofi
**Känsla**: Lekfull, modern, scandi, cool och rolig

**Inspiration**:
- **Duolingo**: Gamified learning, belöningskänsla, progress tracking
- **Kahoot**: Färgglad, energisk, tävlingsinriktad
- **Scandi-modern**: Ren, minimalistisk, men med personlighet

**Designprinciper**:
- **Glädje först**: Användaren ska bli glad när de öppnar appen
- **Tydlighet**: Information ska vara lätt att hitta och förstå
- **Playfulness**: Animationer, färger, illustrationer som gör det kul
- **Mobile-first**: Optimerad för touch och små skärmar
- **Responsiv**: Fungerar perfekt på alla enheter

### Visuella Element
- **Färgpalett**: Ljusa, glada färger med tillräcklig kontrast
- **Typografi**: Modern, lättläst sans-serif
- **Ikoner**: Tydliga, lekfulla, konsekventa
- **Illustrationer**: Enkla, roliga karaktärer eller element
- **Animationer**: Subtila mikrointeraktioner (poäng som "poppar", progress bars som fyller, konfetti vid mål)
- **Badges/Achievements**: Visuellt tilltalande ikoner

---

## 🧑‍🏫 Onboarding

### Första gången-upplevelse

**Steg 1: Välkommen**
- Kort intro till Chore War
- "Gör sysslor roliga för hela familjen!"

**Steg 2: Skapa hushåll**
- Namnge ditt hushåll (t.ex. "Familjen Andersson")
- Ladda upp profilbild för hushållet (optional)

**Steg 3: Lägg till familjemedlemmar**
- Bjud in andra vuxna via email
- Skapa barnprofiler eller skicka invite-koder

**Steg 4: Skapa din första syssla**
- Guidad skapandeprocess
- Förslag från mallar

**Steg 5: Sätt upp första målet**
- Skapa ett enkelt veckomål
- Förklara belöningssystemet

**Steg 6: Klar!**
- "Nu är du redo att börja!"
- Länk till hjälp/tutorial

**Viktigt**:
- Användaren kan **hoppa över** onboarding när som helst
- Onboarding kan återaktiveras från inställningar ("Visa guide igen")

---

## 🛠️ Teknisk Specifikation

### Plattform & Arkitektur

**Version 1: Webapp**
- Mobile-first responsive webb-app
- Fungerar i alla moderna browsers (Chrome, Safari, Firefox, Edge)
- PWA-kapabel (Progressive Web App) för app-liknande upplevelse

**Framtida versioner:**
- Native iOS app (Swift/React Native)
- Native Android app (Kotlin/React Native)

### Tech Stack (Att bestämmas i buildplan)
Kriterier för val:
- **Modern**: Uppdaterad och väl-supportad
- **Snabb**: Optimal performance
- **Responsiv**: Fungerar sömlöst på mobil
- **Skalbar**: Kan växa med appen
- **i18n-redo**: Enkel internationalisering

### Funktionella Krav
- **Realtidsuppdateringar**: När barn claimar sysslor ska det synas direkt för föräldrar
- **Offline-support**: Ej prioriterat i v1 (förutsätter internetanslutning)
- **Bilduppladdning**: Support för kamera och galleri
- **Responsiv design**: Fungerar från 320px till desktop
- **Säkerhet**:
  - Krypterade lösenord
  - Säker autentisering (JWT eller liknande)
  - Roll-baserad åtkomstkontroll
  - GDPR-kompatibel datahantering

### Databas
- Måste hantera relationer mellan hushåll, användare, sysslor, mål, poäng, historik
- Skalbar för att hantera arkiv över tid
- Snabba queries för dashboard och statistik

### Internationalisering (i18n)
- **Svenska** som huvudspråk i v1
- Arkitektur förberedd för enkel översättning
- Alla texter i språkfiler (ej hårdkodade)
- Framtida språk: Engelska, Norska, Danska, Finska

---

## 📦 MVP vs Framtida Features

### ✅ Version 1 (MVP)

**Must-have för första versionen:**
- Användarhantering (vuxna + barn, registrerade konton + barnprofiler)
- Autentisering (email/lösenord + Google)
- Skapa och hantera hushåll
- Barn kan vara i flera hushåll
- Grundläggande sysslor (skapa, claima, slutföra, godkänna)
- Poängsystem (total + period)
- Individuella och gemensamma mål
- Enkel dashboard (leaderboard, progress, dagens sysslor)
- Kommentarsfält på sysslor
- Bilduppladdning
- In-app notifikationer
- Grundläggande statistik
- Arkiv över slutförda sysslor
- Onboarding
- Mallar för vanliga sysslor
- Svenskt språk

**Ska fungera men kan vara enkelt:**
- Statistik (kan börja basic, förbättras senare)
- Dashboard (grundläggande design, kan förfinas)

---

### 🚀 Framtida Features (v2+)

**Public Vy**
- Dashboard för delad enhet (iPad på väggen)
- PIN-skydd för admin-funktioner
- Familjeöversikt i realtid

**Extended Family Access**
- Mor-/farföräldrar kan få read-only eller begränsad access
- Se barnbarnens progress
- Optional: Kunna sätta upp egna belöningar

**Avancerad Syssla-hantering**
- Avvisa syssla med feedback från förälder
- "Gör om"-funktion om syssla inte är bra gjord
- Flera barn måste godkänna gemensamt (peer-review)

**Belönings-Shop**
- Barn kan "spendera" poäng på belöningar
- Föräldrar skapar belöningar med poängkostnad
- Virtuell shop-upplevelse

**Ekonomi-hantering**
- Vecko-/månadspeng kopplad till mål
- "Bank"-funktion där barn ser sitt sparade belopp
- Transfer points mellan hushåll
- Riktiga pengatransaktioner (Swish-integration?)

**Achievements & Badges**
- "Städat 10 gånger i rad"
- "Veckans hjälte"
- "Snabbaste städaren"
- Visuella badges på profil

**Streaks & Bonusar**
- Bonuspoäng för att göra sysslor flera dagar i rad
- "Combo"-system som i spel
- Streak-protection (en missat dag förstör inte streak om man har "lives")

**Säsonger & Kampanjer**
- Tidsbegränsade events ("Sommarloppet", "Julstädningen")
- Extra poäng och specialbelöningar
- Tematiska utmaningar

**Sociala Funktioner**
- Reaktioner/emojis på slutförda sysslor
- "Grattis!"-meddelanden mellan barn
- Familje-feed med aktivitet

**Avancerad Statistik**
- Detaljerade grafer och analyser
- Jämförelser över tid
- Insikter ("Emma gör flest sysslor på söndagar")
- Export till Excel/PDF

**Tema & Anpassning**
- Ljust/mörkt läge
- Anpassningsbara färger per hushåll
- Profilbilder och avatarer
- Custom ikoner för syssla-kategorier

**Notifikationer**
- Push notifications (mobilapp)
- Email-notifikationer (optional)
- SMS-påminnelser (optional)

**Smart Automation**
- AI-förslag på sysslor baserat på mönster
- Automatisk poängjustering baserat på svårighet/tid
- "Smart scheduling" som föreslår optimala tider

---

## 🔒 Säkerhet & Privacy

### Datasäkerhet
- All data krypteras i transit (HTTPS)
- Lösenord hashas med bcrypt eller liknande
- Säker session-hantering
- Roll-baserad åtkomstkontroll (RBAC)

### GDPR-Compliance
- Användare kan exportera sin data
- Användare kan ta bort sitt konto och all associerad data
- Tydliga integritetspolicyer
- Minimera datainsamling (endast vad som behövs)
- Ingen delning med tredje part utan explicit samtycke

### Barns Säkerhet
- Barnprofiler utan email är extra skyddade (endast PIN)
- Föräldrar har full kontroll över barnens konton
- Ingen möjlighet för barn att kommunicera utanför familjen

---

## 📱 Responsiv Design

### Breakpoints
- **Mobile**: 320px - 767px (primär fokus)
- **Tablet**: 768px - 1023px
- **Desktop**: 1024px+

### Mobile-First Approach
- Designa för mobil först
- Progressivt förbättra för större skärmar
- Touch-optimerade kontroller (minst 44x44px touch targets)
- Thumb-friendly navigation (viktiga knappar inom räckhåll)

---

## 🌍 Internationalisering

### Fas 1: Svenska
- All initial utveckling på svenska
- Svenskt datumformat, valuta, etc.

### Fas 2: i18n-arkitektur
- Separera all text från kod
- Använd i18n-bibliotek (t.ex. i18next)
- Support för olika datumformat, valutor, etc.

### Fas 3: Expansion
- Engelska (internationell marknad)
- Nordiska språk (Norge, Danmark, Finland)
- Fler språk baserat på efterfrågan

---

## 📈 Success Metrics

### Användarengagemang
- **Daily Active Users (DAU)**: Familjer som använder appen dagligen
- **Chores Completion Rate**: % av claimade sysslor som slutförs
- **Goal Achievement Rate**: % av mål som nås
- **Retention**: Familjer som fortsätter använda efter 1 månad, 3 månader, 6 månader

### Funktionalitet
- **Time to First Chore**: Hur snabbt skapar föräldrar sin första syssla
- **Time to Completion**: Genomsnittlig tid från claim till godkänd
- **User Satisfaction**: NPS (Net Promoter Score) från föräldrar och barn

### Teknisk Performance
- **Load Time**: < 2 sekunder på 4G
- **Uptime**: 99.9%
- **Error Rate**: < 0.1%

---

## 🗺️ Roadmap Overview

### Q1: Foundation (MVP)
- Grundläggande användarhantering
- Sysslor (skapa, claima, slutföra)
- Poäng och mål
- Enkel dashboard
- Deploy v1

### Q2: Enhancement
- Förbättrad statistik och visualiseringar
- Achievements och badges
- Streaks och bonusar
- Mallar och automation

### Q3: Social & Gamification
- Belönings-shop
- Säsonger och kampanjer
- Förbättrad social interaktion
- Public vy

### Q4: Expansion
- iOS och Android native apps
- Extended family features
- Ekonomi-hantering (vecko-/månadspeng)
- Internationalisering (engelska)

---

## 👨‍💻 Utvecklingsprinciper

### Code Quality
- Ren, läsbar kod
- Kommentarer där logiken inte är självklar
- Konsekvent kodstil
- Automated testing (unit, integration, e2e)

### Agile Development
- Iterativ utveckling
- Regelbundna releases
- Användare-feedback driven
- MVP-först, sedan förbättra

### Performance
- Optimera för mobil
- Lazy loading av bilder och komponenter
- Minimera bundle size
- Cachning där lämpligt

### Accessibility
- WCAG 2.1 AA standard
- Keyboard navigation
- Screen reader support
- Tillräcklig färgkontrast

---

## 📞 Support & Community

### In-App Help
- FAQ-sektion
- Interaktiva tutorials
- Tooltips och hints

### Feedback-Kanaler
- In-app feedback-formulär
- Email support
- Community forum (framtida)

---

## 🎉 Slutord

Chore War är mer än en app - det är ett verktyg för att stärka familjeband, lära barn ansvar och göra vardagen lite roligare. Med rätt mix av gamification, funktionalitet och design kan vi skapa något som familjer älskar att använda varje dag.

**Let's make chores fun! 🚀**

---

*Detta dokument är en levande guide som uppdateras allt eftersom projektet utvecklas. Se `buildplan.md` för detaljerad utvecklingsplan.*
