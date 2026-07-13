from fastapi.testclient import TestClient

from app.main import app
from app.services.demo import build_demo_snapshot

client = TestClient(app)


def test_health_endpoint():
    res = client.get("/api/health")
    assert res.status_code == 200
    body = res.json()
    assert body["status"] == "ok"
    assert body["service"] == "dataops-control-tower"


def test_tower_endpoint_matches_engine():
    res = client.get("/api/tower")
    assert res.status_code == 200
    body = res.json()
    snap = build_demo_snapshot()
    assert body["overall_reliability"] == snap.overall_reliability
    assert body["sources_monitored"] == 3
    assert body["metadata"]["lab"] is True
    assert body["executive_summary"].startswith("Lab demo:")


def test_incidents_and_runs_endpoints():
    incidents = client.get("/api/incidents")
    runs = client.get("/api/runs")
    sources = client.get("/api/sources")
    assert incidents.status_code == 200
    assert runs.status_code == 200
    assert sources.status_code == 200
    assert len(incidents.json()) == 3
    assert len(runs.json()) >= 3
    assert len(sources.json()) == 3
