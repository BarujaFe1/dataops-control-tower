"""Demo catalog, synthetic runs and incident timeline for the Control Tower MVP."""

from __future__ import annotations

from datetime import datetime, timedelta, timezone
from pathlib import Path

import pandas as pd

from app.schemas.models import (
    ControlTowerSnapshot,
    DataSource,
    Incident,
    IncidentStatus,
    ReliabilityScorecard,
    RunSummary,
    Severity,
    SourceType,
)
from app.services.quality import (
    duplicate_rate,
    freshness_hours,
    null_rate,
    quality_score,
    run_quality_checks,
    schema_fingerprint,
)

NOW = datetime(2026, 7, 9, 16, 0, tzinfo=timezone.utc)


def _repo_root() -> Path:
    here = Path(__file__).resolve()
    for parent in here.parents:
        if (parent / "data" / "seed").is_dir():
            return parent
    raise FileNotFoundError("Could not locate repository root containing data/seed")


SEED_DIR = _repo_root() / "data" / "seed"


def _sources() -> list[DataSource]:
    return [
        DataSource(
            id="src_orders_daily",
            name="Orders Daily Extract",
            source_type=SourceType.csv,
            description="Daily e-commerce orders export used by revenue dashboards.",
            owner="Analytics Ops",
            sla_hours=12,
            tags=["orders", "revenue", "csv"],
            created_at=NOW - timedelta(days=40),
        ),
        DataSource(
            id="src_support_api",
            name="Support Tickets API",
            source_type=SourceType.api,
            description="Mock REST feed of support tickets for SLA monitoring.",
            owner="CX Analytics",
            sla_hours=6,
            tags=["support", "api", "sla"],
            created_at=NOW - timedelta(days=28),
        ),
        DataSource(
            id="src_marketing_sheets",
            name="Marketing Spend Sheet",
            source_type=SourceType.sheets,
            description="Mock Google Sheets connector for campaign spend tracking.",
            owner="Growth",
            sla_hours=24,
            tags=["marketing", "sheets", "spend"],
            created_at=NOW - timedelta(days=21),
        ),
    ]


def _load_seed(name: str) -> pd.DataFrame:
    path = SEED_DIR / name
    if not path.exists():
        raise FileNotFoundError(f"Missing demo seed CSV: {path}")
    return pd.read_csv(path)


def _build_run(
    *,
    run_id: str,
    source: DataSource,
    df: pd.DataFrame,
    started_at: datetime,
    previous_rows: int | None,
    last_updated: datetime,
    expected_columns: list[str],
) -> RunSummary:
    fresh = freshness_hours(last_updated, NOW)
    checks = run_quality_checks(
        df,
        freshness_h=fresh,
        sla_hours=source.sla_hours,
        expected_columns=expected_columns,
        previous_row_count=previous_rows,
    )
    score = quality_score(checks)
    status = "healthy" if score >= 85 else "degraded" if score >= 60 else "failing"
    volume_delta = 0.0
    if previous_rows and previous_rows > 0:
        volume_delta = ((len(df) - previous_rows) / previous_rows) * 100.0

    return RunSummary(
        run_id=run_id,
        source_id=source.id,
        started_at=started_at,
        finished_at=started_at + timedelta(minutes=2),
        status=status,
        row_count=len(df),
        column_count=len(df.columns),
        freshness_hours=round(fresh, 2),
        quality_score=score,
        checks=checks,
        schema_fingerprint=schema_fingerprint(df) if not df.empty else "empty",
        volume_delta_pct=round(volume_delta, 2),
        duplicate_rate=round(duplicate_rate(df), 4),
        null_rate=round(null_rate(df), 4),
    )


