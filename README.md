<div align="center">
  <img src="./assets/icon.png" alt="DataOps Control Tower Logo" width="120" height="120" />

  <h1>DataOps Control Tower</h1>

  <p><strong>Lab demo de observabilidade de dados: freshness, schema drift, quality score, SLA e incidentes.</strong></p>
  <p><strong>Data reliability lab: freshness, schema drift, quality score, SLA and incidents on synthetic sources.</strong></p>

  <p>
    <a href="https://dataops-control-tower.vercel.app"><strong>Live Demo</strong></a> •
    <a href="#problema">Problema</a> •
    <a href="#solução">Solução</a> •
    <a href="#arquitetura">Arquitetura</a> •
    <a href="#quick-start">Quick Start</a> •
    <a href="#o-que-este-projeto-demonstra">Portfolio</a>
  </p>

  <p>
    <a href="https://dataops-control-tower.vercel.app"><img alt="Live Demo" src="https://img.shields.io/badge/Live%20Demo-Vercel-000000?style=for-the-badge&logo=vercel" /></a>
    <img alt="Next.js" src="https://img.shields.io/badge/Next.js-15-000000?style=for-the-badge&logo=nextdotjs" />
    <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white" />
    <img alt="FastAPI" src="https://img.shields.io/badge/FastAPI-Lab%20API-009688?style=for-the-badge&logo=fastapi&logoColor=white" />
    <img alt="Lab Demo" src="https://img.shields.io/badge/Lab%20Demo-Synthetic-22C55E?style=for-the-badge" />
  </p>
</div>

<p align="center">
  <img src="./assets/hero-cover.png" alt="DataOps Control Tower overview" width="100%" />
</p>

<p align="center"><strong>Live Demo:</strong> <a href="https://dataops-control-tower.vercel.app">https://dataops-control-tower.vercel.app</a></p>

> **Status:** Lab / portfolio demo (MVP). Dados sintéticos. **Não** é warehouse cloud, Monte Carlo, Great Expectations Cloud nem alerting de produção.

---

## Problema

Times de analytics só descobrem que uma base quebrou **depois** que o dashboard já mentiu: frescor fora do SLA, schema renomeado, volume drift, nulos crescentes — sem issue register nem score explicável.

## Solução

O **DataOps Control Tower** é uma control room de confiabilidade para datasets recorrentes:

1. Cadastro demo de 3 fontes (CSV / API mock / Sheets mock)
2. Checks de schema, nulls, duplicatas, freshness SLA e volume drift
3. Score de reliability com penalidades por severidade
4. Timeline de incidentes com próxima ação
5. Matriz de qualidade + run replay + briefing executivo

Complementa o **DataFlow**: DataFlow diagnostica uma base pontual; o Control Tower mostra **confiabilidade ao longo do tempo** (em modo lab).

---

## Principais funcionalidades

| Painel | O que mostra |
|---|---|
| Freshness & SLA | Idade vs janela SLA por fonte |
| Schema drift | Contrato de colunas vs fingerprint observado |
| Quality matrix | Status lights (freshness / schema / volume / quality) |
| SLA scorecards | Score + tendência + incidentes ativos |
| Incident timeline | Severidade, status, ação recomendada |
| Run replay | Histórico com score, rows, freshness, volume Δ |
| Methodology | `/methodology` — limiares e o que o lab **não** é |

---

## Arquitetura

```text
data/seed (CSV sintético)
        ↓
FastAPI quality engine  →  /api/tower (local opcional)
        ↓
scripts/export_snapshot.py
        ↓
Next.js UI (Vercel = JSON embutido)
```

Detalhes: [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md) · decisões: [docs/TECHNICAL_DECISIONS.md](./docs/TECHNICAL_DECISIONS.md)

<p align="center">
  <img src="./assets/architecture-pipeline.png" alt="Pipeline" width="100%" />
</p>

---

## Stack

- **Web:** Next.js 15, React 19, TypeScript, Tailwind CSS 3
- **API:** FastAPI, Pydantic v2, Pandas, Pytest
- **Deploy:** Vercel (frontend lab)
- **CI:** GitHub Actions (pytest + lint/typecheck/build)

---

## Quick Start

### Demo pública
https://dataops-control-tower.vercel.app

### Frontend local (igual à Vercel)

