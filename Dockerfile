# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./

# Install dependencies
RUN npm ci

# Cache bust argument - changes on every commit to ensure fresh source files
ARG CACHE_BUST
RUN echo "Cache bust: ${CACHE_BUST:-none}"

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

# Create non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy built assets
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# Copy scripts for administrative tasks (seed admin, etc.)
COPY --from=builder /app/scripts ./scripts

# Install minimal dependencies for running administrative scripts
RUN npm install --no-save pg tsx bcrypt

# Create temp directory for tsx
RUN mkdir -p /tmp/tsx-1001 && chown nextjs:nodejs /tmp/tsx-1001

# Set ownership
RUN chown -R nextjs:nodejs /app

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
