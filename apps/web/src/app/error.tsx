"use client";

import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="mx-auto max-w-lg px-4 py-20 text-center">
      <p className="text-xs uppercase tracking-[0.2em] text-tower-danger">Something went wrong</p>
      <h1 className="mt-3 font-display text-2xl font-semibold">Control Tower failed to render</h1>
      <p className="mt-3 text-sm text-tower-muted">
        {error.message || "Unexpected client/server error in the lab demo."}
      </p>
      <div className="mt-6 flex justify-center gap-3">
        <button
          type="button"
          onClick={reset}
          className="rounded-lg border border-tower-line bg-tower-panel px-4 py-2 text-sm hover:border-tower-accent"
        >
          Try again
        </button>
        <Link
          href="/"
          className="rounded-lg border border-tower-accent/40 px-4 py-2 text-sm text-tower-accent hover:bg-tower-accent/10"
        >
          Back to tower
        </Link>
      </div>
    </div>
  );
}
