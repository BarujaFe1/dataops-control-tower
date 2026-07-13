export default function Loading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8" aria-busy="true" aria-live="polite">
      <p className="text-sm uppercase tracking-[0.2em] text-tower-muted">Loading control tower…</p>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="panel h-24 animate-pulse bg-tower-panel/60" />
        ))}
      </div>
      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <div className="panel h-48 animate-pulse bg-tower-panel/60" />
        <div className="panel h-48 animate-pulse bg-tower-panel/60" />
      </div>
    </div>
  );
}
