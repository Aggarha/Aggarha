#!/usr/bin/env bash
#
# Aggarha production deploy guard.
#
# Deploys origin/main only, into the isolated production checkout at
# /var/www/Aggarha-production. Refuses to run against any other branch
# or any other directory. See docs/DEPLOYMENT.md for the full runbook.
#
# Usage: scripts/deploy-production.sh
# Must be run on the production host, as the user that owns the PM2
# process (root in the current setup).

set -euo pipefail

PROD_DIR="/var/www/Aggarha-production"
APP_NAME="aggarha-web"
ROOT_URL="http://127.0.0.1:3100/"
HEALTH_URL="http://127.0.0.1:3100/api/health/db"

log() {
  printf '[deploy] %s\n' "$1"
}

fail() {
  printf '\n[deploy] ==================== DEPLOYMENT FAILED ====================\n' >&2
  printf '[deploy] %s\n' "$1" >&2
  printf '[deploy] =============================================================\n\n' >&2
  exit 1
}

[ -d "$PROD_DIR" ] || fail "Production directory not found: $PROD_DIR"
[ -d "$PROD_DIR/.git" ] || fail "$PROD_DIR is not a git checkout"

cd "$PROD_DIR"
log "Operating on: $PROD_DIR"

CURRENT_BRANCH="$(git rev-parse --abbrev-ref HEAD)"
if [ "$CURRENT_BRANCH" != "main" ]; then
  fail "Refusing to deploy: current branch is '$CURRENT_BRANCH', not 'main'. Production must only ever run main. Fix the checkout manually before retrying."
fi
log "Branch check passed (on main)"

log "Fetching origin..."
git fetch origin

log "Resetting hard to origin/main..."
git reset --hard origin/main

NEW_SHA="$(git rev-parse HEAD)"
log "Now at commit: $NEW_SHA"

log "Installing dependencies (npm ci)..."
npm ci

log "Building (npm run build)..."
npm run build

log "Restarting PM2 process: $APP_NAME (only this process, no other apps)"
pm2 restart "$APP_NAME" --update-env

log "Waiting for process to stabilize..."
sleep 3

log "Running health checks..."

ROOT_CODE="$(curl -s -o /dev/null -w '%{http_code}' --max-time 10 "$ROOT_URL" || echo 000)"
if [ "$ROOT_CODE" != "200" ]; then
  fail "Root URL health check failed: got HTTP $ROOT_CODE from $ROOT_URL"
fi
log "Root URL check passed (HTTP 200)"

HEALTH_CODE="$(curl -s -o /dev/null -w '%{http_code}' --max-time 10 "$HEALTH_URL" || echo 000)"
if [ "$HEALTH_CODE" != "200" ]; then
  fail "DB health check failed: got HTTP $HEALTH_CODE from $HEALTH_URL"
fi
log "DB health check passed (HTTP 200)"

PM2_STATUS="$(pm2 jlist | node -e '
  let data = "";
  process.stdin.on("data", (chunk) => { data += chunk; });
  process.stdin.on("end", () => {
    const apps = JSON.parse(data);
    const app = apps.find((a) => a.name === process.argv[1]);
    process.stdout.write(app ? app.pm2_env.status : "not-found");
  });
' "$APP_NAME")"

if [ "$PM2_STATUS" != "online" ]; then
  fail "PM2 process $APP_NAME is not online (status: $PM2_STATUS)"
fi
log "PM2 status check passed ($APP_NAME: online)"

printf '\n[deploy] ==================== DEPLOYMENT SUCCEEDED ====================\n'
printf '[deploy] Deployed commit: %s\n' "$NEW_SHA"
printf '[deploy] %s is online and passing health checks.\n' "$APP_NAME"
printf '[deploy] ================================================================\n\n'
