# Quality methodology

## Checks (MVP)
| Check | Default threshold | Severity on fail |
|---|---|---|
| Schema columns present | all expected | critical |
| Null rate | ≤ 15% | high |
| Duplicate rate | ≤ 5% | medium |
| Freshness SLA | ≤ source SLA hours | critical |
| Volume drift | ≤ ±35% vs previous | high |
| Non-empty dataset | ≥ 1 row | critical |

## Score
Starts at 100. Penalties: critical −25, high −15, medium −8, low −3.

## Out of scope for MVP
Streaming anomaly detection, warehouse-native lineage, multi-workspace RBAC.
