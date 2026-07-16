<div align="center">
  <img src="./assets/icon.png" alt="DataOps Control Tower Logo" width="120" height="120" />

  <h1>DataOps Control Tower</h1>

  <p><strong>Torre de controle de confiabilidade de dados — qualidade, frescor, schema drift, SLA e incidentes.</strong></p>
  <p><strong>Data reliability control tower — quality, freshness, schema drift, SLA and incidents.</strong></p>

  <p>
    <a href="#pt-br">PT-BR</a> ·
    <a href="#en">English</a> ·
    <a href="#live-demo">Live Demo</a> ·
    <a href="#stack--tecnologias">Stack</a> ·
    <a href="#arquitetura--architecture">Architecture</a> ·
    <a href="#quick-start--início-rápido">Quick Start</a> ·
    <a href="#autor--author">Author</a>
  </p>

  <p>
    <a href="https://dataops-control-tower.vercel.app"><img alt="Live Demo" src="https://img.shields.io/badge/Live%20Demo-dataops--control--tower.vercel.app-000000?style=for-the-badge&logo=vercel&logoColor=white" /></a>
    <img alt="Next.js" src="https://img.shields.io/badge/Next.js-15-000000?style=for-the-badge&logo=nextdotjs" />
    <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-React-3178C6?style=for-the-badge&logo=typescript&logoColor=white" />
    <img alt="Python" src="https://img.shields.io/badge/Python-3.12-3776AB?style=for-the-badge&logo=python&logoColor=white" />
    <img alt="FastAPI" src="https://img.shields.io/badge/FastAPI-API-009688?style=for-the-badge&logo=fastapi&logoColor=white" />
    <img alt="Tailwind" src="https://img.shields.io/badge/Tailwind-CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" />
    <img alt="Lab Demo" src="https://img.shields.io/badge/Status-Lab%20demo-2563EB?style=for-the-badge" />
    <img alt="MIT" src="https://img.shields.io/badge/License-MIT-111827?style=for-the-badge" />
  </p>

  <p>
    <a href="https://dataops-control-tower.vercel.app"><strong>Live Demo</strong></a> ·
    <a href="https://github.com/BarujaFe1/dataops-control-tower"><strong>Repositório</strong></a> ·
    <a href="https://barujafe.vercel.app/"><strong>Portfólio</strong></a> ·
    <a href="https://www.linkedin.com/in/barujafe/"><strong>LinkedIn</strong></a>
  </p>
</div>

<p align="center">
  <img src="./assets/hero-cover.png" alt="DataOps Control Tower overview" width="100%" />
</p>

---

<a id="pt-br"></a>

## PT-BR

## Visão geral

**DataOps Control Tower** monitora datasets recorrentes com painéis de qualidade, frescor, drift de schema, SLA e incidentes — torre de controle de confiabilidade em formato de lab.

> **Aviso de lab:** demo de portfólio com dados sintéticos/amostra. Não é produto em produção com SLA, integrações reais de clientes ou garantia operacional.

---

## Problema

Pipelines quebram em silêncio: schema muda, frescor atrasa, qualidade cai. Sem torre de controle, o negócio descobre tarde.

---

## Para quem

- Data engineers e analytics engineers
- Times de plataforma de dados
- Gestores que precisam de linguagem de SLA de dados

---

## Funcionalidades

- Painéis de qualidade e frescor
- Detecção de schema drift
- Visão de SLA e incidentes
- Seeds processados em data/
- Scheduler opcional (APScheduler) na API

---

## Escopo e limites

- **É:** lab de observabilidade de dados.
- **Não é:** Great Expectations cloud, Monte Carlo clone, monitoramento enterprise multi-tenant.

---

<a id="en"></a>

## English

## Overview

**DataOps Control Tower** monitors recurring datasets with quality, freshness, schema-drift, SLA and incident panels — a data-reliability control tower as a portfolio lab.

> **Lab notice:** portfolio demo with synthetic/sample data. Not a production product with SLA, real customer integrations, or operational guarantees.

---

## Problem

Pipelines fail quietly: schemas drift, freshness slips, quality drops. Without a control tower, the business finds out late.

---

## Who it is for

- Data and analytics engineers
- Data platform teams
- Managers who need data-SLA language

---

## Features

- Quality and freshness panels
- Schema-drift detection
- SLA and incident views
- Processed seeds under data/
- Optional APScheduler in the API

---

## Scope and limits

- **Is:** data-observability lab.
- **Is not:** Great Expectations cloud, Monte Carlo clone, enterprise multi-tenant monitoring.

---

<a id="live-demo"></a>

## Live Demo

**URL:** [https://dataops-control-tower.vercel.app](https://dataops-control-tower.vercel.app)

Demo hospedada para avaliação de portfólio / Hosted for portfolio review.

> Lab demo — synthetic / sample data unless noted. Not a production SLA product.

---

<a id="stack--tecnologias"></a>

## Stack / Tecnologias

| Tecnologia | Uso no projeto |
|---|---|
| Next.js 15 / React 19 / TypeScript / Tailwind | UI |
| Lucide / Recharts / clsx | UI kit |
| FastAPI / Pandas / NumPy | Checks e API |
| APScheduler | Jobs de monitoramento (lab) |
| Pytest | Testes |

---

<a id="arquitetura--architecture"></a>

## Arquitetura / Architecture

Monorepo pps/api + pps/web com dados seed/processed e documentação de metodologia de qualidade.

`	xt
dataops-control-tower/
├── apps/
│   ├── api/
│   └── web/
├── assets/
├── data/
│   ├── seed/
│   └── processed/
├── docs/
├── start.bat
└── LICENSE
`

---

<a id="quick-start--início-rápido"></a>

## Quick Start / Início rápido

### Pré-requisitos / Requirements

- Node.js 20+
- Python 3.12+
- npm

### Clonar / Clone

`ash
git clone https://github.com/BarujaFe1/dataops-control-tower.git
cd dataops-control-tower
`

### Windows (atalho)

`at
start.bat
`

Sobe API em :8000 e web em :3000.

### Manual

`ash
# API
cd apps/api
python -m venv .venv
# Windows: .venv\Scripts\activate
# macOS/Linux: source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
`

`ash
# Web (outro terminal)
cd apps/web
npm install
npm run dev
`

Abra http://localhost:3000

Copie .env.example se precisar de NEXT_PUBLIC_API_URL.


---

## Technical decisions / Decisões técnicas

- **Checks explícitos** (qualidade/frescor/drift) em vez de só dashboards.
- **Tailwind** para UI de torre de controle.
- **Seeds** para demo sem warehouse real.

---

## Roadmap

### Implementado
- Painéis, drift, SLA/incidentes, demo Vercel

### Planejado
- Alertas externos
- Mais conectores
- Histórico longo de incidentes

---

<a id="autor--author"></a>

## Autor / Author

Developed by **Felipe Alirio Baruja**.

- **Portfolio:** [https://barujafe.vercel.app/](https://barujafe.vercel.app/)
- **GitHub:** [github.com/BarujaFe1](https://github.com/BarujaFe1)
- **LinkedIn:** [linkedin.com/in/barujafe](https://www.linkedin.com/in/barujafe/)
- **Repository:** [github.com/BarujaFe1/dataops-control-tower](https://github.com/BarujaFe1/dataops-control-tower)

---

## License / Licença

MIT License.

See [LICENSE](./LICENSE) for details.

---

<div align="center">
  <p><strong>DataOps Control Tower</strong></p>
  <p>Confiabilidade de dados visível antes do incidente.</p>
  <p><em>Data reliability visible before the incident.</em></p>
</div>
