import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Methodology · DataOps Control Tower",
  description: "Explainable reliability score, freshness SLA and schema drift checks used in the lab demo.",
};

const penalties = [
  ["critical", "−25"],
  ["high", "−15"],
  ["medium", "−8"],
  ["low", "−3"],
  ["info", "0"],
];

const checks = [
  ["Schema columns present", "all expected columns", "critical"],
  ["Null rate", "≤ 15%", "high"],
  ["Duplicate rate", "≤ 5%", "medium"],
  ["Freshness SLA", "≤ source sla_hours", "critical"],
  ["Volume drift", "≤ ±35% vs previous run", "high"],
  ["Non-empty dataset", "≥ 1 row", "critical"],
];

export default function MethodologyPage() {
  return (
    <main className="grid-glow min-h-screen">
      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-tower-accent">
          Lab methodology
        </p>
        <h1 className="mt-3 font-display text-4xl font-bold tracking-tight">How the score works</h1>
        <p className="mt-4 text-slate-300">
          DataOps Control Tower uses an explainable reliability score for the portfolio lab. The score
          starts at <strong className="text-tower-accent">100</strong> and applies severity-weighted
          penalties when checks fail. This is intentional simplicity — not a production anomaly platform.
        </p>

        <section className="panel mt-8 p-5">
          <h2 className="font-display text-xl font-semibold">Checks (MVP)</h2>
          <div className="mt-4 overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="text-tower-muted">
                <tr>
                  <th className="py-2 pr-4">Check</th>
                  <th className="py-2 pr-4">Default threshold</th>
                  <th className="py-2">Fail severity</th>
                </tr>
              </thead>
              <tbody>
                {checks.map(([name, threshold, severity]) => (
                  <tr key={name} className="border-t border-tower-line/70">
                    <td className="py-2 pr-4 font-medium">{name}</td>
                    <td className="py-2 pr-4 text-slate-300">{threshold}</td>
                    <td className="py-2 capitalize text-slate-300">{severity}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="panel mt-6 p-5">
          <h2 className="font-display text-xl font-semibold">Penalty table</h2>
          <ul className="mt-4 grid gap-2 sm:grid-cols-2">
            {penalties.map(([sev, pen]) => (
              <li key={sev} className="flex items-center justify-between rounded-lg border border-tower-line px-3 py-2 text-sm">
                <span className="capitalize text-slate-300">{sev}</span>
                <span className="font-mono text-tower-accent">{pen}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="panel mt-6 p-5">
          <h2 className="font-display text-xl font-semibold">What this lab does / does not do</h2>
          <div className="mt-4 grid gap-4 text-sm sm:grid-cols-2">
            <div>
              <p className="font-medium text-tower-accent">Does</p>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-slate-300">
                <li>Demonstrate freshness SLA breaches</li>
                <li>Surface schema drift vs expected columns</li>
                <li>Score quality with explicit penalties</li>
                <li>Track a synthetic incident timeline</li>
              </ul>
            </div>
            <div>
              <p className="font-medium text-tower-warn">Does not</p>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-slate-300">
                <li>Connect to a real warehouse</li>
                <li>Run production schedulers or paging</li>
                <li>Replace Great Expectations / Monte Carlo</li>
                <li>Claim enterprise multi-tenant DataOps</li>
              </ul>
            </div>
          </div>
        </section>

        <p className="mt-8 text-sm text-tower-muted">
          <Link href="/" className="text-tower-accent underline-offset-4 hover:underline">
            ← Back to Control Tower
          </Link>
        </p>
      </div>
    </main>
  );
}
