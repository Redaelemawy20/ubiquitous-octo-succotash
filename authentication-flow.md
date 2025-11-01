# Authentication Flow

This document explains the authentication flow in the application.

## User Flow

### 1. Signup

```
User → POST /api/v1/auth/signup
  ↓
Backend creates user account
  ↓
Returns user data (NO tokens set)
  ↓
User must login to get authenticated
```

**Note:** Signup does not automatically log in the user. They must login separately.

### 2. Login

```
User → POST /api/v1/auth/login (email, password)
  ↓
Backend validates credentials
  ↓
Backend generates:
  - Access token (1 hour expiry)
  - Refresh token (7 days expiry)
  ↓
Tokens stored in HTTP-only cookies
Refresh token stored in database
  ↓
User is authenticated
```

### 3. Authenticated Requests

```
User → API Request (with access token cookie)
  ↓
If token valid → Request succeeds
  ↓
If token expired (401) → Automatic refresh:
  ↓
Frontend → POST /api/v1/auth/refresh
  ↓
Backend validates refresh token
  ↓
Backend issues new access token
  ↓
Original request retried automatically
  ↓
Request succeeds
```

### 4. Token Refresh

- **Automatic**: Happens transparently when access token expires
- **Manual**: Not required - handled by the frontend API service
- **Retry Logic**: Failed requests due to expired tokens are automatically retried after refresh

### 5. Logout

```
User → POST /api/v1/auth/logout
  ↓
Backend removes refresh token from database
  ↓
Backend clears both cookie tokens
  ↓
User is logged out
```

## API Endpoints

| Endpoint        | Method | Description                  | Authentication Required           |
| --------------- | ------ | ---------------------------- | --------------------------------- |
| `/auth/signup`  | POST   | Create new user account      | ❌ No                             |
| `/auth/login`   | POST   | Login user and get tokens    | ❌ No                             |
| `/auth/logout`  | POST   | Logout user and clear tokens | ✅ Yes                            |
| `/auth/refresh` | POST   | Refresh access token         | ❌ No (uses refresh token cookie) |
| `/auth/me`      | GET    | Get current user profile     | ✅ Yes                            |

## Frontend Integration

### Automatic Token Refresh

The frontend API service (`frontend/src/lib/api.ts`) automatically handles token refresh:

- Intercepts 401 (Unauthorized) responses
- Attempts to refresh the access token
- Retries the original request
- Redirects to login if refresh fails

### Usage Example

```typescript
// Make authenticated request - token refresh handled automatically
import { authenticatedRequest } from "./lib/api";

const data = await authenticatedRequest<UserData>("/users/profile", {
  method: "GET",
});
```

## Security Features

✅ **HTTP-only Cookies**: Prevents XSS attacks (JavaScript cannot access tokens)  
✅ **Secure Flag**: Cookies only sent over HTTPS in production  
✅ **SameSite Strict**: Prevents CSRF attacks  
✅ **Token Revocation**: Refresh tokens can be revoked on logout  
✅ **Database Storage**: Refresh tokens stored in database for validation  
✅ **Automatic Expiration**: Tokens expire automatically for security

## Environment Variables

### Backend

```env
JWT_SECRET=your-secret-key-here          # Secret for signing JWT tokens
JWT_EXPIRES_IN=3600                      # Access token expiry (seconds) - default: 1 hour
JWT_REFRESH_EXPIRES_IN=604800            # Refresh token expiry (seconds) - default: 7 days
```

### Frontend

```env
VITE_API_BASE_URL=http://localhost:3000/api/v1
```

## Token Expiration Defaults

- **Access Token**: 1 hour (3600 seconds)
- **Refresh Token**: 7 days (604800 seconds)

Both can be customized via environment variables.

## Protected Routes

Protected routes automatically check authentication and redirect unauthenticated users to login:

```typescript
// Example: ProtectedRoute component
<ProtectedRoute>
  <YourComponent />
</ProtectedRoute>
```

## Notes

- Users are **not** automatically logged in after signup
- Token refresh is **automatic** and **transparent** to the user
- Refresh tokens are stored in the database for validation and revocation
- All tokens use the same JWT secret (configured in `JWT_SECRET`)
