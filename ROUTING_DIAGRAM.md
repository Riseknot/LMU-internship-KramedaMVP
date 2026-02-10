# CareConnect - Routing & Struktur Diagramm

## Flussdiagramm der Anwendung

```mermaid
graph TD
    A["App.tsx"] --> B{Authentifiziert?}
    
    B -->|Nein| C["LoginPage / RegisterPage"]
    B -->|Ja| D{Nutzer-Rolle?}
    
    D -->|helper| E["HelperView"]
    D -->|coordinator| F["CoordinatorView"]
    
    E --> E1["activePage State"]
    E1 -->|assignments| E2["Aufträge<br/>Accept/Reject"]
    E1 -->|calendar| E3["Kalender<br/>Verfügbarkeit"]
    E1 -->|availability| E4["Verfügbarkeit<br/>Manager"]
    E1 -->|gamification| E5["Erfolge<br/>Gamification"]
    E1 -->|dashboard| E6["Dashboard<br/>Statistiken"]
    
    E2 --> EM1["💬 ChatModal<br/>📝 TodoModal"]
    E3 --> EM1
    
    F --> F1["activePage State"]
    F1 -->|assignments| F2["Aufträge<br/>Management"]
    F1 -->|helpers| F3["Helper Liste<br/>oder Karte"]
    F1 -->|buddies| F4["Buddy<br/>Management"]
    F1 -->|sozialfond| F5["Sozialfond<br/>Übersicht"]
    F1 -->|pflegegrad| F6["Pflegegrad<br/>Profil"]
    F1 -->|bedarfsermittlung| F7["Bedarfs<br/>rechner"]
    F1 -->|finance| F8["Kosten<br/>übersicht"]
    F1 -->|gamification| F9["Gamification<br/>Panel"]
    F1 -->|map| F10["GPS Karte<br/>Helper"]
    F1 -->|profile| F11["Profil<br/>Daten"]
    
    F2 --> FM1["💬 ChatModal<br/>📝 TodoModal<br/>🎯 Recommendations"]
    F3 --> FM1
    
    E2 -.->|onSendMessage| G["useAppState<br/>addChatMessage"]
    F2 -.->|onSendMessage| G
    E2 -.->|onAccept| G
    
    G -.->|State Management| H["chatMessages<br/>todos<br/>assignments"]
    
    style A fill:#3B82F6,stroke:#1E40AF,color:#fff
    style E fill:#10B981,stroke:#059669,color:#fff
    style F fill:#F59E0B,stroke:#D97706,color:#fff
    style G fill:#8B5CF6,stroke:#6D28D9,color:#fff
    style C fill:#EF4444,stroke:#DC2626,color:#fff
    style E2 fill:#86EFAC,stroke:#22C55E,color:#000
    style F2 fill:#FCD34D,stroke:#FBBF24,color:#000
```

## Beschreibung

### Authentifizierung
- **LoginPage**: Existierende Nutzer melden sich an
- **RegisterPage**: Neue Nutzer können sich registrieren
- Nach erfolgreicher Authentifizierung wird die Rolle geprüft

### Rollen-basierte Views

#### HelperView (🟢 Helfer)
Nutzer mit Rolle `helper` sehen folgende Tabs:
- **assignments**: Verfügbare Aufträge, Accept/Reject
- **calendar**: Kalender der Aufträge
- **availability**: Verfügbarkeitszeiten verwalten
- **gamification**: Erfolge und Punkte
- **dashboard**: Statistiken und Überblick

**Modals**:
- ChatModal: Kommunikation über Aufträge
- TodoModal: Checklisten für Aufträge

#### CoordinatorView (🟡 Koordinator)
Nutzer mit Rolle `coordinator` sehen 11 verschiedene Seiten:
- **assignments**: Auftragsverwaltung (erstellen, zuweisen)
- **helpers**: Liste der Helper (mit Map-Option)
- **buddies**: Buddy-Beziehungen verwalten
- **sozialfond**: Übersicht Sozialfond-Beiträge
- **pflegegrad**: Pflegegradprofil
- **bedarfsermittlung**: Bedarfsrechner
- **finance**: Finanzübersicht
- **gamification**: Gamification-Daten
- **map**: GPS-Karte der Helper
- **profile**: Profilseite

**Modals**:
- ChatModal: Mit Helfern kommunizieren
- TodoModal: Aufgabenverwaltung
- HelperRecommendations: Helfer für Auftrag empfehlen

### State Management (🟣)

Der zentrale `useAppState` Hook verwaltet:
- `chatMessages`: Nachrichten pro Auftrag
- `todos`: Aufgabenlisten
- `assignments`: Alle Aufträge
- `users`: Alle Nutzer
- `files`: Hochgeladene Dateien
- `finances`, `costEntries`: Finanzielle Daten
- Und weitere spezifische States

## Aufruf online visualisieren

Kopiere den Mermaid-Code (zwischen den ` ``` `Markierungen) und füge ihn hier ein:
- **Mermaid Live Editor**: https://mermaid.live/
- **Mermaid.js Offline**: Markdown-Viewer mit Mermaid-Support (z.B. VS Code Extension)

## Navigation im Code

```
src/
├── App.tsx                    ← Hauptrouting & Auth-Check
├── pages/
│   ├── HelperView.tsx         ← Helper-Navigation
│   └── CoordinatorView.tsx    ← Coordinator-Navigation
├── components/
│   ├── LoginPage.tsx
│   ├── RegisterPage.tsx
│   ├── ChatModal.tsx
│   ├── TodoModal.tsx
│   └── [weitere Components]
├── hooks/
│   └── useAppState.ts         ← Zentrale State Management
└── types/
    └── index.ts               ← Datenstrukturen
```
