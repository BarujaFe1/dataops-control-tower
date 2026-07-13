import type { ControlTowerSnapshot } from "@/types";
import snapshot from "@/data/tower_snapshot.json";

/** Canonical lab snapshot — generated from the FastAPI quality engine (synthetic seeds). */
export const FALLBACK_TOWER = snapshot as ControlTowerSnapshot;
