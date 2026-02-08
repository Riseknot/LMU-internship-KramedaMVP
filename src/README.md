# CareConnect - Care Management Platform MVP

Eine vollständige Pflege-Management-Plattform mit zwei Benutzerrollen (Coordinator und Helper), intelligentem Matching-System, Gamification und umfassenden Tools zur Entlastung pflegender Angehöriger.

## 🎯 Hauptfeatures

- **Zwei Benutzerrollen**: Coordinator (pflegende Angehörige) und Helper (Pflegekräfte)
- **Intelligentes Matching**: Automatische Helper-Empfehlungen basierend auf Nähe, Verfügbarkeit und Skills
- **Pflegegrad-Tool**: Automatische Anzeige verfügbarer Pflegeleistungen
- **Bedarfsermittlung**: Intelligente Optimierung der Zahlungsaufteilung
- **Gamification**: Level, Badges, Achievements und Streak-System
- **Einnahmen-Dashboard**: Detaillierte Statistiken mit Ampelsystem für Helper
- **GPS-Karte**: Geografische Übersicht aller Helper
- **Zertifizierungen**: Upload und Verwaltung von Nachweisen
- **Chat & Todos**: Kommunikation und Aufgabenverwaltung pro Auftrag

---

## 📁 Projektstruktur

```
/
├── App.tsx                          # Haupt-App-Komponente mit Routing
├── types/
│   └── index.ts                     # Alle TypeScript-Typen und Interfaces
├── hooks/
│   └── useAppState.ts               # Zentraler State-Management-Hook
├── services/
│   ├── mockData.ts                  # Mock-Daten für Entwicklung/Demo
│   └── matchingService.ts           # Matching-Algorithmus für Helper
├── pages/
│   ├── CoordinatorView.tsx          # Hauptansicht für Koordinatoren
│   └── HelperView.tsx               # Hauptansicht für Helper
├── components/
│   ├── LoginPage.tsx                # Login-Seite
│   ├── LoginAnimation.tsx           # Kolibri-Animation beim Login
│   ├── RegisterPage.tsx             # Registrierung
│   ├── DesktopSidebar.tsx          # Desktop-Navigation (Sidebar)
│   ├── MobileSidebar.tsx           # Mobile-Navigation (Sidebar)
│   ├── Dashboard.tsx                # Dashboard für Helper (veraltet, durch EarningsStatistics ersetzt)
│   ├── EarningsStatistics.tsx      # ⭐ Einnahmen-Dashboard mit Ampelsystem
│   ├── CareGradeProfile.tsx        # ⭐ Pflegegrad-Tool mit Leistungsübersicht
│   ├── NeedsCalculator.tsx         # ⭐ Bedarfsermittlung mit intelligentem Matching
│   ├── CareFinanceOverview.tsx     # Kostenübersicht für Koordinatoren
│   ├── GamificationPanel.tsx       # Gamification-Übersicht
│   ├── CertificationManager.tsx    # Zertifikats-Verwaltung
│   ├── AvailabilityManager.tsx     # Verfügbarkeits-Verwaltung (Wochenansicht)
│   ├── CreateAssignmentForm.tsx    # Auftragserstellung
│   ├── AssignmentCard.tsx          # Auftrags-Karte
│   ├── AssignmentListView.tsx      # Auftrags-Liste
│   ├── HelperRecommendations.tsx   # Helper-Empfehlungen
│   ├── HelperListView.tsx          # Helper-Liste
│   ├── MapView.tsx                  # GPS-Karte mit Helper-Positionen
│   ├── ChatModal.tsx                # Chat-Dialog
│   ├── TodoModal.tsx                # Todo-Dialog
│   ├── RatingForm.tsx               # Bewertungsformular
│   ├── TodoList.tsx                 # Todo-Liste
│   ├── Chat.tsx                     # Chat-Komponente
│   └── UserSwitcher.tsx             # User-Wechsler (Dev-Tool)
├── components/ui/                   # shadcn/ui Komponenten
│   ├── button.tsx
│   ├── card.tsx
│   ├── input.tsx
│   ├── select.tsx
│   ├── badge.tsx
│   ├── progress.tsx
│   ├── tabs.tsx
│   ├── dialog.tsx
│   ├── alert.tsx
│   └── ...                          # Weitere shadcn/ui Komponenten
└── styles/
    └── globals.css                  # Globale Styles + Tailwind CSS v4
```

---

## 🎮 Gamification anpassen

### Wo finde ich Gamification-Daten?

