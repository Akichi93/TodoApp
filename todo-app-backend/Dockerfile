FROM node:22-slim AS builder

WORKDIR /usr/src/app

# Install OpenSSL (required by Prisma native engines)
RUN apt-get update -y \
	&& apt-get install -y --no-install-recommends openssl libssl-dev ca-certificates curl \
	&& rm -rf /var/lib/apt/lists/*

# Install dependencies
COPY package.json package-lock.json* ./
RUN npm ci

# Copy source and build
COPY . .

# Generate Prisma client and build backend
RUN npx prisma generate --schema=prisma/schema.prisma
RUN npm run build

FROM node:22-slim AS runner
WORKDIR /usr/src/app

# Install OpenSSL runtime deps
RUN apt-get update -y \
	&& apt-get install -y --no-install-recommends openssl libssl-dev ca-certificates \
	&& rm -rf /var/lib/apt/lists/*

# Copy production artifacts
COPY package.json package-lock.json* ./
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/prisma ./prisma
COPY docker-entrypoint.sh ./docker-entrypoint.sh
RUN chmod +x ./docker-entrypoint.sh

ENV NODE_ENV=production
ENV PORT=4000
EXPOSE 4000

HEALTHCHECK --interval=30s --timeout=5s --start-period=5s CMD curl -f http://localhost:${PORT}/api || exit 1

CMD ["./docker-entrypoint.sh"]
