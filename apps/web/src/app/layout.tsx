import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "DataOps Control Tower",
    template: "%s · DataOps Control Tower",
  },
  description:
    "Lab demo for data reliability: quality, freshness, schema drift, SLA and incidents on synthetic sources.",
  openGraph: {
    title: "DataOps Control Tower",
    description: "Synthetic data reliability control room for portfolio demos.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-tower-accent focus:px-3 focus:py-2 focus:text-tower-bg"
        >
          Skip to content
        </a>
        <header className="border-b border-tower-line/80 bg-tower-bg/80 backdrop-blur">
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
            <Link href="/" className="font-display text-sm font-semibold tracking-wide text-slate-100">
              DataOps Control Tower
            </Link>
            <nav className="flex items-center gap-4 text-sm text-tower-muted" aria-label="Primary">
              <Link href="/" className="hover:text-tower-accent">
                Tower
              </Link>
              <Link href="/methodology" className="hover:text-tower-accent">
                Methodology
              </Link>
              <a
                href="https://github.com/BarujaFe1/dataops-control-tower"
                className="hover:text-tower-accent"
                rel="noreferrer"
                target="_blank"
              >
                GitHub
              </a>
            </nav>
          </div>
        </header>
        <div id="main">{children}</div>
      </body>
    </html>
  );
}