def build_demo_snapshot() -> ControlTowerSnapshot:
    sources = {s.id: s for s in _sources()}
    orders = _load_seed("orders_daily.csv")
    support = _load_seed("support_tickets.csv")
    marketing = _load_seed("marketing_spend.csv")

    # Simulate previous volumes for drift checks
    runs = [
        _build_run(
            run_id="run_orders_prev",
            source=sources["src_orders_daily"],
            df=orders.iloc[: max(1, int(len(orders) * 0.92))],
            started_at=NOW - timedelta(hours=26),
            previous_rows=None,
            last_updated=NOW - timedelta(hours=26),
            expected_columns=list(orders.columns) if not orders.empty else [],
        ),
        _build_run(
            run_id="run_orders_latest",
            source=sources["src_orders_daily"],
            df=orders,
            started_at=NOW - timedelta(hours=2),
            previous_rows=max(1, int(len(orders) * 0.92)),
            last_updated=NOW - timedelta(hours=2),
            expected_columns=list(orders.columns) if not orders.empty else [],
        ),
        _build_run(
            run_id="run_support_latest",
            source=sources["src_support_api"],
            df=support,
            started_at=NOW - timedelta(hours=8),
            previous_rows=max(1, int(len(support) * 1.05)),
            last_updated=NOW - timedelta(hours=8),
            expected_columns=list(support.columns) if not support.empty else [],
        ),
        _build_run(
            run_id="run_marketing_latest",
            source=sources["src_marketing_sheets"],
            df=marketing,
            started_at=NOW - timedelta(hours=30),
            previous_rows=len(marketing),
            last_updated=NOW - timedelta(hours=30),
            expected_columns=["date", "campaign", "channel", "spend_brl", "leads"],
        ),
    ]

    incidents = [
        Incident(
            id="inc_001",
            source_id="src_support_api",
            title="Freshness SLA breached — Support Tickets API",
            severity=Severity.critical,
            status=IncidentStatus.investigating,
            opened_at=NOW - timedelta(hours=7),
            closed_at=None,
            summary="Last successful ingest is older than the 6h SLA. Downstream CX dashboards may show stale queues.",
            recommended_action="Replay connector, verify API token and pagination, then re-run quality suite.",
            related_run_id="run_support_latest",
        ),
        Incident(
            id="inc_002",
            source_id="src_marketing_sheets",
            title="Schema drift — missing expected column `leads`",
            severity=Severity.high,
            status=IncidentStatus.open,
            opened_at=NOW - timedelta(hours=29),
            closed_at=None,
            summary="Marketing sheet fingerprint changed. Contract expects `leads`; observed schema diverged in demo seed.",
            recommended_action="Confirm sheet header rename with Growth owner and update data contract.",
            related_run_id="run_marketing_latest",
        ),
        Incident(
            id="inc_003",
            source_id="src_orders_daily",
            title="Watch — shipping_city nulls (column-level)",
            severity=Severity.medium,
            status=IncidentStatus.mitigated,
            opened_at=NOW - timedelta(days=2),
            closed_at=None,
            summary=(
                "Column-level watch on shipping_city nulls. Overall dataset null rate remains under "
                "the 15% threshold, so the reliability score stays healthy; this is a soft watch, not a hard fail."
            ),
            recommended_action="Backfill city from ZIP when available; keep monitoring for 3 runs.",
            related_run_id="run_orders_latest",
        ),
    ]

    latest_by_source: dict[str, RunSummary] = {}
    for run in runs:
        prev = latest_by_source.get(run.source_id)
        if prev is None or run.finished_at > prev.finished_at:
            latest_by_source[run.source_id] = run

    scorecards: list[ReliabilityScorecard] = []
    for source in sources.values():
        run = latest_by_source.get(source.id)
        open_count = sum(
            1
            for i in incidents
            if i.source_id == source.id and i.status != IncidentStatus.resolved
        )
        if run is None:
            continue
        freshness_status = "ok" if run.freshness_hours <= source.sla_hours else "breach"
        schema_ok = all(
            c.passed for c in run.checks if c.check_id.startswith("schema")
        )
        volume_ok = all(c.passed for c in run.checks if c.check_id == "volume_drift")
        quality_status = run.status
        scorecards.append(
            ReliabilityScorecard(
                source_id=source.id,
                source_name=source.name,
                reliability_score=run.quality_score,
                freshness_status=freshness_status,
                schema_status="ok" if schema_ok else "drift",
                volume_status="ok" if volume_ok else "drift",
                quality_status=quality_status,
                open_incidents=open_count,
                last_run_at=run.finished_at,
                sla_hours=source.sla_hours,
                trend=[max(40.0, run.quality_score + d) for d in (-12, -5, -2, 0)],
            )
        )

    overall = (
        round(sum(s.reliability_score for s in scorecards) / len(scorecards), 1)
        if scorecards
        else 0.0
    )
    open_incidents = sum(1 for i in incidents if i.status != IncidentStatus.resolved)
    failing_slas = sum(1 for s in scorecards if s.freshness_status == "breach")

    executive = (
        "Lab demo: Control Tower monitors "
        f"{len(sources)} synthetic sources with overall reliability "
        f"{overall}/100. {open_incidents} active incidents (including mitigated watches) "
        f"and {failing_slas} SLA breach(es) require attention before executive reporting windows."
    )

    return ControlTowerSnapshot(
        generated_at=NOW,
        overall_reliability=overall,
        sources_monitored=len(sources),
        open_incidents=open_incidents,
        failing_slas=failing_slas,
        scorecards=scorecards,
        recent_runs=sorted(runs, key=lambda r: r.finished_at, reverse=True),
        incidents=sorted(incidents, key=lambda i: i.opened_at, reverse=True),
        executive_summary=executive,
        metadata={
            "connectors": ["csv", "api", "sheets"],
            "demo_mode": True,
            "lab": True,
            "product": "DataOps Control Tower",
            "notice": "Synthetic demo dataset — not connected to a real warehouse.",
        },
    )


def list_sources() -> list[DataSource]:
    return _sources()
