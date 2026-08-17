#!/usr/bin/env bash
set -euo pipefail

# Typed as confirmation before --reset --prod is allowed to touch the DB.
PROJECT_NAME="personal-portfolio-website"

MODE="dev"
DO_SEED=false
DO_RESET=false

usage() {
  cat <<'EOF'
Usage: ./init.sh [--dev|--prod] [--seed] [--reset] [--help]

  --dev      Target local development: docker-compose.dev.yml + .env.development.local. Default.
  --prod     Target production: docker-compose.yml + .env.
  --seed     Run scripts/seed.ts after migrations (inserts example posts/projects).
  --reset    DESTRUCTIVE. Stops the target stack, removes its Docker volumes
             (including local Payload media uploads), and DROPS THE ENTIRE
             PUBLIC SCHEMA on the target DATABASE_URL before rebuilding from
             scratch. Always asks for interactive confirmation; with --prod
             you must type the project name exactly. There is no flag to
             skip this confirmation — that's intentional.
  --help     Show this message.

Examples:
  ./init.sh                 # dev: build, migrate, start
  ./init.sh --seed          # dev: build, migrate, start, seed example content
  ./init.sh --prod          # prod: build, migrate, start
  ./init.sh --reset --prod  # prod: wipe containers/volumes/DB schema, then rebuild fresh

Note: on a brand-new database, `payload migrate` (run automatically in --prod)
does nothing until migration files exist. Run `pnpm payload:migrate:create`
once, commit the generated migration, then re-run this script.
EOF
}

for arg in "$@"; do
  case "$arg" in
    --dev) MODE="dev" ;;
    --prod) MODE="prod" ;;
    --seed) DO_SEED=true ;;
    --reset) DO_RESET=true ;;
    --help|-h) usage; exit 0 ;;
    *) echo "Unknown option: $arg" >&2; usage; exit 1 ;;
  esac
done

if ! command -v docker >/dev/null 2>&1 || ! docker compose version >/dev/null 2>&1; then
  echo "Docker with the compose plugin is required." >&2
  exit 1
fi

if [[ "$MODE" == "dev" ]]; then
  COMPOSE_FILE="docker-compose.dev.yml"
  ENV_FILE=".env.development.local"
else
  COMPOSE_FILE="docker-compose.yml"
  ENV_FILE=".env"
fi

if [[ ! -f "$ENV_FILE" ]]; then
  echo "Missing $ENV_FILE. Copy .env.example to $ENV_FILE and fill in real values first." >&2
  exit 1
fi

# Exported so both the pnpm/CLI commands below (migrations run on the host,
# against DATABASE_URL, independent of container state) and Docker Compose
# see the same values.
set -a
# shellcheck disable=SC1090
source "$ENV_FILE"
set +a

if [[ -z "${DATABASE_URL:-}" ]]; then
  echo "DATABASE_URL is not set in $ENV_FILE." >&2
  exit 1
fi

if $DO_RESET; then
  echo "This will stop the '$COMPOSE_FILE' stack, remove its volumes, and DROP THE ENTIRE PUBLIC SCHEMA at:"
  echo "  DATABASE_URL=$DATABASE_URL"
  if [[ "$MODE" == "prod" ]]; then
    read -rp "Type '$PROJECT_NAME' to confirm you want to wipe PRODUCTION: " confirm
    if [[ "$confirm" != "$PROJECT_NAME" ]]; then
      echo "Confirmation did not match. Aborting." >&2
      exit 1
    fi
  else
    read -rp "Continue? [y/N] " confirm
    [[ "$confirm" =~ ^[Yy]$ ]] || { echo "Aborted."; exit 1; }
  fi

  docker compose -f "$COMPOSE_FILE" down -v --remove-orphans
  pnpm db:reset
fi

echo "==> Building ($MODE)"
docker compose -f "$COMPOSE_FILE" build

if [[ "$MODE" == "dev" ]]; then
  echo "==> Starting local Postgres"
  docker compose -f "$COMPOSE_FILE" up -d --wait postgres
fi

echo "==> Running migrations"
if [[ "$MODE" == "dev" ]]; then
  # Run inside the app container so it reaches Postgres via the compose
  # network (service name), not the host — sidesteps host<->container
  # networking quirks with the local-only dev database.
  docker compose -f "$COMPOSE_FILE" run --rm app pnpm db:migrate
  echo "(dev: Payload syncs its own collection schema automatically on server start)"
else
  pnpm db:migrate
  pnpm payload:migrate
fi

echo "==> Starting containers"
docker compose -f "$COMPOSE_FILE" up -d

if $DO_SEED; then
  if [[ "$MODE" == "prod" ]]; then
    read -rp "This inserts example posts/projects into PRODUCTION. Continue? [y/N] " confirm
    if [[ ! "$confirm" =~ ^[Yy]$ ]]; then
      echo "Skipped seeding."
      exit 0
    fi
  fi
  echo "==> Seeding"
  pnpm db:seed
fi

echo "==> Done. $MODE stack is up (compose file: $COMPOSE_FILE)."