```bash
cd apps/web
npm install
npm run dev
```

### API + Web (opcional)

```bash
# API
cd apps/api
python -m venv .venv
.venv\Scripts\activate          # Windows
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000

# Web — apps/web/.env.local
# NEXT_PUBLIC_USE_API=true
# NEXT_PUBLIC_API_URL=http://127.0.0.1:8000
cd apps/web && npm run dev
```

Windows one-shot: `start.bat`

### Variáveis de ambiente

| Variável | Onde | Default |
|---|---|---|
| `NEXT_PUBLIC_USE_API` | web | `false` (snapshot embutido) |
| `NEXT_PUBLIC_API_URL` | web | `http://127.0.0.1:8000` |
| `WEB_ORIGIN` / `DEMO_MODE` | api | ver `apps/api/.env.example` |

Templates: `.env.example`, `apps/web/.env.example`, `apps/api/.env.example`

---

## Testes

```bash
# API
python -m pytest apps/api/tests -q

# Web
cd apps/web && npm run lint && npm run typecheck && npm run build
```

Após mudar seeds/engine:

```bash
python scripts/export_snapshot.py
```

Guia: [docs/TESTING.md](./docs/TESTING.md) · Deploy: [docs/DEPLOYMENT.md](./docs/DEPLOYMENT.md)

---

## Decisões técnicas e trade-offs

- **Lab-first:** 3 conectores sintéticos > dezenas de integrações superficiais
- **JSON na Vercel:** demo estável sem backend Python em produção
- **Score determinístico:** interviewável e testável (sem black box)
- **Trade-off:** não há orquestração real, lineage enterprise nem anomaly ML

---

## Roadmap

| Fase | Escopo |
|---|---|
| MVP (agora) | 3 fontes demo, checks, score, incidentes, UI, CI |
| Fase 2 | Contracts, Slack/email mock, release diff, lineage básico |
| Fase 3 | Orquestração, playbooks, multi-workspace |

---

## O que este projeto demonstra

- Data observability / reliability thinking
- Analytics engineering contínuo (não só notebook)
- Produto full-stack (Next.js + FastAPI)
- Score explicável + incident response narrativo
- Honestidade de escopo (lab banner + methodology)

## Como eu apresentaria em entrevista

1. Abrir a Live Demo e ler o overall reliability
2. Mostrar SLA breach (Support) e schema drift (Marketing `leads`)
3. Percorrer Incident timeline → recommended action
4. Abrir `/methodology` e explicar penalidades
5. Contrastar com DataFlow (pontual vs temporal)
6. Declarar limites: sintético, sem warehouse real

Roteiro: [docs/portfolio_case.md](./docs/portfolio_case.md)

---

## Screenshots

> Placeholders gerados para README; a UI real é a Live Demo.

<table>
  <tr>
    <td width="50%"><img src="./assets/screenshots/02-sla-scorecards.png" alt="SLA" /><br /><sub>SLA scorecards</sub></td>
    <td width="50%"><img src="./assets/screenshots/03-quality-matrix.png" alt="Matrix" /><br /><sub>Quality matrix</sub></td>
  </tr>
  <tr>
    <td width="50%"><img src="./assets/screenshots/04-incident-timeline.png" alt="Incidents" /><br /><sub>Incident timeline</sub></td>
    <td width="50%"><img src="./assets/screenshots/05-run-replay.png" alt="Replay" /><br /><sub>Run replay</sub></td>
  </tr>
</table>

---

## Documentação

- [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md)
- [docs/TECHNICAL_DECISIONS.md](./docs/TECHNICAL_DECISIONS.md)
- [docs/TESTING.md](./docs/TESTING.md)
- [docs/DEPLOYMENT.md](./docs/DEPLOYMENT.md)
- [docs/AUDIT_REPORT.md](./docs/AUDIT_REPORT.md)
- [docs/HANDOFF.md](./docs/HANDOFF.md)
- [SECURITY_NOTES.md](./SECURITY_NOTES.md)

---

## Autor

**Felipe Alirio Baruja** · [Portfolio](https://barujafe.vercel.app/) · [GitHub](https://github.com/BarujaFe1) · [LinkedIn](https://www.linkedin.com/in/barujafe/)

## Licença

MIT © 2026 Felipe Alirio Baruja