**Mock-Daten für Badges und Achievements:**
```
📁 /services/mockData.ts
```

Hier findest du die `mockUsers`-Array mit vordefinierten Badges:

```typescript
gamification: {
  level: 7,
  points: 3450,
  badges: [
    {
      id: 'badge-3',
      name: 'Zuverlässig',
      description: '10 Aufträge ohne Absage',
      icon: '⭐',
      earnedAt: '2026-01-15T10:00:00'
    },
    {
      id: 'badge-4',
      name: 'Top-Bewertet',
      description: '5x 5-Sterne Bewertung',
      icon: '🌟',
      earnedAt: '2026-01-25T15:00:00'
    },
    // Weitere Badges...
  ],
  streak: 35,
  completedAssignments: 24
}
```

### Neue Badges hinzufügen

**Option 1: In Mock-Daten (für Demo/Testing)**
```typescript
// In /services/mockData.ts
{
  id: 'badge-99',
  name: 'Schnellstarter',           // Badge-Name
  description: 'Ersten Auftrag innerhalb von 24h angenommen',  // Beschreibung
  icon: '🚀',                        // Emoji als Icon
  earnedAt: '2026-02-08T10:00:00'   // Zeitpunkt des Erhalts
}
```

**Option 2: Badge-Logik hinzufügen (für echte App)**
```typescript
// In /hooks/useAppState.ts oder einem neuen Badge-Service
const checkAndAwardBadges = (user: User, assignments: Assignment[]) => {
  const newBadges: Badge[] = [];
  
  // Beispiel: "Schnellstarter" Badge
  if (assignments.filter(a => a.helperId === user.id).length >= 1) {
    const firstAssignment = assignments.find(a => a.helperId === user.id);
    const acceptedQuickly = /* Logik hier */;
    
    if (acceptedQuickly) {
      newBadges.push({
        id: `badge-${Date.now()}`,
        name: 'Schnellstarter',
        description: 'Ersten Auftrag innerhalb von 24h angenommen',
        icon: '🚀',
        earnedAt: new Date().toISOString(),
      });
    }
  }
  
  return newBadges;
};
```

### Gamification-UI anpassen

**Komponente:**
```
📁 /components/GamificationPanel.tsx
```

Hier kannst du ändern:
- Layout der Badge-Anzeige
- Level-Berechnung (aktuell: Level = Math.floor(points / 500))
- Streak-Darstellung
- Achievement-Kategorien

---

## 💰 Pflegeleistungen und Geldquellen anpassen

### Wo finde ich die Liste der Pflegeleistungen?

**Zentrale Konfiguration:**
```
📁 /components/CareGradeProfile.tsx
```

Suche nach `CARE_SERVICES`:

```typescript
const CARE_SERVICES: CareService[] = [
  {
    id: '1',
    name: 'Entlastungsbetrag',
    paymentSource: 'entlastungsbetrag',
    careGrades: [1, 2, 3, 4, 5],    // Für welche Pflegegrade verfügbar
    maxAmount: 125,                  // Maximalbetrag in €
    hourlyRate: 30,                  // Stundensatz in €
    priority: 1,                     // Priorität für Bedarfsermittlung (1 = höchste)
    description: 'Monatlicher Zuschuss zur Entlastung pflegender Angehöriger',
  },
  // Weitere Leistungen...
];
```

### Neue Pflegeleistung hinzufügen

```typescript
{
  id: '9',
  name: 'Tages- und Nachtpflege',
  paymentSource: 'tagespflege',     // Neue PaymentSource erstellen
  careGrades: [2, 3, 4, 5],
  maxAmount: 689,                    // Für Pflegegrad 2
  hourlyRate: 0,                     // Falls nicht stundenweise
  priority: 6,
  description: 'Teilstationäre Pflege in Tages- oder Nachtpflegeeinrichtungen',
}
```

**Wichtig:** Neue `paymentSource` auch in Types hinzufügen:
```
📁 /types/index.ts
```

```typescript
export type PaymentSource = 
  | 'selbstzahler' 
  | 'entlastungsbetrag' 
  | 'pflegesachleistung' 
  | 'verhinderungspflege' 
  | 'kurzzeitpflege' 
  | 'zusatzbetreuung'
  | 'tagespflege';  // ← Neue Quelle
```

