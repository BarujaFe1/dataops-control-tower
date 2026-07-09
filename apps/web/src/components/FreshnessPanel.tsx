import type { ReliabilityScorecard } from "@/types";

type FreshnessRow = {
  source: string;
  ageHours: number;
  slaHours: number;
  status: string;
};

export function FreshnessPanel({
  scorecards,
  runs,
}: {
  scorecards: ReliabilityScorecard[];
  runs: Array<{ source_id: string; freshness_hours: number }>;
}) {
  const rows: FreshnessRow[] = scorecards.map((card) => {
    const run = runs.find((r) => r.source_id === card.source_id);
    return {
      source: card.source_name,
      ageHours: run?.freshness_hours ?? 0,
      slaHours: card.sla_hours,
      status: card.freshness_status,
    };
  });

  return (
    <section className="panel p-5">
      <h2 className="font-display text-xl font-semibold">Freshness &amp; SLA</h2>
      <p className="mt-1 text-sm text-tower-muted">
        Age of each synthetic source versus its freshness SLA window.
      </p>
      <div className="mt-4 space-y-3">
        {rows.map((row) => {
          const pct = Math.min(100, (row.ageHours / row.slaHours) * 100);
          const breach = row.status !== "ok";
          return (
            <div key={row.source}>
              <div className="mb-1 flex items-center justify-between text-sm">
                <span className="font-medium">{row.source}</span>
                <span className={breach ? "text-tower-danger" : "text-tower-accent"}>
                  {row.ageHours}h / {row.slaHours}h SLA
                </span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-tower-line">
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
