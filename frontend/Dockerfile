# ==============================================================================
# HRMS Lite - Production Frontend Multi-Stage Dockerfile
# ==============================================================================

# Stage 1: Build React Production Bundle
FROM node:18-alpine AS builder

WORKDIR /app

# Copy dependency manifests
COPY frontend/package.json frontend/package-lock.json* ./

# Install dependencies with frozen lockfile
RUN npm ci --silent

# Copy frontend source
COPY frontend/ ./

# Pass build environment variables if any
ARG REACT_APP_API_URL=/api
ARG REACT_APP_CLERK_PUBLISHABLE_KEY
ENV REACT_APP_API_URL=${REACT_APP_API_URL}
ENV REACT_APP_CLERK_PUBLISHABLE_KEY=${REACT_APP_CLERK_PUBLISHABLE_KEY}

# Compile optimized static bundle
RUN npm run build

# Stage 2: Serve with Lightweight Alpine Nginx
FROM nginx:1.25-alpine

# Remove default nginx html
RUN rm -rf /usr/share/nginx/html/*

# Copy built assets from builder stage
COPY --from=builder /app/build /usr/share/nginx/html

# Copy custom Nginx configuration
COPY frontend/nginx.conf /etc/nginx/conf.d/default.conf

# Expose port
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s --retries=3 \
    CMD wget -qO- http://localhost/nginx-health || exit 1

CMD ["nginx", "-g", "daemon off;"]