Und Farbe in EarningsStatistics hinzufügen:
```typescript
// In /components/EarningsStatistics.tsx
const PAYMENT_SOURCE_COLORS: Record<PaymentSource, string> = {
  // ... bestehende Farben
  tagespflege: '#14B8A6',  // Neue Farbe
};

const PAYMENT_SOURCE_LABELS: Record<PaymentSource, string> = {
  // ... bestehende Labels
  tagespflege: 'Tages- und Nachtpflege',  // Neues Label
};
```

---

## 📊 Bedarfsermittlung anpassen

### Wo finde ich die Matching-Logik?

**Komponente:**
```
📁 /components/NeedsCalculator.tsx
```

Die Logik befindet sich im `allocation` useMemo:

```typescript
const allocation = useMemo((): AllocationResult[] => {
  if (!careGrade || monthlyHours <= 0) return [];
  
  const results: AllocationResult[] = [];
  let remainingHours = monthlyHours;
  
  // Sortiere nach Priorität (niedrigere Nummer = höhere Priorität)
  const sortedServices = [...availableServices].sort((a, b) => a.priority - b.priority);
  
  for (const service of sortedServices) {
    if (remainingHours <= 0) break;
    if (service.hourlyRate === 0) continue;
    
    // Berechne wie viele Stunden diese Leistung abdecken kann
    const maxHoursByAmount = service.maxAmount / service.hourlyRate;
    const hoursToAllocate = Math.min(remainingHours, maxHoursByAmount);
    const amountToAllocate = hoursToAllocate * service.hourlyRate;
    
    // ... Rest der Logik
  }
  
  return results;
}, [careGrade, monthlyHours, preferredRate, availableServices]);
```

### Prioritäten anpassen

Ändere die `priority` in `CARE_SERVICES`:
- **Niedrigere Zahl = höhere Priorität**
- Die Bedarfsermittlung nutzt zuerst die Leistungen mit der niedrigsten Nummer

Beispiel:
```typescript
{
  name: 'Entlastungsbetrag',
  priority: 1,  // Wird ZUERST genutzt
},
{
  name: 'Pflegesachleistung',
  priority: 2,  // Wird DANACH genutzt
},
```

---

## 🎨 Design & Styling

### Farben anpassen

**Hauptdatei:**
```
📁 /styles/globals.css
```

Tailwind CSS v4 Custom Properties:

```css
@layer base {
  :root {
    /* Primärfarben (Dunkelblau) */
    --primary-50: 239 246 255;
    --primary-600: 37 99 235;
    --primary-700: 29 78 216;
    --primary-900: 30 58 138;
    
    /* Akzentfarben (Warmes Orange) */
    --accent-400: 251 146 60;
    --accent-500: 249 115 22;
    
    /* Erfolg/Warnung/Fehler */
    --success: 34 197 94;
    --warning: 234 179 8;
    --error: 239 68 68;
    
    /* Neutral */
    --neutral-50: 250 250 250;
    --neutral-700: 64 64 64;
    --neutral-900: 23 23 23;
  }
}
```

### Komponenten-Styling

Alle Komponenten nutzen:
- **Tailwind CSS v4** für Utility-Classes
- **shadcn/ui** Komponenten aus `/components/ui/`
- **Gradient-Designs** mit `bg-gradient-to-br`, `from-X`, `to-Y`
- **Animationen** mit `transition-all`, `duration-200`, `hover:scale-[1.02]`

Beispiel für konsistente Button-Styles:
```tsx
<button className="px-4 py-3 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-xl font-bold hover:shadow-lg transition-all duration-200 hover:scale-[1.01] active:scale-[0.99]">
  Klicken
</button>
```

---

## 🔧 Häufige Anpassungen

### 1. Neue Seite für Coordinator hinzufügen

**Schritt 1:** Komponente erstellen
```tsx
// /components/MeineNeueSeite.tsx
export function MeineNeueSeite() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Neue Seite</h2>
      {/* Inhalt */}
    </div>
  );
}
```

**Schritt 2:** In CoordinatorView einbinden
```tsx
// /pages/CoordinatorView.tsx
import { MeineNeueSeite } from '../components/MeineNeueSeite';

// In renderContent():
case 'neue-seite':
  return <MeineNeueSeite />;
```

**Schritt 3:** Navigation hinzufügen
```tsx
// /components/DesktopSidebar.tsx und /components/MobileSidebar.tsx
import { FileText } from 'lucide-react';  // Icon auswählen

const coordinatorMenuItems = [
  // ... bestehende Items
  { id: 'neue-seite', label: 'Neue Seite', icon: FileText },
];
```

### 2. Mock-Benutzer hinzufügen

