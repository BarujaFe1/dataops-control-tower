import type { ReliabilityScorecard } from "@/types";

type FreshnessRow = {
  source: string;
  ageHours: number | null;
  slaHours: number;
  status: string;
};

export function FreshnessPanel({
  scorecards,
  runs,
}: {
  scorecards: ReliabilityScorecard[];
  runs: Array<{ source_id: string; freshness_hours: number; finished_at: string }>;
}) {
  if (scorecards.length === 0) {
    return (
      <section className="panel p-5">
        <h2 className="font-display text-xl font-semibold">Freshness &amp; SLA</h2>
        <p className="mt-4 text-sm text-tower-muted">No sources in this snapshot.</p>
      </section>
    );
  }

  const rows: FreshnessRow[] = scorecards.map((card) => {
    const sourceRuns = runs.filter((r) => r.source_id === card.source_id);
    const run = sourceRuns.sort(
      (a, b) => new Date(b.finished_at).getTime() - new Date(a.finished_at).getTime(),
    )[0];
    return {
      source: card.source_name,
      ageHours: run?.freshness_hours ?? null,
      slaHours: card.sla_hours,
      status: card.freshness_status,
    };
  });

  return (
    <section className="panel p-5" aria-labelledby="freshness-heading">
      <h2 id="freshness-heading" className="font-display text-xl font-semibold">
        Freshness &amp; SLA
      </h2>
      <p className="mt-1 text-sm text-tower-muted">
        Age of each synthetic source versus its freshness SLA window.
      </p>
      <div className="mt-4 space-y-3">
        {rows.map((row) => {
          const age = row.ageHours ?? 0;
          const pct = row.ageHours == null ? 0 : Math.min(100, (age / row.slaHours) * 100);
          const breach = row.status !== "ok";
          const label = breach ? "breach" : "within SLA";
          return (
            <div key={row.source}>
              <div className="mb-1 flex flex-wrap items-center justify-between gap-2 text-sm">
                <span className="font-medium">{row.source}</span>
                <span className={breach ? "text-tower-danger" : "text-tower-accent"}>
                  {row.ageHours == null
                    ? "no run"
                    : `${row.ageHours}h / ${row.slaHours}h · ${label}`}
                </span>
              </div>
              <div
                className="h-2 overflow-hidden rounded-full bg-tower-line"
                role="meter"
                aria-valuemin={0}
                aria-valuemax={row.slaHours}
                aria-valuenow={age}
                aria-label={`${row.source} freshness ${label}`}
              >
                <div
                  className={`h-full rounded-full ${breach ? "bg-tower-danger" : "bg-tower-accent"}`}
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
