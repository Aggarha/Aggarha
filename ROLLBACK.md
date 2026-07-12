# Rollback Record — Temporary Production Preview

Created: 2026-07-10 (see `date` at execution time for exact timestamp)

## Captured state before any change

**Production** (`/var/www/Aggarha-production`)
- Commit: `c2d4ff0cd8d1f228358645183b5bb807f9150b7e` ("Merge pull request #1 from Aggarha/feature/ui-polish")
- Branch: `main`
- Working tree: clean except one untracked `ecosystem.config.js` (expected, not part of git history)

**PM2 `aggarha-web` (before change)**
- pid: `2071951`
- status: `online`
- restart_time: `2`
- cwd: `/var/www/Aggarha-production`
- exec interpreter: `/usr/bin/node`
- script: `npm`
- args: `start -- -p 3100`
- env: `NODE_ENV=production`
- Source config: `/var/www/Aggarha-production/ecosystem.config.js` (untouched, left in place)

**Dev** (`/var/www/Aggarha`)
- Branch: `feature/product-condition-evidence`
- Base commit: same as production, `c2d4ff0`
- Full uncommitted working-tree diff: all the Visual Polish / Art Direction / editorial-identity work from this session (demo photo library, sponsored billboard, listing card redesign, homepage restructure, PlayStation Gamers Zone hero, Collectors' Rare Finds, VerifiedSparkle trust mark, etc.)

## Rollback commands (run in this exact order if asked to roll back)

```bash
# 1. Stop the preview process
pm2 delete aggarha-web

# 2. Restart production from its own untouched config (same pid namespace, same port)
pm2 start /var/www/Aggarha-production/ecosystem.config.js

# 3. Persist PM2 state
pm2 save

# 4. Verify
pm2 describe aggarha-web   # cwd should read /var/www/Aggarha-production
curl -s -o /dev/null -w "%{http_code}\n" http://127.0.0.1:3100/
curl -s -o /dev/null -w "%{http_code}\n" https://www.aggarha.com/
```

No git state changes anywhere (production stayed on `main` @ `c2d4ff0` throughout; dev tree was only read from, never written to). No Nginx, database, or Prisma changes were made or need reverting. The original production directory was never deleted or modified.

## Preview directory

`/var/www/Aggarha-review-preview` — a plain rsync copy of the dev working tree (including uncommitted changes), with its own `.env` copied from production, its own `node_modules`/`.next` built fresh. Safe to delete after review; does not affect `/var/www/Aggarha` or `/var/www/Aggarha-production`.
