from datetime import datetime
from enum import Enum
from typing import Any

from pydantic import BaseModel, Field


class SourceType(str, Enum):
    csv = "csv"
    api = "api"
    sheets = "sheets"


class Severity(str, Enum):
    critical = "critical"
    high = "high"
    medium = "medium"
    low = "low"
    info = "info"


class IncidentStatus(str, Enum):
    open = "open"
    investigating = "investigating"
    mitigated = "mitigated"
    resolved = "resolved"


class DataSource(BaseModel):
    id: str
    name: str
    source_type: SourceType
    description: str
    owner: str
    sla_hours: int = Field(ge=1, description="Maximum freshness SLA in hours")
    tags: list[str] = Field(default_factory=list)
    created_at: datetime


class QualityCheckResult(BaseModel):
    check_id: str
    name: str
    passed: bool
    severity: Severity
    observed: float | int | str | None = None
    threshold: float | int | str | None = None
    message: str


class RunSummary(BaseModel):
    run_id: str
    source_id: str
    started_at: datetime
    finished_at: datetime
    status: str
    row_count: int
    column_count: int
    freshness_hours: float
    quality_score: float
    checks: list[QualityCheckResult]
    schema_fingerprint: str
    volume_delta_pct: float
    duplicate_rate: float
    null_rate: float


class Incident(BaseModel):
    id: str
    source_id: str
    title: str
    severity: Severity
    status: IncidentStatus
    opened_at: datetime
    closed_at: datetime | None = None
    summary: str
    recommended_action: str
    related_run_id: str | None = None


class ReliabilityScorecard(BaseModel):
    source_id: str
    source_name: str
    reliability_score: float
    freshness_status: str
    schema_status: str
    volume_status: str
    quality_status: str
    open_incidents: int
    last_run_at: datetime | None
    sla_hours: int
    trend: list[float] = Field(default_factory=list)


class ControlTowerSnapshot(BaseModel):
    generated_at: datetime
    overall_reliability: float
    sources_monitored: int
    open_incidents: int
    failing_slas: int
    scorecards: list[ReliabilityScorecard]
    recent_runs: list[RunSummary]
    incidents: list[Incident]
    executive_summary: str
    metadata: dict[str, Any] = Field(default_factory=dict)
