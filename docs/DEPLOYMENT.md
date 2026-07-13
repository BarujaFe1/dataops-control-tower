# Deployment — DataOps Control Tower

## Live demo

**https://dataops-control-tower.vercel.app**

Frontend-only lab mode (embedded synthetic snapshot).

## Vercel (recommended)

1. Import `BarujaFe1/dataops-control-tower`
2. **Root Directory:** `apps/web`
3. Framework: Next.js (see `apps/web/vercel.json`)
4. Env (optional): leave `NEXT_PUBLIC_USE_API` unset/false
5. Deploy production

Local CLI (already used):

```bash
cd apps/web
vercel link --yes --project dataops-control-tower
vercel deploy --prod --yes
```

## Local web

```bash
cd apps/web
npm install
npm run dev
```

Open http://localhost:3000

## Local API + web

```bash
# Terminal 1
cd apps/api
python -m venv .venv
.venv\Scripts\activate   # Windows
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000

# Terminal 2
cd apps/web
# set NEXT_PUBLIC_USE_API=true in .env.local
npm run dev
```

Or Windows launcher: `start.bat`

## What is *not* deployed

- FastAPI workers on Vercel (by design)
- Real warehouse / Slack / email alerting
- Streaming anomaly detection

Those belong to roadmap phases, not this lab demo.
