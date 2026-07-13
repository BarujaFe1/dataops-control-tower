# Architecture — DataOps Control Tower

## Purpose

Lab / portfolio demo of a **data reliability control room**: freshness SLA, schema drift, quality scoring, incident timeline and run replay on **synthetic** sources.

This is **not** a production DataOps platform, warehouse connector suite, or alerting SaaS.

## High-level diagram

```text
CSV / API mock / Sheets mock (seeds)
        │
        ▼
 FastAPI quality engine (Pandas + Pydantic)
        │
        ├─► /api/tower | /incidents | /runs   (local optional)
        │
        ▼
 export_snapshot.py  ──►  apps/web/src/data/tower_snapshot.json
        │
        ▼
 Next.js Control Tower UI (Vercel default = embedded JSON)
```

## Packages

| Path | Role |
|---|---|
| `apps/api` | FastAPI app: checks, demo snapshot, REST |
| `apps/web` | Next.js 15 App Router UI |
| `data/seed` | Synthetic CSV sources |
| `data/demo` | Exported JSON twin of the web snapshot |
| `scripts/export_snapshot.py` | Keeps UI snapshot aligned with the engine |
| `.github/workflows/ci.yml` | API pytest + web lint/typecheck/build |

## Domain model (API)

- **DataSource** — connector metadata + SLA hours
- **QualityCheckResult** — named check with severity + pass/fail
- **RunSummary** — one execution with score, rates, fingerprint
- **Incident** — issue register entry with recommended action
- **ReliabilityScorecard** — per-source status lights + trend
- **ControlTowerSnapshot** — full tower payload for UI

## Frontend surfaces

- `/` — Control Tower dashboard (freshness, drift, matrix, incidents, replay)
- `/methodology` — explainable score & scope boundaries

## Runtime modes

| Mode | How | Data |
|---|---|---|
| Lab (default) | `NEXT_PUBLIC_USE_API` unset/false | Embedded `tower_snapshot.json` |
| API | `NEXT_PUBLIC_USE_API=true` + FastAPI up | Live `build_demo_snapshot()` |
| API fallback | API requested but unreachable | Embedded snapshot + warning banner |

## Quality engine (MVP checks)

| Check | Default fail threshold | Severity |
|---|---|---|
| Schema columns | missing expected cols | critical |
| Null rate | > 15% | high |
| Duplicate rate | > 5% | medium |
| Freshness SLA | age > `sla_hours` | critical |
| Volume drift | > ±35% vs previous | high |
| Non-empty | 0 rows | critical |

Score starts at 100; penalties: critical −25, high −15, medium −8, low −3.

## Security posture

- No real warehouse credentials
- Seeds are synthetic (example emails only)
- `.env*` ignored except `*.example`
- Vercel OIDC / `.env.local` never committed
