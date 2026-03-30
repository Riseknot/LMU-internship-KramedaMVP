# UI-Guidelines - Tailwind CSS & shadcn/ui

## ✅ Design-Prinzipien

Alle UI-Komponenten in CareConnect folgen diesen Prinzipien:

1. **Tailwind CSS v4** - Ausschließlich Utility-Classes, kein Custom CSS
2. **shadcn/ui** - Wiederverwendbare, barrierefreie Komponenten
3. **Konsistente Farbpalette** - Primärfarbe (Dunkelblau) + Akzent (Orange)
4. **Moderne Gradienten** - Subtile Farbverläufe für Tiefe
5. **Micro-Animationen** - Smooth Transitions für bessere UX
6. **Mobile-First** - Responsive Design mit Tailwind Breakpoints

---

## 🎨 Tailwind CSS v4 Nutzung

### ✅ Richtig (Tailwind Utility Classes)

```tsx
// Gutes Beispiel - Nur Tailwind Classes
<div className="p-6 bg-white rounded-xl border border-neutral-200 shadow-sm hover:shadow-md transition-all duration-200">
  <h3 className="text-lg font-bold text-neutral-900 mb-4">Titel</h3>
  <p className="text-sm text-neutral-600">Beschreibung</p>
</div>
```

### ❌ Falsch (Custom CSS)

```tsx
// Schlechtes Beispiel - Vermeiden!
<div className="custom-card">  {/* ❌ Custom Class */}
  <h3 style={{ fontSize: '18px' }}>Titel</h3>  {/* ❌ Inline Styles */}
</div>

/* In CSS-Datei: */
.custom-card {  /* ❌ Custom CSS Class */}
  padding: 24px;
  background: white;
}
```

---

## 🧩 shadcn/ui Komponenten

### Verfügbare Komponenten

Alle shadcn/ui Komponenten befinden sich in `/components/ui/`:

```
components/ui/
├── button.tsx          # Buttons (Primary, Secondary, Ghost, etc.)
├── card.tsx            # Card-Container
├── badge.tsx           # Status-Badges
├── dialog.tsx          # Modal-Dialoge
├── input.tsx           # Eingabefelder
├── select.tsx          # Dropdown-Selects
├── tabs.tsx            # Tab-Navigation
├── progress.tsx        # Fortschrittsbalken
├── alert.tsx           # Alert-Boxen
├── calendar.tsx        # Datum-Picker
└── ...                 # Weitere Komponenten
```

### Verwendung

```tsx
import { Button } from './components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from './components/ui/card';
import { Badge } from './components/ui/badge';

function MeineKomponente() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Titel</CardTitle>
      </CardHeader>
      <CardContent>
        <Badge>Neu</Badge>
        <Button>Klicken</Button>
      </CardContent>
    </Card>
  );
}
```

---

## 🎨 Farb-System

### Primärfarbe (Dunkelblau)

```tsx
// Hintergründe
bg-primary-50      // Sehr helles Blau
bg-primary-100     // Helles Blau
bg-primary-600     // Standard Blau
bg-primary-700     // Dunkles Blau
bg-primary-900     // Sehr dunkles Blau

// Text
text-primary-600   // Blauer Text
text-primary-900   // Dunkelblauer Text

// Borders
border-primary-200 // Helle blaue Border
border-primary-600 // Standard blaue Border

// Gradienten (häufig verwendet)
bg-gradient-to-br from-primary-700 via-primary-800 to-primary-900
```

### Akzentfarbe (Warmes Orange)

```tsx
bg-accent-400      // Helles Orange
bg-accent-500      // Standard Orange
text-accent-500    // Oranger Text

// Gradienten
bg-gradient-to-r from-accent-400 to-accent-500
```

### Status-Farben

```tsx
// Erfolg (Grün)
bg-success         // #22C55E
text-success
border-success

// Warnung (Gelb)
bg-warning         // #EAB308
text-warning
border-warning

// Fehler (Rot)
bg-error           // #EF4444
text-error
border-error
```

### Neutrale Farben

```tsx
// Grau-Skala
bg-neutral-50      // Fast weiß
bg-neutral-100     // Sehr hell
bg-neutral-200     // Hell (Borders)
bg-neutral-600     // Mittel
bg-neutral-700     // Dunkel (Text)
bg-neutral-900     // Sehr dunkel
```

---

## 🎯 Häufige Patterns

### 1. Card mit Gradient Header

```tsx
<div className="bg-white rounded-xl border border-neutral-200 shadow-sm overflow-hidden">
  {/* Gradient Header */}
  <div className="bg-gradient-to-br from-primary-700 via-primary-800 to-primary-900 text-white p-6">
    <h2 className="text-2xl font-bold">Titel</h2>
    <p className="text-primary-100 text-sm">Untertitel</p>
  </div>
  
  {/* Content */}
  <div className="p-6">
    <p>Inhalt...</p>
  </div>
</div>
```

### 2. Hover-Effekte

