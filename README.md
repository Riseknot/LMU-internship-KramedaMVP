# Lumi – Alltagshilfe digital organisieren

Webbasierte Plattform zur Vermittlung von Alltagshilfe. Verbindet hilfesuchende Personen und deren Koordinatoren mit qualifizierten Helfern über ein automatisiertes Matching-System.

**Live:** [mvpkrameda.vercel.app](https://mvpkrameda.vercel.app)

## Stack

Next.js 16 (App Router) · React 18 · TypeScript · MongoDB Atlas · Mongoose · Tailwind CSS v4 · Radix UI / shadcn

## Features

- Rollenbasiertes Auth-System (Koordinator / Helfer) mit E-Mail-Verifikation
- Helptask-Verwaltung mit Karten- und Listenansicht (Google Maps)
- Datenschutzmaske: Standorte werden nur als anonymisierter Radius angezeigt
- 5-phasige NLP-Pipeline zur semantischen Analyse von Aufgabenbeschreibungen
- Matching-Algorithmus mit gewichtetem Scoring (Verfügbarkeit, Qualifikation, Entfernung)
- Badge-System (Bronze → Platin) zur Anerkennung aktiver Helfer
- NLP-Monitoring-Dashboard mit Drift-Erkennung
- Swagger-API-Dokumentation unter `/api-docs`

## Lokaler Start

```bash
npm install
```

`.env` anlegen:

```env
MONGO_URI=<mongodb-connection-string>
RESEND_API_KEY=<resend-api-key>
RESEND_FROM="onboarding@resend.dev"
JWT_SECRET=<beliebiger-geheimer-string>
GOOGLE_MAPS_API_KEY=<google-maps-api-key>
```

```bash
npm run dev
```

> Im Dev-Modus funktioniert die Registrierung ohne Resend – der Verifikationscode wird direkt in der API-Response zurückgegeben.

## Weitere Scripts

| Befehl | Zweck |
|---|---|
| `npm run build` | Produktions-Build |
| `npm run nlp:goldenset` | NLP-Qualitätstest (304 Testfälle) |
| `npm run seed:helpers` | 20 realistische Helfer-Profile für München einspielen |

## Projektstruktur

```
app/api/          REST-API (Auth, Helptasks, Users, NLP-Metrics)
app/lib/          Backend: DB-Verbindung, Models, Services, NLP-Pipeline
app/src/          Frontend: Pages, Components, Hooks, Services, Types
app/src/pages/    Seitencontainer (RootView als App-Shell)
public/api-docs/  Statisches swagger.json
scripts/          CLI-Tools: NLP-Tests, Seeding
```
