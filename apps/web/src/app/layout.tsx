import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "DataOps Control Tower",
  description:
    "Monitor recurring datasets like living systems: quality, freshness, schema, SLA and incidents.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
