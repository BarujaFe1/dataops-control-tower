# Testing — DataOps Control Tower

## API (Pytest)

```bash
cd apps/api
python -m venv .venv
# Windows: .venv\Scripts\activate
# Unix: source .venv/bin/activate
pip install -r requirements.txt
pytest -q
```

From repo root (Python on PATH):

```bash
npm run test:api
# or
python -m pytest apps/api/tests -q
```

### Suites

| File | Focus |
|---|---|
| `tests/test_quality.py` | Null/dup rates, penalties, freshness TZ, empty DF, demo contract |
| `tests/test_api.py` | FastAPI `/api/health`, `/tower`, `/incidents`, `/runs`, `/sources` |
| `tests/test_snapshot_parity.py` | Embedded web JSON matches engine KPIs |

## Web

```bash
cd apps/web
npm ci
npm run lint
npm run typecheck
npm run build
```

No Jest/Playwright suite yet — CI gates on lint + typecheck + production build.

## Snapshot refresh

After changing seeds or `demo.py`:

```bash
python scripts/export_snapshot.py
pytest apps/api/tests -q
```

## CI

`.github/workflows/ci.yml` runs API pytest and web lint/typecheck/build on `main`, `chore/**`, and PRs.