```typescript
// /services/mockData.ts
export const mockUsers: User[] = [
  // ... bestehende User
  {
    id: 'helper-4',
    name: 'Neue Person',
    role: 'helper',
    email: 'neue.person@care.de',
    phone: '+49 30 99999999',
    zipCode: '10115',
    skills: ['Körperpflege', 'Mobilität'],
    coordinates: { lat: 52.5200, lng: 13.4050 },
    gamification: {
      level: 1,
      points: 0,
      badges: [],
      streak: 0,
      completedAssignments: 0,
    },
  },
];
```

### 3. Pflegegrad ändern

```typescript
// In /services/mockData.ts beim Coordinator-User:
{
  id: 'coord-1',
  name: 'Anna Schmidt',
  role: 'coordinator',
  careGrade: 4,  // ← Von 3 auf 4 ändern
  // ...
}
```

### 4. Einnahmen-Ampelsystem anpassen

```typescript
// /components/EarningsStatistics.tsx
const getTrafficLightStatus = (monthlyIncome: number) => {
  if (monthlyIncome >= 2000) {  // ← Schwellwert von 1500 auf 2000 ändern
    return {
      color: 'error',
      title: 'Rot: Selbstständigkeit empfohlen',
      // ...
    };
  } else if (monthlyIncome >= 1200) {  // ← Von 1000 auf 1200
    return {
      color: 'warning',
      title: 'Gelb: Einkommen steigt',
      // ...
    };
  }
  // ...
};
```

---

## 🗺️ Matching-Algorithmus anpassen

**Datei:**
```
📁 /services/matchingService.ts
```

Der Algorithmus berechnet einen Score aus:
- **Distanz** (50% Gewichtung)
- **Verfügbarkeit** (30% Gewichtung)
- **Skills** (20% Gewichtung)

```typescript
export function calculateHelperScore(
  helper: User,
  assignment: Assignment,
  availabilitySlots: AvailabilitySlot[]
): HelperScore {
  // Distanz-Score (0-100, höher ist besser)
  const distance = calculateDistance(
    helper.coordinates!,
    assignment.zipCode
  );
  const distanceScore = Math.max(0, 100 - (distance * 2));
  
  // Verfügbarkeits-Score
  const availabilityScore = checkAvailability(/* ... */);
  
  // Skill-Score
  const skillScore = calculateSkillMatch(
    helper.skills || [],
    assignment.requiredSkills
  );
  
  // Gesamt-Score (gewichtet)
  const totalScore = 
    (distanceScore * 0.5) +      // 50% Gewichtung
    (availabilityScore * 0.3) +  // 30% Gewichtung
    (skillScore * 0.2);          // 20% Gewichtung
  
  return {
    helperId: helper.id,
    helperName: helper.name,
    score: totalScore,
    distance,
    availabilityMatch: availabilityScore,
    skillMatch: skillScore,
  };
}
```

### Gewichtung ändern

```typescript
const totalScore = 
  (distanceScore * 0.4) +      // Distanz weniger wichtig
  (availabilityScore * 0.4) +  // Verfügbarkeit wichtiger
  (skillScore * 0.2);          // Skills gleich
```

---

## 📱 Mobile vs. Desktop

### Sidebar-Verhalten

**Desktop:**
```
📁 /components/DesktopSidebar.tsx
```
- Zeigt sich automatisch ab `lg` Breakpoint (1024px)
- Kann ein-/ausgeklappt werden
- Fixed Position links

**Mobile:**
```
📁 /components/MobileSidebar.tsx
```
- Overlay-Menü von rechts
- Wird über Button im Header geöffnet
- Schließt automatisch bei Navigation

### Responsive Design

Alle Komponenten nutzen Tailwind Responsive Prefixes:
- `sm:` - ab 640px
- `md:` - ab 768px
- `lg:` - ab 1024px
- `xl:` - ab 1280px

