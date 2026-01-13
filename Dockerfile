# ================================
# Stage 1: Dependencies
# ================================
FROM node:20-alpine AS deps

RUN apk add --no-cache libc6-compat

WORKDIR /app

# Copy package files
COPY package.json package-lock.json* ./

# Install dependencies
RUN npm ci

# ================================
# Stage 2: Builder
# ================================
FROM node:20-alpine AS builder

WORKDIR /app

# Copy dependencies from deps stage
COPY --from=deps /app/node_modules ./node_modules

# Copy all source files
COPY . .

# Ensure next.config.ts has standalone output
# This creates the config if it doesn't have standalone
RUN if ! grep -q "standalone" next.config.ts 2>/dev/null; then \
    echo 'import type { NextConfig } from "next";' > next.config.ts && \
    echo 'const nextConfig: NextConfig = { output: "standalone" };' >> next.config.ts && \
    echo 'export default nextConfig;' >> next.config.ts; \
    fi

# Set environment variables for build
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

# Build the application
RUN npm run build

# Verify standalone folder exists
RUN ls -la .next/ && ls -la .next/standalone/ || echo "Standalone not found"

# ================================
# Stage 3: Runner (Production)
# ================================
FROM node:20-alpine AS runner

WORKDIR /app

# Set environment variables
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV HOSTNAME="0.0.0.0"
ENV PORT=9090

# Create non-root user for security
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy public folder
COPY --from=builder /app/public ./public

# Create .next directory
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Copy standalone build
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Switch to non-root user
USER nextjs

# Expose port
EXPOSE 9090

# Start the application
CMD ["node", "server.js"]
