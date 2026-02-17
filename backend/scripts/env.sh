#!/bin/bash
# Shared environment setup for backend scripts

ENVIRONMENT="${ENVIRONMENT:-development}"

if [[ "${ENVIRONMENT}" == "production" ]]; then
  echo "Starting in production mode..."
  export NODE_ENV="production"
else
  echo "Starting in development mode..."
  export NODE_ENV="development"
fi

# Always use Turso for both development and production
# DATABASE_URL is used by Prisma CLI commands (db push, migrate)
# The actual runtime uses TURSO_DATABASE_URL via the libsql adapter in db.ts
