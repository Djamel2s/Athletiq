# PowerShell startup script for Windows
$ErrorActionPreference = 'Stop'

Write-Host "Running DB migrations (deploy)..."
npx prisma migrate deploy

Write-Host "Running DB seed..."
npm run db:seed -ErrorAction SilentlyContinue

Write-Host "Building project..."
npm run build

Write-Host "Starting server..."
npm run start
