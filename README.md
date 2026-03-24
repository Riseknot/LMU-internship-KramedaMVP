
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
