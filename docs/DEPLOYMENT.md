# Deployment

> **Implementation status: Implemented.** This describes the actual production setup on the current host, not a target architecture — see [SYSTEM_ARCHITECTURE.md](SYSTEM_ARCHITECTURE.md) for how this compares to the longer-term target deployment.

## 1. Production topology

Production and development are **isolated checkouts of the same repository**, on the same host:

| Directory | Purpose | Branch |
|---|---|---|
| `/var/www/Aggarha` | Development workspace — feature branches, local `npm run build`/`lint`/`typecheck` validation | any (`feature/*`, etc.) |
| `/var/www/Aggarha-production` | Production checkout, served by PM2 | `main` only |

This split exists because production and development previously shared a single directory, and a `npm run build` run for local validation would silently overwrite the live server's `.next` build output out from under the running process — causing Next.js `Failed to find Server Action` errors and crash/restart loops. See `AGGARHA_PRODUCTION_ISOLATION_PLAN.md` (`/var/www/`) for the full incident writeup and isolation rationale.

Nginx (`www.aggarha.com` / `aggarha.com`) reverse-proxies to `http://127.0.0.1:3100` — it has no awareness of which directory is behind that port, so deploys never require an Nginx change.

PM2 runs the production app as a single process named **`aggarha-web`**, defined by `/var/www/Aggarha-production/ecosystem.config.js`, bound to port 3100.

## 2. Deploying to production

**Never build or restart PM2 from `/var/www/Aggarha`.** Production only ever moves forward via:

```bash
scripts/deploy-production.sh
```

Run this from the production host as the user that owns the PM2 process. The script:

1. Operates only on `/var/www/Aggarha-production` — refuses to touch anything else.
2. Verifies the checkout is on `main`; **refuses to deploy otherwise.**
3. `git fetch origin` then `git reset --hard origin/main` — production always ends up at exactly what's merged to `main`, nothing else.
4. `npm ci` — clean, reproducible install from `package-lock.json`.
5. `npm run build`.
6. `pm2 restart aggarha-web --update-env` — restarts only that one process; no other PM2 app on the host is touched.
7. Runs health checks (`http://127.0.0.1:3100/` and `/api/health/db` both must return 200, and PM2 must report the process `online`).
8. Prints a clear `DEPLOYMENT SUCCEEDED` or `DEPLOYMENT FAILED` banner and exits non-zero on any failure.

The script uses `set -euo pipefail`, so any failed step (bad branch, failed build, failed health check) stops the deploy immediately rather than leaving production half-updated.

### Prerequisites for a deploy
- The change has been merged into `main` on GitHub (deploys are pull-based from `origin/main`, not pushed from a developer's machine).
- `/var/www/Aggarha-production/.env` is already provisioned (see §4) — the script does not manage secrets.

## 3. Rollback

```bash
cd /var/www/Aggarha-production
git log --oneline -5                # find the last known-good commit SHA
git reset --hard <last-good-sha>
npm ci
npm run build
pm2 restart aggarha-web --update-env
```

Then re-run the same health checks the deploy script performs (`curl http://127.0.0.1:3100/` and `/api/health/db`, `pm2 status`).

## 4. Secrets

`/var/www/Aggarha-production/.env` is gitignored and is **not** touched by `git reset --hard` — it must be provisioned manually once, and updated manually if secrets change. There is no automated sync between environments; this is a known gap (see Risks below).

## 5. One-time setup (already performed — reference only)

This section documents how `/var/www/Aggarha-production` was created; it is not part of the routine deploy flow and should not need to be repeated unless the production checkout is lost or recreated from scratch.

```bash
cd /var/www
git clone git@github.com:Aggarha/Aggarha.git Aggarha-production
cd Aggarha-production
git checkout main
cp /var/www/Aggarha/.env .env
npm ci
npm run build
# ecosystem.config.js created in this directory (see repo history)
pm2 delete aggarha-web   # only if an old process pointed at the wrong directory
pm2 start ecosystem.config.js
pm2 save
```

## 6. Risks / known gaps

- No CI/CD automation — `scripts/deploy-production.sh` is operator-run, not triggered automatically on merge.
- No technical enforcement prevents someone from manually `git checkout`-ing a different branch inside `/var/www/Aggarha-production` outside the deploy script; the script's branch check is the only guard.
- `.env` drift: production secrets are updated manually and are not version-controlled or synced.
- `pm2 save` must be re-run after any manual PM2 change to `aggarha-web`, or a host reboot will resurrect a stale process definition.

## 7. Cross-references
- [SYSTEM_ARCHITECTURE.md](SYSTEM_ARCHITECTURE.md)
- Master index: [PROJECT_HANDOFF.md](../PROJECT_HANDOFF.md)
