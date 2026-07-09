import { fetchTower, USE_API } from "@/lib/api";
import { FALLBACK_TOWER } from "@/lib/fallback";
import { FreshnessPanel } from "@/components/FreshnessPanel";
import { IncidentTimeline } from "@/components/IncidentTimeline";
import { QualityMatrix } from "@/components/QualityMatrix";
import { SchemaDriftPanel } from "@/components/SchemaDriftPanel";
import { SlaCards } from "@/components/SlaCards";

async function loadTower() {
  try {
    return await fetchTower();
  } catch {
    return FALLBACK_TOWER;
  }
}

export default async function HomePage() {
  const tower = await loadTower();
  const isLab = !USE_API || Boolean(tower.metadata?.lab);

  return (
    <main className="grid-glow min-h-screen">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {isLab && (
          <div className="mb-6 rounded-xl border border-tower-warn/40 bg-tower-warn/10 px-4 py-3 text-sm text-tower-warn">
            <strong className="font-semibold">Lab / portfolio demo</strong>
            {" — "}
            synthetic sources and simulated incidents. Not connected to a real warehouse, scheduler
            or production alerting stack.
          </div>
        )}

        <header className="mb-10 flex flex-col gap-6 border-b border-tower-line pb-8 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.28em] text-tower-accent">
              Data reliability operations
            </p>
            <h1 className="font-display text-4xl font-bold tracking-tight sm:text-5xl">
              DataOps Control Tower
            </h1>
            <p className="mt-3 max-w-2xl text-base text-slate-300">
              Monitor recurring datasets like living systems: quality, freshness, schema drift,
              volume, duplicates, SLA and incidents — before dashboards break.
            </p>
          </div>
          <div className="panel px-5 py-4 text-right">
            <p className="text-xs uppercase tracking-[0.18em] text-tower-muted">Overall reliability</p>
            <p className="font-display text-5xl font-semibold text-tower-accent">
              {tower.overall_reliability}
            </p>
            <p className="text-sm text-tower-muted">/ 100</p>
          </div>
        </header>

        <section className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            ["Sources", tower.sources_monitored],
            ["Open incidents", tower.open_incidents],
            ["SLA breaches", tower.failing_slas],
            ["Recent runs", tower.recent_runs.length],
          ].map(([label, value]) => (
            <div key={String(label)} className="panel p-4">
              <p className="text-xs uppercase tracking-[0.18em] text-tower-muted">{label}</p>
              <p className="mt-2 font-display text-3xl font-semibold">{value}</p>
            </div>
          ))}
        </section>

        <section className="mb-10 grid gap-4 lg:grid-cols-2">
          <FreshnessPanel scorecards={tower.scorecards} runs={tower.recent_runs} />
          <SchemaDriftPanel runs={tower.recent_runs} />
        </section>

        <section className="mb-10">
          <div className="mb-4 flex items-end justify-between gap-4">
            <div>
              <h2 className="font-display text-2xl font-semibold">SLA scorecards</h2>
              <p className="text-sm text-tower-muted">Freshness windows, reliability trend and open risk.</p>
            </div>
          </div>
          <SlaCards scorecards={tower.scorecards} />
        </section>

        <section className="mb-10">
          <h2 className="mb-2 font-display text-2xl font-semibold">Quality matrix</h2>
          <p className="mb-4 text-sm text-tower-muted">
            Cross-source status lights for freshness, schema, volume and quality.
          </p>
          <QualityMatrix scorecards={tower.scorecards} />
        </section>

        <section className="mb-10 grid gap-8 lg:grid-cols-5">
          <div className="lg:col-span-3">
            <h2 className="mb-2 font-display text-2xl font-semibold">Incident timeline</h2>
            <p className="mb-4 text-sm text-tower-muted">
              Issue register with severity, status and recommended next action.
            </p>
            <IncidentTimeline incidents={tower.incidents} />
          </div>
          <aside className="panel h-fit p-5 lg:col-span-2">
            <h2 className="font-display text-xl font-semibold">Executive briefing</h2>
            <p className="mt-3 text-sm leading-relaxed text-slate-300">{tower.executive_summary}</p>
            <div className="mt-5 space-y-2 text-sm">
              <p className="text-tower-muted">Demo connectors</p>
              <p className="font-medium">CSV · API mock · Sheets mock</p>
              <p className="text-tower-muted">Generated at</p>
              <p className="font-medium">
                {new Date(tower.generated_at).toLocaleString("pt-BR")}
              </p>
            </div>
          </aside>
        </section>

        <section className="panel p-5">
          <h2 className="font-display text-xl font-semibold">Run replay</h2>
          <p className="mt-1 text-sm text-tower-muted">Latest monitored executions with score and drift signals.</p>
          <div className="mt-4 overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="text-tower-muted">
                <tr>
                  <th className="py-2 pr-4">Run</th>
                  <th className="py-2 pr-4">Source</th>
                  <th className="py-2 pr-4">Score</th>
                  <th className="py-2 pr-4">Rows</th>
                  <th className="py-2 pr-4">Freshness</th>
                  <th className="py-2 pr-4">Volume Δ</th>
                  <th className="py-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {tower.recent_runs.map((run) => (
                  <tr key={run.run_id} className="border-t border-tower-line/70">
                    <td className="py-2 pr-4 font-mono text-xs">{run.run_id}</td>
                    <td className="py-2 pr-4">{run.source_id}</td>
                    <td className="py-2 pr-4">{run.quality_score}</td>
                    <td className="py-2 pr-4">{run.row_count}</td>
                    <td className="py-2 pr-4">{run.freshness_hours}h</td>
                    <td className="py-2 pr-4">{run.volume_delta_pct}%</td>
                    <td className="py-2 capitalize">{run.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </main>
  );
}
