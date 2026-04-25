# Multi-stage Dockerfile for Turbo Monorepo with Next.js App

## Description
This Dockerfile is optimized for a Turbo monorepo containing a Next.js application focused on real estate. It sets up multiple stages for building the application and ensuring an efficient deployment process.

```dockerfile
# Stage 1: Pruner
FROM node:20-alpine AS pruner
WORKDIR /app
COPY . .
RUN npx turbo prune --scope=realestate --docker

# Stage 2: Installer
FROM node:20-alpine AS installer
WORKDIR /app
COPY --from=pruner /app/ package.json pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm install --frozen-lockfile

# Stage 3: Sourcer
FROM node:20-alpine AS sourcer
WORKDIR /app
COPY --from=installer /app/node_modules ./node_modules
COPY --from=pruner /app/realestate ./realestate

# Stage 4: Builder
FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=sourcer /app/package.json ./
RUN npm install -g pnpm && pnpm install --frozen-lockfile
COPY --from=sourcer /app/realestate ./realestate
RUN pnpm build

# Stage 5: Runner
FROM node:20-alpine AS runner
WORKDIR /app
COPY --from=builder /app/realestate/ .
RUN addgroup -S nextjs && adduser -S nextjs -G nextjs
USER nextjs
EXPOSE 3001
CMD [ "node", "server.js" ]
```

## Notes
- Make sure that the Next.js app is configured to run on port 3001.
- The use of non-root user enhances security. 
- Layer caching is utilized to optimize build times.