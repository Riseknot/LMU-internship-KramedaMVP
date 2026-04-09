# REST API & Helptask Guideline

# Ressourcen
# - Immer Nomen, Plural: /api/helptasks
# - Einzelzugriffe über ID im Pfad: GET /api/helptasks/123
# - Query-Parameter nur für Filter, Suche oder Radius:
#   GET /api/helptasks?zipCode=80331
#   GET /api/helptasks?near=11.57,48.13&radius=5000

# HTTP Methoden
# - POST   → erstellen
# - GET    → liste / einzelner task
# - PATCH  → update
# - DELETE → löschen


# Statuscodes
# - 200 OK
# - 201 Created
# - 400 Bad Request
# - 401 Unauthorized
# - 404 Not Found
# - 500 Server Error

# Response-Format
# Erfolg:
# {
#   "success": true,
#   "data": { ... }
# }
# Fehler:
# {
#   "success": false,
#   "error": "USER_ALREADY_EXISTS"
# }

# Geo & Datenschutz
# - Exakte Adressen nicht speichern (DSGVO)
# - Optionen:
#   1) PLZ → Mittelpunkt
#   2) Grid/Raster → anonymisierte Koordinaten (500m-1km)
#   3) Random Noise → zufällige Verschiebung
# - Backend: MongoDB $geoNear + 2dsphere Index für Radius-Queries


# API-Endpunkte Best Practice
# POST   /api/helptasks         → erstellen
# GET    /api/helptasks         → alle / filter
# GET    /api/helptasks/:id     → einzelner task
# PATCH  /api/helptasks/:id     → update
# DELETE /api/helptasks/:id     → löschen
# GET    /api/helptasks?near=lng,lat&radius=5000 → nearby tasks
# Optional: /api/v1/helptasks → versionierung

# MongoDB
# Index: An index is a shortcut for MongoDB to find values fast without scanning all documents.