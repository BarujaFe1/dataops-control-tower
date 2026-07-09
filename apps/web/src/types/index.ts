export type Severity = "critical" | "high" | "medium" | "low" | "info";
export type IncidentStatus = "open" | "investigating" | "mitigated" | "resolved";

export interface QualityCheckResult {
  check_id: string;
  name: string;
  passed: boolean;
  severity: Severity;
  observed?: string | number | null;
  threshold?: string | number | null;
  message: string;
}

export interface RunSummary {
  run_id: string;
  source_id: string;
  started_at: string;
  finished_at: string;
  status: string;
  row_count: number;
  column_count: number;
  freshness_hours: number;
  quality_score: number;
  checks: QualityCheckResult[];
  schema_fingerprint: string;
  volume_delta_pct: number;
  duplicate_rate: number;
  null_rate: number;
}

export interface Incident {
  id: string;
  source_id: string;
  title: string;
  severity: Severity;
  status: IncidentStatus;
  opened_at: string;
  closed_at?: string | null;
  summary: string;
  recommended_action: string;
  related_run_id?: string | null;
}

export interface ReliabilityScorecard {
  source_id: string;
  source_name: string;
  reliability_score: number;
  freshness_status: string;
  schema_status: string;
  volume_status: string;
  quality_status: string;
  open_incidents: number;
  last_run_at?: string | null;
  sla_hours: number;
  trend: number[];
}

export interface ControlTowerSnapshot {
  generated_at: string;
  overall_reliability: number;
  sources_monitored: number;
  open_incidents: number;
  failing_slas: number;
  scorecards: ReliabilityScorecard[];
  recent_runs: RunSummary[];
  incidents: Incident[];
  executive_summary: string;
  metadata: Record<string, unknown>;
}
