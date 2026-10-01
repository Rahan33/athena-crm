# ==========================================
# CLOUD NATIVE DOCKERFILE - FRONTEND SPA
# Multi-Stage Production Build (Node -> Nginx Alpine)
# ==========================================

# Stage 1: Build Application
FROM node:20-alpine AS builder

WORKDIR /app

# Copy dependency manifests
COPY package*.json ./
RUN npm ci

# Copy application source & config
COPY tsconfig*.json vite.config.ts index.html ./
COPY src ./src
COPY public ./public

# Build optimized production bundle
RUN npm run build

# Stage 2: Production Web Server
FROM nginx:1.27-alpine AS runner

# Copy custom Nginx security and reverse proxy configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy compiled static assets from builder
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose standard HTTP port
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://127.0.0.1/healthz || exit 1

CMD ["nginx", "-g", "daemon off;"]
