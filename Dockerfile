# syntax=docker/dockerfile:1

# ==========================================
# Stage 1: Build Backend (Go Fiber v3)
# ==========================================
FROM golang:1.24-alpine AS builder-be

WORKDIR /app/backend

# Install build tools
RUN apk add --no-cache ca-certificates git

# Cache Go modules
COPY backend/go.mod backend/go.sum ./
RUN go mod download

# Copy backend source
COPY backend/ ./

# Build statically linked binary
RUN CGO_ENABLED=0 GOOS=linux go build -ldflags="-s -w" -o /app/bin/server ./cmd/server

# ==========================================
# Stage 2: Build Frontend (Astro 7 SSR)
# ==========================================
FROM node:22-alpine AS builder-fe

WORKDIR /app/frontend

# Install dependencies
COPY frontend/package.json frontend/package-lock.json ./
RUN npm ci

# Copy frontend source
COPY frontend/ ./

# Build Astro production bundle (SSR mode)
RUN npm run build

# Prune development dependencies
RUN npm prune --omit=dev

# ==========================================
# Stage 3: Production Runtime
# ==========================================
FROM node:22-alpine AS runner

WORKDIR /app

# Install system utilities and Infisical CLI
RUN apk add --no-cache ca-certificates tzdata curl bash tar && \
    ARCH=$(uname -m) && \
    if [ "$ARCH" = "x86_64" ]; then INF_ARCH="linux_amd64"; \
    elif [ "$ARCH" = "aarch64" ]; then INF_ARCH="linux_arm64"; \
    else INF_ARCH="linux_amd64"; fi && \
    curl -1sLf "https://github.com/Infisical/cli/releases/download/v0.43.139/cli_0.43.139_${INF_ARCH}.tar.gz" -o /tmp/infisical.tar.gz && \
    tar -xzf /tmp/infisical.tar.gz -C /usr/local/bin infisical && \
    rm -f /tmp/infisical.tar.gz && \
    chmod +x /usr/local/bin/infisical

# Copy backend binary
COPY --from=builder-be /app/bin/server /app/bin/server

# Copy frontend build and production dependencies
COPY --from=builder-fe /app/frontend/dist /app/frontend/dist
COPY --from=builder-fe /app/frontend/node_modules /app/frontend/node_modules
COPY --from=builder-fe /app/frontend/package.json /app/frontend/package.json

# Copy runner and entrypoint scripts
COPY docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh
COPY docker-run.sh /app/run.sh

# Normalize CRLF to LF (Windows compatibility) and set execute permissions
RUN sed -i 's/\r$//' /usr/local/bin/docker-entrypoint.sh /app/run.sh && \
    chmod +x /usr/local/bin/docker-entrypoint.sh /app/run.sh /app/bin/server

# Environment configuration
ENV NODE_ENV=production
ENV PORT=3000
ENV HOST=0.0.0.0
ENV BACKEND_PORT=8080
ENV BACKEND_URL=http://127.0.0.1:8080

# Port ekspose untuk VPS / Coolify (Astro Frontend)
EXPOSE 3000

# Healthcheck probe (start-period 20s memberi waktu injeksi secrets Infisical)
HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD curl -f http://127.0.0.1:3000/health || exit 1

ENTRYPOINT ["docker-entrypoint.sh"]
CMD ["/app/run.sh"]
