import { statusDot } from "@/lib/utils";
import type { ReliabilityScorecard } from "@/types";

export function SlaCards({ scorecards }: { scorecards: ReliabilityScorecard[] }) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {scorecards.map((card) => (
        <article key={card.source_id} className="panel p-4">
          <div className="mb-3 flex items-start justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-tower-muted">SLA</p>
              <h3 className="font-display text-lg font-semibold">{card.source_name}</h3>
            </div>
            <span className={`mt-1 inline-block h-2.5 w-2.5 rounded-full ${statusDot(card.freshness_status === "ok" ? "ok" : "fail")}`} />
          </div>
          <dl className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <dt className="text-tower-muted">Reliability</dt>
              <dd className="font-display text-2xl font-semibold text-tower-accent">
                {card.reliability_score}
              </dd>
            </div>
            <div>
              <dt className="text-tower-muted">SLA window</dt>
              <dd className="font-medium">{card.sla_hours}h</dd>
            </div>
            <div>
              <dt className="text-tower-muted">Schema</dt>
              <dd className="capitalize">{card.schema_status}</dd>
            </div>
            <div>
              <dt className="text-tower-muted">Incidents</dt>
              <dd>{card.open_incidents}</dd>
            </div>
          </dl>
          <div className="mt-4 flex h-10 items-end gap-1">
            {card.trend.map((v, idx) => (
              <div
                key={`${card.source_id}-${idx}`}
                className="flex-1 rounded-sm bg-tower-accent/80"
                style={{ height: `${Math.max(12, v)}%` }}
                title={`${v}`}
              />
            ))}
          </div>
        </article>
      ))}
    </div>
  );
}
