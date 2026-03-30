
# MVP Funktionen fuer Helfer-App

This is a code bundle for MVP Funktionen fuer Helfer-App.
The original project is available at [Figma](https://www.figma.com/design/E5iAhksWBCC4AAqLS58vAq/MVP-Funktionen-f%C3%BCr-Helfer-App).

## Running the code

Run `npm i` to install the dependencies.

Create a `.env` file with at least:

- `MONGO_URI=<your_mongodb_connection_string>`
- `RESEND_API_KEY=<your_resend_api_key>`
- `RESEND_FROM="onboarding@resend.dev"`
- `APP_NAME=CareConnect`

Run `npm run dev` to start the development server.

Notes:

- In development, registration works without Resend and exposes a test code in the API response.
- In production, Resend is required for registration email verification.

## Project structure (where to code)

Use this as the default map for new work:

- `app/src/App.tsx`: auth flow + app bootstrapping
- `app/src/pages/RootView.tsx`: main shell + page routing after login
- `app/src/components/Sidebar.tsx`: primary navigation (single source)
- `app/src/pages/signIn & signUp/*`: login/register/auth animation
- `app/src/pages/*`: page-level containers and orchestration
- `app/src/components/*`: reusable UI/domain components
- `app/src/hooks/*`: data/state hooks for frontend features
- `app/src/services/*`: frontend API clients
- `app/api/*`: Next.js API routes
- `app/lib/*`: backend/shared services (DB, models, server logic)

## Conventions for simpler development

- Add new feature behavior first in `pages`, then extract to `components` only when reused.
- Keep one navigation system (`Sidebar.tsx`) to avoid parallel UI paths.
- Keep colors centralized in `app/globals.css` semantic tokens/classes.
- Prefer extending existing `services` and `hooks` over creating parallel fetch logic.
- Delete dead files immediately when replacing flows.

## Recent cleanup

Removed legacy/unreferenced UI files and stale assets to reduce cognitive load:

- old helper/coordinator legacy views
- old duplicate sidebar variants
- old standalone dashboard component
- unused API stub file
- unused backup logo assets
