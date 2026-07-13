# Security notes — DataOps Control Tower

## Scope

Lab demo with synthetic CSVs. No production customer data.

## Findings

| Item | Status |
|---|---|
| `.env` / secrets in git | Protected by `.gitignore` |
| `apps/web/.env.local` (Vercel OIDC) | Present locally after `vercel link`; **must not be committed** |
| Seed emails (`userN@example.com`) | Synthetic placeholders |
| API `database_url` | Unused SQLite string for future; no DB credentials |

## Rules

1. Never commit `.env`, `.env.local`, `.vercel` project tokens, or personal exports.
2. Prefer `*.example` templates only.
3. If a secret is ever pushed, rotate it and record the incident here without pasting the secret.
