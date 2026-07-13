import type { ReliabilityScorecard } from "@/types";

const dimensions = ["freshness_status", "schema_status", "volume_status", "quality_status"] as const;

const labels: Record<(typeof dimensions)[number], string> = {
  freshness_status: "Freshness",
  schema_status: "Schema",
  volume_status: "Volume",
  quality_status: "Quality",
};

function cellTone(value: string): string {
  if (value === "ok" || value === "healthy") return "bg-tower-accent/20 text-tower-accent";
  if (value === "degraded" || value === "mitigated") return "bg-tower-warn/20 text-tower-warn";
  return "bg-tower-danger/20 text-tower-danger";
}

export function QualityMatrix({ scorecards }: { scorecards: ReliabilityScorecard[] }) {
  if (scorecards.length === 0) {
    return (
      <div className="panel p-6 text-sm text-tower-muted" role="status">
        Quality matrix is empty — no monitored sources in this snapshot.
      </div>
    );
  }

  return (
    <div className="panel overflow-x-auto">
      <table className="min-w-full text-left text-sm">
        <caption className="sr-only">
          Cross-source quality matrix for freshness, schema, volume and quality status
        </caption>
        <thead className="border-b border-tower-line text-tower-muted">
          <tr>
            <th scope="col" className="px-4 py-3 font-medium">
              Source
            </th>
            {dimensions.map((dim) => (
              <th scope="col" key={dim} className="px-4 py-3 font-medium">
                {labels[dim]}
              </th>
            ))}
            <th scope="col" className="px-4 py-3 font-medium">
              Score
            </th>
          </tr>
        </thead>
        <tbody>
          {scorecards.map((card) => (
            <tr key={card.source_id} className="border-b border-tower-line/60">
              <th scope="row" className="px-4 py-3 font-medium text-slate-100">
                {card.source_name}
              </th>
              {dimensions.map((dim) => (
                <td key={dim} className="px-4 py-3">
                  <span className={`rounded-md px-2 py-1 capitalize ${cellTone(String(card[dim]))}`}>
                    {String(card[dim])}
                  </span>
                </td>
              ))}
              <td className="px-4 py-3 font-display text-lg">{card.reliability_score}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
