# Builder stage (uses Debian slim so native modules can compile)
FROM node:20-bullseye-slim AS builder

WORKDIR /app

# Install build dependencies required by node-canvas and other native modules
RUN apt-get update && apt-get install -y --no-install-recommends \
  build-essential python3 pkg-config libcairo2-dev libpango1.0-dev libjpeg-dev libgif-dev librsvg2-dev libvips-dev ca-certificates \
  && rm -rf /var/lib/apt/lists/*

COPY package.json package-lock.json* ./
COPY prisma ./prisma
RUN npm ci

COPY tsconfig.json ./
COPY src ./src
RUN npm run build

# Runner stage
FROM node:20-bullseye-slim AS runner
WORKDIR /app

COPY package.json package-lock.json* ./
COPY prisma ./prisma
RUN npm ci --omit=dev
RUN npx prisma generate

COPY --from=builder /app/dist ./dist

RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 nodejs
USER nodejs

EXPOSE 3001

CMD ["sh", "-c", "node dist/seeds/run.js; node dist/server.js"]