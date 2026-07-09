import { severityColor } from "@/lib/utils";
import type { Incident } from "@/types";

export function IncidentTimeline({ incidents }: { incidents: Incident[] }) {
  return (
    <ol className="space-y-4">
      {incidents.map((incident) => (
        <li key={incident.id} className="panel relative overflow-hidden p-4 pl-5">
          <div className="absolute bottom-0 left-0 top-0 w-1 bg-gradient-to-b from-tower-danger via-tower-warn to-tower-accent" />
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3 className="font-display text-base font-semibold">{incident.title}</h3>
            <div className="flex items-center gap-2 text-xs uppercase tracking-wide">
              <span className={severityColor(incident.severity)}>{incident.severity}</span>
              <span className="rounded-full border border-tower-line px-2 py-0.5 text-tower-muted">
                {incident.status}
              </span>
            </div>
          </div>
          <p className="mt-2 text-sm text-slate-300">{incident.summary}</p>
          <p className="mt-2 text-sm text-tower-accent">
            Next action: {incident.recommended_action}
          </p>
          <p className="mt-2 text-xs text-tower-muted">
            Opened {new Date(incident.opened_at).toLocaleString("pt-BR")} · {incident.source_id}
          </p>
        </li>
      ))}
    </ol>
  );
}
