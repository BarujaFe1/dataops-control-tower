import pandas as pd

from app.services.quality import (
    duplicate_rate,
    null_rate,
    quality_score,
    run_quality_checks,
    schema_fingerprint,
)
from app.schemas.models import Severity


def test_null_and_duplicate_rates():
    df = pd.DataFrame(
        {
            "id": [1, 2, 2, 3],
            "city": ["SP", None, "RJ", "BH"],
        }
    )
    assert round(null_rate(df), 2) == 0.12 or round(null_rate(df), 4) == 0.125
    assert duplicate_rate(df) == 0.0  # full-row duplicates only
    df2 = pd.concat([df, df.iloc[[0]]], ignore_index=True)
    assert duplicate_rate(df2) > 0


def test_quality_score_penalties():
    df = pd.DataFrame({"a": [1, None, 3], "b": [1, 1, 1]})
    checks = run_quality_checks(
        df,
        freshness_h=30,
        sla_hours=12,
        expected_columns=["a", "b", "c"],
        previous_row_count=10,
    )
    failed = [c for c in checks if not c.passed]
    assert any(c.check_id == "schema_columns" for c in failed)
    assert any(c.check_id == "freshness_sla" for c in failed)
    score = quality_score(checks)
    assert score < 100
    assert all(isinstance(c.severity, Severity) for c in checks)


def test_schema_fingerprint_stable():
    df = pd.DataFrame({"x": [1], "y": ["a"]})
    assert schema_fingerprint(df) == schema_fingerprint(df.copy())
