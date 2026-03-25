# ──────────────────────────────────────────────
# Stage 1: Builder
# Install ALL dependencies (including devDeps like typescript) and compile.
# This stage is never shipped — it's just a build environment.
# ──────────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files BEFORE source code.
# Docker builds in layers. If package.json hasn't changed, Docker reuses the
# cached npm ci layer and skips re-installing — saves minutes on rebuilds.
COPY package*.json ./
RUN npm ci

# Now copy the rest of the source and compile TypeScript → JavaScript
COPY . .
RUN npm run build


# ──────────────────────────────────────────────
# Stage 2: Runner
# Start fresh from a clean base image with only production dependencies.
# The final image contains no TypeScript compiler, no source files, no devDeps.
# This is why multi-stage builds exist: smaller, more secure production images.
# ──────────────────────────────────────────────
FROM node:20-alpine AS runner

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

# Copy only the compiled output from the builder stage
COPY --from=builder /app/dist ./dist

EXPOSE 3000

# Run the server entry point (not the Vercel serverless export in api/index.ts)
CMD ["node", "dist/server.js"]
