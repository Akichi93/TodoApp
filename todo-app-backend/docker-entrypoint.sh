#!/usr/bin/env bash
set -e

# Ensure Prisma client is generated (if used)
if [ -f "node_modules/.bin/prisma" ] || command -v prisma >/dev/null 2>&1; then
  echo "Generating Prisma client..."
  npx prisma generate --schema=prisma/schema.prisma || true
fi

# Run migrations if the environment requests it
if [ "${PRISMA_MIGRATE:-false}" = "true" ]; then
  echo "Applying Prisma migrations..."
  npx prisma migrate deploy --schema=prisma/schema.prisma || true
fi

# Start app
exec npm run start:prod
