# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Install pnpm globally
RUN npm install -g pnpm

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install all dependencies (dev + prod) for building
RUN pnpm install --frozen-lockfile

# Copy source code (excluding node_modules and dist via .dockerignore)
COPY . .

# Build the app
RUN pnpm build

# Production stage
FROM node:20-alpine

WORKDIR /app

# Install pnpm globally
RUN npm install -g pnpm

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install only production dependencies
RUN pnpm install --prod --frozen-lockfile

# Copy built app from builder stage
COPY --from=builder /app/dist ./dist

# Expose the app port
EXPOSE 3000

# Start the app
CMD ["pnpm", "start:prod"]