```tsx
{/* Card mit Hover */}
<div className="bg-white rounded-xl border border-neutral-200 p-6 hover:shadow-lg transition-all duration-200 cursor-pointer">
  Inhalt
</div>

{/* Button mit Scale */}
<button className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:scale-[1.02] active:scale-[0.98] transition-all duration-200">
  Klicken
</button>
```

### 3. Responsive Grid

```tsx
{/* 1 Spalte mobile, 2 tablet, 3 desktop */}
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
</div>
```

### 4. Flex Container

```tsx
{/* Space Between */}
<div className="flex items-center justify-between">
  <span>Links</span>
  <span>Rechts</span>
</div>

{/* Centered */}
<div className="flex items-center justify-center gap-3">
  <Icon />
  <span>Zentriert</span>
</div>
```

### 5. Status Badge

```tsx
import { Badge } from './components/ui/badge';

{/* Grünes Badge */}
<Badge className="bg-success/10 text-success border-success/30">
  Aktiv
</Badge>

{/* Rotes Badge */}
<Badge className="bg-error/10 text-error border-error/30">
  Fehler
</Badge>
```

### 6. Icon + Text

```tsx
import { Calendar } from 'lucide-react';

<div className="flex items-center gap-2 text-neutral-700">
  <Calendar className="w-4 h-4" />
  <span className="text-sm">10. Februar 2026</span>
</div>
```

### 7. Gradient Button

```tsx
<button className="px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-[1.01] active:scale-[0.99]">
  Primärer Button
</button>

<button className="px-6 py-3 bg-gradient-to-r from-accent-400 to-accent-500 text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-[1.01] active:scale-[0.99]">
  Akzent Button
</button>
```

### 8. Input Field

```tsx
<div>
  <label className="block text-sm font-medium text-neutral-700 mb-2">
    E-Mail
  </label>
  <input
    type="email"
    className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
    placeholder="name@example.com"
  />
</div>
```

### 9. Alert Box

```tsx
<div className="flex items-start gap-3 p-4 bg-warning/10 rounded-lg border border-warning/30">
  <AlertCircle className="w-5 h-5 text-warning flex-shrink-0 mt-0.5" />
  <div className="text-sm text-warning-dark">
    <p className="font-medium">Warnung</p>
    <p>Dies ist eine Warnmeldung.</p>
  </div>
</div>
```

### 10. Progress Bar

```tsx
<div className="space-y-2">
  <div className="flex items-center justify-between text-sm">
    <span className="text-neutral-600">Fortschritt</span>
    <span className="font-bold text-neutral-900">75%</span>
  </div>
  <div className="w-full bg-neutral-200 rounded-full h-2">
    <div 
      className="bg-gradient-to-r from-primary-600 to-primary-700 h-2 rounded-full transition-all duration-500"
      style={{ width: '75%' }}
    />
  </div>
</div>
```

---

## 🎭 Animationen

### Transition Classes

```tsx
// Standard Transition
transition-all duration-200

// Farb-Transition
transition-colors duration-200

// Transform-Transition
transition-transform duration-200

// Opacity-Transition
transition-opacity duration-300
```

### Scale Effekte

```tsx
// Hover Scale Up
hover:scale-[1.02]

// Active Scale Down
active:scale-[0.98]

// Kombiniert
hover:scale-[1.02] active:scale-[0.99]
```

### Shadow Transitions

```tsx
// Von keinem Schatten zu Schatten
shadow-sm hover:shadow-md transition-all duration-200

// Von Schatten zu großem Schatten
shadow-lg hover:shadow-xl transition-all duration-200

// Farbiger Schatten
shadow-lg shadow-primary-200
```

---

## 📐 Spacing System

### Padding

```tsx
p-2     // 8px
p-3     // 12px
p-4     // 16px
p-6     // 24px
p-8     // 32px

// Directional
px-4    // Horizontal
py-3    // Vertical
pt-6    // Top
pb-6    // Bottom
pl-4    // Left
pr-4    // Right
```

### Margin

```tsx
m-2     // 8px
m-4     // 16px
m-6     // 24px

// Directional (gleich wie padding)
mx-auto // Zentriert horizontal
mt-4    // Top margin
mb-6    // Bottom margin
```

### Gap (für Flex/Grid)

```tsx
gap-2   // 8px
gap-3   // 12px
gap-4   // 16px
gap-6   // 24px

// Directional
gap-x-4 // Horizontal
gap-y-6 // Vertical
```

---

## 📝 Typography

### Font Sizes

```tsx
text-xs     // 12px
text-sm     // 14px
text-base   // 16px
text-lg     // 18px
text-xl     // 20px
text-2xl    // 24px
text-3xl    // 30px
```

### Font Weights

```tsx
font-normal   // 400
font-medium   // 500
font-semibold // 600
font-bold     // 700
```

### Line Height

```tsx
leading-tight   // 1.25
leading-normal  // 1.5
leading-relaxed // 1.625
```

---

## 🔄 Responsive Breakpoints

