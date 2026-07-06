# Aggarha Claude Operating Rules

## Scope
- Work only inside /var/www/Aggarha unless explicitly told otherwise.
- Do not inspect or modify VulpesArena, FOPS, Infrastructure, Nginx, PM2, Docker, or other repos unless explicitly requested.

## Context Discipline
- Use minimum context.
- Prefer targeted file reads over recursive search.
- Read only files directly needed for the task.
- Use the BRD, PRD, architecture docs, and this file as source of truth.

## Delivery Style
- Develop vertically whenever possible: database + API + UI + UX + validation.
- Keep Aggarha demo-presentable.
- Do not build payments unless explicitly requested.
- Do not build chat unless explicitly requested.

## Validation
- Run validation before commit.
- Required validation order when relevant: prisma validate, migration/seed if database changed, lint, typecheck, build.
- Commit and push only after successful validation.

## Reporting
- Keep reports concise.
- Include completed work, files changed, validation, commit SHA, and remaining work.
- Stop after each phase and wait for the next instruction.
- If task context becomes large, remind the user to run /compact.
- If switching to a new unrelated task, remind the user to run /clear.

## Safety
- Never remove features just to make validation pass.
- If a migration is risky, stop and explain before proceeding.
