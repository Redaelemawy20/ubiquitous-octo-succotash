# Backend Structure

## Root Directory

```
backend/

├── logs/                     # Application logs
│   ├── app.log
│   ├── combined.log
│   ├── error.log
│   ├── exceptions.log
│   └── rejections.log
├── src/                      # Source code
│   ├── auth/
│   │   ├── dto/
│   │   │   ├── signin.dto.ts
│   │   │   └── signup.dto.ts
│   │   ├── auth.controller.spec.ts
│   │   ├── auth.controller.ts
│   │   ├── auth.module.ts
│   │   ├── auth.service.spec.ts
│   │   └── auth.service.ts
│   ├── common/
│   │   └── filters/
│   │       └── http-exception.filter.ts
│   ├── logger/
│   │   └── app-logger.ts
│   ├── users/
│   │   ├── user.schema.ts
│   │   ├── users.module.ts
│   │   ├── users.service.spec.ts
│   │   └── users.service.ts
│   ├── app.controller.spec.ts
│   ├── app.controller.ts
│   ├── app.module.ts
│   ├── app.service.ts
│   └── main.ts
├── test/                      # Test files
│   ├── app.e2e-spec.ts
│   ├── auth.http
│   └── jest-e2e.json
├── node_modules/              # Dependencies (generated)
├── Dockerfile
├── eslint.config.mjs
├── nest-cli.json
├── package.json
├── pnpm-lock.yaml
├── README.md
├── tsconfig.build.json
└── tsconfig.json
```
