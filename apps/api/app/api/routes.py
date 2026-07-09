from fastapi import APIRouter

from app.services.demo import build_demo_snapshot, list_sources

router = APIRouter()


@router.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok", "service": "dataops-control-tower"}


@router.get("/sources")
def sources():
    return list_sources()


@router.get("/tower")
def tower_snapshot():
    return build_demo_snapshot()


@router.get("/incidents")
def incidents():
    return build_demo_snapshot().incidents


@router.get("/runs")
def runs():
    return build_demo_snapshot().recent_runs
