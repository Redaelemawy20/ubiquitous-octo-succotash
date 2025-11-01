## esgen

Simple steps to run the project either locally (no Docker) or with Docker Compose.

### Option 1 — Run locally (no Docker)

Prerequisites:

- Node.js 18+ and pnpm installed
- MongoDB running locally on `mongodb://localhost:27017`

Steps:

1.  Create environment files (copy from example)

    **Backend:**

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
    JWT_EXPIRES_IN=3600
    ```

    **Frontend:**

    Windows (PowerShell):

    ```powershell
    Copy-Item frontend/.env.example frontend/.env
    ```

    macOS/Linux:

    ```bash
    cp frontend/.env.example frontend/.env
    ```

    If you don't have the example file, create `frontend/.env` with:

    ```
    VITE_API_BASE_URL=http://localhost:3000/api/v1
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

    API Documentation (Swagger):

    ```
    http://localhost:3000/api/v1/docs
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
- API Documentation (Swagger):
  ```
  http://localhost:3000/api/v1/docs
  ```
- Frontend:
  ```
  http://localhost:3001
  ```

To stop:

```bash
docker compose down
```

To view logs:

View logs for all containers:

```bash
docker compose logs
```

View logs for a specific container:

```bash
docker compose logs backend
docker compose logs frontend
docker compose logs mongodb
```

Follow logs in real-time (with `-f` flag):

```bash
docker compose logs -f
docker compose logs -f backend
```

View logs with timestamps:

```bash
docker compose logs -t
docker compose logs -t backend
```

View last N lines of logs:

```bash
docker compose logs --tail=100
docker compose logs --tail=50 backend
```

### Testing API Requests

You can test API requests directly in VS Code using the REST Client extension.

Open `backend/test/auth.http` and click the "Send Request" link above each request to test the authentication endpoints.

## Documentation

For more information, see the following documentation files:

- To see frontend structure, see [frontend-structure.md](./frontend-structure.md)
- To see backend structure, see [backend-structure.md](./backend-structure.md)
- To see authentication flow, see [authentication-flow.md](./authentication-flow.md)
- To see task requirements checklist, see [requirements_checklist.md](./requirements_checklist.md)
