#!/bin/sh
set -e

log_error() {
  echo "Error during DB Migrations"
}

log_error() {
  echo "Error during Main Execution"
}

#/**
# * Migrations
# /*
echo " ############# MIGRATING ############# "
trap log_error EXIT
source .env
# setup de contexto do banco a ser criado
export TYPEORM_DATABASE=postgres
export TYPEORM_HOST=${DATABASE_HOST}
export TYPEORM_CONNECTION=postgres
export TYPEORM_USERNAME=postgres
export TYPEORM_PASSWORD=${DATABASE_PASSWORD}
export TYPEORM_PORT=5432
# config de models
export TYPEORM_SYNCHRONIZE=false
export TYPEORM_LOGGING=true
# config de conjunto de arquivos da Migration 
export TYPEORM_MIGRATIONS=/app/dist/migrations/create/*.js
export TYPEORM_MIGRATIONS_DIR=/app/dist/migrations/create
export TYPEORM_MIGRATIONS_TABLE_NAME=migrations_ms

node --require ts-node/register /app/node_modules/typeorm/cli.js migration:run -t=false
# setup de contexto do banco a ser migrado
export TYPEORM_DATABASE=${DATABASE_DB}
export TYPEORM_HOST=${DATABASE_HOST}
export TYPEORM_CONNECTION=postgres
export TYPEORM_USERNAME=postgres
export TYPEORM_PASSWORD=${DATABASE_PASSWORD}
export TYPEORM_PORT=5432
# config de models
export TYPEORM_SYNCHRONIZE=false
export TYPEORM_LOGGING=true
# config de conjunto de arquivos da Migration 
export TYPEORM_MIGRATIONS=/app/dist/migrations/*.js
export TYPEORM_MIGRATIONS_DIR=/app/dist/migrations
export TYPEORM_MIGRATIONS_TABLE_NAME=migrations

node --require ts-node/register /app/node_modules/typeorm/cli.js migration:run
trap - EXIT
echo " ############# MIGRATED ############# "




if [ "${1#-}" != "${1}" ] || [ -z "$(command -v "${1}")" ]; then
  set -- node "$@"
fi

trap log_info EXIT
exec "$@"
trap - EXIT