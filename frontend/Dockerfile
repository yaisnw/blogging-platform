# ──────────────────────────────────────────────
# Stage 1: Builder
# ──────────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

# ── Critical concept: Vite bakes environment variables at BUILD TIME ──
# Unlike a Node.js server where process.env is read at runtime, Vite replaces
# import.meta.env.VITE_* references with literal string values during `npm run build`.
# This means the API URL is hardcoded into the JS bundle — not read when the container starts.
#
# Consequence: if you need a different API URL, you must rebuild the image.
# That's why these are ARGs (build-time) not ENVs (runtime).
ARG VITE_BASE_URL=http://localhost:3000
ARG VITE_GOOGLE_CLIENT_ID

# Expose the ARGs as environment variables so Vite can read them during the build
ENV VITE_BASE_URL=$VITE_BASE_URL
ENV VITE_GOOGLE_CLIENT_ID=$VITE_GOOGLE_CLIENT_ID

RUN npm run build


# ──────────────────────────────────────────────
# Stage 2: Runner (nginx)
# Node.js is not needed to serve a React app in production.
# A compiled React app is just static files (HTML, JS, CSS).
# nginx serves them far more efficiently than `vite preview` or `serve`.
# ──────────────────────────────────────────────
FROM nginx:alpine AS runner

# Copy the static build output from the builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Replace the default nginx config with ours (handles SPA routing)
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
