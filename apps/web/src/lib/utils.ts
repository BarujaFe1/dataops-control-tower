import type { Severity } from "@/types";
import { clsx } from "clsx";

export function cn(...inputs: Array<string | false | null | undefined>) {
  return clsx(inputs);
}

export function severityColor(severity: Severity): string {
  switch (severity) {
    case "critical":
      return "text-tower-danger";
    case "high":
      return "text-orange-400";
    case "medium":
      return "text-tower-warn";
    case "low":
      return "text-sky-300";
    default:
      return "text-tower-muted";
  }
}

export function statusDot(status: string): string {
  if (status === "ok" || status === "healthy" || status === "resolved") return "bg-tower-accent";
  if (status === "degraded" || status === "mitigated" || status === "investigating") return "bg-tower-warn";
  return "bg-tower-danger";
}
