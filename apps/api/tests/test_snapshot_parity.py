import json
from pathlib import Path

from app.services.demo import build_demo_snapshot


def test_exported_web_snapshot_matches_engine_contract():
    """Keep the Vercel-embedded JSON aligned with the quality engine."""
    root = Path(__file__).resolve().parents[3]
    path = root / "apps" / "web" / "src" / "data" / "tower_snapshot.json"
    assert path.exists(), "Run: python scripts/export_snapshot.py"
    data = json.loads(path.read_text(encoding="utf-8"))
    snap = build_demo_snapshot()
    assert data["overall_reliability"] == snap.overall_reliability
    assert data["sources_monitored"] == snap.sources_monitored
    assert data["open_incidents"] == snap.open_incidents
    assert data["failing_slas"] == snap.failing_slas
    assert data["metadata"]["lab"] is True
    assert str(data["executive_summary"]).startswith("Lab demo:")
