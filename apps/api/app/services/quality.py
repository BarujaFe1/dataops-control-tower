"""Quality and reliability checks for recurring datasets."""

from __future__ import annotations

import hashlib
from datetime import datetime, timezone

import pandas as pd

from app.schemas.models import QualityCheckResult, Severity


def schema_fingerprint(df: pd.DataFrame) -> str:
    payload = "|".join(f"{c}:{str(df[c].dtype)}" for c in df.columns)
    return hashlib.sha256(payload.encode("utf-8")).hexdigest()[:16]


def null_rate(df: pd.DataFrame) -> float:
    if df.empty:
        return 1.0
    total = df.shape[0] * df.shape[1]
    return float(df.isna().sum().sum() / total) if total else 0.0


def duplicate_rate(df: pd.DataFrame) -> float:
    if df.empty:
        return 0.0
    return float(df.duplicated().mean())


def freshness_hours(last_updated: datetime, now: datetime | None = None) -> float:
    now = now or datetime.now(timezone.utc)
    if last_updated.tzinfo is None:
        last_updated = last_updated.replace(tzinfo=timezone.utc)
    return max(0.0, (now - last_updated).total_seconds() / 3600.0)


def run_quality_checks(
    df: pd.DataFrame,
    *,
    freshness_h: float,
    sla_hours: int,
    expected_columns: list[str] | None = None,
    previous_row_count: int | None = None,
) -> list[QualityCheckResult]:
    checks: list[QualityCheckResult] = []
    expected_columns = expected_columns or list(df.columns)

    missing_cols = [c for c in expected_columns if c not in df.columns]
    checks.append(
        QualityCheckResult(
            check_id="schema_columns",
            name="Schema columns present",
            passed=len(missing_cols) == 0,
            severity=Severity.critical if missing_cols else Severity.info,
            observed=",".join(missing_cols) if missing_cols else "ok",
            threshold="all expected columns",
            message=(
                f"Missing columns: {missing_cols}"
                if missing_cols
                else "All expected columns are present."
            ),
        )
    )

    nr = null_rate(df)
    checks.append(
        QualityCheckResult(
            check_id="null_rate",
            name="Null rate under threshold",
            passed=nr <= 0.15,
            severity=Severity.high if nr > 0.15 else Severity.info,
            observed=round(nr, 4),
            threshold=0.15,
            message=f"Overall null rate is {nr:.1%}.",
        )
    )

    dr = duplicate_rate(df)
    checks.append(
        QualityCheckResult(
            check_id="duplicate_rate",
            name="Duplicate rate under threshold",
            passed=dr <= 0.05,
            severity=Severity.medium if dr > 0.05 else Severity.info,
            observed=round(dr, 4),
            threshold=0.05,
            message=f"Duplicate rate is {dr:.1%}.",
        )
    )

    checks.append(
        QualityCheckResult(
            check_id="freshness_sla",
            name="Freshness within SLA",
            passed=freshness_h <= sla_hours,
            severity=Severity.critical if freshness_h > sla_hours else Severity.info,
            observed=round(freshness_h, 2),
            threshold=sla_hours,
            message=(
                f"Dataset is {freshness_h:.1f}h old against SLA of {sla_hours}h."
            ),
        )
    )

    if previous_row_count is not None and previous_row_count > 0:
        delta = (len(df) - previous_row_count) / previous_row_count
        checks.append(
            QualityCheckResult(
                check_id="volume_drift",
                name="Volume drift within band",
                passed=abs(delta) <= 0.35,
                severity=Severity.high if abs(delta) > 0.35 else Severity.info,
                observed=round(delta * 100, 2),
                threshold="±35%",
                message=f"Row count changed by {delta:.1%} vs previous run.",
            )
        )

    if len(df) == 0:
        checks.append(
            QualityCheckResult(
                check_id="non_empty",
                name="Dataset is non-empty",
                passed=False,
                severity=Severity.critical,
                observed=0,
                threshold=1,
                message="Dataset has zero rows.",
            )
        )

    return checks


def quality_score(checks: list[QualityCheckResult]) -> float:
    """Explainable score starting at 100 with severity-weighted penalties."""
    score = 100.0
    penalties = {
        Severity.critical: 25.0,
        Severity.high: 15.0,
        Severity.medium: 8.0,
        Severity.low: 3.0,
        Severity.info: 0.0,
    }
    for check in checks:
        if not check.passed:
            score -= penalties[check.severity]
    return max(0.0, round(score, 1))
