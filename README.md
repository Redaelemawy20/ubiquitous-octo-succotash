## esgen

Simple steps to run the project either locally (no Docker) or with Docker Compose.

### Option 1 — Run locally (no Docker)

Prerequisites:

- Node.js 18+ and pnpm installed
- MongoDB running locally on `mongodb://localhost:27017`

Steps:

1.  Create backend environment file (copy from example)

    Windows (PowerShell):

    ```powershell
    Copy-Item backend/.env.example backend/.env
    ```

    macOS/Linux:

    ```bash
    cp backend/.env.example backend/.env
    ```

    If you don't have the example file, create `backend/.env` with:

    ```
    MONGODB_URI=mongodb://localhost:27017/nestdb
    CORS_ORIGINS=http://localhost:5173
    PORT=3000
    JWT_SECRET=Verysecret
    JWT_EXPIRES_IN=1h
    ```

2.  Install dependencies

    In `backend/`:

    ```bash
    pnpm install
    ```

    In `frontend/`:

    ```bash
    pnpm install
    ```

3.  Start the backend (NestJS)

    From `backend/`:

    ```bash
    pnpm start:dev
    ```

    Backend URL:

    ```
    http://localhost:3000
    ```

4.  Start the frontend (Vite + React)

    From `frontend/`:

    ```bash
    pnpm dev
    ```

    Open:

    ```
    http://localhost:3001
    ```

### Option 2 — Run with Docker Compose

Prerequisites:

- Docker and Docker Compose

Steps:

From the project root:

```bash
docker compose up --build -d
```

Open the app:

```
http://localhost:3001
```

What gets started:

- MongoDB:
  ```
  localhost:27017
  ```
- Backend (NestJS):
  ```
  http://localhost:3000
  ```
- Frontend:
  ```
  http://localhost:3001
  ```

To stop:

```bash
docker compose down
```
