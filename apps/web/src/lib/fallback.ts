import type { ControlTowerSnapshot } from "@/types";

/** Offline fallback so the UI remains demoable without the API running. */
export const FALLBACK_TOWER: ControlTowerSnapshot = {
  generated_at: "2026-07-09T16:00:00+00:00",
  overall_reliability: 74.5,
  sources_monitored: 3,
  open_incidents: 3,
  failing_slas: 1,
  executive_summary:
    "Control Tower monitors 3 demo sources with overall reliability 74.5/100. 3 incidents remain open and 1 SLA breach requires attention before executive reporting windows.",
  metadata: { connectors: ["csv", "api", "sheets"], demo_mode: true },
  scorecards: [
    {
      source_id: "src_orders_daily",
      source_name: "Orders Daily Extract",
      reliability_score: 92,
      freshness_status: "ok",
      schema_status: "ok",
      volume_status: "ok",
      quality_status: "healthy",
      open_incidents: 1,
      last_run_at: "2026-07-09T14:02:00+00:00",
      sla_hours: 12,
      trend: [80, 87, 90, 92],
    },
    {
      source_id: "src_support_api",
      source_name: "Support Tickets API",
      reliability_score: 60,
      freshness_status: "breach",
      schema_status: "ok",
      volume_status: "ok",
      quality_status: "degraded",
      open_incidents: 1,
      last_run_at: "2026-07-09T08:02:00+00:00",
      sla_hours: 6,
      trend: [48, 55, 58, 60],
    },
    {
      source_id: "src_marketing_sheets",
      source_name: "Marketing Spend Sheet",
      reliability_score: 71.5,
      freshness_status: "breach",
      schema_status: "drift",
      volume_status: "ok",
      quality_status: "degraded",
      open_incidents: 1,
      last_run_at: "2026-07-08T10:02:00+00:00",
      sla_hours: 24,
      trend: [59.5, 66.5, 69.5, 71.5],
    },
  ],
  recent_runs: [
    {
      run_id: "run_orders_latest",
      source_id: "src_orders_daily",
      started_at: "2026-07-09T14:00:00+00:00",
      finished_at: "2026-07-09T14:02:00+00:00",
      status: "healthy",
      row_count: 120,
      column_count: 7,
      freshness_hours: 2,
      quality_score: 92,
      checks: [],
      schema_fingerprint: "abc123",
      volume_delta_pct: 8.7,
      duplicate_rate: 0,
      null_rate: 0.08,
    },
  ],
  incidents: [
    {
      id: "inc_001",
      source_id: "src_support_api",
      title: "Freshness SLA breached — Support Tickets API",
      severity: "critical",
      status: "investigating",
      opened_at: "2026-07-09T09:00:00+00:00",
      summary:
        "Last successful ingest is older than the 6h SLA. Downstream CX dashboards may show stale queues.",
      recommended_action:
        "Replay connector, verify API token and pagination, then re-run quality suite.",
      related_run_id: "run_support_latest",
    },
    {
      id: "inc_002",
      source_id: "src_marketing_sheets",
      title: "Schema drift — missing expected column `leads`",
      severity: "high",
      status: "open",
      opened_at: "2026-07-08T11:00:00+00:00",
      summary:
        "Marketing sheet fingerprint changed. Contract expects `leads`; observed schema diverged in demo seed.",
      recommended_action:
        "Confirm sheet header rename with Growth owner and update data contract.",
      related_run_id: "run_marketing_latest",
    },
    {
      id: "inc_003",
      source_id: "src_orders_daily",
      title: "Elevated null rate on shipping_city",
      severity: "medium",
      status: "mitigated",
      opened_at: "2026-07-07T16:00:00+00:00",
      summary:
        "Null rate crossed soft threshold on a non-critical dimension. Score still healthy.",
      recommended_action:
        "Backfill city from ZIP when available; keep monitoring for 3 runs.",
      related_run_id: "run_orders_latest",
    },
  ],
};
