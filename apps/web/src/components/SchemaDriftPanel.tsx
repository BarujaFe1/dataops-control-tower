import type { RunSummary } from "@/types";

export function SchemaDriftPanel({ runs }: { runs: RunSummary[] }) {
  const drifts = runs.flatMap((run) =>
    run.checks
      .filter((c) => c.check_id.startsWith("schema") && !c.passed)
      .map((c) => ({
        runId: run.run_id,
        sourceId: run.source_id,
        fingerprint: run.schema_fingerprint,
        message: c.message,
        observed: c.observed,
      })),
  );

  const healthy = runs.filter(
    (run) => !run.checks.some((c) => c.check_id.startsWith("schema") && !c.passed),
  );

  return (
    <section className="panel p-5">
      <h2 className="font-display text-xl font-semibold">Schema drift</h2>
      <p className="mt-1 text-sm text-tower-muted">
        Expected-column contract vs observed fingerprint on the latest lab runs.
      </p>

      {drifts.length === 0 ? (
        <p className="mt-4 text-sm text-tower-accent">No schema drift in the current snapshot.</p>
      ) : (
        <ul className="mt-4 space-y-3">
          {drifts.map((d) => (
            <li key={`${d.runId}-drift`} className="rounded-lg border border-tower-danger/40 bg-tower-danger/5 p-3">
              <p className="text-sm font-medium text-tower-danger">{d.sourceId}</p>
              <p className="mt-1 text-sm text-slate-300">{d.message}</p>
              <p className="mt-2 font-mono text-xs text-tower-muted">
                fingerprint {d.fingerprint} · observed {String(d.observed)}
              </p>
            </li>
          ))}
        </ul>
      )}

      {healthy.length > 0 && (
        <p className="mt-4 text-xs text-tower-muted">
          Stable schemas: {healthy.map((r) => r.source_id).join(", ")}
        </p>
      )}
    </section>
  );
}
