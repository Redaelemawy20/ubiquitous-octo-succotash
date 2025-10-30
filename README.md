## esgen

Simple steps to run the project either locally (no Docker) or with Docker Compose.

### Option 1 — Run locally (no Docker)

Prerequisites:

- Node.js 18+ and pnpm installed
- MongoDB running locally on `mongodb://localhost:27017`

Steps:

1. Install dependencies

   - In `backend/`: `pnpm install`
   - In `frontend/`: `pnpm install`

2. Start the backend (NestJS)

   - From `backend/`: `pnpm start:dev`
   - Backend will listen on `http://localhost:3000`
   - Uses MongoDB at `mongodb://localhost:27017/nestdb` by default
   - To customize CORS, set `CORS_ORIGINS`, e.g.: `CORS_ORIGINS=http://localhost:3001`

3. Start the frontend (Vite + React)
   - From `frontend/`: `pnpm dev -- --port 3001`
   - Open `http://localhost:3001`

Notes:

- If you prefer Vite’s default port (5173), add it to backend CORS: `CORS_ORIGINS=http://localhost:5173`
- API base URL is `http://localhost:3000` (see `frontend/src/lib/api.ts`). Ensure the backend is reachable from the browser.

### Option 2 — Run with Docker Compose

Prerequisites:

- Docker and Docker Compose

Steps:

1. From the project root: `docker compose up --build -d`
2. Open the app at `http://localhost:3001`

What gets started:

- MongoDB on `localhost:27017`
- Backend (NestJS) on `http://localhost:3000`
- Frontend (built + served) on `http://localhost:3001`

To stop:

- `docker compose down`
