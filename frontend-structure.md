# Frontend Structure

## Root Directory

```
frontend/
├── public/
│   ├── imgs/
│   │   ├── alex-sea.avif
│   │   └── logo.png
│   └── vite.svg
├── src/
│   ├── assets/
│   │   └── react.svg
│   ├── components/
│   │   ├── auth/
│   │   │   ├── AuthLayout.tsx
│   │   │   ├── LoginForm.tsx
│   │   │   └── SignupForm.tsx
│   │   ├── common/
│   │   │   └── AppLogo.tsx
│   │   ├── ui/
│   │   │   ├── button.tsx
│   │   │   └── input.tsx
│   │   └── ProtectedRoute.tsx
│   ├── contexts/
│   │   ├── auth.ts
│   │   └── AuthContext.tsx
│   ├── hooks/
│   │   └── useAuth.ts
│   ├── lib/
│   │   ├── api.ts
│   │   ├── utils.ts
│   │   └── validation.ts
│   ├── pages/
│   │   ├── Home.tsx
│   │   ├── Login.tsx
│   │   └── Signup.tsx
│   ├── App.tsx
│   ├── index.css
│   └── main.tsx
├── index.html
├── vite.config.ts
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.node.json
├── eslint.config.js
├── package.json
├── pnpm-lock.yaml
├── Dockerfile
└── README.md
```
