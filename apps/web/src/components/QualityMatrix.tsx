import type { ReliabilityScorecard } from "@/types";

const dimensions = ["freshness_status", "schema_status", "volume_status", "quality_status"] as const;

function cellTone(value: string): string {
  if (value === "ok" || value === "healthy") return "bg-tower-accent/20 text-tower-accent";
  if (value === "degraded" || value === "mitigated") return "bg-tower-warn/20 text-tower-warn";
  return "bg-tower-danger/20 text-tower-danger";
}

export function QualityMatrix({ scorecards }: { scorecards: ReliabilityScorecard[] }) {
  return (
    <div className="panel overflow-x-auto">
      <table className="min-w-full text-left text-sm">
        <thead className="border-b border-tower-line text-tower-muted">
          <tr>
            <th className="px-4 py-3 font-medium">Source</th>
            <th className="px-4 py-3 font-medium">Freshness</th>
            <th className="px-4 py-3 font-medium">Schema</th>
            <th className="px-4 py-3 font-medium">Volume</th>
            <th className="px-4 py-3 font-medium">Quality</th>
            <th className="px-4 py-3 font-medium">Score</th>
          </tr>
        </thead>
        <tbody>
          {scorecards.map((card) => (
            <tr key={card.source_id} className="border-b border-tower-line/60">
              <td className="px-4 py-3 font-medium">{card.source_name}</td>
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