```tsx
// Mobile First Approach
sm:   // ≥ 640px
md:   // ≥ 768px
lg:   // ≥ 1024px
xl:   // ≥ 1280px
2xl:  // ≥ 1536px

// Beispiel
<div className="w-full md:w-1/2 lg:w-1/3">
  {/* 100% mobile, 50% tablet, 33% desktop */}
</div>
```

---

## 🎨 Gradient Kombinationen

### Header Gradienten

```tsx
// Primär
bg-gradient-to-br from-primary-700 via-primary-800 to-primary-900

// Akzent
bg-gradient-to-r from-accent-400 to-accent-500

// Success
bg-linear-to-r from-success/90 to-success
```

### Button Gradienten

```tsx
// Primär Button
bg-gradient-to-r from-primary-600 to-primary-700

// Akzent Button
bg-gradient-to-r from-accent-400 to-accent-500

// Gefährlicher Button (Notfall)
bg-linear-to-r from-error/90 to-error
```

### Card Gradienten (Subtle)

```tsx
// Sehr subtil
bg-gradient-to-br from-neutral-50 to-white

// Primary Hint
bg-gradient-to-br from-primary-50 to-primary-100

// Accent Hint
bg-gradient-to-br from-accent-50 to-accent-100
```

---

## 🚀 Neue Komponente erstellen - Checkliste

- [ ] **Nur Tailwind Classes** - Kein Custom CSS
- [ ] **shadcn/ui nutzen** - Falls passende Komponente existiert
- [ ] **Lucide Icons** - Für alle Icons
- [ ] **Konsistente Farben** - Primary, Accent, Status-Farben
- [ ] **Responsive** - Mobile-First mit Breakpoints
- [ ] **Hover States** - Für interaktive Elemente
- [ ] **Transitions** - Smooth Animationen
- [ ] **Spacing** - Konsistentes Padding/Margin (4, 6, 8)
- [ ] **Typography** - Korrekte Font-Sizes und Weights
- [ ] **Accessibility** - Labels, ARIA-Attributes

---

## 💡 Best Practices

### 1. Wiederverwendbare Patterns

Statt denselben Code zu wiederholen, erstelle eine Komponente:

```tsx
// ✅ Gut
function StatusCard({ status, title, value }) {
  return (
    <div className="bg-white rounded-xl border border-neutral-200 p-6">
      <Badge className={status === 'active' ? 'bg-success/10' : 'bg-neutral-100'}>
        {status}
      </Badge>
      <h3 className="text-lg font-bold mt-4">{title}</h3>
      <p className="text-3xl font-bold text-primary-700">{value}</p>
    </div>
  );
}

// Verwenden
<StatusCard status="active" title="Aktive Aufträge" value={5} />
```

### 2. Conditional Classes

```tsx
// ✅ Gut mit Template Literals
<div className={`px-4 py-2 rounded-lg ${
  isActive 
    ? 'bg-primary-600 text-white' 
    : 'bg-neutral-100 text-neutral-700'
}`}>
  Status
</div>

// Oder mit clsx/cn helper (falls verfügbar)
<div className={cn(
  'px-4 py-2 rounded-lg',
  isActive ? 'bg-primary-600 text-white' : 'bg-neutral-100 text-neutral-700'
)}>
  Status
</div>
```

### 3. Accessibility

```tsx
// ✅ Immer Labels für Inputs
<label htmlFor="email" className="block text-sm font-medium mb-2">
  E-Mail
</label>
<input id="email" type="email" />

// ✅ ARIA für Icons ohne Text
<button aria-label="Schließen">
  <X className="w-4 h-4" />
</button>

// ✅ Screen Reader Text
<span className="sr-only">Für Screen Reader</span>
```

---

## 📦 shadcn/ui Button Varianten

```tsx
import { Button } from './components/ui/button';

// Default (Primary)
<Button>Standard</Button>

// Secondary
<Button variant="secondary">Sekundär</Button>

// Outline
<Button variant="outline">Outline</Button>

// Ghost
<Button variant="ghost">Ghost</Button>

// Destructive
<Button variant="destructive">Löschen</Button>

// Link Style
<Button variant="link">Link</Button>

// Größen
<Button size="sm">Klein</Button>
<Button size="default">Normal</Button>
<Button size="lg">Groß</Button>
```

---

## 🎯 Zusammenfassung

**Kernprinzip:** Alles mit Tailwind CSS Utility Classes bauen, shadcn/ui Komponenten nutzen wo möglich, konsistentes Design-System einhalten.

**Niemals:**
- ❌ Custom CSS Classes erstellen
- ❌ Inline Styles verwenden (außer für dynamische Werte wie `width: ${percent}%`)
- ❌ Inkonsistente Farben oder Spacing verwenden

**Immer:**
- ✅ Tailwind Utility Classes
- ✅ shadcn/ui Komponenten
- ✅ Konsistente Farben (Primary, Accent, Status)
- ✅ Responsive Design
- ✅ Smooth Transitions
- ✅ Accessibility beachten

---

**Happy Coding! 🎨**
