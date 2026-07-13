# Handoff — portfolio quality pass

**Branch:** `chore/portfolio-quality-pass`  
**Date:** 2026-07-13  
**Repo:** https://github.com/BarujaFe1/dataops-control-tower  
**Live demo:** https://dataops-control-tower.vercel.app

---

## What was found

- Lab demo Next.js + FastAPI already published, but lint was interactive/broken for CI.
- Frontend snapshot numbers could diverge from the quality engine.
- Fragile pytest assertion (`or`), unused UI deps, weak a11y on status-only color.
- Missing ARCHITECTURE / TESTING / DEPLOYMENT / HANDOFF docs and CI.
- Incident copy implied a hard null fail while Orders score stayed healthy.
- Silent API failure looked like intentional lab mode.

**Pre-pass score:** ~6.8/10 (AUDIT)

---

## What was fixed / improved

| Area | Change |
|---|---|
| DX / lint | ESLint flat config; `npm run lint` non-interactive |
| Snapshot | Canonical export via `scripts/export_snapshot.py`; web + `data/demo` twins |
| Engine | Robust seed root discovery; missing CSV raises; lab metadata + `Lab demo:` summary |
| Narrative | Incident `inc_003` reframed as column-level watch; KPI labeled Active incidents |
| UX | Methodology page, nav, skip link, loading/error routes, freshness a11y text+meter, schema latest-only |
| API fail | Distinct `api-fallback` banner when `USE_API=true` but API down |
| Tests | Deterministic quality tests + FastAPI HTTP tests + snapshot parity |
| CI | `.github/workflows/ci.yml` (pytest + lint/typecheck/build) |
| Deps | Removed unused `recharts` / `lucide-react` |
| Docs | AUDIT, ARCHITECTURE, TECHNICAL_DECISIONS, TESTING, DEPLOYMENT, SECURITY_NOTES, README rewrite |
| Config | Pydantic `SettingsConfigDict`; web `.env.example` documents `NEXT_PUBLIC_USE_API` |

---

## Commands run

```text
python scripts/export_snapshot.py
pytest apps/api/tests -q          → 11 passed
cd apps/web && npm install
npm run lint                      → pass
npm run typecheck                 → pass
npm run build                     → pass (/ and /methodology)
```

---

## What still remains (honest backlog)

1. Replace generated README screenshots with real Live Demo captures.
2. Optional Playwright smoke against the deployed URL.
3. Cross-platform root scripts if Windows-only paths reappear in tooling.
4. Phase-2 product work (contracts, Slack mock, lineage) — out of MVP scope.
5. Local copy `G:\dev\felipe-baruja-portfolio` may diverge from canonical portfolio; live slug already points to the demo.

---

## Residual risks

- Recruiters may still over-read “Control Tower” as production SaaS — mitigate with lab banner + methodology.
- Snapshot parity test fails if someone edits JSON by hand without re-export.
- `.env.local` with Vercel OIDC exists locally after `vercel link` (gitignored).

---

## Next steps

1. Open PR: `chore/portfolio-quality-pass` → `main`
2. Confirm CI green on GitHub
3. Optional: redeploy Vercel after merge
4. Capture real screenshots into `assets/screenshots/`

---

## Portfolio suggestions

- Keep Live Demo as primary CTA on the `dataops-control-tower` slug.
- Interview arc: DataFlow (point-in-time) → Control Tower (temporal reliability).
- Emphasize explainable score + incident actions, not connector count.

---

## Suggested commit message

```text
chore: improve portfolio quality, docs, tests and stability
```

---

## Acceptance checklist

- [x] Installs
- [x] Runs (web lab; API local documented)
- [x] Build passes
- [x] Essential tests pass
- [x] CI added
- [x] `.env.example` ok
- [x] `.gitignore` protects secrets
- [x] README strong + honest
- [x] Docs AUDIT / ARCHITECTURE / HANDOFF
- [x] UX reviewed
- [ ] Branch published (push after commit)
