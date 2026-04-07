#!/usr/bin/env bash
set -euo pipefail

echo "Running DB migrations (deploy)..."
npx prisma migrate deploy

echo "Running DB seed..."
npm run db:seed || true

echo "Building project..."
npm run build

echo "Starting server..."
npm run start
