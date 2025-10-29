FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install pnpm globally
RUN npm install -g pnpm

# Install dependencies
RUN pnpm install --frozen-lockfile

# Install serve globally
RUN npm i -g serve

# Copy source code
COPY . .

# Build the app
RUN pnpm build

# Expose port 3001 (backend uses 3000)
EXPOSE 3001

# Serve the built app
CMD [ "serve", "-s", "dist", "-l", "3001" ]