Beispiel:
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {/* 1 Spalte mobile, 2 tablet, 3 desktop */}
</div>
```

---

## 🎯 Wichtige shadcn/ui Komponenten

Alle UI-Komponenten sind aus shadcn/ui und befinden sich in `/components/ui/`:

- **`button.tsx`** - Buttons mit Varianten (default, outline, ghost, etc.)
- **`card.tsx`** - Card-Container
- **`badge.tsx`** - Status-Badges
- **`dialog.tsx`** - Modal-Dialoge
- **`input.tsx`** - Eingabefelder
- **`select.tsx`** - Dropdown-Selects
- **`tabs.tsx`** - Tab-Navigation
- **`progress.tsx`** - Fortschrittsbalken
- **`alert.tsx`** - Benachrichtigungen
- **`calendar.tsx`** - Kalender-Picker
- **`chart.tsx`** - Chart-Wrapper (verwendet Recharts)

### Neue shadcn Komponente hinzufügen

In einer echten Umgebung würdest du:
```bash
npx shadcn-ui@latest add [component-name]
```

Im Figma Make Kontext sind bereits alle gängigen Komponenten verfügbar.

---

## 🚀 Entwicklung

### State Management

Alle Daten werden in einem zentralen Hook verwaltet:
```
📁 /hooks/useAppState.ts
```

Wichtige Funktionen:
- `login(user)` - Benutzer einloggen
- `logout()` - Benutzer ausloggen
- `updateAssignment(id, updates)` - Auftrag aktualisieren
- `addChatMessage(message)` - Chat-Nachricht hinzufügen
- `updateAvailability(slots)` - Verfügbarkeit aktualisieren
- `addTodo(assignmentId, text)` - Todo hinzufügen

### TypeScript Types

Alle Types befinden sich in:
```
📁 /types/index.ts
```

Wichtigste Types:
- `User` - Benutzer (Helper oder Coordinator)
- `Assignment` - Auftrag
- `PaymentSource` - Zahlungsquelle
- `CareGrade` - Pflegegrad (1-5)
- `CareService` - Pflegeleistung
- `HelperEarning` - Einnahme eines Helpers
- `Badge` - Gamification Badge
- `GamificationData` - Gamification-Daten

---

## 📝 Notfall-Hotline ändern

**Desktop & Mobile Sidebar:**
```tsx
// /components/DesktopSidebar.tsx und /components/MobileSidebar.tsx
<a
  href="tel:+498001234567"  // ← Telefonnummer hier ändern
  className="..."
>
  <span className="text-xs">+49 800 123 4567</span>  // ← Anzeige hier ändern
</a>
```

---

## 🎨 Icons

Das Projekt nutzt **Lucide React** für alle Icons:

```tsx
import { Heart, Calendar, Users, Shield, Calculator } from 'lucide-react';

<Heart className="w-6 h-6 text-primary-600" />
```

Alle verfügbaren Icons: https://lucide.dev/icons/

---

## 💡 Tipps

1. **Konsistentes Design**: Nutze bestehende Komponenten als Vorlage für neue Features
2. **Tailwind-First**: Verwende Tailwind-Classes statt Custom CSS
3. **shadcn/ui**: Nutze die vorgefertigten UI-Komponenten für konsistentes UX
4. **TypeScript**: Definiere alle neuen Datenstrukturen in `/types/index.ts`
5. **Mock-Daten**: Teste neue Features zuerst mit Mock-Daten in `/services/mockData.ts`
6. **Responsive**: Denke immer an Mobile und Desktop gleichzeitig

---

## 🐛 Debugging

### User wechseln (Development)

Nutze den UserSwitcher (nur sichtbar wenn eingeloggt):
```tsx
// Ist bereits in App.tsx eingebunden
<UserSwitcher 
  users={users} 
  currentUser={currentUser} 
  onSwitchUser={switchUser} 
/>
```

### Console Logs

Wichtige Logs sind bereits in den Komponenten:
- Assignment-Akzeptanz
- Badge-Vergabe
- Pflegegrad-Änderungen
- Bedarfsermittlung-Ergebnisse

---

## ✅ Checkliste für neue Features

- [ ] TypeScript-Types in `/types/index.ts` definiert
- [ ] Mock-Daten in `/services/mockData.ts` erstellt
- [ ] Komponente erstellt (nutzt Tailwind + shadcn/ui)
- [ ] In entsprechende View eingefügt (CoordinatorView oder HelperView)
- [ ] Navigation in Sidebars hinzugefügt (Desktop + Mobile)
- [ ] Responsive Design getestet
- [ ] State Management in `useAppState.ts` erweitert (falls nötig)

---

## 📚 Weitere Ressourcen

- **Tailwind CSS v4**: https://tailwindcss.com/docs
- **shadcn/ui**: https://ui.shadcn.com/
- **Lucide Icons**: https://lucide.dev/
- **Recharts**: https://recharts.org/ (für Charts in EarningsStatistics)
- **React**: https://react.dev/

---

**Viel Erfolg bei der Entwicklung! 🚀**
