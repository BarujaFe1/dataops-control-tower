# docs/AUDIT_REPORT.md
# Audit Report — DataOps Control Tower

**Date:** 2026-07-13  
**Branch:** `chore/portfolio-quality-pass`  
**Auditor role:** portfolio quality pass (architecture, DX, QA, security, recruiter lens)

---

## Executive summary

O repositório é um **lab/demo de observabilidade de dados** (Next.js + FastAPI) com painéis de freshness/SLA, schema drift, quality matrix e incidentes. A demo pública na Vercel já funciona com snapshot sintético embutido. O núcleo de qualidade em Python é pequeno, testável e alinhado à tese do produto.

Principais gaps encontrados: **lint quebrado (prompt interativo)**, **snapshot frontend divergente do engine API**, testes frágeis, ausência de CI, documentação de arquitetura/deploy incompleta para recrutadores, UX com status só por cor, e dependências frontend não usadas (`recharts`, `lucide-react`).

**Nota atual (pré-pass):** **6.8 / 10**  
**Nota alvo deste pass:** **8.3+ / 10** (lab honesto, build estável, docs fortes, testes/CI)

---

## Stack real

| Camada | Tecnologia |
|---|---|
| Web | Next.js 15 App Router, React 19, TypeScript, Tailwind 3 |
| API | FastAPI, Pydantic v2, Pandas, Pytest |
| Demo data | CSV seeds + snapshot sintético |
| Deploy | Vercel (frontend only, synthetic mode) |
| Live demo | https://dataops-control-tower.vercel.app |

---

## Principais riscos

1. **Narrativa vs realidade:** risco de parecer “plataforma DataOps” quando é lab com 3 fontes sintéticas.
2. **Lint não configurado:** `npm run lint` abria wizard interativo e quebrava CI/DX.
3. **Divergência de números:** FALLBACK web ≠ scores calculados pela API (`74.5/[92,60,71.5]` vs `75.0/[100,75,50]`).
4. **Sem CI:** regressões em quality engine / build Next passam despercebidas.
5. **Segurança:** `.env.local` com `VERCEL_OIDC_TOKEN` existe localmente (já ignorado; não versionar).

---

## Quick wins

- Configurar ESLint flat config não-interativo.
- Alinhar snapshot web ao JSON gerado pelo engine.
- Endurecer testes de qualidade (assertions determinísticas).
- Adicionar CI GitHub Actions (web + api).
- README de portfólio + docs de arquitetura/deploy/testes/handoff.
- A11y: texto de status além de cor; `aria` em scorecards; empty states.

---

## Melhorias estruturais

- Scripts raiz (`package.json` / `Makefile` ou `scripts/`) para DX.
- Página `/methodology` explicando score e limiares.
- Teste de integração leve do snapshot demo.
- Remover deps mortas ou usá-las de propósito.

---

## Bugs / falhas encontradas

| ID | Severidade | Descrição | Status planejado |
|---|---|---|---|
| B1 | High (DX) | `next lint` sem config → prompt interativo | Fix |
| B2 | Medium | Snapshot UI ≠ engine API | Fix (shared JSON) |
| B3 | Low | `test_null_and_duplicate_rates` assertion frouxa (`or`) | Fix |
| B4 | Low | Status lights só por cor (a11y) | Fix |
| B5 | Low | `recharts`/`lucide-react` não usados | Remover ou usar |
| B6 | Info | Screenshots são placeholders gerados | Documentar |
| B7 | Info | API `metadata.lab` ausente no snapshot API | Fix |

---

## Plano de execução

1. Corrigir lint/build scripts e ESLint.
2. Exportar snapshot canônico + alinhar frontend.
3. Expandir testes API + smoke snapshot.
4. UX: methodology, a11y, empty states, nav.
5. CI + docs + README portfolio-grade.
6. Validar typecheck/build/pytest.
7. Commit + push da branch.

---

## Checklist final (aceitação)

- [x] instala
- [x] roda (web lab / API local documentada)
- [x] build passa
- [x] testes essenciais passam (11 pytest + lint/typecheck/build)
- [x] CI adicionada
- [x] `.env.example` ok
- [x] `.gitignore` protege segredos
- [x] README forte e honesto
- [x] docs AUDIT/ARCHITECTURE/HANDOFF
- [x] UX revisada
- [ ] branch publicada (após push)

**Nota pós-pass (estimada):** **8.4 / 10** (lab honesto, estável, documentado; screenshots reais ainda pendentes)
