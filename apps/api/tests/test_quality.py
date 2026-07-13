import pandas as pd

from app.schemas.models import Severity
from app.services.demo import build_demo_snapshot
from app.services.quality import (
    duplicate_rate,
    freshness_hours,
    null_rate,
    quality_score,
    run_quality_checks,
    schema_fingerprint,
)
from datetime import datetime, timezone, timedelta


def test_null_rate_exact():
    df = pd.DataFrame(
        {
            "id": [1, 2, 2, 3],
            "city": ["SP", None, "RJ", "BH"],
        }
    )
    # 1 null out of 8 cells
    assert null_rate(df) == 0.125


def test_duplicate_rate_full_rows_only():
    df = pd.DataFrame(
        {
            "id": [1, 2, 2, 3],
            "city": ["SP", None, "RJ", "BH"],
        }
    )
    assert duplicate_rate(df) == 0.0
    df2 = pd.concat([df, df.iloc[[0]]], ignore_index=True)
    assert duplicate_rate(df2) == 0.2


def test_quality_score_penalties():
    df = pd.DataFrame({"a": [1, None, 3], "b": [1, 1, 1]})
    checks = run_quality_checks(
        df,
        freshness_h=30,
        sla_hours=12,
        expected_columns=["a", "b", "c"],
        previous_row_count=10,
    )
    failed_ids = {c.check_id for c in checks if not c.passed}
    assert "schema_columns" in failed_ids
    assert "freshness_sla" in failed_ids
    assert "volume_drift" in failed_ids
    score = quality_score(checks)
    # critical schema (-25) + high null (-15) + critical freshness (-25) + high volume (-15) = 20
    assert score == 20.0
    assert all(isinstance(c.severity, Severity) for c in checks)


def test_schema_fingerprint_stable():
    df = pd.DataFrame({"x": [1], "y": ["a"]})
    assert schema_fingerprint(df) == schema_fingerprint(df.copy())


def test_freshness_hours_timezone_naive():
    now = datetime(2026, 7, 9, 16, 0, tzinfo=timezone.utc)
    naive = datetime(2026, 7, 9, 10, 0)
    assert freshness_hours(naive, now) == 6.0


def test_empty_dataset_fails_non_empty_check():
    df = pd.DataFrame(columns=["a", "b"])
    checks = run_quality_checks(df, freshness_h=1, sla_hours=12, expected_columns=["a", "b"])
    assert any(c.check_id == "non_empty" and not c.passed for c in checks)
    assert null_rate(df) == 1.0


def test_demo_snapshot_contract():
    snap = build_demo_snapshot()
    assert snap.sources_monitored == 3
    assert snap.open_incidents == 3
    assert snap.failing_slas == 2
    assert snap.overall_reliability == 75.0
    assert snap.metadata.get("lab") is True
    assert snap.executive_summary.startswith("Lab demo:")
    assert len(snap.scorecards) == 3
    assert len(snap.recent_runs) >= 3
    marketing = next(s for s in snap.scorecards if s.source_id == "src_marketing_sheets")
    assert marketing.schema_status == "drift"
    support = next(s for s in snap.scorecards if s.source_id == "src_support_api")
    assert support.freshness_status == "breach"
